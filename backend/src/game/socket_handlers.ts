import { Socket } from "socket.io";

import prisma from "../db";

const join = (socket: Socket, matchId: string) => {
    socket.join(matchId);
}

const getNextQuestion = async (matchId: number) => {
    // const question = await prisma.matchQuestion.findFirst({
    //     where: {
    //         matchId,
    //         is_done: false,
    //     }, 
    //     select: {
    //         question: {
    //             include: {
    //                 answers: true,
    //             }
    //         }
    //     },
    //     // we need orderBy in order to serve users the same quesiton
    //     orderBy: {
    //         questionId: 'asc',
    //     }
    // })?.question

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
    // const matchExists = await prisma.match.findFirst({
    //     where: {
    //         id: matchId,
    //         state: {
    //             not: 'FINISHED',
    //         }
    //     }
    // }) !== null;

    const matchExists = Number.isInteger(matchId);

    if (!matchExists) {
        return null;
    }

    const match = await prisma.match.findFirst({
        where: {
            id: matchId,
        }
    })

    if (!match) {
        return null;
    }

    const newState = match.state === 'WAITING' ? 'CANCELLED' : 'FINISHED';

    const updatedMatch = await prisma.match.update({
        where: {
            id: matchId,
        },
        data: {
            state: newState,
        }
    })

    return updatedMatch
}

export default {
    join,
    getNextQuestion,
    end_game,
}