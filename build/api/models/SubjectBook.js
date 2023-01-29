"use strict";
// import debug from "debug";
// import { DataTypes, Model, Sequelize } from "sequelize";
// import db from "../../db";
// const log = debug("api:models:SubjectBook");
// export class SubjectBookModel extends Model {}
// export default class SubjectBookRecord {
//   static init() {
//     SubjectBookModel.init(
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
//         subject_id: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//         },
//       },
//       {
//         tableName: "books_book_subjects",
//         timestamps: false,
//         underscored: true,
//         sequelize: db.getDriver() as Sequelize,
//       }
//     );
//     log('done')
//   }
//   static addRelationships() {}
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViamVjdEJvb2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL21vZGVscy9TdWJqZWN0Qm9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNkJBQTZCO0FBQzdCLDJEQUEyRDtBQUMzRCw2QkFBNkI7QUFFN0IsK0NBQStDO0FBRS9DLGlEQUFpRDtBQUVqRCwyQ0FBMkM7QUFDM0Msb0JBQW9CO0FBQ3BCLDZCQUE2QjtBQUM3QixVQUFVO0FBQ1YsZ0JBQWdCO0FBQ2hCLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsOEJBQThCO0FBQzlCLGFBQWE7QUFDYixxQkFBcUI7QUFDckIscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUM5QixhQUFhO0FBQ2Isd0JBQXdCO0FBQ3hCLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsYUFBYTtBQUNiLFdBQVc7QUFDWCxVQUFVO0FBQ1YsNENBQTRDO0FBQzVDLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0Isa0RBQWtEO0FBQ2xELFVBQVU7QUFDVixTQUFTO0FBQ1Qsa0JBQWtCO0FBQ2xCLE1BQU07QUFDTixpQ0FBaUM7QUFDakMsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuLy8gaW1wb3J0IHsgRGF0YVR5cGVzLCBNb2RlbCwgU2VxdWVsaXplIH0gZnJvbSBcInNlcXVlbGl6ZVwiO1xyXG4vLyBpbXBvcnQgZGIgZnJvbSBcIi4uLy4uL2RiXCI7XHJcblxyXG4vLyBjb25zdCBsb2cgPSBkZWJ1ZyhcImFwaTptb2RlbHM6U3ViamVjdEJvb2tcIik7XHJcblxyXG4vLyBleHBvcnQgY2xhc3MgU3ViamVjdEJvb2tNb2RlbCBleHRlbmRzIE1vZGVsIHt9XHJcblxyXG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBTdWJqZWN0Qm9va1JlY29yZCB7XHJcbi8vICAgc3RhdGljIGluaXQoKSB7XHJcbi8vICAgICBTdWJqZWN0Qm9va01vZGVsLmluaXQoXHJcbi8vICAgICAgIHtcclxuLy8gICAgICAgICBpZDoge1xyXG4vLyAgICAgICAgICAgdHlwZTogRGF0YVR5cGVzLklOVEVHRVIsXHJcbi8vICAgICAgICAgICBwcmltYXJ5S2V5OiB0cnVlLFxyXG4vLyAgICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuLy8gICAgICAgICB9LFxyXG4vLyAgICAgICAgIGJvb2tfaWQ6IHtcclxuLy8gICAgICAgICAgIHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLFxyXG4vLyAgICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuLy8gICAgICAgICB9LFxyXG4vLyAgICAgICAgIHN1YmplY3RfaWQ6IHtcclxuLy8gICAgICAgICAgIHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLFxyXG4vLyAgICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuLy8gICAgICAgICB9LFxyXG4vLyAgICAgICB9LFxyXG4vLyAgICAgICB7XHJcbi8vICAgICAgICAgdGFibGVOYW1lOiBcImJvb2tzX2Jvb2tfc3ViamVjdHNcIixcclxuLy8gICAgICAgICB0aW1lc3RhbXBzOiBmYWxzZSxcclxuLy8gICAgICAgICB1bmRlcnNjb3JlZDogdHJ1ZSxcclxuLy8gICAgICAgICBzZXF1ZWxpemU6IGRiLmdldERyaXZlcigpIGFzIFNlcXVlbGl6ZSxcclxuLy8gICAgICAgfVxyXG4vLyAgICAgKTtcclxuLy8gICAgIGxvZygnZG9uZScpXHJcbi8vICAgfVxyXG4vLyAgIHN0YXRpYyBhZGRSZWxhdGlvbnNoaXBzKCkge31cclxuLy8gfVxyXG4iXX0=