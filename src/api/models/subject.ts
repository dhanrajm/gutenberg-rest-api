import { Model } from "../../db";
import BookModel from "./book";

export default class SubjectModel extends Model {
  static get tableName() {
    return "books_subject";
  }

  static get relationMappings() {
    return {
      books: {
        relation: Model.ManyToManyRelation,
        modelClass: BookModel,
        join: {
          from: "books_subject.id",
          through: {
            // books_book_subjects is the join table.
            from: "books_book_subjects.subject_id",
            to: "books_book_subjects.book_id",
          },
          to: "books_book.id",
        },
      },
    };
  }
}
