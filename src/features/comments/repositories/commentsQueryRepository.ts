import { commmentsCollection } from "../../../db/mongo.db";
import { ObjectId } from "mongodb";

export const commentsQueryRepository = {
  async getCommentById(id: string) {
    return await commmentsCollection.findOne({ _id: new ObjectId(id) });
  },
};
