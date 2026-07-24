"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationResultMiddleware = void 0;
const express_validator_1 = require("express-validator");
const http_statuses_1 = require("../../types/http-statuses");
const formatErrors = (error) => {
    const expressError = error;
    console.log("EXPRESS ERROR", expressError);
    return {
        field: expressError.path,
        message: expressError.msg.message,
    };
};
const validationResultMiddleware = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req)
        .formatWith(formatErrors)
        .array({ onlyFirstError: true });
    if (result.length > 0) {
        res.status(http_statuses_1.HttpStatuses.BAD_REQUEST_400).send({ errorsMessages: result });
        return;
    }
    next();
};
exports.validationResultMiddleware = validationResultMiddleware;
