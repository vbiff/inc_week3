import { commmentsCollection } from "../../../db/mongo.db";
import { CommentCreateDto } from "../dto/input-dto/comment-create-dto";

export const commentsRepository = {
  async createComment(newComment: CommentCreateDto): Promise<string> {
    const commentId = await commmentsCollection.insertOne(newComment);
    return commentId.insertedId.toString();
  },
};
