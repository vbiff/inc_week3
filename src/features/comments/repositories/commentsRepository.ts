import { commentsCollection } from "../../../db/mongo.db";
import { CommentCreateDto } from "../application/command-service/dto/comment-create-dto";

export const commentsRepository = {
  async createComment(newComment: CommentCreateDto): Promise<string> {
    const commentId = await commentsCollection.insertOne(newComment);
    return commentId.insertedId.toString();
  },
};
