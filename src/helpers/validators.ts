import { Result, ValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "./logger";
import { APIError } from "./error";

const log = logger("helpers:validator");

export const bookListQueryValidator = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const logFn = log.extend("bookListQueryValidator");
  logFn("called");

  const errors: Result = validationResult(req);
  const errorMessages: ValidationError[] = errors.array();

  if (!errorMessages.length) {
    logFn("done, no errors");
    return next();
  } else {
    logFn("error, return error response");
    const message = errorMessages
      .map(({ msg, param }) => `${msg} for ${param}`)
      .join(" and ");

    return next(new APIError(message, 422, true));
  }
};
