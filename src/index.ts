import express from "express";
import { setupApp } from "./setup-app";
import { runDb } from "./db/mongo.db";

const app = express();
setupApp(app);

const PORT = process.env.PORT || 3000;

const startApp = async (): Promise<void> => {
  await runDb();
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};
startApp();
