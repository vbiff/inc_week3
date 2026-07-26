"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapperOutput = mapperOutput;
function mapperOutput(items, meta) {
    return {
        pagesCount: meta.pagesCount,
        page: meta.page,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items,
    };
}
