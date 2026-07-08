import { HydratedDocument, Model, model, Schema } from "mongoose";
import { RefreshTokenDTO } from "../application/command-services/dto/refresh-token-dto";

export class RefreshTokenEntity {
  refreshToken: string;
  expiresAt: Date;

  constructor(dto: RefreshTokenDTO) {
    this.refreshToken = dto.refreshToken;
    this.expiresAt = dto.expiresAt;
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
