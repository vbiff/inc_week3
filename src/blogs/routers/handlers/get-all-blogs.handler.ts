import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.mongodb.repositories";

export async function getAllBlogsHandler(req: Request, res: Response) {
  const blogs = await blogsRepository.findAll();
  res.send(blogs);
}
