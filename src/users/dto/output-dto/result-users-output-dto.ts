import { UserView } from "./user-view";

export type ResultUsersOutputDto = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserView[];
};
