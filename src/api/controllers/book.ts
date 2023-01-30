import { Request, Response, NextFunction } from "express";
import { ParsedUrlQuery } from "querystring";
import { sendError } from "../../helpers/error";
import logger from "../../helpers/logger";
import { DbBookQueryParams } from "../../types";
import BookModel from "../models/book";

const log = logger("api:controller:book");

function parseQueryParams(query: ParsedUrlQuery) {
  const params: DbBookQueryParams = {
    skip: 0,
    pageSize: 25,
    id: null,
    title: null,
    author: null,
    lang: null,
    topic: null,
    mimeType: null,
  };
  for (const key of Object.keys(query)) {
    switch (key) {
      case "skip":
      case "pageSize":
        params[key] = query[key] as unknown as number;
        break;
      case "id":
      case "title":
      case "author":
      case "lang":
      case "topic":
        params[key] = query[key] || null;
        break;
      case "mime-type":
        params["mimeType"] = query[key] || null;
        break;
      default:
        break;
    }
  }

  return params;
}
async function list(req: Request, res: Response, _next: NextFunction) {
  try {
    log("called %O", JSON.stringify(req.query));
    const model = new BookModel();

    const params = parseQueryParams(req.query as ParsedUrlQuery);
    const result = await model.getMany(params);

    log("done");
    res.send(result);
  } catch (e) {
    sendError(e, res);
  }
}

export default {
  list,
};
