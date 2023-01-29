import debug from "debug";
import DB, { Model } from "../../db";
import BookModel from "./book";
const log = debug("api:models:subject");
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
    getMany() {
        log("called", DB);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvbW9kZWxzL3N1YmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sU0FBUyxNQUFNLFFBQVEsQ0FBQztBQUUvQixNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUV4QyxNQUFNLENBQUMsT0FBTyxPQUFPLFlBQWEsU0FBUSxLQUFLO0lBQzdDLE1BQU0sS0FBSyxTQUFTO1FBQ2xCLE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxNQUFNLEtBQUssZ0JBQWdCO1FBQ3pCLE9BQU87WUFDTCxLQUFLLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFLEtBQUssQ0FBQyxrQkFBa0I7Z0JBQ2xDLFVBQVUsRUFBRSxTQUFTO2dCQUNyQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLGtCQUFrQjtvQkFDeEIsT0FBTyxFQUFFO3dCQUNQLHlDQUF5Qzt3QkFDekMsSUFBSSxFQUFFLGdDQUFnQzt3QkFDdEMsRUFBRSxFQUFFLDZCQUE2QjtxQkFDbEM7b0JBQ0QsRUFBRSxFQUFFLGVBQWU7aUJBQ3BCO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU87UUFDTCxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IERCLCB7IE1vZGVsIH0gZnJvbSBcIi4uLy4uL2RiXCI7XHJcbmltcG9ydCBCb29rTW9kZWwgZnJvbSBcIi4vYm9va1wiO1xyXG5cclxuY29uc3QgbG9nID0gZGVidWcoXCJhcGk6bW9kZWxzOnN1YmplY3RcIik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdWJqZWN0TW9kZWwgZXh0ZW5kcyBNb2RlbCB7XHJcbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XHJcbiAgICByZXR1cm4gXCJib29rc19zdWJqZWN0XCI7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib29rczoge1xyXG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5NYW55VG9NYW55UmVsYXRpb24sXHJcbiAgICAgICAgbW9kZWxDbGFzczogQm9va01vZGVsLFxyXG4gICAgICAgIGpvaW46IHtcclxuICAgICAgICAgIGZyb206IFwiYm9va3Nfc3ViamVjdC5pZFwiLFxyXG4gICAgICAgICAgdGhyb3VnaDoge1xyXG4gICAgICAgICAgICAvLyBib29rc19ib29rX3N1YmplY3RzIGlzIHRoZSBqb2luIHRhYmxlLlxyXG4gICAgICAgICAgICBmcm9tOiBcImJvb2tzX2Jvb2tfc3ViamVjdHMuc3ViamVjdF9pZFwiLFxyXG4gICAgICAgICAgICB0bzogXCJib29rc19ib29rX3N1YmplY3RzLmJvb2tfaWRcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0bzogXCJib29rc19ib29rLmlkXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRNYW55KCkge1xyXG4gICAgbG9nKFwiY2FsbGVkXCIsIERCKTtcclxuICB9XHJcbn1cclxuIl19