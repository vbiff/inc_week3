import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repositories";

export function getAllPostsHandler(req: Request, res: Response) {
  const blogs = postsRepository.findAll();
  res.send(blogs);
}
