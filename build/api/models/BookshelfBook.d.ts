import { Model } from "../../db";
import BookshelfModel from "./bookshelf";
export default class BookshelfBookModel extends Model {
    static get tableName(): string;
    static get relationMappings(): {
        shelf: {
            relation: import("objection").RelationType;
            modelClass: typeof BookshelfModel;
            join: {
                from: string;
                to: string;
            };
        };
    };
    getMany(): void;
}
