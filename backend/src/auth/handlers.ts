import { SECRET_KEY } from "../constants";
import prisma from "../db";
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

//TODO: Stop sending password in jwt token

export const login  = async (req: Request, res: Response) => {
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

    if (user.password === password) {
        const token = jwt.sign(user, SECRET_KEY);
        return res.json({ token });
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export const register = async (req: Request, res: Response) => {
    //@ts-ignore
    const { username, password } = req.body;
    
    const user = await prisma.user.create({
        data: {
            username,
            password
        }
    });
    
    const token = jwt.sign(user, SECRET_KEY);
    return res.json({ token });
}

export const me = async (req: Request, res: Response) => {
    return res.json(req.user);
}