import express from "express";
import { checkSchema } from "express-validator";
import schema from "../../helpers/schema";
import { bookListQueryValidator } from "../../helpers/validators";
import bookController from "../controllers/book";

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
  /** Get list of books */
  .get(
    checkSchema(schema.bookListQuery),
    bookListQueryValidator,
    bookController.list
  );

export default router;
