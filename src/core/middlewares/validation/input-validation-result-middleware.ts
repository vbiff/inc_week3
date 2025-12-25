import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from "express-validator";
import { NextFunction, Request, Response } from "express";
import { HttpStatuses } from "../../types/http-statuses";

const formatErrors = (error: ValidationError) => {
  const expressError = error as unknown as FieldValidationError;

  console.log("EXPRESS ERROR", expressError);
  return {
    field: expressError.path,
    message: expressError.msg.message,
  };
};

export const validationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });
  console.log("VALIDATION RESULT", result);
  if (result.length > 0) {
    res.status(HttpStatuses.BAD_REQUEST_400).send({ errorsMessages: result });
    return;
  }
  next();
};
