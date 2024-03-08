import { User } from "@prisma/client";
import { Request } from "express";

export type WithUser = Request & { user: User };
