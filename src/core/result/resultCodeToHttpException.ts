import { ResultStatus } from "./resultCode";
import { HttpStatuses } from "../types/http-statuses";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
  switch (resultCode) {
    case ResultStatus.BadRequest:
      return HttpStatuses.BAD_REQUEST_400;
    case ResultStatus.Forbidden:
      return HttpStatuses.FORBIDDEN_403;
    default:
      return HttpStatuses.SERVERERROR_500;
  }
};
