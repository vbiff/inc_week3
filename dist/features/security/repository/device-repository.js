"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceRepository = void 0;
const device_entity_1 = require("../domain/device_entity");
const inversify_1 = require("inversify");
let DeviceRepository = class DeviceRepository {
    findDeviceByIdAndIat(deviceId, iat) {
        return __awaiter(this, void 0, void 0, function* () {
            return device_entity_1.DeviceModel.findOne({ deviceId, iat });
        });
    }
    findDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return device_entity_1.DeviceModel.findOne({ deviceId });
        });
    }
    createDevice(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = device_entity_1.DeviceEntity.createDevice(dto);
            yield device_entity_1.DeviceModel.create(device);
        });
    }
    updateDevice(deviceId, iat, exp) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_entity_1.DeviceModel.findOne({ deviceId });
            if (!device)
                return;
            device.updateSession(iat, exp);
            yield device.save();
        });
    }
    deleteDevice(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield device_entity_1.DeviceModel.deleteOne({ deviceId });
        });
    }
    findAllDevicesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield device_entity_1.DeviceModel.find({ userId });
        });
    }
    deleteAllDevicesExceptCurrent(userId, currentDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield device_entity_1.DeviceModel.deleteMany({
                userId,
                deviceId: { $ne: currentDeviceId },
            });
        });
    }
};
exports.DeviceRepository = DeviceRepository;
exports.DeviceRepository = DeviceRepository = __decorate([
    (0, inversify_1.injectable)()
], DeviceRepository);
