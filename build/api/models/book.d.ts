import { Model } from "../../db";
import { Book, BookConnection, DbBookQueryParams } from "../../types";
import AuthorModel from "./author";
import BookshelfModel from "./bookshelf";
import FormatModel from "./format";
import LanguageModel from "./language";
import SubjectModel from "./subject";
export default class BookModel extends Model {
    authors: any;
    totalCount: any;
    static get tableName(): string;
    static get relationMappings(): {
        authors: {
            relation: import("objection").RelationType;
            modelClass: typeof AuthorModel;
            join: {
                from: string;
                through: {
                    from: string;
                    to: string;
                };
                to: string;
            };
        };
        shelves: {
            relation: import("objection").RelationType;
            modelClass: typeof BookshelfModel;
            join: {
                from: string;
                through: {
                    from: string;
                    to: string;
                };
                to: string;
            };
        };
        subjects: {
            relation: import("objection").RelationType;
            modelClass: typeof SubjectModel;
            join: {
                from: string;
                through: {
                    from: string;
                    to: string;
                };
                to: string;
            };
        };
        languages: {
            relation: import("objection").RelationType;
            modelClass: typeof LanguageModel;
            join: {
                from: string;
                through: {
                    from: string;
                    to: string;
                };
                to: string;
            };
        };
        formats: {
            relation: import("objection").RelationType;
            modelClass: typeof FormatModel;
            join: {
                from: string;
                to: string;
            };
        };
    };
    static format(record: any): Book;
    getMany(params: DbBookQueryParams): Promise<BookConnection | null>;
}
