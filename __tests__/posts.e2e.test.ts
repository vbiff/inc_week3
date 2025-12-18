import express from "express";
import { setupApp } from "../src/setup-app";
import request from "supertest";
import { HttpStatuses } from "../src/core/types/http-statuses";
import { blogInputDto } from "../src/blogs/dto/blog.input_dto";
import { generateBasicAuthToken } from "../src/core/utils/generate-admin-auth-token";
import { PostInputDTO } from "../src/posts/dto/post-input-dto";
import { BLOGS_PATH, POSTS_PATH } from "../src/core/paths/paths";

describe("Test for CRUD posts", () => {
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

    expect(blogs.body.items.length).toBe(1); //I have deleted everything

    blogId = blogs.body.items[0].id;
  });

  let postId = "";

  //post blog
  it("Should create a post", async () => {
    const newPost: PostInputDTO = {
      title: "test",
      shortDescription: "description",
      content: "content",
      blogId: blogId,
    };

    const result = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send(newPost)
      .expect(HttpStatuses.CREATED_201);

    console.log(result.body);
  });
  //get all
  it("Should get all posts", async () => {
    const posts = await request(app)
      .get(POSTS_PATH)
      .expect(HttpStatuses.OK_200);

    expect(posts.body.items.length).toBe(1);

    postId = posts.body.items[0].id;
  });
  //get by id
  it("Should get a post by id", async () => {
    console.log(postId);
    await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .expect(HttpStatuses.OK_200);

    await request(app)
      .get(`${POSTS_PATH}/693c45f575a8c9cafc5843d1`)
      .expect(HttpStatuses.NOT_FOUND_404);
  });
  //update
  it("Should update post with valid id", async () => {
    const updatePost: PostInputDTO = {
      title: "test2",
      shortDescription: "description2",
      content: "content2",
      blogId: blogId,
    };

    await request(app)
      .put(`${POSTS_PATH}/${postId}`)
      .set("Authorization", adminToken)
      .send(updatePost)
      .expect(HttpStatuses.NO_CONTENT_204);

    const response = await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .expect(HttpStatuses.OK_200);

    expect(response.body).toMatchObject({
      blogName: "NAME",
      title: "test2",
      shortDescription: "description2",
      content: "content2",
      blogId: blogId,
    });
    // put wrong id
    await request(app)
      .put(`${POSTS_PATH}/693c45f575a8c9cafc5843d1`)
      .set("Authorization", adminToken)
      .send(updatePost)
      .expect(HttpStatuses.NOT_FOUND_404);
  });
  //delete
  it("Should delete post by id", async () => {
    await request(app)
      .delete(`${POSTS_PATH}/${postId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatuses.NO_CONTENT_204);

    await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .expect(HttpStatuses.NOT_FOUND_404);
  });

  it("Shouldnt delete post by id", async () => {
    await request(app)
      .delete(`${POSTS_PATH}/${postId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatuses.NOT_FOUND_404);
  });
});
