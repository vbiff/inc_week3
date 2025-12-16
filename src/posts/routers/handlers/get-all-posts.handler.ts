import { Request, Response } from "express";
import { postsServices } from "../../domain/posts-services";

export async function getAllPostsHandler(req: Request, res: Response) {
  const blogs = await postsServices.findAll();
  res.send(blogs);
}
