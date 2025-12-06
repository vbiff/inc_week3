import request from "supertest";
import express from "express";
import { setupApp } from "../src/setup-app";
import { HttpStatuses } from "../src/core/types/http-statuses";

describe("Testing API", () => {
  const app = express();
  setupApp(app);

  it("Should delete all data in memory_db and check if we have an empty list", async () => {
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);

    const getResponse = await request(app)
      .get("/videos")
      .expect(HttpStatuses.OK_200);
    expect(getResponse.body).toEqual([]);
  });
});
