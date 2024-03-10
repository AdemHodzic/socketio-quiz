import { Response, Request } from 'express';
import prisma from '../db';
import { Question, User } from '@prisma/client';
import { cancelMatch, finishMatch } from './service';

type QuestionResult = {
    question: string;
    question_winner: number;
    question_answer: string;
}

export const getResults = async (req: Request, res: Response) => {
    const { matchId } = req.params;

    const results = await prisma.$queryRawUnsafe<QuestionResult[]>(`
        SELECT
            q.body as question,
            mq."userId" as question_winner,
            a.body as question_answer
        FROM
            "MatchQuestion" mq
            INNER JOIN "Question" q ON q.id = mq."questionId"
            INNER JOIN "Answer" a ON a."questionId" = q.id
            AND a.is_correct
        WHERE
            mq."matchId" = ${matchId}
        ORDER BY
            mq."updatedAt" asc
    `);

    return res.json(results);
}

export const createMatch = async (req: Request, res: Response) => {
    //@ts-ignore
    const user: User = req.user;

    const questions = await prisma.$queryRawUnsafe<Question[]>(`
        SELECT * FROM "Question" ORDER BY random() LIMIT 5;
    `) 

    // create a new match
    const match = await prisma.match.create({data: {
        state: 'WAITING',
        MatchQuestion: {
            create: questions.map((question) => {
                return {
                    questionId: question.id,
                    is_done: false,
                }
            })
        }
    }});
    
    // create a new match user
    await prisma.matchUser.create({
        data: {
            matchId: match.id,
            userId: user.id,
        }
    });

    return res.json(match)
}



export const leaveMatch = async (req: Request, res: Response) => {
    //@ts-ignore
    const user: User = req.user;
    const { matchId } = req.params;

    // delete the match user
    await prisma.matchUser.deleteMany({
        where: {
            matchId: parseInt(matchId),
            userId: user.id,
        }
    });

    // change match state to 'CANCELLED' if previous state was 'WAITING'
    // or 'FINISHED' if previous state was 'PLAYING'

    let match = await prisma.match.findUnique({where: {id: parseInt(matchId)}});

    if (match?.state === 'WAITING') {
        match.state = 'CANCELLED';
        match = await cancelMatch(parseInt(matchId));
    } else if (match?.state === 'PLAYING') {
        match.state = 'FINISHED';
        match = await finishMatch(parseInt(matchId));
    }

    return res.json(match)
}

export const joinMatch = async (req: Request, res: Response) => {
    //@ts-ignore
    const user: User = req.user;

    const match = await prisma.match.findFirst({
        where: {
            state: 'WAITING',
            MatchUser: {
                some: {
                    userId: {
                        not: user.id
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    if (!match) {
        return createMatch(req, res);
    }

    await prisma.matchUser.create({
        data: {
            matchId: match.id,
            userId: user.id,
        }
    });

    match.state = 'PLAYING';
    await prisma.match.update({where: {id: match.id}, data: {state: 'PLAYING'}});

    return res.json(match)
}