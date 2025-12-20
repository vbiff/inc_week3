import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsServices } from "../../../posts/domain/posts-services";
import { mapperPost } from "../../../posts/mappers/mapper-post";
import { WithId } from "mongodb";
import { PostCreateDto } from "../../../posts/dto/post-create-dto";
import { blogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";

export async function createPostForSpecificBlogIdHandler(
  req: Request,
  res: Response,
) {
  const blog = await blogsQueryRepository.findByObjectId(req.params.blogId);

  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  const newPost: WithId<PostCreateDto> | null =
    await postsServices.createPostForSpecificBlogId(
      req.body,
      req.params.blogId,
    );

  if (!newPost) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  const mappedPost = mapperPost(newPost);

  res.status(HttpStatuses.CREATED_201).send(mappedPost);
}
