import { Request, Response } from "express";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { container } from "../../../../composition-root";
import { PostsQueryRepository } from "../../../posts/repositories/posts.mongodb-query-repository";
import { BlogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";

const postsQueryRepository = container.get(PostsQueryRepository);
const blogsQueryRepository = container.get(BlogsQueryRepository);

export async function getAllPostsForSpecificBlogIdHandler(
  req: Request,
  res: Response,
) {
  const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

  const blog = await blogsQueryRepository.findByObjectId(req.params.blogId);
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  const resultPosts = await postsQueryRepository.findAllPostsByBlogId(
    req.params.blogId,
    queryInput,
  );

  res.status(HttpStatuses.OK_200).send(resultPosts);
}
