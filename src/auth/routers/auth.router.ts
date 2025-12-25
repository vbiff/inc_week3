import { Router } from "express";
import { loginAuthHandler } from "./handlers/login-auth-handler";
import { authValidator } from "../validation/input-auth-valodator";

export const authRouter = Router();

authRouter.post("/login", authValidator, loginAuthHandler);
