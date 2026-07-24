"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatuses = void 0;
var HttpStatuses;
(function (HttpStatuses) {
    HttpStatuses[HttpStatuses["OK_200"] = 200] = "OK_200";
    HttpStatuses[HttpStatuses["CREATED_201"] = 201] = "CREATED_201";
    HttpStatuses[HttpStatuses["NO_CONTENT_204"] = 204] = "NO_CONTENT_204";
    HttpStatuses[HttpStatuses["TOO_MANY_REQUESTS_429"] = 429] = "TOO_MANY_REQUESTS_429";
    HttpStatuses[HttpStatuses["BAD_REQUEST_400"] = 400] = "BAD_REQUEST_400";
    HttpStatuses[HttpStatuses["UNAUTHORIZED_401"] = 401] = "UNAUTHORIZED_401";
    HttpStatuses[HttpStatuses["FORBIDDEN_403"] = 403] = "FORBIDDEN_403";
    HttpStatuses[HttpStatuses["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
    HttpStatuses[HttpStatuses["SERVERERROR_500"] = 500] = "SERVERERROR_500";
})(HttpStatuses || (exports.HttpStatuses = HttpStatuses = {}));
