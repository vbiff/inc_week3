import { Request, Response } from "express";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { PostsQueryRepository } from "../../../posts/repositories/posts.mongodb-query-repository";
import { BlogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";
import { inject, injectable } from "inversify";

@injectable()
export class GetAllPostsForSpecificBlogIdHandler {
  constructor(
    @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
    @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  getAllPostsForSpecificBlogIdHandler = async (req: Request, res: Response) => {
    const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

    const blog = await this.blogsQueryRepository.findByObjectId(
      req.params.blogId,
    );
    if (!blog) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }

    const resultPosts = await this.postsQueryRepository.findAllPostsByBlogId(
      req.params.blogId,
      queryInput,
    );

    res.status(HttpStatuses.OK_200).send(resultPosts);
  };
}
