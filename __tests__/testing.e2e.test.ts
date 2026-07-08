import request from "supertest";
import express from "express";
import { setupApp } from "../src/setup-app";
import { HttpStatuses } from "../src/core/types/http-statuses";
import { runDb } from "../src/db/mongo.db";
import mongoose from "mongoose";

describe("Testing API", () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDb();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("Should delete all data in memory_db and check if we have an empty list", async () => {
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);
  });
});
