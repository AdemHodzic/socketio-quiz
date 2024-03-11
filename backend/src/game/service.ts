import { Answer, Question, User } from "@prisma/client";
import { SECRET_KEY } from "../constants";
import prisma from "../db"
import jwt from "jsonwebtoken"

export const cancelMatch = async (matchId: number) => {
    const match = await prisma.match.update({ where: { id: matchId }, data: { state: 'CANCELLED' } });
    return match;
}

export const finishMatch = async (matchId: number) => {
    const userResults = await prisma.$queryRawUnsafe<{
        user_id: number;
        answer_count: number;
    }[]>(`
        SELECT
            u.id AS user_id,
            count(mq.id) AS answer_count
        FROM
            "User" u
        INNER JOIN "MatchQuestion" mq ON mq."userId" = u.id AND mq."matchId" = ${matchId}
        GROUP BY u.id
    `);

    let winnerId = null;


    if (userResults[0]?.answer_count > userResults[1]?.answer_count) {
        winnerId = userResults[0].user_id;
    } else if (userResults[0]?.answer_count < userResults[1]?.answer_count) {
        winnerId = userResults[1].user_id;
    }

    const match = await prisma.match.update({ where: { id: matchId }, data: { state: 'FINISHED', userId: winnerId } });
    return match;
}

export const getNextQuestion = async (matchId: number): Promise<Question & { answers: Answer[]} | null> => {
    const question = await prisma.question.findFirst({
        where: {
            MatchQuestion: {
                some: {
                    matchId,
                    is_done: false,
                }
            },
        },
        include: {
            answers: true,
        },
        orderBy: {
            id: 'asc',
        }
    })


    if (!question) {
        return null;
    }
    
    return question;

}

export const end_game = async (matchId: number) => {
    const matchExists = Number.isInteger(matchId);

    if (!matchExists) {
        return null;
    }

    let match = await prisma.match.findFirst({
        where: {
            id: matchId,
        }
    })

    if (!match) {
        return null;
    }

    if (match.state === 'WAITING') {
        match = await cancelMatch(matchId)
    } else {
        match = await finishMatch(matchId)
    }

    return match
}

type AnswerQuestionPayload = {
    matchId: number,
    questionId: number,
    answerId: number,
    token: string,
}

type AnswerQuestionResult = "CORRECT" | "INCORRECT" | "INVALID_ANSWER" | "EVERYONE_ANSWERED"

export const answerQuestion: (paylaod: AnswerQuestionPayload) => Promise<AnswerQuestionResult> = async (payload: any) => {
    const { matchId, questionId, answerId, token } = payload;
    const user = jwt.verify(token, SECRET_KEY) as User;

    if (!user) {
        return "INVALID_ANSWER";
    }

    // check if user has already attempted to answer this question
    const hasAttempted = await prisma.matchQuestionAnswer.findFirst({
        where: {
            userId: user.id,
            matchQuestion: {
                matchId,
                questionId,
            }
        }
    }) !== null;

    if (hasAttempted) {
        return "INVALID_ANSWER"
    }

    const matchQuestion = await prisma.matchQuestion.findFirstOrThrow({
        where: {
            matchId,
            questionId,
            is_done: false,
        }
    })

    const answer = await prisma.answer.findFirstOrThrow({
        where: {
            id: answerId,
        }
    })

    const matchQuestionAnswer = await prisma.matchQuestionAnswer.create({
        data: {
            userId: user.id,
            answerId: answerId,
            matchQuestionId: matchQuestion?.id,
        }
    })

    if (answer.is_correct) {
        await prisma.matchQuestion.update({
            where: {
                id: matchQuestion.id,
            },
            data: {
                is_done: true,
                userId: user.id,
            }
        });

        return "CORRECT";
    } else {

        const everyoneAnswered = await prisma.matchQuestionAnswer.count({
            where: {
                matchQuestionId: matchQuestion.id,
            }
        }) === 2;

        if (everyoneAnswered) {
            await prisma.matchQuestion.update({
                where: {
                    id: matchQuestion.id,
                },
                data: {
                    is_done: true,
                }
            });

            return "EVERYONE_ANSWERED";
        } 

        return "INCORRECT";
    }
}