import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { username } = req?.user as User;
    
    if (!username || username !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
    }

    next();
}