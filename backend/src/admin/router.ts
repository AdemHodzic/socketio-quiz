import { Router } from "express";

import { createQuestions, deleteQuestions, updateQuestions, getQuestions, getQuestion } from "./handlers";

import { isAdmin } from "./middleware";
import { validToken } from "../auth/middleware";

const router = Router();

const middleware = [
    validToken,
    isAdmin
]

router.post("/questions/", middleware, createQuestions);
router.get("/questions/", middleware, getQuestions);
router.get("/questions/:id", middleware, getQuestion);
router.patch("/questions/", middleware, updateQuestions);
router.delete("/questions/", middleware, deleteQuestions);

export default router;