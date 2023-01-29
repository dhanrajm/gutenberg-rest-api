import debug from "debug";
import DB, { Model } from "../../db";
import BookModel from "./book";

const log = debug("api:models:bookshelf");

export default class BookshelfModel extends Model {
  static get tableName() {
    return "books_bookshelf";
  }

  static get relationMappings() {
    return {
      books: {
        relation: Model.ManyToManyRelation,
        modelClass: BookModel,
        join: {
          from: "books_bookshelf.id",
          through: {
            // books_book_bookshelves is the join table.
            from: "books_book_bookshelves.bookshelf_id",
            to: "books_book_bookshelves.book_id",
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
