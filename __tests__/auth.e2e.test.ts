import request from "supertest";
import { HttpStatuses } from "../src/core/types/http-statuses";
import express from "express";
import { setupApp } from "../src/setup-app";
import { UserInputDTO } from "../src/features/users/application/queries/dto/input-dto/user-input-dto";
import { AUTH_PATH, LOGIN_PATH, USERS_PATH } from "../src/core/paths/paths";
import { generateBasicAuthToken } from "../src/core/utils/generate-admin-auth-token";

describe("auth tests", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);
  });

  afterAll(async () => {
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);
  });
  //create new user
  it("Should create new user", async () => {
    const newUser: UserInputDTO = {
      login: "TEST",
      password: "123456",
      email: "test123@email.com",
    };

    await request(app)
      .post(USERS_PATH)
      .set("Authorization", adminToken)
      .send(newUser)
      .expect(HttpStatuses.CREATED_201);
  });
  let token = "";
  it("Should login new user", async () => {
    console.log("HERE");
    const result = await request(app)
      .post(AUTH_PATH + LOGIN_PATH)
      .send({ loginOrEmail: "test123@email.com", password: "123456" })
      .expect(HttpStatuses.OK_200);

    token = result.body.accessToken;
  });

  it("Should return me", async () => {
    const result = await request(app)
      .get(AUTH_PATH + "/me")
      .set("Authorization", "Bearer " + token);
    expect(result.status).toBe(200);

    console.log(result.body);
  });
});
