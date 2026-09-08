import path from "path";
import fs from "fs";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";

// Import modular routers
import compatibilityRouter from "./server/compatibility.js";
import horoscopeRouter from "./server/horoscope.js";
import dailyHoroscopeRouter from "./server/dailyHoroscope.js";
import punditChatRouter from "./server/punditChat.js";
import profileChatRouter from "./server/profileChat.js";
import cashfreeRouter from "./server/cashfree.js";
import aiSearchRouter from "./server/aiSearch.js";
import authRouter from "./server/routes/auth.js";

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
// Note: in the api-only clone there will be no frontend dist, so this is skipped.
const frontendDistPath = path.join(process.cwd(), 'frontend-dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => res.sendFile(path.join(frontendDistPath, 'index.html')));
}

app.listen(PORT, "0.0.0.0", () => {
  const source = process.env.PORT ? `PORT=${process.env.PORT} (env)` : "default 3000";
  console.log(`Matrimony API listening on 0.0.0.0:${PORT} [${source}]`);
  console.log(`Mode: ${process.env.NODE_ENV === "production" ? "production" : "development"}`);
});
