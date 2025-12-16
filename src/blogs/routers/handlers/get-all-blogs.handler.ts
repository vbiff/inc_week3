import { Request, Response } from "express";
import { blogsServices } from "../../domain/blogs-services";

export async function getAllBlogsHandler(req: Request, res: Response) {
  const blogs = await blogsServices.findBlogs();
  res.send(blogs);
}

///get.   /blog/?sortBy=data&sortDirection=asc&....
