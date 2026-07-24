"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkipNumber = getSkipNumber;
function getSkipNumber(pageNumber, pageSize) {
    return (pageNumber - 1) * pageSize;
}
