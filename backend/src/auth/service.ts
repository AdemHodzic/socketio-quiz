import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from "../db";

import { SECRET_KEY } from '../constants';

export const validateToken = (token: string) => {
    try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
    }
    catch (error) {
        return null;
    }
}

export const createUser = async (username: string, password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            username,
            salt: salt,
            password: hashedPassword,

        }
    });

    return user;
}