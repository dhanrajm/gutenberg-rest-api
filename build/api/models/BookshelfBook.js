// import debug from "debug";
// import { DataTypes, Model, Sequelize } from "sequelize";
// import db from "../../db";
// const log = debug("api:models:BookshelfBook");
// export class BookshelfBookModel extends Model {}
// export default class BookshelfBookRecord {
//   static init() {
//     BookshelfBookModel.init(
//       {
//         id: {
//           type: DataTypes.INTEGER,
//           primaryKey: true,
//           allowNull: false,
//         },
//         book_id: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//         },
//         bookshelf_id: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//         },
//       },
//       {
//         tableName: "books_book_bookshelves",
//         timestamps: false,
//         underscored: true,
//         sequelize: db.getDriver() as Sequelize,
//       }
//     );
//     log('done')
//   }
//   static addRelationships() {}
// }
import debug from "debug";
import DB, { Model } from "../../db";
import BookshelfModel from "./bookshelf";
const log = debug("api:models:BookshelfBookModel");
export default class BookshelfBookModel extends Model {
    static get tableName() {
        return "books_bookshelf";
    }
    static get relationMappings() {
        return {
            shelf: {
                relation: Model.HasManyRelation,
                modelClass: BookshelfModel,
                join: {
                    from: "books_book_bookshelves.bookshelf_id",
                    to: "books_bookshelf.id",
                },
            },
        };
    }
    getMany() {
        log("called", DB);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9va3NoZWxmQm9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvbW9kZWxzL0Jvb2tzaGVsZkJvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNkJBQTZCO0FBQzdCLDJEQUEyRDtBQUMzRCw2QkFBNkI7QUFFN0IsaURBQWlEO0FBRWpELG1EQUFtRDtBQUVuRCw2Q0FBNkM7QUFDN0Msb0JBQW9CO0FBQ3BCLCtCQUErQjtBQUMvQixVQUFVO0FBQ1YsZ0JBQWdCO0FBQ2hCLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsOEJBQThCO0FBQzlCLGFBQWE7QUFDYixxQkFBcUI7QUFDckIscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUM5QixhQUFhO0FBQ2IsMEJBQTBCO0FBQzFCLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsYUFBYTtBQUNiLFdBQVc7QUFDWCxVQUFVO0FBQ1YsK0NBQStDO0FBQy9DLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0Isa0RBQWtEO0FBQ2xELFVBQVU7QUFDVixTQUFTO0FBQ1Qsa0JBQWtCO0FBQ2xCLE1BQU07QUFDTixpQ0FBaUM7QUFDakMsSUFBSTtBQUNKLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNyQyxPQUFPLGNBQWMsTUFBTSxhQUFhLENBQUM7QUFFekMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFFbkQsTUFBTSxDQUFDLE9BQU8sT0FBTyxrQkFBbUIsU0FBUSxLQUFLO0lBQ25ELE1BQU0sS0FBSyxTQUFTO1FBQ2xCLE9BQU8saUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUVELE1BQU0sS0FBSyxnQkFBZ0I7UUFDekIsT0FBTztZQUNMLEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUUsS0FBSyxDQUFDLGVBQWU7Z0JBQy9CLFVBQVUsRUFBRSxjQUFjO2dCQUMxQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLHFDQUFxQztvQkFDM0MsRUFBRSxFQUFFLG9CQUFvQjtpQkFDekI7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRUQsT0FBTztRQUNMLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IGRlYnVnIGZyb20gXCJkZWJ1Z1wiO1xyXG4vLyBpbXBvcnQgeyBEYXRhVHlwZXMsIE1vZGVsLCBTZXF1ZWxpemUgfSBmcm9tIFwic2VxdWVsaXplXCI7XHJcbi8vIGltcG9ydCBkYiBmcm9tIFwiLi4vLi4vZGJcIjtcclxuXHJcbi8vIGNvbnN0IGxvZyA9IGRlYnVnKFwiYXBpOm1vZGVsczpCb29rc2hlbGZCb29rXCIpO1xyXG5cclxuLy8gZXhwb3J0IGNsYXNzIEJvb2tzaGVsZkJvb2tNb2RlbCBleHRlbmRzIE1vZGVsIHt9XHJcblxyXG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBCb29rc2hlbGZCb29rUmVjb3JkIHtcclxuLy8gICBzdGF0aWMgaW5pdCgpIHtcclxuLy8gICAgIEJvb2tzaGVsZkJvb2tNb2RlbC5pbml0KFxyXG4vLyAgICAgICB7XHJcbi8vICAgICAgICAgaWQ6IHtcclxuLy8gICAgICAgICAgIHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLFxyXG4vLyAgICAgICAgICAgcHJpbWFyeUtleTogdHJ1ZSxcclxuLy8gICAgICAgICAgIGFsbG93TnVsbDogZmFsc2UsXHJcbi8vICAgICAgICAgfSxcclxuLy8gICAgICAgICBib29rX2lkOiB7XHJcbi8vICAgICAgICAgICB0eXBlOiBEYXRhVHlwZXMuSU5URUdFUixcclxuLy8gICAgICAgICAgIGFsbG93TnVsbDogZmFsc2UsXHJcbi8vICAgICAgICAgfSxcclxuLy8gICAgICAgICBib29rc2hlbGZfaWQ6IHtcclxuLy8gICAgICAgICAgIHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLFxyXG4vLyAgICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuLy8gICAgICAgICB9LFxyXG4vLyAgICAgICB9LFxyXG4vLyAgICAgICB7XHJcbi8vICAgICAgICAgdGFibGVOYW1lOiBcImJvb2tzX2Jvb2tfYm9va3NoZWx2ZXNcIixcclxuLy8gICAgICAgICB0aW1lc3RhbXBzOiBmYWxzZSxcclxuLy8gICAgICAgICB1bmRlcnNjb3JlZDogdHJ1ZSxcclxuLy8gICAgICAgICBzZXF1ZWxpemU6IGRiLmdldERyaXZlcigpIGFzIFNlcXVlbGl6ZSxcclxuLy8gICAgICAgfVxyXG4vLyAgICAgKTtcclxuLy8gICAgIGxvZygnZG9uZScpXHJcbi8vICAgfVxyXG4vLyAgIHN0YXRpYyBhZGRSZWxhdGlvbnNoaXBzKCkge31cclxuLy8gfVxyXG5pbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCBEQiwgeyBNb2RlbCB9IGZyb20gXCIuLi8uLi9kYlwiO1xyXG5pbXBvcnQgQm9va3NoZWxmTW9kZWwgZnJvbSBcIi4vYm9va3NoZWxmXCI7XHJcblxyXG5jb25zdCBsb2cgPSBkZWJ1ZyhcImFwaTptb2RlbHM6Qm9va3NoZWxmQm9va01vZGVsXCIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9va3NoZWxmQm9va01vZGVsIGV4dGVuZHMgTW9kZWwge1xyXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xyXG4gICAgcmV0dXJuIFwiYm9va3NfYm9va3NoZWxmXCI7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzaGVsZjoge1xyXG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNNYW55UmVsYXRpb24sXHJcbiAgICAgICAgbW9kZWxDbGFzczogQm9va3NoZWxmTW9kZWwsXHJcbiAgICAgICAgam9pbjoge1xyXG4gICAgICAgICAgZnJvbTogXCJib29rc19ib29rX2Jvb2tzaGVsdmVzLmJvb2tzaGVsZl9pZFwiLFxyXG4gICAgICAgICAgdG86IFwiYm9va3NfYm9va3NoZWxmLmlkXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRNYW55KCkge1xyXG4gICAgbG9nKFwiY2FsbGVkXCIsIERCKTtcclxuICB9XHJcbn1cclxuIl19