import { CommentLikeCreateDTO } from "../application/command-service/dto/comment-like-create-dto";
import {
  CommentLikeEntity,
  CommentLikeModel,
} from "../domain/comment_like_entity";
import { Result } from "../../../core/result/resultType";
import { ResultStatus } from "../../../core/result/resultCode";
import { injectable } from "inversify";

@injectable()
export class CommentsLikesRepository {
  async setLike(newLike: CommentLikeCreateDTO): Promise<string> {
    const like = CommentLikeEntity.createCommentLike(newLike);

    const created = await CommentLikeModel.create(like);
    return created._id.toString();
  }

  async updateLike(
    likeId: string,
    newLike: CommentLikeCreateDTO,
  ): Promise<Result> {
    const like = await CommentLikeModel.findById(likeId);
    if (!like) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Like not found",
        extensions: [],
        data: null,
      };
    }
    like.status = newLike.status;
    like.lastModifiedAt = Date.now().toString();
    await like.save();
    return {
      status: ResultStatus.Success,
      errorMessage: "",
      extensions: [],
      data: null,
    };
  }
}
