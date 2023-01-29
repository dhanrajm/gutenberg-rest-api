import { Model } from "../../db";
import BookModel from "./book";
export default class LanguageModel extends Model {
    static get tableName(): string;
    static get relationMappings(): {
        books: {
            relation: import("objection").RelationType;
            modelClass: typeof BookModel;
            join: {
                from: string;
                through: {
                    from: string;
                    to: string;
                };
                to: string;
            };
        };
    };
    getMany(): void;
}
