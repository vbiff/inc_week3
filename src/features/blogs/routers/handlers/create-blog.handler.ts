import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { BlogsService } from "../../application/command-services/blogs-services";
import { BlogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";
import { inject, injectable } from "inversify";

@injectable()
export class CreateBlogHandler {
  constructor(
    @inject(BlogsService) private blogsService: BlogsService,
    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}
  createBlogHandler = async (req: Request, res: Response): Promise<void> => {
    const blogId = await this.blogsService.createBlog(req.body);

    if (!blogId) {
      return;
    }

    const newBlog = await this.blogsQueryRepository.findByObjectId(blogId);

    if (!newBlog) {
      return;
    }

    res.status(HttpStatuses.CREATED_201).send(newBlog);
  };
}
