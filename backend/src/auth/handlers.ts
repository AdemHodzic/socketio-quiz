import { SECRET_KEY } from "../constants";
import prisma from "../db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from "@prisma/client";
import { createUser } from "./service";

//TODO: Stop sending password in jwt token

export const login = async (req: Request, res: Response) => {
    //@ts-ignore
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
        where: {
            username
        }
    });

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const hash = await bcrypt.hash(password, user.salt);

    if (user.password === hash) {
        const token = jwt.sign(user, SECRET_KEY);
        return res.json({ token });
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export const register = async (req: Request, res: Response) => {
    //@ts-ignore
    const { username, password } = req.body;

    const user = await createUser(username, password);

    const token = jwt.sign(user, SECRET_KEY);
    return res.json({ token });
}

export const me = async (req: Request, res: Response) => {
    return res.json(req.user);
}

export const stats = async (req: Request, res: Response) => {

    const { id } = req.user as User;

    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            username: true,
            _count: {
                select: {
                    MatchUser: {
                        where: {
                            match: {
                                state: "FINISHED"
                            }
                        }
                    },
                    Match: true,
                }
            },
            MatchQuestionAnswer: {
                include: {
                    answer: true,
                }
            }
        },
    });

    const result = {
        username: user?.username,
        total_matches: user?._count?.MatchUser,
        total_won_matches: user?._count?.Match,
        total_answers: user?.MatchQuestionAnswer.length,
        total_correct_answers: user?.MatchQuestionAnswer.filter((mqa) => mqa.answer.is_correct).length
    }


    return res.json(result);
}