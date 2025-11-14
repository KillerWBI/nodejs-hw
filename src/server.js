import { errors } from "celebrate";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import authRouter from "./routes/authRoutes.js";
import notesRouter from "./routes/notesRoutes.js";
import userRoutes from "./routes/UserRoutes.js";



const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====


app.use(cors());
app.use(express.json());
app.use(logger);
app.use(cookieParser());

// ===== Routes =====
app.use("/", notesRouter);
app.use("/", authRouter);
app.use("/", userRoutes);

// ===== Handlers =====
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

// ===== DB =====
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
