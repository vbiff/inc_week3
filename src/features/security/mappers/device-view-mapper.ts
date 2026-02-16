import { DeviceDTO } from "../application/dto/device-dto";

export const deviceViewMapper = (rawDevice: DeviceDTO) => {
  return {
    ip: rawDevice.ip,
    title: rawDevice.title,
    lastActiveDate: new Date(rawDevice.iat * 1000).toISOString(),
    deviceId: rawDevice.deviceId,
  };
};
