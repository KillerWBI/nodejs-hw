import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/multer.js";


const router = Router();

router.patch("/users/me/avatar",authenticate,upload.single("avatar"), );




export default router;
