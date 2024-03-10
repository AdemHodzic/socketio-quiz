import { Socket } from "socket.io";

import prisma from "../db";
import { SECRET_KEY } from "../constants";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { cancelMatch, finishMatch } from "./service";


const join = (socket: Socket, matchId: string) => {
    socket.join(matchId);
}

const getNextQuestion = async (matchId: number) => {
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

const end_game = async (matchId: number) => {
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

const answerQuestion: (paylaod: AnswerQuestionPayload) => Promise<AnswerQuestionResult> = async (payload: any) => {
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

export default {
    join,
    getNextQuestion,
    answerQuestion,
    end_game,
}