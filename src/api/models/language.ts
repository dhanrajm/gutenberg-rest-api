import debug from "debug";
import DB, { Model } from "../../db";
import BookModel from "./book";

const log = debug("api:models:language");

export default class LanguageModel extends Model {
  static get tableName() {
    return "books_language";
  }

  static get relationMappings() {
    return {
      books: {
        relation: Model.ManyToManyRelation,
        modelClass: BookModel,
        join: {
          from: "books_language.id",
          through: {
            // books_book_languages is the join table.
            from: "books_book_languages.language_id",
            to: "books_book_languages.book_id",
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
