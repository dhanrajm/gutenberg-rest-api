import { Request, Response, NextFunction } from "express";
import { ParsedUrlQuery } from "querystring";
import { DbBookQueryParams } from "../../types";
import BookModel from "../models/book";

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
  console.log(req.query);
  const model = new BookModel();

  const params = parseQueryParams(req.query as ParsedUrlQuery);
  const result = await model.getMany(params);

  res.send(result);
}

export default {
  list,
};
