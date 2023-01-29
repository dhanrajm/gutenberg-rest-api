import { Model } from "sequelize";
import { Genre } from "../../types";
export declare class GenreModel extends Model {
}
export default class GenreRecord {
    static init(): void;
    static addRelationships(): void;
    static format(record: GenreModel): Genre;
    getOne(): void;
}
