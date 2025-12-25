import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsServices } from "../../domain/posts-services";
import { blogsQueryRepository } from "../../../blogs/repositories/blogs.query-mongodb.repositories";
import { postsQueryRepositories } from "../../repositories/posts.mongodb-query-repository";
import { Blog } from "../../../blogs/types/blog";

export async function createPostHandler(req: Request, res: Response) {
  const blog: Blog | null = await blogsQueryRepository.findByObjectId(
    req.body.blogId,
  );
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }

  const newPostId = await postsServices.createPost(req.body, blog!.name);

  if (!newPostId) {
    return;
  }

  const mappedPost = await postsQueryRepositories.findByObjectId(
    newPostId.toString(),
  );

  res.status(HttpStatuses.CREATED_201).send(mappedPost);
}
