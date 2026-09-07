import path from "path";
import fs from "fs";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";

// Import modular routers
import compatibilityRouter from "./server/compatibility";
import horoscopeRouter from "./server/horoscope";
import dailyHoroscopeRouter from "./server/dailyHoroscope";
import punditChatRouter from "./server/punditChat";
import profileChatRouter from "./server/profileChat";
import cashfreeRouter from "./server/cashfree";
import aiSearchRouter from "./server/aiSearch";
import authRouter from "./server/routes/auth";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Allow the frontend (static hosting) to call this API from a browser.
if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN.split(','), credentials: true }));
}

// Mount API routes
app.use("/api/auth", authRouter);
app.use("/api", compatibilityRouter);
app.use("/api", horoscopeRouter);
app.use("/api", dailyHoroscopeRouter);
app.use("/api", punditChatRouter);
app.use("/api", profileChatRouter);
app.use("/api", cashfreeRouter);
app.use("/api", aiSearchRouter);

// Optional: serve a built frontend if it exists (keeps single-origin option).
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.listen(PORT, "0.0.0.0", () => {
  const source = process.env.PORT ? `PORT=${process.env.PORT} (env)` : "default 3000";
  console.log(`Matrimony API listening on 0.0.0.0:${PORT} [${source}]`);
  console.log(`Mode: ${process.env.NODE_ENV === "production" ? "production" : "development"}`);
});
