import { LikeStatuses } from "../domain/comment_like_entity";
import { body } from "express-validator";

export const commentLikeStatusValidation = [
  body("likeStatus")
    .isIn(Object.values(LikeStatuses))
    .withMessage({ message: "likeStatus must be Like, Dislike or None" }),
];
