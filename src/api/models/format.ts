import { Model } from "../../db";
import BookModel from "./book";

export default class FormatModel extends Model {
  static get tableName() {
    return "books_format";
  }

  static get relationMappings() {
    return {
      books: {
        relation: Model.BelongsToOneRelation,
        modelClass: BookModel,
        join: {
          from: "books_format.book_id",
          to: "books_book.id",
        },
      },
    };
  }
}
