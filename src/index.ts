import express from "express";
import { setupApp } from "./setup-app";
import { runDb } from "./db/mongo.db";

const app = express();

let dbConnectPromise: Promise<void> | null = null;

app.use(async (req, res, next) => {
  if (!dbConnectPromise) {
    dbConnectPromise = runDb();
  }
  await dbConnectPromise;
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
