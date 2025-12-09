import { Router, Request, Response } from "express";
import { HttpStatuses } from "../../core/types/http-statuses";
import { blogInputDto } from "../dto/blog.input_dto";
import { blogsRepository } from "../repositories/blogs.repositories";

export const blogRouter = Router();
//get all
blogRouter.get("/", (req: Request, res: Response) => {
  const blogs = blogsRepository.findAll();
  res.status(HttpStatuses.OK_200).send(blogs);
});
// create
blogRouter.post("/", (req: Request<blogInputDto>, res: Response) => {
  const newBlog = blogsRepository.createBlog(req.body);
  res.status(HttpStatuses.CREATED_201).send(newBlog);
});

// get by id

blogRouter.get("/:id", (req: Request, res: Response) => {
  const blog = blogsRepository.findById(req.params.id);
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.status(HttpStatuses.OK_200).send(blog);
});

// update
blogRouter.put("/:id", (req: Request, res: Response) => {
  blogsRepository.updateBlog(req.body, req.params.id);
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});

//delete
blogRouter.delete("/:id", (req: Request, res: Response) => {
  blogsRepository.deleteBlog(req.params.id);
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});
