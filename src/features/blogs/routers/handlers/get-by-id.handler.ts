import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { BlogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";
import { inject, injectable } from "inversify";

@injectable()
export class GetBlogByIdHandler {
  constructor(
    @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  getBlogById = async (req: Request, res: Response) => {
    const blog = await this.blogsQueryRepository.findByObjectId(req.params.id);
    if (!blog) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }

    res.status(HttpStatuses.OK_200).send(blog);
  };
}
