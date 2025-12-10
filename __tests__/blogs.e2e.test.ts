import express from "express";
import { setupApp } from "../src/setup-app";
import request from "supertest";
import { HttpStatuses } from "../src/core/types/http-statuses";
import { blogInputDto } from "../src/blogs/dto/blog.input_dto";

describe("Test for CRUD blogs", () => {
  const app = express();
  setupApp(app);

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
      websiteUrl: "https://length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY.com",
    };

    await request(app)
      .post("/blogs")
      .send(newBlog)
      .expect(HttpStatuses.CREATED_201);
  });
  //get all
  it("Should get all blogs", async () => {
    const blogs = await request(app).get("/blogs").expect(HttpStatuses.OK_200);

    expect(blogs.body.length).toBe(1);

    blogId = blogs.body[0].id;
  });
  //get by id
  it("Should get a blog by id", async () => {
    await request(app).get(`/blogs/${blogId}`).expect(HttpStatuses.OK_200);

    await request(app).get(`/blogs/wrongId`).expect(HttpStatuses.NOT_FOUND_404);
  });
  //update
  it("Should update blog with valid id", async () => {
    const updateBlog: blogInputDto = {
      description: "description22",
      name: "NAME22",
      websiteUrl: "https://example22.com/",
    };

    await request(app)
      .put(`/blogs/${blogId}`)
      .send(updateBlog)
      .expect(HttpStatuses.NO_CONTENT_204);

    const response = await request(app)
      .get(`/blogs/${blogId}`)
      .expect(HttpStatuses.OK_200);

    expect(response.body).toEqual({
      description: "description22",
      name: "NAME22",
      websiteUrl: "https://example22.com/",
      id: blogId,
    });
    // put wrong id
    await request(app)
      .put(`/blogs/wrongId`)
      .send(updateBlog)
      .expect(HttpStatuses.NOT_FOUND_404);
  });
  //delete
  it("Should delete blog by id", async () => {
    await request(app)
      .delete(`/blogs/${blogId}`)
      .expect(HttpStatuses.NO_CONTENT_204);

    await request(app)
      .get(`/blogs/${blogId}`)
      .expect(HttpStatuses.NOT_FOUND_404);
  });

  it("Shouldnt delete blog by id", async () => {
    await request(app)
      .delete(`/blogs/${blogId}`)
      .expect(HttpStatuses.NOT_FOUND_404);
  });
});
