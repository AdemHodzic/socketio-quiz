import { Router } from "express";

import { createQuestions, deleteQuestions, updateQuestions, getQuestions } from "./handlers";

import { isAdmin } from "./middleware";
import { validToken } from "../auth/middleware";

const router = Router();

const middleware = [
    validToken,
    isAdmin
]

router.post("/questions/", middleware, createQuestions);
router.get("/questions/", middleware, getQuestions);
router.patch("/questions/", middleware, updateQuestions);
router.delete("/questions/", middleware, deleteQuestions);

export default router;