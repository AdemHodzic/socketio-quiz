import prisma from "../db";

import { Request, Response } from "express";

export const createQuestions = async (req: Request, res: Response) => {
    //@ts-ignore
    const { questions } = req.body;

    let createCount = 0;

    for (const question of questions) {
        await prisma.question.create({
            data: {
                body: question.body,
                answers: {
                    create: question.answers,
                }
            }
        });

        createCount++;
    }

    return res.status(200).json({
        created: createCount,
    });
}

export const deleteQuestions = async (req: Request, res: Response) => {
    const ids = req.body.ids;

    const deleteResult = await prisma.question.deleteMany({
        where: {
            id: {
                in: ids,
            }
        }
    });

    return res.status(200).json(deleteResult);
}

export const updateQuestions = async (req: Request, res: Response) => {
    const { questions } = req.body;

    let updateCount = 0;

    for (let question of questions) {
        const answers = question.answers;

        await prisma.question.update({
            where: {
                id: question.id,
            },
            data: {
                body: question.body,
            }
        });

        for (let answer of answers) {
            await prisma.answer.update({
                where: {
                    id: answer.id,
                },
                data: {
                    body: answer.body,
                    is_correct: answer.is_correct,
                }
            });
        }

        updateCount++;
    }

    return res.status(200).json({ updated: updateCount });
}

export const getQuestions = async (req: Request, res: Response) => {
    const questions = await prisma.question.findMany({
        include: {
            answers: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return res.status(200).json({questions});
}

export const getQuestion = async (req: Request, res: Response) => {
    const { id } = req.params as any;

    const question = await prisma.question.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            answers: true,
        }
    });

    return res.status(200).json({question});
}