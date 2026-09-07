import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Import modular routers
import compatibilityRouter from "./server/compatibility";
import horoscopeRouter from "./server/horoscope";
import dailyHoroscopeRouter from "./server/dailyHoroscope";
import punditChatRouter from "./server/punditChat";
import profileChatRouter from "./server/profileChat";
import cashfreeRouter from "./server/cashfree";
import aiSearchRouter from "./server/aiSearch";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Mount API routes
app.use("/api", compatibilityRouter);
app.use("/api", horoscopeRouter);
app.use("/api", dailyHoroscopeRouter);
app.use("/api", punditChatRouter);
app.use("/api", profileChatRouter);
app.use("/api", cashfreeRouter);
app.use("/api", aiSearchRouter);

// -------------------------------------------------------------------------
// Vite Dev Middleware & SPA Production Fallback
// -------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in Development Mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in Production Mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hindu Matrimony Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
