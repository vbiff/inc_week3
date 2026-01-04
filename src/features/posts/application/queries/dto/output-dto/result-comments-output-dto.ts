import { CommentOutputResultDto } from "../../../../../comments/application/queries/dto/output-dto/output-result-dto";

export type ResultCommentsOutputDto = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentOutputResultDto[];
};
