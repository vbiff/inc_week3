"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryValidation = exports.DEFAULT_SORT_DIRECTION = exports.DEFAULT_SORT_BY = exports.DEFAULT_PAGE_SIZE = exports.DEFAULT_PAGE = void 0;
const sort_directions_1 = require("../../types/sort-directions");
const express_validator_1 = require("express-validator");
exports.DEFAULT_PAGE = 1;
exports.DEFAULT_PAGE_SIZE = 10;
exports.DEFAULT_SORT_BY = "createdAt";
exports.DEFAULT_SORT_DIRECTION = sort_directions_1.SortDirection.DESC;
const pageNumberValidation = (0, express_validator_1.query)("pageNumber")
    .optional()
    .default(exports.DEFAULT_PAGE)
    .isInt({ min: 1 })
    .withMessage("page number must be a positive integer")
    .toInt();
const pageSizeValidation = (0, express_validator_1.query)("pageSize")
    .optional()
    .default(exports.DEFAULT_PAGE_SIZE)
    .isInt({ min: 1, max: 100 })
    .withMessage("pageSize must be a positive integer form 1 to 100")
    .toInt();
const sortByValidation = (0, express_validator_1.query)("sortBy").default(exports.DEFAULT_SORT_BY);
const sortDirectionValidation = (0, express_validator_1.query)("sortDirection")
    .optional()
    .default(exports.DEFAULT_SORT_DIRECTION)
    .isIn(Object.values(sort_directions_1.SortDirection))
    .withMessage(`Sort direction must be one of: ${Object.values(sort_directions_1.SortDirection).join(", ")}`);
const searchNameTermValidation = (0, express_validator_1.query)("searchNameTerm")
    .optional()
    .isString()
    .withMessage(`searchNameTerm must be String`);
exports.queryValidation = [
    pageNumberValidation,
    pageSizeValidation,
    sortByValidation,
    sortDirectionValidation,
    searchNameTermValidation,
];
