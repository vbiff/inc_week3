import express from "express";
import { setupApp } from "../src/setup-app";
import { blogInputDto } from "../src/blogs/dto/input-dto/blog_input_dto";
import request from "supertest";
import { BLOGS_PATH, POSTS_PATH } from "../src/core/paths/paths";
import { generateBasicAuthToken } from "../src/core/utils/generate-admin-auth-token";
import { HttpStatuses } from "../src/core/types/http-statuses";

describe("InputValidation", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);
  });

  //first we need to create a blog and get blogId
  let blogId = "";

  //post blog
  it("Should create a blog", async () => {
    const newBlog: blogInputDto = {
      description: "description",
      name: "NAME",
      websiteUrl:
        "https://length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY.com",
    };

    await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send(newBlog)
      .expect(HttpStatuses.CREATED_201);
  });
  //get all
  it("Should get all blogs", async () => {
    const blogs = await request(app)
      .get(BLOGS_PATH)
      .expect(HttpStatuses.OK_200);

    expect(blogs.body.length).toBe(1); //I have deleted everything before all

    blogId = blogs.body[0].id;
  });

  it("Should pass all validation on create", async () => {
    const validInputData = {
      title: "",
      shortDescription: "description",
      content: "content",
      blogId: blogId,
    };
    const response = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send(validInputData)
      .expect(HttpStatuses.BAD_REQUEST_400);

    console.log(response.body);
  });
});
