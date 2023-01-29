import { Result, ValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const bookListQueryValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: Result = validationResult(req);
  const errorMessages: ValidationError[] = errors.array();

  console.log(errorMessages)
  if (!errorMessages.length) return next();
  else return res.status(422).json({ errors: errorMessages });
};
