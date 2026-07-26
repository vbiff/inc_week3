import { PostModel } from "../../posts/domain/post_entity";
import { mapperToCommentOutputResDto } from "../mappers/mapper-to-comment-output-res-dto";
import { ResultCommentsOutputDto } from "../../posts/application/queries/dto/output-dto/result-comments-output-dto";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { getSkipNumber } from "../../../core/utils/skip";
import { mapperOutput } from "../../../core/mappers/mapper-output";
import { injectable } from "inversify";
import { CommentModel } from "../domain/comment_entity";
import { CommentLikeModel, LikeStatuses } from "../domain/comment_like_entity";
import { CommentOutputResultDto } from "../application/queries/dto/output-dto/output-result-dto";

@injectable()
export class CommentsQueryRepository {
  async getCommentById(id: string, userId: string | undefined) {
    const comment = await CommentModel.findById(id);
    if (!comment) {
      return null;
    }
    if (userId === undefined) {
      return mapperToCommentOutputResDto(comment, userId, LikeStatuses.None);
    }
    const userLike = await CommentLikeModel.findOne({
      userId: userId,
      commentId: id,
    });
    if (!userLike) {
      return mapperToCommentOutputResDto(comment, userId, LikeStatuses.None);
    }
    return mapperToCommentOutputResDto(comment, userId, userLike.status);
  }

  async getCommentsForPostId(
    postId: string,
    queryInput: PaginationAndSortingReq,
    userId: string | undefined,
  ): Promise<ResultCommentsOutputDto | null> {
    const post = await PostModel.findById(postId);
    if (!post) {
      return null;
    }

    const { pageNumber, pageSize, sortBy, sortDirection } = queryInput;
    const skip: number = getSkipNumber(pageNumber, pageSize);

    const filter = { postId: postId };

    const [comments, totalCount] = await Promise.all([
      CommentModel.find(filter)
        .skip(skip)
        .limit(pageSize)
        .sort({ [sortBy]: sortDirection }),

      CommentModel.countDocuments(filter),
    ]);

    let mappedComments: CommentOutputResultDto[] = [];
    if (userId === undefined) {
      mappedComments = comments.map((comment) =>
        mapperToCommentOutputResDto(
          comment, // живой документ, геттеры работают
          userId,
          LikeStatuses.None,
        ),
      );
    } else {
      const likesArray = await CommentLikeModel.find({
        userId,
        commentId: { $in: comments.map((c) => c._id.toString()) },
      });

      const likesByCommentId = new Map(
        likesArray.map((like) => [like.commentId, like.status]),
      );

      mappedComments = comments.map((comment) =>
        mapperToCommentOutputResDto(
          comment, // живой документ, геттеры работают
          userId,
          likesByCommentId.get(comment.id) ?? LikeStatuses.None,
        ),
      );
    }
    // const mappedComments = [];
    // for (const comment of comments) {
    //   const like = await CommentLikeModel.findOne({
    //     commentId: comment.id,
    //     userId: userId,
    //   });
    //   const likeStatus = like ? like.status : LikeStatuses.None;
    //   const trueComment = mapperToCommentOutputResDto(
    //     comment,
    //     userId,
    //     likeStatus,
    //   );
    //   mappedComments.push(trueComment);
    // }

    return mapperOutput(mappedComments, {
      pagesCount: Math.ceil(totalCount / queryInput.pageSize),
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: totalCount,
    });
  }
}
