import { Router } from "express";
import { updateUserAvatar } from "../controllers/UserController.js";
import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/multer.js";


const router = Router();

router.patch("/users/me/avatar",authenticate,upload.single("avatar"), updateUserAvatar,);




export default router;
