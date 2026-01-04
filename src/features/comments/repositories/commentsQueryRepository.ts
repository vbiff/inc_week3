import { commentsCollection, postsCollection } from "../../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { mapperToCommentOutputResDto } from "../mappers/mapper-to-comment-output-res-dto";
import { ResultCommentsOutputDto } from "../../posts/application/queries/dto/output-dto/result-comments-output-dto";
import { PostCreateDto } from "../../posts/application/command-services/dto/post-create-dto";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { getSkipNumber } from "../../../core/utils/skip";
import { CommentCreateDto } from "../application/command-service/dto/comment-create-dto";
import { mapperOutput } from "../../../core/mappers/mapper-output";

export const commentsQueryRepository = {
  async getCommentById(id: string) {
    const comment = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!comment) {
      return null;
    }
    return mapperToCommentOutputResDto(comment);
  },

  async getCommentsForPostId(
    postId: string,
    queryInput: PaginationAndSortingReq,
  ): Promise<ResultCommentsOutputDto | null> {
    const post: WithId<PostCreateDto> | null = await postsCollection.findOne({
      _id: new ObjectId(postId),
    });
    if (!post) {
      return null;
    }

    const { pageNumber, pageSize, sortBy, sortDirection } = queryInput;
    const skip: number = getSkipNumber(pageNumber, pageSize);

    const filter = { postId: postId };

    const comments: WithId<CommentCreateDto>[] = await commentsCollection
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort(sortBy, sortDirection)
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);

    const mappedComments = comments.map((comment) =>
      mapperToCommentOutputResDto(comment),
    );

    return mapperOutput(mappedComments, {
      pagesCount: Math.ceil(totalCount / queryInput.pageSize),
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: totalCount,
    });
  },
};
