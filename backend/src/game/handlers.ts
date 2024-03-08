import { Response, Request } from 'express';
import prisma from '../db';
import { User } from '@prisma/client';

export const createMatch = async (req: Request, res: Response) => {
    //@ts-ignore
    const user: User = req.user;

    // get 5 random questions
    const questions = await prisma.question.findMany({
        take: 5,
        skip: Math.floor(Math.random() * 10)
    });

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
        match = await prisma.match.update({where: {id: parseInt(matchId)}, data: {state: 'CANCELLED'}});
    } else if (match?.state === 'PLAYING') {
        match =  await prisma.match.update({where: {id: parseInt(matchId)}, data: {state: 'FINISHED'}});
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

    console.log(user, match)

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