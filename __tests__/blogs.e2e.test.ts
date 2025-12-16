import express from "express";
import { setupApp } from "../src/setup-app";
import request from "supertest";
import { HttpStatuses } from "../src/core/types/http-statuses";
import { blogInputDto } from "../src/blogs/dto/blog.input_dto";
import { generateBasicAuthToken } from "../src/core/utils/generate-admin-auth-token";
import { BLOGS_PATH } from "../src/core/paths/paths";

describe("Test for CRUD blogs", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);
  });

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

    expect(blogs.body.length).toBe(1); //I have deleted everything
    console.log(blogs.body);

    blogId = blogs.body[0].id;
  });

  //create a post by blogId
  it("should create a post with specific blogId", async () => {
    await request(app)
      .post(`${BLOGS_PATH}/${blogId}/posts`)
      .set("Authorization", adminToken)
      .expect(HttpStatuses.CREATED_201);
  });

  //get by id
  it("Should get a blog by id", async () => {
    await request(app)
      .get(`${BLOGS_PATH}/${blogId}`)
      .expect(HttpStatuses.OK_200);

    await request(app)
      .get(`${BLOGS_PATH}/693c45f575a8c9cafc5843d1`)
      .expect(HttpStatuses.NOT_FOUND_404);
  });
  //update
  it("Should update blog with valid id", async () => {
    const updateBlog: blogInputDto = {
      description: "description22",
      name: "NAME22",
      websiteUrl: "https://example22.com/",
    };

    await request(app)
      .put(`${BLOGS_PATH}/${blogId}`)
      .set("Authorization", adminToken)
      .send(updateBlog)
      .expect(HttpStatuses.NO_CONTENT_204);

    const response = await request(app)
      .get(`${BLOGS_PATH}/${blogId}`)
      .expect(HttpStatuses.OK_200);

    expect(response.body).toMatchObject(updateBlog);
    // put wrong id
    await request(app)
      .put(`${BLOGS_PATH}/693c45f575a8c9cafc5843d1`)
      .set("Authorization", adminToken)
      .send(updateBlog)
      .expect(HttpStatuses.NOT_FOUND_404);
  });
  //delete
  it("Should delete blog by id", async () => {
    await request(app)
      .delete(`${BLOGS_PATH}/${blogId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatuses.NO_CONTENT_204);

    await request(app)
      .get(`${BLOGS_PATH}/${blogId}`)
      .expect(HttpStatuses.NOT_FOUND_404);
  });

  it("Shouldnt delete blog by id", async () => {
    await request(app)
      .delete(`${BLOGS_PATH}/${blogId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatuses.NOT_FOUND_404);
  });
});
