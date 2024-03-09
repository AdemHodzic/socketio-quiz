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

export default {
    join,
    getNextQuestion,
}