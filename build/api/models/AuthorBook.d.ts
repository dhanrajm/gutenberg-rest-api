import { Model } from "../../db";
import AuthorModel from "./author";
export default class AuthorBookModel extends Model {
    static get tableName(): string;
    static get relationMappings(): {
        author: {
            relation: import("objection").RelationType;
            modelClass: typeof AuthorModel;
            join: {
                from: string;
                to: string;
            };
        };
    };
    getMany(): void;
}
