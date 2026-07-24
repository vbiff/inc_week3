"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultCodeToHttpException = void 0;
const resultCode_1 = require("./resultCode");
const http_statuses_1 = require("../types/http-statuses");
const resultCodeToHttpException = (resultCode) => {
    switch (resultCode) {
        case resultCode_1.ResultStatus.BadRequest:
            return http_statuses_1.HttpStatuses.BAD_REQUEST_400;
        case resultCode_1.ResultStatus.Forbidden:
            return http_statuses_1.HttpStatuses.FORBIDDEN_403;
        case resultCode_1.ResultStatus.Unauthorized:
            return http_statuses_1.HttpStatuses.UNAUTHORIZED_401;
        case resultCode_1.ResultStatus.NotFound:
            return http_statuses_1.HttpStatuses.NOT_FOUND_404;
        default:
            return http_statuses_1.HttpStatuses.SERVERERROR_500;
    }
};
exports.resultCodeToHttpException = resultCodeToHttpException;
