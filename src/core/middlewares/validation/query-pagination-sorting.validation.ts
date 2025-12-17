import { SortDirection } from "../../types/sort-directions";
import { query } from "express-validator";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIRECTION = SortDirection.DESC;

const pageNumberValidation = query("pageNumber")
  .default(DEFAULT_PAGE)
  .isInt({ min: 1 })
  .withMessage("page number must be a positive integer")
  .toInt();

const pageSizeValidation = query("pageSize")
  .default(DEFAULT_PAGE_SIZE)
  .isInt({ min: 1, max: 100 })
  .withMessage("pageSize must be a positive integer form 1 to 100")
  .toInt();

const sortByValidation = query("sortBy").default(DEFAULT_SORT_BY);

const sortDirectionValidation = query("sortDirection")
  .default(DEFAULT_SORT_DIRECTION)
  .isIn(Object.values(SortDirection))
  .withMessage(
    `Sort direction must be one of: ${Object.values(SortDirection).join(", ")}`,
  );

export const queryValidation = [
  pageNumberValidation,
  pageSizeValidation,
  sortByValidation,
  sortDirectionValidation,
];
