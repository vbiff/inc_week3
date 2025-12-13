import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.mongodb.repositories";

export async function getAllPostsHandler(req: Request, res: Response) {
  const blogs = await postsRepository.findAll();
  res.send(blogs);
}
