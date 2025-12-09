import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repositories";

export function getAllBlogsHandler(req: Request, res: Response) {
  const blogs = blogsRepository.findAll();
  res.send(blogs);
}
