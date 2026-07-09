import {
  RefreshTokenEntity,
  RefreshTokenModel,
} from "../domain/refresh_token_entity";

export class AuthRepository {
  async isTokenInBlackList(token: string): Promise<boolean> {
    try {
      const result = await RefreshTokenModel.findOne({ refreshToken: token });
      return !!result;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async addTokenToBlackList(token: string): Promise<boolean> {
    try {
      const entry = RefreshTokenEntity.createRefreshToken({
        refreshToken: token,
        expiresAt: new Date(Date.now() + 60000),
      });
      await RefreshTokenModel.create(entry);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
