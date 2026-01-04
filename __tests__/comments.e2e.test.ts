import express from "express";
import { setupApp } from "../src/setup-app";
import request from "supertest";
import { HttpStatuses } from "../src/core/types/http-statuses";
import { BlogInputDto } from "../src/features/blogs/application/queries/dto/input-dto/blog_input_dto";
import {
  AUTH_PATH,
  BLOGS_PATH,
  COMMENT_PATH,
  LOGIN_PATH,
  POSTS_PATH,
  USERS_PATH,
} from "../src/core/paths/paths";
import { PostInputDTO } from "../src/features/posts/application/queries/dto/input-dto/post-input-dto";
import { generateBasicAuthToken } from "../src/core/utils/generate-admin-auth-token";
import { UserInputDTO } from "../src/features/users/application/queries/dto/input-dto/user-input-dto";

describe("comments", () => {
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
    const newBlog: BlogInputDto = {
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

  // COMMENTS!

  let commentId = "";
  it("Should create a comment for the postId", async () => {
    const newComment = { content: "HELLO WORLD!" };

    const result = await request(app)
      .post(`${POSTS_PATH}/${postId}${COMMENT_PATH}`)
      .set("Authorization", "Bearer " + token)
      .send(newComment)
      .expect(HttpStatuses.CREATED_201);

    console.log(result.body);
    commentId = result.body.id;
  });
  it("Should get comment by id", async () => {
    const result = await request(app)
      .get(`${COMMENT_PATH}/${commentId}`)
      .expect(HttpStatuses.OK_200);

    console.log(result.body);
  });

  it("Should get a comments by post id", async () => {
    const result = await request(app)
      .get(`${POSTS_PATH}/${postId}${COMMENT_PATH}`)
      .expect(HttpStatuses.OK_200);

    console.log(result.body);
  });

  it("Should update a comment by id", async () => {
    const content = { content: "new content" };
    await request(app)
      .put(`${COMMENT_PATH}/${commentId}`)
      .set("Authorization", "Bearer " + token)
      .send(content)
      .expect(HttpStatuses.NO_CONTENT_204);

    const result = await request(app)
      .get(`${COMMENT_PATH}/${commentId}`)
      .expect(HttpStatuses.OK_200);

    expect(result.body.content).toBe("new content");
  });

  it("Should not delete a comment by wrong id", async () => {
    await request(app)
      .delete(`${COMMENT_PATH}/63189b06003380064c4193be`)
      .set("Authorization", "Bearer " + token)
      .expect(HttpStatuses.NOT_FOUND_404);
  });

  it("Should delete a comment by  id", async () => {
    await request(app)
      .delete(`${COMMENT_PATH}/${commentId}`)
      .set("Authorization", "Bearer " + token)
      .expect(HttpStatuses.NO_CONTENT_204);
  });
});
