import { refreshTokensCollection } from "../../../db/mongo.db";

export const authRepository = {
  async isTokenInBlackList(token: string): Promise<boolean> {
    try {
      await refreshTokensCollection.findOne({
        refreshToken: token,
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  async addTokenToBlackList(token: string): Promise<boolean> {
    try {
      await refreshTokensCollection.insertOne({
        refreshToken: token,
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
};
