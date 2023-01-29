import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
// import config from "../config";

/**
 * Intercept unhandled promise rejection and thow the same exception
 * This will be intercepted in the uncaughtException handler
 */
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p);
  throw new Error(`Unhandled promise rejection, ${reason}`);
});

/**
 * Intercept uncaughtException.
 * We are not handling any exit process. So just exit.
 * Other wise we could have called another function to do clean up and then exit
 */
process.on("uncaughtException", (err) => {
  console.log(`uncaught exception: ${err}`);
  console.log("Application encountered a critical error. Exiting");
  process.exit(1);
});

/**
 * Class representing an API error.
 * @extends Error
 */
class APIError extends Error {
  status: number;
  isPublic: boolean;
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic: boolean = false
  ) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    Error.captureStackTrace(this, this.constructor);
  }
}

function errorFormatter(
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  console.log("errorFormatter", err.constructor.name);
  // if (err) {
  //   // validation error contains errors which is an array of error each containing message[]
  //   const unifiedErrorMessage = err.details.body
  //     .map((error: { message: string }) => error.message)
  //     .join(" and ");
  //   const error = new APIError(unifiedErrorMessage, err.statusCode, true);
  //   return next(error);
  // }

  // if (!(err instanceof APIError)) {
  //   const apiError = new APIError(err.message, err.status, err.isPublic);
  //   return next(apiError);
  // }

  return next(err);
}

function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  const err = new APIError("API not found", httpStatus.NOT_FOUND);
  return next(err);
}

function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log(err);
  res.send("error");
  // res.status(err.status).json({
  //   message: err.isPublic ? err.message : httpStatus[err.status],
  //   stack: config.server.env === "development" ? err.stack : {},
  // });
}
export { APIError, notFoundHandler, errorFormatter, errorHandler };
