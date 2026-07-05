import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { container } from "../../../../composition-root";
import { ObjectId } from "mongodb";
import { PostsService } from "../../../posts/application/command-services/posts-services";
import { BlogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";
import { PostsQueryRepository } from "../../../posts/repositories/posts.mongodb-query-repository";

const postsService = container.get(PostsService);
const blogsQueryRepository = container.get(BlogsQueryRepository);
const postsQueryRepository = container.get(PostsQueryRepository);

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
    await postsService.createPostForSpecificBlogId(
      req.body,
      req.params.blogId,
      blog.name,
    );

  const newPost = await postsQueryRepository.findByObjectId(
    newPostId!.toString(),
  );

  if (!newPost) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.status(HttpStatuses.CREATED_201).send(newPost);
}
