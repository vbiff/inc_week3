import { Router, Request, Response } from "express";
import { HttpStatuses } from "../../core/types/http-statuses";
import { BlogModel } from "../../features/blogs/domain/blog_entity";
import { PostModel } from "../../features/posts/domain/post_entity";
import { CommentModel } from "../../features/comments/domain/comment_entity";
import { UserModel } from "../../features/users/domain/user_entity";
import { DeviceModel } from "../../features/security/domain/device_entity";
import { RateLimitModel } from "../../core/middlewares/rate-limit/rate-limit.model";
import { CommentLikeModel } from "../../features/comments/domain/comment_like_entity";

export const testingRouter: Router = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await BlogModel.deleteMany();
  await PostModel.deleteMany();
  await CommentModel.deleteMany();
  await UserModel.deleteMany();
  await DeviceModel.deleteMany();
  await RateLimitModel.deleteMany();
  await CommentLikeModel.deleteMany();
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});
