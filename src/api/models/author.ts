import debug from "debug";
import DB, { Model } from "../../db";
import BookModel from "./book";

const log = debug("api:models:author");

export default class AuthorModel extends Model {
  static get tableName() {
    return "books_author";
  }

  static get relationMappings() {
    return {
      books: {
        relation: Model.ManyToManyRelation,
        modelClass: BookModel,
        join: {
          from: "books_author.id",
          through: {
            // books_book_authors is the join table.
            from: "books_book_authors.author_id",
            to: "books_book_authors.book_id",
          },
          to: "books_book.id",
        },
      },
    };
  }

  getMany() {
    log("called", DB);
  }
}
