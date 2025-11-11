import { celebrate } from "celebrate";
import { Router } from "express";
import { loginUser, refreshUserSession, registerUser } from "../controllers/authController.js";
import { loginUserShema, registerUserSchema } from "../validations/authValidation.js";


const router = Router();

router.post("/auth/register", celebrate(registerUserSchema), registerUser);
router.post("auth/login", celebrate(loginUserShema), loginUser);
router.post("auth/refresh", refreshUserSession);


export default router;
