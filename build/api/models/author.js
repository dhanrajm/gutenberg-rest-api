import debug from "debug";
import DB, { Model } from "../../db";
import BookModel from "./book";
const log = debug("api:models:author");
export default class AuthorModel extends Model {
    static get tableName() {
        return "books_author";
    }
    static get relationMappings() {
        return {
            books: {
                relation: Model.ManyToManyRelation,
                modelClass: BookModel,
                join: {
                    from: "books_author.id",
                    through: {
                        // books_book_authors is the join table.
                        from: "books_book_authors.author_id",
                        to: "books_book_authors.book_id",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9tb2RlbHMvYXV0aG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNyQyxPQUFPLFNBQVMsTUFBTSxRQUFRLENBQUM7QUFFL0IsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFdkMsTUFBTSxDQUFDLE9BQU8sT0FBTyxXQUFZLFNBQVEsS0FBSztJQUM1QyxNQUFNLEtBQUssU0FBUztRQUNsQixPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDO0lBRUQsTUFBTSxLQUFLLGdCQUFnQjtRQUN6QixPQUFPO1lBQ0wsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxLQUFLLENBQUMsa0JBQWtCO2dCQUNsQyxVQUFVLEVBQUUsU0FBUztnQkFDckIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLE9BQU8sRUFBRTt3QkFDUCx3Q0FBd0M7d0JBQ3hDLElBQUksRUFBRSw4QkFBOEI7d0JBQ3BDLEVBQUUsRUFBRSw0QkFBNEI7cUJBQ2pDO29CQUNELEVBQUUsRUFBRSxlQUFlO2lCQUNwQjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPO1FBQ0wsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCBEQiwgeyBNb2RlbCB9IGZyb20gXCIuLi8uLi9kYlwiO1xyXG5pbXBvcnQgQm9va01vZGVsIGZyb20gXCIuL2Jvb2tcIjtcclxuXHJcbmNvbnN0IGxvZyA9IGRlYnVnKFwiYXBpOm1vZGVsczphdXRob3JcIik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRob3JNb2RlbCBleHRlbmRzIE1vZGVsIHtcclxuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcclxuICAgIHJldHVybiBcImJvb2tzX2F1dGhvclwiO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYm9va3M6IHtcclxuICAgICAgICByZWxhdGlvbjogTW9kZWwuTWFueVRvTWFueVJlbGF0aW9uLFxyXG4gICAgICAgIG1vZGVsQ2xhc3M6IEJvb2tNb2RlbCxcclxuICAgICAgICBqb2luOiB7XHJcbiAgICAgICAgICBmcm9tOiBcImJvb2tzX2F1dGhvci5pZFwiLFxyXG4gICAgICAgICAgdGhyb3VnaDoge1xyXG4gICAgICAgICAgICAvLyBib29rc19ib29rX2F1dGhvcnMgaXMgdGhlIGpvaW4gdGFibGUuXHJcbiAgICAgICAgICAgIGZyb206IFwiYm9va3NfYm9va19hdXRob3JzLmF1dGhvcl9pZFwiLFxyXG4gICAgICAgICAgICB0bzogXCJib29rc19ib29rX2F1dGhvcnMuYm9va19pZFwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRvOiBcImJvb2tzX2Jvb2suaWRcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldE1hbnkoKSB7XHJcbiAgICBsb2coXCJjYWxsZWRcIiwgREIpO1xyXG4gIH1cclxufVxyXG4iXX0=