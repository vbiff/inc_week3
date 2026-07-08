import { HydratedDocument, Model, model, Schema } from "mongoose";
import { DeviceDTO } from "../application/dto/device-dto";

export class DeviceEntity {
  userId: string;
  deviceId: string;
  title: string;
  ip: string;
  iat: number;
  exp: number;

  constructor(dto: DeviceDTO) {
    this.userId = dto.userId;
    this.deviceId = dto.deviceId;
    this.title = dto.title;
    this.ip = dto.ip;
    this.iat = dto.iat;
    this.exp = dto.exp;
  }

  updateSession(iat: number, exp: number): void {
    this.iat = iat;
    this.exp = exp;
  }
}

export const DeviceSchema = new Schema<DeviceEntity>({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  title: { type: String, required: true },
  ip: { type: String, required: true },
  iat: { type: Number, required: true },
  exp: { type: Number, required: true },
});

DeviceSchema.loadClass(DeviceEntity);

export type DeviceDocument = HydratedDocument<DeviceEntity>;

export const DeviceModel: Model<DeviceEntity> = model<DeviceEntity>(
  "Device",
  DeviceSchema,
);
