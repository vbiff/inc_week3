import { commentsCollection } from "../../../db/mongo.db";
import { PostModel } from "../../posts/domain/post_entity";
import { ObjectId } from "mongodb";
import { mapperToCommentOutputResDto } from "../mappers/mapper-to-comment-output-res-dto";
import { ResultCommentsOutputDto } from "../../posts/application/queries/dto/output-dto/result-comments-output-dto";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { getSkipNumber } from "../../../core/utils/skip";
import { mapperOutput } from "../../../core/mappers/mapper-output";
import { injectable } from "inversify";

@injectable()
export class CommentsQueryRepository {
  async getCommentById(id: string) {
    const comment = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!comment) {
      return null;
    }
    return mapperToCommentOutputResDto(comment);
  }

  async getCommentsForPostId(
    postId: string,
    queryInput: PaginationAndSortingReq,
  ): Promise<ResultCommentsOutputDto | null> {
    const post = await PostModel.findById(postId);
    if (!post) {
      return null;
    }

    const { pageNumber, pageSize, sortBy, sortDirection } = queryInput;
    const skip: number = getSkipNumber(pageNumber, pageSize);

    const filter = { postId: postId };

    const [comments, totalCount] = await Promise.all([
      commentsCollection
        .find(filter)
        .skip(skip)
        .limit(pageSize)
        .sort(sortBy, sortDirection)
        .toArray(),

      commentsCollection.countDocuments(filter),
    ]);

    const mappedComments = comments.map((comment) =>
      mapperToCommentOutputResDto(comment),
    );

    return mapperOutput(mappedComments, {
      pagesCount: Math.ceil(totalCount / queryInput.pageSize),
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: totalCount,
    });
  }
}
