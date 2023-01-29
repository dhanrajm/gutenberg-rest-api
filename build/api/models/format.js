import debug from "debug";
import DB, { Model } from "../../db";
import BookModel from "./book";
const log = debug("api:models:format");
export default class FormatModel extends Model {
    static get tableName() {
        return "books_format";
    }
    static get relationMappings() {
        return {
            books: {
                relation: Model.BelongsToOneRelation,
                modelClass: BookModel,
                join: {
                    from: "books_format.book_id",
                    to: "books_book.id",
                },
            },
        };
    }
    getMany() {
        log("called", DB);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9tb2RlbHMvZm9ybWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNyQyxPQUFPLFNBQVMsTUFBTSxRQUFRLENBQUM7QUFFL0IsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFdkMsTUFBTSxDQUFDLE9BQU8sT0FBTyxXQUFZLFNBQVEsS0FBSztJQUM1QyxNQUFNLEtBQUssU0FBUztRQUNsQixPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDO0lBRUQsTUFBTSxLQUFLLGdCQUFnQjtRQUN6QixPQUFPO1lBQ0wsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxLQUFLLENBQUMsb0JBQW9CO2dCQUNwQyxVQUFVLEVBQUUsU0FBUztnQkFDckIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxzQkFBc0I7b0JBQzVCLEVBQUUsRUFBRSxlQUFlO2lCQUNwQjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPO1FBQ0wsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCBEQiwgeyBNb2RlbCB9IGZyb20gXCIuLi8uLi9kYlwiO1xyXG5pbXBvcnQgQm9va01vZGVsIGZyb20gXCIuL2Jvb2tcIjtcclxuXHJcbmNvbnN0IGxvZyA9IGRlYnVnKFwiYXBpOm1vZGVsczpmb3JtYXRcIik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JtYXRNb2RlbCBleHRlbmRzIE1vZGVsIHtcclxuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcclxuICAgIHJldHVybiBcImJvb2tzX2Zvcm1hdFwiO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYm9va3M6IHtcclxuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXHJcbiAgICAgICAgbW9kZWxDbGFzczogQm9va01vZGVsLFxyXG4gICAgICAgIGpvaW46IHtcclxuICAgICAgICAgIGZyb206IFwiYm9va3NfZm9ybWF0LmJvb2tfaWRcIixcclxuICAgICAgICAgIHRvOiBcImJvb2tzX2Jvb2suaWRcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldE1hbnkoKSB7XHJcbiAgICBsb2coXCJjYWxsZWRcIiwgREIpO1xyXG4gIH1cclxufVxyXG4iXX0=