import { DeviceDTO } from "../application/dto/device-dto";
import { WithId } from "mongodb";

export const deviceViewMapper = (rawDevice: WithId<DeviceDTO>) => {
  return {
    ip: rawDevice.ip,
    title: rawDevice.title,
    lastActiveDate: new Date(rawDevice.iat * 1000).toISOString(),
    deviceId: rawDevice.deviceId,
  };
};
