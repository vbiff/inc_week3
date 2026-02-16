import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsService, blogsQueryRepository, postsQueryRepository } from "../../../../composition-root";
import { BlogView } from "../../../blogs/application/queries/dto/output-dto/blog-view";

export async function createPostHandler(req: Request, res: Response) {
  const blog: BlogView | null = await blogsQueryRepository.findByObjectId(
    req.body.blogId,
  );
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }

  const newPostId = await postsService.createPost(req.body, blog!.name);

  if (!newPostId) {
    return;
  }

  const mappedPost = await postsQueryRepository.findByObjectId(
    newPostId.toString(),
  );

  res.status(HttpStatuses.CREATED_201).send(mappedPost);
}
