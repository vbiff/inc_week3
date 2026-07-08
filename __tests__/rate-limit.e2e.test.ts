import request from "supertest";
import { HttpStatuses } from "../src/core/types/http-statuses";
import express from "express";
import { setupApp } from "../src/setup-app";
import { AUTH_PATH } from "../src/core/paths/paths";
import { runDb } from "../src/db/mongo.db";
import mongoose from "mongoose";

describe("rate limit tests", () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDb();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);
  });

  it("should return 429 after 5 requests to /auth/registration within 10 seconds", async () => {
    const body = {
      login: "testuser",
      password: "123456",
      email: "test@test.com",
    };

    // Send 5 requests - all should NOT be 429
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post(AUTH_PATH + "/registration")
        .send({ ...body, login: `testuser${i}`, email: `test${i}@test.com` });

      console.log(`Request ${i + 1}: status=${res.status}`);
      expect(res.status).not.toBe(429);
    }

    // 6th request should be 429
    const res = await request(app)
      .post(AUTH_PATH + "/registration")
      .send(body);

    console.log(`Request 6: status=${res.status}`);
    expect(res.status).toBe(429);
  });

  it("should return 429 after 5 requests to /auth/login within 10 seconds", async () => {
    const body = {
      loginOrEmail: "nonexistent",
      password: "123456",
    };

    // Send 5 requests - all should be 401 (user doesn't exist)
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post(AUTH_PATH + "/login")
        .send(body);

      console.log(`Request ${i + 1}: status=${res.status}`);
      expect(res.status).toBe(401);
    }

    // 6th request should be 429
    const res = await request(app)
      .post(AUTH_PATH + "/login")
      .send(body);

    console.log(`Request 6: status=${res.status}`);
    expect(res.status).toBe(429);
  });
});
