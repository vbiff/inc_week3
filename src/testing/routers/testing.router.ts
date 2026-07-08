import { Router, Request, Response } from "express";
import { HttpStatuses } from "../../core/types/http-statuses";
import { client } from "../../db/mongo.db";
import { DeviceDTO } from "../../features/security/application/dto/device-dto";
import { BlogModel } from "../../features/blogs/domain/blog_entity";
import { PostModel } from "../../features/posts/domain/post_entity";
import { CommentModel } from "../../features/comments/domain/comment_entity";
import { UserModel } from "../../features/users/domain/user_entity";

export const testingRouter: Router = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await BlogModel.deleteMany();
  await PostModel.deleteMany();
  await CommentModel.deleteMany();
  await UserModel.deleteMany();
  await client.db("blogger").collection<DeviceDTO>("devices").deleteMany({});
  await client
    .db("blogger")
    .collection<{ ip: string; url: string; date: Date }>("rateLimit")
    .deleteMany({});
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});
