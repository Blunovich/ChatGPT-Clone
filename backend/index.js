import "dotenv/config";
import db from "./db/db.config.js";
import express from "express";
import cors from "cors";
import mainRouter from "./src/api/main.routes.js";
import { errorHandler } from "./src/middleware/error-handler.js";

// ...

const app = express();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173", // Vite local development
  "https://gizachew-chat-gpt-clone.vercel.app", // Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, mobile apps, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
// ------------------------------

app.use(express.json()); // used to parse json payloads
app.use("/api", mainRouter);
app.use(errorHandler);

async function startServer() {
  try {
    const connection = await db.getConnection();
    connection.release();
    // Render handles the port automatically using process.env.PORT,
    // but keeping 3788 as a local fallback is great!
    const PORT = process.env.PORT || 3777;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
}

startServer();
