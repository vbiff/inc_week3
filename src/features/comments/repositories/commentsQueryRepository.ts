import { commmentsCollection } from "../../../db/mongo.db";
import { ObjectId } from "mongodb";
import { AuthMeDto } from "../../auth/application/queries/dto/auth-output-dto/auth-me-dto";
import { mapperToCommentOutputResDto } from "../mappers/mapper-to-comment-output-res-dto";

export const commentsQueryRepository = {
  async getCommentById(id: string, userInfo: AuthMeDto) {
    const comment = await commmentsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!comment) {
      return null;
    }
    return mapperToCommentOutputResDto(comment, userInfo);
  },
};
