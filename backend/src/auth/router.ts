import { Router } from "express";
import { login, register, me, stats } from "./handlers";
import { validToken } from "./middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", validToken, me);
router.get("/stats", validToken, stats);

export default router;