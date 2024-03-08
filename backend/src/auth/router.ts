import { Router } from "express";
import { login, register, me } from "./handlers";
import { validToken } from "./middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", validToken, me);

export default router;