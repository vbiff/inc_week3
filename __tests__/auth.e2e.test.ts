import request from "supertest";
import { HttpStatuses } from "../src/core/types/http-statuses";
import express from "express";
import { setupApp } from "../src/setup-app";
import { client, runDb } from "../src/db/mongo.db";
import { UserInputDTO } from "../src/features/users/application/queries/dto/input-dto/user-input-dto";
import { AUTH_PATH, LOGIN_PATH, USERS_PATH } from "../src/core/paths/paths";
import { generateBasicAuthToken } from "../src/core/utils/generate-admin-auth-token";
import { container } from "../src/composition-root";
import { NodemailerService } from "../src/features/auth/adapters/email-service/nodemailer-service";
import mongoose from "mongoose";

const nodemailerService = container.get(NodemailerService);

describe("auth tests", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDb();
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);

    //sendEmail -> mockSendEmail
  });

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);
    await mongoose.disconnect();
    await client.close();
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
  });

  it("Should register user", async () => {
    jest.spyOn(nodemailerService, "sendEmail").mockResolvedValue();

    const response = await request(app)
      .post(AUTH_PATH + "/registration")
      .send({
        password: "123456",
        email: "mikhail.bogovalov@gmail.com",
        login: "test",
      });

    console.log(response.body, "!!!!!!");

    expect(response.status).toEqual(204);
    expect(nodemailerService.sendEmail).toHaveBeenCalled();
  });
});
