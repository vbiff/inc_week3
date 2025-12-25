import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsServices } from "../../../posts/domain/posts-services";
import { ObjectId } from "mongodb";
import { blogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";
import { postsQueryRepositories } from "../../../posts/repositories/posts.mongodb-query-repository";

export async function createPostForSpecificBlogIdHandler(
  req: Request,
  res: Response,
) {
  const blog = await blogsQueryRepository.findByObjectId(req.params.blogId);

  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  const newPostId: ObjectId | null =
    await postsServices.createPostForSpecificBlogId(
      req.body,
      req.params.blogId,
      blog.name,
    );

  const newPost = await postsQueryRepositories.findByObjectId(
    newPostId!.toString(),
  );

  if (!newPost) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.status(HttpStatuses.CREATED_201).send(newPost);
}
