"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryInputDtoHelper = queryInputDtoHelper;
const query_pagination_sorting_validation_1 = require("../middlewares/validation/query-pagination-sorting.validation");
const sort_directions_1 = require("../types/sort-directions");
function queryInputDtoHelper(req) {
    var _a, _b, _c, _d, _e, _f;
    return {
        pageNumber: Number((_a = req.query.pageNumber) !== null && _a !== void 0 ? _a : query_pagination_sorting_validation_1.DEFAULT_PAGE),
        pageSize: Number((_b = req.query.pageSize) !== null && _b !== void 0 ? _b : query_pagination_sorting_validation_1.DEFAULT_PAGE_SIZE),
        sortBy: String((_c = req.query.sortBy) !== null && _c !== void 0 ? _c : query_pagination_sorting_validation_1.DEFAULT_SORT_BY),
        sortDirection: req.query.sortDirection === sort_directions_1.SortDirection.ASC
            ? sort_directions_1.SortDirection.ASC
            : query_pagination_sorting_validation_1.DEFAULT_SORT_DIRECTION,
        searchNameTerm: String((_d = req.query.searchNameTerm) !== null && _d !== void 0 ? _d : ""),
        searchLoginTerm: String((_e = req.query.searchLoginTerm) !== null && _e !== void 0 ? _e : ""),
        searchEmailTerm: String((_f = req.query.searchEmailTerm) !== null && _f !== void 0 ? _f : ""),
    };
}
