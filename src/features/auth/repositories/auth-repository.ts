import { refreshTokensCollection } from "../../../db/mongo.db";

export const authRepository = {
  async isTokenInBlackList(token: string): Promise<boolean> {
    try {
      const result = await refreshTokensCollection.findOne({
        refreshToken: token,
      });

      if (!result) {
        return false;
      }
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
        expiresAt: new Date(Date.now() + 60000),
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
};
