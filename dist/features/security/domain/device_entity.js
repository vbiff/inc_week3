"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceModel = exports.DeviceSchema = exports.DeviceEntity = void 0;
const mongoose_1 = require("mongoose");
class DeviceEntity {
    constructor(userId, deviceId, title, ip, iat, exp) {
        this.userId = userId;
        this.deviceId = deviceId;
        this.title = title;
        this.ip = ip;
        this.iat = iat;
        this.exp = exp;
    }
    static createDevice(dto) {
        return new DeviceEntity(dto.userId, dto.deviceId, dto.title, dto.ip, dto.iat, dto.exp);
    }
    updateSession(iat, exp) {
        this.iat = iat;
        this.exp = exp;
    }
}
exports.DeviceEntity = DeviceEntity;
exports.DeviceSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    title: { type: String, required: true },
    ip: { type: String, required: true },
    iat: { type: Number, required: true },
    exp: { type: Number, required: true },
});
exports.DeviceSchema.loadClass(DeviceEntity);
exports.DeviceModel = (0, mongoose_1.model)("Device", exports.DeviceSchema);
