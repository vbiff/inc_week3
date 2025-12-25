import express from "express";
import { setupApp } from "../src/setup-app";
import request from "supertest";
import { HttpStatuses } from "../src/core/types/http-statuses";
import { UserInputDTO } from "../src/users/dto/input-dto/user-input-dto";
import { USERS_PATH } from "../src/core/paths/paths";
import { generateBasicAuthToken } from "../src/core/utils/generate-admin-auth-token";

describe("Test for CRUD Users", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);
  });

  //create new user
  it("Should create new user", async () => {
    const newUser: UserInputDTO = {
      login: "123456",
      password: "654321",
      email: "test@gmail.com",
    };

    await request(app)
      .post(USERS_PATH)
      .set("Authorization", adminToken)
      .send(newUser)
      .expect(HttpStatuses.CREATED_201);
  });

  it("Should return all users", async () => {
    const users = await request(app)
      .get(USERS_PATH)
      .set("Authorization", adminToken)
      .expect(HttpStatuses.OK_200);

    expect(users.body!.items.length).toBe(1);
  });
});
