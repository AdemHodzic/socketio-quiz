import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import { Request, Response, NextFunction } from 'express';

export const validToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}