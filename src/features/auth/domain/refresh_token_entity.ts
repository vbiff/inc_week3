import { HydratedDocument, Model, model, Schema } from "mongoose";
import { RefreshTokenDTO } from "../application/command-services/dto/refresh-token-dto";

export class RefreshTokenEntity {
  private constructor(
    public refreshToken: string,
    public expiresAt: Date,
  ) {}

  static createRefreshToken(dto: RefreshTokenDTO): RefreshTokenEntity {
    return new RefreshTokenEntity(dto.refreshToken, dto.expiresAt);
  }
}

export const RefreshTokenSchema = new Schema<RefreshTokenEntity>({
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

RefreshTokenSchema.loadClass(RefreshTokenEntity);

export type RefreshTokenDocument = HydratedDocument<RefreshTokenEntity>;

export const RefreshTokenModel: Model<RefreshTokenEntity> =
  model<RefreshTokenEntity>("RefreshToken", RefreshTokenSchema);
