import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsServices } from "../../domain/posts-services";
import { mapperPost } from "../../mappers/mapper-post";
import { blogsQueryRepository } from "../../../blogs/repositories/blogs.query-mongodb.repositories";
import { blogCreateDto } from "../../../blogs/dto/blog-create-dto";
import { WithId } from "mongodb";
import { postsQueryRepositories } from "../../repositories/posts.mongodb-query-repository";

export async function createPostHandler(req: Request, res: Response) {
  const blog: WithId<blogCreateDto> | null =
    await blogsQueryRepository.findByObjectId(req.body.blogId);
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }

  const newPostId = await postsServices.createPost(req.body, blog!.name);

  if (!newPostId) {
    return;
  }

  const newPost = await postsQueryRepositories.findByObjectId(
    newPostId.toString(),
  );
  if (!newPost) {
    return;
  }
  const mappedPost = mapperPost(newPost);

  res.status(HttpStatuses.CREATED_201).send(mappedPost);
}
