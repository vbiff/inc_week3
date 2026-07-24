"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.GetAllActiveDevicesHandler = void 0;
const inversify_1 = require("inversify");
const device_repository_1 = require("../../repository/device-repository");
const http_statuses_1 = require("../../../../core/types/http-statuses");
const device_view_mapper_1 = require("../../mappers/device-view-mapper");
let GetAllActiveDevicesHandler = class GetAllActiveDevicesHandler {
    constructor(deviceRepository) {
        this.deviceRepository = deviceRepository;
        this.getAllActiveDevicesHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const allActiveDevices = yield this.deviceRepository.findAllDevicesByUserId(req.user.id);
            if (!allActiveDevices) {
                res.sendStatus(http_statuses_1.HttpStatuses.NOT_FOUND_404);
                return;
            }
            const result = allActiveDevices.map((d) => (0, device_view_mapper_1.deviceViewMapper)(d));
            res.status(http_statuses_1.HttpStatuses.OK_200).send(result);
        });
    }
};
exports.GetAllActiveDevicesHandler = GetAllActiveDevicesHandler;
exports.GetAllActiveDevicesHandler = GetAllActiveDevicesHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(device_repository_1.DeviceRepository)),
    __metadata("design:paramtypes", [device_repository_1.DeviceRepository])
], GetAllActiveDevicesHandler);
