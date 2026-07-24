"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapperOutput = mapperOutput;
function mapperOutput(items, meta) {
    return {
        page: meta.page,
        pagesCount: meta.pagesCount,
        totalCount: meta.totalCount,
        pageSize: meta.pageSize,
        items,
    };
}
