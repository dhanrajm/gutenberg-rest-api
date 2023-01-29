// import debug from "debug";
// import { DataTypes, Model, Sequelize } from "sequelize";
// import db from "../../db";
// const log = debug("api:models:AuthorBook");
// export class AuthorBookModel extends Model {}
// export default class AuthorBookRecord {
//   static init() {
//     AuthorBookModel.init(
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
//         author_id: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//         },
//       },
//       {
//         tableName: "books_book_authors",
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
import AuthorModel from "./author";
const log = debug("api:models:AuthorBook");
export default class AuthorBookModel extends Model {
    static get tableName() {
        return "books_book_authors";
    }
    static get relationMappings() {
        return {
            author: {
                relation: Model.HasManyRelation,
                modelClass: AuthorModel,
                join: {
                    from: "books_book_authors.author_id",
                    to: "books_author.id",
                },
            },
        };
    }
    getMany() {
        log("called", DB);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aG9yQm9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvbW9kZWxzL0F1dGhvckJvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNkJBQTZCO0FBQzdCLDJEQUEyRDtBQUMzRCw2QkFBNkI7QUFFN0IsOENBQThDO0FBRTlDLGdEQUFnRDtBQUVoRCwwQ0FBMEM7QUFDMUMsb0JBQW9CO0FBQ3BCLDRCQUE0QjtBQUM1QixVQUFVO0FBQ1YsZ0JBQWdCO0FBQ2hCLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsOEJBQThCO0FBQzlCLGFBQWE7QUFDYixxQkFBcUI7QUFDckIscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUM5QixhQUFhO0FBQ2IsdUJBQXVCO0FBQ3ZCLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsYUFBYTtBQUNiLFdBQVc7QUFDWCxVQUFVO0FBQ1YsMkNBQTJDO0FBQzNDLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0Isa0RBQWtEO0FBQ2xELFVBQVU7QUFDVixTQUFTO0FBQ1Qsa0JBQWtCO0FBQ2xCLE1BQU07QUFDTixpQ0FBaUM7QUFDakMsSUFBSTtBQUVKLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNyQyxPQUFPLFdBQVcsTUFBTSxVQUFVLENBQUM7QUFFbkMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFFM0MsTUFBTSxDQUFDLE9BQU8sT0FBTyxlQUFnQixTQUFRLEtBQUs7SUFDaEQsTUFBTSxLQUFLLFNBQVM7UUFDbEIsT0FBTyxvQkFBb0IsQ0FBQztJQUM5QixDQUFDO0lBRUQsTUFBTSxLQUFLLGdCQUFnQjtRQUN6QixPQUFPO1lBQ0wsTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLLENBQUMsZUFBZTtnQkFDL0IsVUFBVSxFQUFFLFdBQVc7Z0JBQ3ZCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsOEJBQThCO29CQUNwQyxFQUFFLEVBQUUsaUJBQWlCO2lCQUN0QjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPO1FBQ0wsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbi8vIGltcG9ydCB7IERhdGFUeXBlcywgTW9kZWwsIFNlcXVlbGl6ZSB9IGZyb20gXCJzZXF1ZWxpemVcIjtcclxuLy8gaW1wb3J0IGRiIGZyb20gXCIuLi8uLi9kYlwiO1xyXG5cclxuLy8gY29uc3QgbG9nID0gZGVidWcoXCJhcGk6bW9kZWxzOkF1dGhvckJvb2tcIik7XHJcblxyXG4vLyBleHBvcnQgY2xhc3MgQXV0aG9yQm9va01vZGVsIGV4dGVuZHMgTW9kZWwge31cclxuXHJcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dGhvckJvb2tSZWNvcmQge1xyXG4vLyAgIHN0YXRpYyBpbml0KCkge1xyXG4vLyAgICAgQXV0aG9yQm9va01vZGVsLmluaXQoXHJcbi8vICAgICAgIHtcclxuLy8gICAgICAgICBpZDoge1xyXG4vLyAgICAgICAgICAgdHlwZTogRGF0YVR5cGVzLklOVEVHRVIsXHJcbi8vICAgICAgICAgICBwcmltYXJ5S2V5OiB0cnVlLFxyXG4vLyAgICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuLy8gICAgICAgICB9LFxyXG4vLyAgICAgICAgIGJvb2tfaWQ6IHtcclxuLy8gICAgICAgICAgIHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLFxyXG4vLyAgICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuLy8gICAgICAgICB9LFxyXG4vLyAgICAgICAgIGF1dGhvcl9pZDoge1xyXG4vLyAgICAgICAgICAgdHlwZTogRGF0YVR5cGVzLklOVEVHRVIsXHJcbi8vICAgICAgICAgICBhbGxvd051bGw6IGZhbHNlLFxyXG4vLyAgICAgICAgIH0sXHJcbi8vICAgICAgIH0sXHJcbi8vICAgICAgIHtcclxuLy8gICAgICAgICB0YWJsZU5hbWU6IFwiYm9va3NfYm9va19hdXRob3JzXCIsXHJcbi8vICAgICAgICAgdGltZXN0YW1wczogZmFsc2UsXHJcbi8vICAgICAgICAgdW5kZXJzY29yZWQ6IHRydWUsXHJcbi8vICAgICAgICAgc2VxdWVsaXplOiBkYi5nZXREcml2ZXIoKSBhcyBTZXF1ZWxpemUsXHJcbi8vICAgICAgIH1cclxuLy8gICAgICk7XHJcbi8vICAgICBsb2coJ2RvbmUnKVxyXG4vLyAgIH1cclxuLy8gICBzdGF0aWMgYWRkUmVsYXRpb25zaGlwcygpIHt9XHJcbi8vIH1cclxuXHJcbmltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IERCLCB7IE1vZGVsIH0gZnJvbSBcIi4uLy4uL2RiXCI7XHJcbmltcG9ydCBBdXRob3JNb2RlbCBmcm9tIFwiLi9hdXRob3JcIjtcclxuXHJcbmNvbnN0IGxvZyA9IGRlYnVnKFwiYXBpOm1vZGVsczpBdXRob3JCb29rXCIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0aG9yQm9va01vZGVsIGV4dGVuZHMgTW9kZWwge1xyXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xyXG4gICAgcmV0dXJuIFwiYm9va3NfYm9va19hdXRob3JzXCI7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhdXRob3I6IHtcclxuICAgICAgICByZWxhdGlvbjogTW9kZWwuSGFzTWFueVJlbGF0aW9uLFxyXG4gICAgICAgIG1vZGVsQ2xhc3M6IEF1dGhvck1vZGVsLFxyXG4gICAgICAgIGpvaW46IHtcclxuICAgICAgICAgIGZyb206IFwiYm9va3NfYm9va19hdXRob3JzLmF1dGhvcl9pZFwiLFxyXG4gICAgICAgICAgdG86IFwiYm9va3NfYXV0aG9yLmlkXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRNYW55KCkge1xyXG4gICAgbG9nKFwiY2FsbGVkXCIsIERCKTtcclxuICB9XHJcbn1cclxuIl19