"use strict";
// import debug from "debug";
// import { DataTypes, Model, Sequelize } from "sequelize";
// import db from "../../db";
// const log = debug("api:models:LanguageBook");
// export class LanguageBookModel extends Model {}
// export default class LanguageBookRecord {
//   static init() {
//     LanguageBookModel.init(
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
//         Language_id: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//         },
//       },
//       {
//         tableName: "books_book_languages",
//         timestamps: false,
//         underscored: true,
//         sequelize: db.getDriver() as Sequelize,
//       }
//     );
//     log('done')
//   }
//   static addRelationships() {}
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2VCb29rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9tb2RlbHMvTGFuZ3VhZ2VCb29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw2QkFBNkI7QUFDN0IsMkRBQTJEO0FBQzNELDZCQUE2QjtBQUU3QixnREFBZ0Q7QUFFaEQsa0RBQWtEO0FBRWxELDRDQUE0QztBQUM1QyxvQkFBb0I7QUFDcEIsOEJBQThCO0FBQzlCLFVBQVU7QUFDVixnQkFBZ0I7QUFDaEIscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUM5Qiw4QkFBOEI7QUFDOUIsYUFBYTtBQUNiLHFCQUFxQjtBQUNyQixxQ0FBcUM7QUFDckMsOEJBQThCO0FBQzlCLGFBQWE7QUFDYix5QkFBeUI7QUFDekIscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUM5QixhQUFhO0FBQ2IsV0FBVztBQUNYLFVBQVU7QUFDViw2Q0FBNkM7QUFDN0MsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3QixrREFBa0Q7QUFDbEQsVUFBVTtBQUNWLFNBQVM7QUFDVCxrQkFBa0I7QUFDbEIsTUFBTTtBQUNOLGlDQUFpQztBQUNqQyxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IGRlYnVnIGZyb20gXCJkZWJ1Z1wiO1xyXG4vLyBpbXBvcnQgeyBEYXRhVHlwZXMsIE1vZGVsLCBTZXF1ZWxpemUgfSBmcm9tIFwic2VxdWVsaXplXCI7XHJcbi8vIGltcG9ydCBkYiBmcm9tIFwiLi4vLi4vZGJcIjtcclxuXHJcbi8vIGNvbnN0IGxvZyA9IGRlYnVnKFwiYXBpOm1vZGVsczpMYW5ndWFnZUJvb2tcIik7XHJcblxyXG4vLyBleHBvcnQgY2xhc3MgTGFuZ3VhZ2VCb29rTW9kZWwgZXh0ZW5kcyBNb2RlbCB7fVxyXG5cclxuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFuZ3VhZ2VCb29rUmVjb3JkIHtcclxuLy8gICBzdGF0aWMgaW5pdCgpIHtcclxuLy8gICAgIExhbmd1YWdlQm9va01vZGVsLmluaXQoXHJcbi8vICAgICAgIHtcclxuLy8gICAgICAgICBpZDoge1xyXG4vLyAgICAgICAgICAgdHlwZTogRGF0YVR5cGVzLklOVEVHRVIsXHJcbi8vICAgICAgICAgICBwcmltYXJ5S2V5OiB0cnVlLFxyXG4vLyAgICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuLy8gICAgICAgICB9LFxyXG4vLyAgICAgICAgIGJvb2tfaWQ6IHtcclxuLy8gICAgICAgICAgIHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLFxyXG4vLyAgICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuLy8gICAgICAgICB9LFxyXG4vLyAgICAgICAgIExhbmd1YWdlX2lkOiB7XHJcbi8vICAgICAgICAgICB0eXBlOiBEYXRhVHlwZXMuSU5URUdFUixcclxuLy8gICAgICAgICAgIGFsbG93TnVsbDogZmFsc2UsXHJcbi8vICAgICAgICAgfSxcclxuLy8gICAgICAgfSxcclxuLy8gICAgICAge1xyXG4vLyAgICAgICAgIHRhYmxlTmFtZTogXCJib29rc19ib29rX2xhbmd1YWdlc1wiLFxyXG4vLyAgICAgICAgIHRpbWVzdGFtcHM6IGZhbHNlLFxyXG4vLyAgICAgICAgIHVuZGVyc2NvcmVkOiB0cnVlLFxyXG4vLyAgICAgICAgIHNlcXVlbGl6ZTogZGIuZ2V0RHJpdmVyKCkgYXMgU2VxdWVsaXplLFxyXG4vLyAgICAgICB9XHJcbi8vICAgICApO1xyXG4vLyAgICAgbG9nKCdkb25lJylcclxuLy8gICB9XHJcbi8vICAgc3RhdGljIGFkZFJlbGF0aW9uc2hpcHMoKSB7fVxyXG4vLyB9XHJcbiJdfQ==