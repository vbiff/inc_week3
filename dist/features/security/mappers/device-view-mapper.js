"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceViewMapper = void 0;
const deviceViewMapper = (rawDevice) => {
    return {
        ip: rawDevice.ip,
        title: rawDevice.title,
        lastActiveDate: new Date(rawDevice.iat * 1000).toISOString(),
        deviceId: rawDevice.deviceId,
    };
};
exports.deviceViewMapper = deviceViewMapper;
