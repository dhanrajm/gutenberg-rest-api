import debug from "debug";
import DB, { Model } from "../../db";
import BookModel from "./book";
const log = debug("api:models:bookshelf");
export default class BookshelfModel extends Model {
    static get tableName() {
        return "books_bookshelf";
    }
    static get relationMappings() {
        return {
            books: {
                relation: Model.ManyToManyRelation,
                modelClass: BookModel,
                join: {
                    from: "books_bookshelf.id",
                    through: {
                        // books_book_bookshelves is the join table.
                        from: "books_book_bookshelves.bookshelf_id",
                        to: "books_book_bookshelves.book_id",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9va3NoZWxmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9tb2RlbHMvYm9va3NoZWxmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNyQyxPQUFPLFNBQVMsTUFBTSxRQUFRLENBQUM7QUFFL0IsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFMUMsTUFBTSxDQUFDLE9BQU8sT0FBTyxjQUFlLFNBQVEsS0FBSztJQUMvQyxNQUFNLEtBQUssU0FBUztRQUNsQixPQUFPLGlCQUFpQixDQUFDO0lBQzNCLENBQUM7SUFFRCxNQUFNLEtBQUssZ0JBQWdCO1FBQ3pCLE9BQU87WUFDTCxLQUFLLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFLEtBQUssQ0FBQyxrQkFBa0I7Z0JBQ2xDLFVBQVUsRUFBRSxTQUFTO2dCQUNyQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLG9CQUFvQjtvQkFDMUIsT0FBTyxFQUFFO3dCQUNQLDRDQUE0Qzt3QkFDNUMsSUFBSSxFQUFFLHFDQUFxQzt3QkFDM0MsRUFBRSxFQUFFLGdDQUFnQztxQkFDckM7b0JBQ0QsRUFBRSxFQUFFLGVBQWU7aUJBQ3BCO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU87UUFDTCxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IERCLCB7IE1vZGVsIH0gZnJvbSBcIi4uLy4uL2RiXCI7XHJcbmltcG9ydCBCb29rTW9kZWwgZnJvbSBcIi4vYm9va1wiO1xyXG5cclxuY29uc3QgbG9nID0gZGVidWcoXCJhcGk6bW9kZWxzOmJvb2tzaGVsZlwiKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvb2tzaGVsZk1vZGVsIGV4dGVuZHMgTW9kZWwge1xyXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xyXG4gICAgcmV0dXJuIFwiYm9va3NfYm9va3NoZWxmXCI7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib29rczoge1xyXG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5NYW55VG9NYW55UmVsYXRpb24sXHJcbiAgICAgICAgbW9kZWxDbGFzczogQm9va01vZGVsLFxyXG4gICAgICAgIGpvaW46IHtcclxuICAgICAgICAgIGZyb206IFwiYm9va3NfYm9va3NoZWxmLmlkXCIsXHJcbiAgICAgICAgICB0aHJvdWdoOiB7XHJcbiAgICAgICAgICAgIC8vIGJvb2tzX2Jvb2tfYm9va3NoZWx2ZXMgaXMgdGhlIGpvaW4gdGFibGUuXHJcbiAgICAgICAgICAgIGZyb206IFwiYm9va3NfYm9va19ib29rc2hlbHZlcy5ib29rc2hlbGZfaWRcIixcclxuICAgICAgICAgICAgdG86IFwiYm9va3NfYm9va19ib29rc2hlbHZlcy5ib29rX2lkXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdG86IFwiYm9va3NfYm9vay5pZFwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFueSgpIHtcclxuICAgIGxvZyhcImNhbGxlZFwiLCBEQik7XHJcbiAgfVxyXG59XHJcbiJdfQ==