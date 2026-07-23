import express from "express";
import { setupApp } from "./setup-app";
import { runDb } from "./db/mongo.db";
import { HttpStatuses } from "./core/types/http-statuses";

const app = express();

let dbConnectPromise: Promise<void> | null = null;

app.use(async (req, res, next) => {
  if (!dbConnectPromise) {
    dbConnectPromise = runDb();
  }
  try {
    await dbConnectPromise;
  } catch (error) {
    // Reset so the next request (possibly a retry) attempts a fresh
    // connection instead of being stuck forever on this warm serverless
    // instance, since a failed connect used to resolve silently and never
    // get retried.
    dbConnectPromise = null;
    console.error("Database connection failed:", error);
    res.sendStatus(HttpStatuses.SERVERERROR_500);
    return;
  }
  next();
});

setupApp(app);

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

export default app;
