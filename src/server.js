import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import express from "express";
import PinoHttp from "pino-http";
import { connectMongoDB } from "./db/connectMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(PinoHttp());


app.get("/notes", (req, res) => {
  res.status(200).json({ message: "Retrieved all notes" });
});

app.get("/notes/:noteId", (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

app.get("/test-error", () => {
  throw new Error("Simulated server error");
});


app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ message: err.message });
});

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
