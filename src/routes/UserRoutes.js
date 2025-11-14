import { Router } from "express";
import { updateUserAvatar } from "../controllers/UserController.js";
import { authenticate } from "../middleware/authenticate.js";


const router = Router();

router.patch("/users/me/avatar",authenticate,updateUserAvatar,);




export default router;
