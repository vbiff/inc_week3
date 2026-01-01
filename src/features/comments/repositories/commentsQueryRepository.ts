import { commmentsCollection } from "../../../db/mongo.db";
import { ObjectId } from "mongodb";
import { mapperToCommentOutputResDto } from "../mappers/mapper-to-comment-output-res-dto";

export const commentsQueryRepository = {
  async getCommentById(id: string) {
    const comment = await commmentsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!comment) {
      return null;
    }
    return mapperToCommentOutputResDto(comment);
  },
};
