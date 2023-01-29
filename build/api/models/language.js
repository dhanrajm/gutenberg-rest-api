import debug from "debug";
import DB, { Model } from "../../db";
import BookModel from "./book";
const log = debug("api:models:language");
export default class LanguageModel extends Model {
    static get tableName() {
        return "books_language";
    }
    static get relationMappings() {
        return {
            books: {
                relation: Model.ManyToManyRelation,
                modelClass: BookModel,
                join: {
                    from: "books_language.id",
                    through: {
                        // books_book_languages is the join table.
                        from: "books_book_languages.language_id",
                        to: "books_book_languages.book_id",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL21vZGVscy9sYW5ndWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDckMsT0FBTyxTQUFTLE1BQU0sUUFBUSxDQUFDO0FBRS9CLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRXpDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sYUFBYyxTQUFRLEtBQUs7SUFDOUMsTUFBTSxLQUFLLFNBQVM7UUFDbEIsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRUQsTUFBTSxLQUFLLGdCQUFnQjtRQUN6QixPQUFPO1lBQ0wsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxLQUFLLENBQUMsa0JBQWtCO2dCQUNsQyxVQUFVLEVBQUUsU0FBUztnQkFDckIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxtQkFBbUI7b0JBQ3pCLE9BQU8sRUFBRTt3QkFDUCwwQ0FBMEM7d0JBQzFDLElBQUksRUFBRSxrQ0FBa0M7d0JBQ3hDLEVBQUUsRUFBRSw4QkFBOEI7cUJBQ25DO29CQUNELEVBQUUsRUFBRSxlQUFlO2lCQUNwQjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPO1FBQ0wsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCBEQiwgeyBNb2RlbCB9IGZyb20gXCIuLi8uLi9kYlwiO1xyXG5pbXBvcnQgQm9va01vZGVsIGZyb20gXCIuL2Jvb2tcIjtcclxuXHJcbmNvbnN0IGxvZyA9IGRlYnVnKFwiYXBpOm1vZGVsczpsYW5ndWFnZVwiKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhbmd1YWdlTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XHJcbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XHJcbiAgICByZXR1cm4gXCJib29rc19sYW5ndWFnZVwiO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYm9va3M6IHtcclxuICAgICAgICByZWxhdGlvbjogTW9kZWwuTWFueVRvTWFueVJlbGF0aW9uLFxyXG4gICAgICAgIG1vZGVsQ2xhc3M6IEJvb2tNb2RlbCxcclxuICAgICAgICBqb2luOiB7XHJcbiAgICAgICAgICBmcm9tOiBcImJvb2tzX2xhbmd1YWdlLmlkXCIsXHJcbiAgICAgICAgICB0aHJvdWdoOiB7XHJcbiAgICAgICAgICAgIC8vIGJvb2tzX2Jvb2tfbGFuZ3VhZ2VzIGlzIHRoZSBqb2luIHRhYmxlLlxyXG4gICAgICAgICAgICBmcm9tOiBcImJvb2tzX2Jvb2tfbGFuZ3VhZ2VzLmxhbmd1YWdlX2lkXCIsXHJcbiAgICAgICAgICAgIHRvOiBcImJvb2tzX2Jvb2tfbGFuZ3VhZ2VzLmJvb2tfaWRcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0bzogXCJib29rc19ib29rLmlkXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRNYW55KCkge1xyXG4gICAgbG9nKFwiY2FsbGVkXCIsIERCKTtcclxuICB9XHJcbn1cclxuIl19