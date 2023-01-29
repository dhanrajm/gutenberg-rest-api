import debug from "debug";
import DB, { Model } from "../../db";
import AuthorModel from "./author";
import BookshelfModel from "./bookshelf";
import FormatModel from "./format";
import LanguageModel from "./language";
import SubjectModel from "./subject";
const log = debug("api:models:books");
export default class BookModel extends Model {
    authors;
    totalCount;
    static get tableName() {
        return "books_book";
    }
    static get relationMappings() {
        return {
            authors: {
                relation: Model.ManyToManyRelation,
                modelClass: AuthorModel,
                join: {
                    from: "books_book.id",
                    through: {
                        // books_book_authors is the join table.
                        from: "books_book_authors.book_id",
                        to: "books_book_authors.author_id",
                    },
                    to: "books_author.id",
                },
            },
            shelves: {
                relation: Model.ManyToManyRelation,
                modelClass: BookshelfModel,
                join: {
                    from: "books_book.id",
                    through: {
                        // books_book_bookshelves is the join table.
                        from: "books_book_bookshelves.book_id",
                        to: "books_book_bookshelves.bookshelf_id",
                    },
                    to: "books_bookshelf.id",
                },
            },
            subjects: {
                relation: Model.ManyToManyRelation,
                modelClass: SubjectModel,
                join: {
                    from: "books_book.id",
                    through: {
                        // books_book_subjects is the join table.
                        from: "books_book_subjects.book_id",
                        to: "books_book_subjects.subject_id",
                    },
                    to: "books_subject.id",
                },
            },
            languages: {
                relation: Model.ManyToManyRelation,
                modelClass: LanguageModel,
                join: {
                    from: "books_book.id",
                    through: {
                        // books_book_languages is the join table.
                        from: "books_book_languages.book_id",
                        to: "books_book_languages.language_id",
                    },
                    to: "books_language.id",
                },
            },
            formats: {
                relation: Model.HasManyRelation,
                modelClass: FormatModel,
                join: {
                    from: "books_book.id",
                    to: "books_format.book_id",
                },
            },
        };
    }
    static format(record) {
        const book = {
            id: record.id,
            title: record.title,
            authors: [],
            genres: [],
            languages: [],
            subjects: [],
            bookshelfs: [],
            downloadLinks: [],
        };
        (record.authors || []).forEach((a) => book.authors.push({
            id: a.id,
            name: a.name,
            birth_year: a.birth_year,
            death_year: a.death_year,
        }));
        (record.languages || []).forEach((a) => book.languages.push({
            id: a.id,
            code: a.code,
        }));
        (record.subjects || []).forEach((a) => book.subjects.push({
            id: a.id,
            name: a.name,
        }));
        (record.bookshelfs || []).forEach((a) => book.bookshelfs.push({
            id: a.id,
            name: a.name,
        }));
        (record.formats || []).forEach((a) => book.downloadLinks.push({
            mime_type: a.mime_type,
            url: a.url,
        }));
        return book;
    }
    async getMany(params) {
        console.log(`getMany: called ${JSON.stringify(params)}`);
        const nameFilter = (builder, _type, value) => {
            if (typeof value === "string") {
                builder.where("name", "iLike", `%${value}%`);
            }
            else {
                const values = value;
                if (values.length === 0)
                    return;
                let t = builder.where("name", "iLike", `%${values[0]}%`);
                for (let i = 1; i < values.length; i++) {
                    t = t.orWhere("name", "iLike", `%${values[i]}%`);
                }
            }
        };
        log("called", DB, params);
        let query = BookModel.query();
        query
            .select(BookModel.raw(`
      "books_book"."id" as "id",
      "books_book"."download_count" AS "download_count"
      `))
            .where("download_count", "is not", null);
        // id
        if (params.id) {
            if (typeof params.id !== "object") {
                query.where("books_book.id", parseInt(params.id));
            }
            else {
                query.where("books_book.id", "in", params.id.map((v) => parseInt(v)));
            }
        }
        // title
        if (params.title) {
            if (typeof params.title === "string") {
                query.where("books_book.title", "iLike", `%${params.title}%`);
            }
            else {
                const values = params.title;
                for (let i = 0; i < values.length; i++) {
                    if (i === 0) {
                        query.where("books_book.title", "iLike", `%${values[i]}%`);
                    }
                    else {
                        query.orWhere("books_book.title", "iLike", `%${values[i]}%`);
                    }
                }
            }
        }
        // mimeType
        if (params.mimeType) {
            query.innerJoinRelated("[formats(formatsFilter)]").modifiers({
                formatsFilter: (builder) => {
                    if (typeof params.mimeType === "string") {
                        builder.where("mime_type", params.mimeType.trim());
                    }
                    else {
                        builder.where("mime_type", "in", params.mimeType.map((v) => v.trim()));
                    }
                },
            });
        }
        // authors
        if (params.author) {
            query.innerJoinRelated("[authors(authorFilter)]").modifiers({
                authorFilter: (builder) => nameFilter(builder, "author", params.author),
            });
        }
        // lang
        if (params.lang) {
            query.innerJoinRelated("[languages(languageFilter)]").modifiers({
                languageFilter: (builder) => {
                    if (typeof params.lang === "string") {
                        builder.where("code", params.lang.trim());
                    }
                    else {
                        builder.where("code", "in", params.lang.map((v) => v.trim()));
                    }
                },
            });
        }
        // topic
        if (params.topic) {
            const q1 = query.clone();
            const q2 = query.clone();
            q1.innerJoinRelated("[subjects(subjectFilter), shelves]").modifiers({
                subjectFilter: (builder) => nameFilter(builder, "subject", params.topic),
            });
            q2.innerJoinRelated("[subjects, shelves(shelfFilter)]").modifiers({
                shelfFilter: (builder) => nameFilter(builder, "shelf", params.topic),
            });
            query = q1.unionAll(q2);
        }
        query.distinctOn("id").groupBy("books_book.id");
        const q3 = query.clone();
        const q4 = BookModel.query()
            .count("*", { as: "totalCount" })
            .from(q3.as("books"));
        query = BookModel.query()
            .with("totalCount", (builder) => builder.from(q4.as("booksCount")))
            .select("*")
            .from(q3.as("books"))
            .innerJoin(BookModel.raw(`"totalCount" as "totalCount" on true`))
            .orderBy("books.download_count", "desc")
            .offset(params.skip)
            .limit(params.pageSize);
        const q6 = query.clone();
        query = BookModel.query()
            .with("filtered_books", (builder) => builder.from(q6.as("books")))
            .withGraphJoined("[authors,languages,subjects,shelves,formats]")
            .select(BookModel.raw(`"filtered_books"."totalCount"`))
            .innerJoin(BookModel.raw(`"filtered_books" as "filtered_books" on true`))
            .whereRaw(`"books_book"."id" in (SELECT "id" FROM "filtered_books")`);
        const result = await query;
        console.log(JSON.stringify(result));
        console.log(query.toKnexQuery().toQuery());
        const totalCount = result[0] ? result[0].totalCount : 0;
        console.log("totalCount", totalCount);
        const books = [];
        const pageInfo = {
            totalCount,
        };
        result.forEach((record) => books.push(BookModel.format(record)));
        return { books, pageInfo };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvbW9kZWxzL2Jvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBV3JDLE9BQU8sV0FBVyxNQUFNLFVBQVUsQ0FBQztBQUNuQyxPQUFPLGNBQWMsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxXQUFXLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sYUFBYSxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLFlBQVksTUFBTSxXQUFXLENBQUM7QUFFckMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFdEMsTUFBTSxDQUFDLE9BQU8sT0FBTyxTQUFVLFNBQVEsS0FBSztJQUMxQyxPQUFPLENBQU07SUFDYixVQUFVLENBQU07SUFDaEIsTUFBTSxLQUFLLFNBQVM7UUFDbEIsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELE1BQU0sS0FBSyxnQkFBZ0I7UUFDekIsT0FBTztZQUNMLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUUsS0FBSyxDQUFDLGtCQUFrQjtnQkFDbEMsVUFBVSxFQUFFLFdBQVc7Z0JBQ3ZCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsZUFBZTtvQkFDckIsT0FBTyxFQUFFO3dCQUNQLHdDQUF3Qzt3QkFDeEMsSUFBSSxFQUFFLDRCQUE0Qjt3QkFDbEMsRUFBRSxFQUFFLDhCQUE4QjtxQkFDbkM7b0JBQ0QsRUFBRSxFQUFFLGlCQUFpQjtpQkFDdEI7YUFDRjtZQUNELE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUUsS0FBSyxDQUFDLGtCQUFrQjtnQkFDbEMsVUFBVSxFQUFFLGNBQWM7Z0JBQzFCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsZUFBZTtvQkFDckIs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U0FBUyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2FBQ3RELFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7YUFDeEUsUUFBUSxDQUFDLDBEQUEwRCxDQUFDLENBQUM7UUFFeEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxLQUFLLENBQUM7UUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUUzQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN0QyxNQUFNLEtBQUssR0FBVyxFQUFFLENBQUM7UUFDekIsTUFBTSxRQUFRLEdBQUc7WUFDZixVQUFVO1NBQ1gsQ0FBQztRQUNGLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCBEQiwgeyBNb2RlbCB9IGZyb20gXCIuLi8uLi9kYlwiO1xyXG5pbXBvcnQge1xyXG4gIEF1dGhvcixcclxuICBCb29rLFxyXG4gIEJvb2tDb25uZWN0aW9uLFxyXG4gIEJvb2tGb3JtYXQsXHJcbiAgQm9va3NoZWxmLFxyXG4gIERiQm9va1F1ZXJ5UGFyYW1zLFxyXG4gIExhbmd1YWdlLFxyXG4gIFN1YmplY3QsXHJcbn0gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XHJcbmltcG9ydCBBdXRob3JNb2RlbCBmcm9tIFwiLi9hdXRob3JcIjtcclxuaW1wb3J0IEJvb2tzaGVsZk1vZGVsIGZyb20gXCIuL2Jvb2tzaGVsZlwiO1xyXG5pbXBvcnQgRm9ybWF0TW9kZWwgZnJvbSBcIi4vZm9ybWF0XCI7XHJcbmltcG9ydCBMYW5ndWFnZU1vZGVsIGZyb20gXCIuL2xhbmd1YWdlXCI7XHJcbmltcG9ydCBTdWJqZWN0TW9kZWwgZnJvbSBcIi4vc3ViamVjdFwiO1xyXG5cclxuY29uc3QgbG9nID0gZGVidWcoXCJhcGk6bW9kZWxzOmJvb2tzXCIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9va01vZGVsIGV4dGVuZHMgTW9kZWwge1xyXG4gIGF1dGhvcnM6IGFueTtcclxuICB0b3RhbENvdW50OiBhbnk7XHJcbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XHJcbiAgICByZXR1cm4gXCJib29rc19ib29rXCI7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhdXRob3JzOiB7XHJcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcclxuICAgICAgICBtb2RlbENsYXNzOiBBdXRob3JNb2RlbCxcclxuICAgICAgICBqb2luOiB7XHJcbiAgICAgICAgICBmcm9tOiBcImJvb2tzX2Jvb2suaWRcIixcclxuICAgICAgICAgIHRocm91Z2g6IHtcclxuICAgICAgICAgICAgLy8gYm9va3NfYm9va19hdXRob3JzIGlzIHRoZSBqb2luIHRhYmxlLlxyXG4gICAgICAgICAgICBmcm9tOiBcImJvb2tzX2Jvb2tfYXV0aG9ycy5ib29rX2lkXCIsXHJcbiAgICAgICAgICAgIHRvOiBcImJvb2tzX2Jvb2tfYXV0aG9ycy5hdXRob3JfaWRcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0bzogXCJib29rc19hdXRob3IuaWRcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBzaGVsdmVzOiB7XHJcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcclxuICAgICAgICBtb2RlbENsYXNzOiBCb29rc2hlbGZNb2RlbCxcclxuICAgICAgICBqb2luOiB7XHJcbiAgICAgICAgICBmcm9tOiBcImJvb2tzX2Jvb2suaWRcIixcclxuICAgICAgICAgIHRocm91Z2g6IHtcclxuICAgICAgICAgICAgLy8gYm9va3NfYm9va19ib29rc2hlbHZlcyBpcyB0aGUgam9pbiB0YWJsZS5cclxuICAgICAgICAgICAgZnJvbTogXCJib29rc19ib29rX2Jvb2tzaGVsdmVzLmJvb2tfaWRcIixcclxuICAgICAgICAgICAgdG86IFwiYm9va3NfYm9va19ib29rc2hlbHZlcy5ib29rc2hlbGZfaWRcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0bzogXCJib29rc19ib29rc2hlbGYuaWRcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBzdWJqZWN0czoge1xyXG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5NYW55VG9NYW55UmVsYXRpb24sXHJcbiAgICAgICAgbW9kZWxDbGFzczogU3ViamVjdE1vZGVsLFxyXG4gICAgICAgIGpvaW46IHtcclxuICAgICAgICAgIGZyb206IFwiYm9va3NfYm9vay5pZFwiLFxyXG4gICAgICAgICAgdGhyb3VnaDoge1xyXG4gICAgICAgICAgICAvLyBib29rc19ib29rX3N1YmplY3RzIGlzIHRoZSBqb2luIHRhYmxlLlxyXG4gICAgICAgICAgICBmcm9tOiBcImJvb2tzX2Jvb2tfc3ViamVjdHMuYm9va19pZFwiLFxyXG4gICAgICAgICAgICB0bzogXCJib29rc19ib29rX3N1YmplY3RzLnN1YmplY3RfaWRcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0bzogXCJib29rc19zdWJqZWN0LmlkXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgbGFuZ3VhZ2VzOiB7XHJcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcclxuICAgICAgICBtb2RlbENsYXNzOiBMYW5ndWFnZU1vZGVsLFxyXG4gICAgICAgIGpvaW46IHtcclxuICAgICAgICAgIGZyb206IFwiYm9va3NfYm9vay5pZFwiLFxyXG4gICAgICAgICAgdGhyb3VnaDoge1xyXG4gICAgICAgICAgICAvLyBib29rc19ib29rX2xhbmd1YWdlcyBpcyB0aGUgam9pbiB0YWJsZS5cclxuICAgICAgICAgICAgZnJvbTogXCJib29rc19ib29rX2xhbmd1YWdlcy5ib29rX2lkXCIsXHJcbiAgICAgICAgICAgIHRvOiBcImJvb2tzX2Jvb2tfbGFuZ3VhZ2VzLmxhbmd1YWdlX2lkXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdG86IFwiYm9va3NfbGFuZ3VhZ2UuaWRcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBmb3JtYXRzOiB7XHJcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkhhc01hbnlSZWxhdGlvbixcclxuICAgICAgICBtb2RlbENsYXNzOiBGb3JtYXRNb2RlbCxcclxuICAgICAgICBqb2luOiB7XHJcbiAgICAgICAgICBmcm9tOiBcImJvb2tzX2Jvb2suaWRcIixcclxuICAgICAgICAgIHRvOiBcImJvb2tzX2Zvcm1hdC5ib29rX2lkXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZm9ybWF0KHJlY29yZDogYW55KTogQm9vayB7XHJcbiAgICBjb25zdCBib29rID0ge1xyXG4gICAgICBpZDogcmVjb3JkLmlkLFxyXG4gICAgICB0aXRsZTogcmVjb3JkLnRpdGxlLFxyXG4gICAgICBhdXRob3JzOiBbXSBhcyBBdXRob3JbXSxcclxuICAgICAgZ2VucmVzOiBbXSxcclxuICAgICAgbGFuZ3VhZ2VzOiBbXSBhcyBMYW5ndWFnZVtdLFxyXG4gICAgICBzdWJqZWN0czogW10gYXMgU3ViamVjdFtdLFxyXG4gICAgICBib29rc2hlbGZzOiBbXSBhcyBCb29rc2hlbGZbXSxcclxuICAgICAgZG93bmxvYWRMaW5rczogW10gYXMgQm9va0Zvcm1hdFtdLFxyXG4gICAgfTtcclxuXHJcbiAgICAocmVjb3JkLmF1dGhvcnMgfHwgW10pLmZvckVhY2goKGE6IEF1dGhvcikgPT5cclxuICAgICAgYm9vay5hdXRob3JzLnB1c2goe1xyXG4gICAgICAgIGlkOiBhLmlkLFxyXG4gICAgICAgIG5hbWU6IGEubmFtZSxcclxuICAgICAgICBiaXJ0aF95ZWFyOiBhLmJpcnRoX3llYXIsXHJcbiAgICAgICAgZGVhdGhfeWVhcjogYS5kZWF0aF95ZWFyLFxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuXHJcbiAgICAocmVjb3JkLmxhbmd1YWdlcyB8fCBbXSkuZm9yRWFjaCgoYTogTGFuZ3VhZ2UpID0+XHJcbiAgICAgIGJvb2subGFuZ3VhZ2VzLnB1c2goe1xyXG4gICAgICAgIGlkOiBhLmlkLFxyXG4gICAgICAgIGNvZGU6IGEuY29kZSxcclxuICAgICAgfSlcclxuICAgICk7XHJcblxyXG4gICAgKHJlY29yZC5zdWJqZWN0cyB8fCBbXSkuZm9yRWFjaCgoYTogU3ViamVjdCkgPT5cclxuICAgICAgYm9vay5zdWJqZWN0cy5wdXNoKHtcclxuICAgICAgICBpZDogYS5pZCxcclxuICAgICAgICBuYW1lOiBhLm5hbWUsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG5cclxuICAgIChyZWNvcmQuYm9va3NoZWxmcyB8fCBbXSkuZm9yRWFjaCgoYTogQm9va3NoZWxmKSA9PlxyXG4gICAgICBib29rLmJvb2tzaGVsZnMucHVzaCh7XHJcbiAgICAgICAgaWQ6IGEuaWQsXHJcbiAgICAgICAgbmFtZTogYS5uYW1lLFxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuXHJcbiAgICAocmVjb3JkLmZvcm1hdHMgfHwgW10pLmZvckVhY2goKGE6IEJvb2tGb3JtYXQpID0+XHJcbiAgICAgIGJvb2suZG93bmxvYWRMaW5rcy5wdXNoKHtcclxuICAgICAgICBtaW1lX3R5cGU6IGEubWltZV90eXBlLFxyXG4gICAgICAgIHVybDogYS51cmwsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBib29rO1xyXG4gIH1cclxuICBhc3luYyBnZXRNYW55KHBhcmFtczogRGJCb29rUXVlcnlQYXJhbXMpOiBQcm9taXNlPEJvb2tDb25uZWN0aW9uIHwgbnVsbD4ge1xyXG4gICAgY29uc29sZS5sb2coYGdldE1hbnk6IGNhbGxlZCAke0pTT04uc3RyaW5naWZ5KHBhcmFtcyl9YCk7XHJcbiAgICBjb25zdCBuYW1lRmlsdGVyID0gKFxyXG4gICAgICBidWlsZGVyOiBhbnksXHJcbiAgICAgIF90eXBlOiBzdHJpbmcsXHJcbiAgICAgIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSB8IG51bGxcclxuICAgICkgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgYnVpbGRlci53aGVyZShcIm5hbWVcIiwgXCJpTGlrZVwiLCBgJSR7dmFsdWV9JWApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHZhbHVlIGFzIHN0cmluZ1tdO1xyXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHQgPSBidWlsZGVyLndoZXJlKFwibmFtZVwiLCBcImlMaWtlXCIsIGAlJHt2YWx1ZXNbMF19JWApO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB0ID0gdC5vcldoZXJlKFwibmFtZVwiLCBcImlMaWtlXCIsIGAlJHt2YWx1ZXNbaV19JWApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2coXCJjYWxsZWRcIiwgREIsIHBhcmFtcyk7XHJcbiAgICBsZXQgcXVlcnkgPSBCb29rTW9kZWwucXVlcnkoKTtcclxuXHJcbiAgICBxdWVyeVxyXG4gICAgICAuc2VsZWN0KFxyXG4gICAgICAgIEJvb2tNb2RlbC5yYXcoYFxyXG4gICAgICBcImJvb2tzX2Jvb2tcIi5cImlkXCIgYXMgXCJpZFwiLFxyXG4gICAgICBcImJvb2tzX2Jvb2tcIi5cImRvd25sb2FkX2NvdW50XCIgQVMgXCJkb3dubG9hZF9jb3VudFwiXHJcbiAgICAgIGApXHJcbiAgICAgIClcclxuICAgICAgLndoZXJlKFwiZG93bmxvYWRfY291bnRcIiwgXCJpcyBub3RcIiwgbnVsbCk7XHJcblxyXG4gICAgLy8gaWRcclxuICAgIGlmIChwYXJhbXMuaWQpIHtcclxuICAgICAgaWYgKHR5cGVvZiBwYXJhbXMuaWQgIT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICBxdWVyeS53aGVyZShcImJvb2tzX2Jvb2suaWRcIiwgcGFyc2VJbnQocGFyYW1zLmlkKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcXVlcnkud2hlcmUoXHJcbiAgICAgICAgICBcImJvb2tzX2Jvb2suaWRcIixcclxuICAgICAgICAgIFwiaW5cIixcclxuICAgICAgICAgIChwYXJhbXMuaWQgYXMgc3RyaW5nW10pLm1hcCgodikgPT4gcGFyc2VJbnQodikpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRpdGxlXHJcbiAgICBpZiAocGFyYW1zLnRpdGxlKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgcGFyYW1zLnRpdGxlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgcXVlcnkud2hlcmUoXCJib29rc19ib29rLnRpdGxlXCIsIFwiaUxpa2VcIiwgYCUke3BhcmFtcy50aXRsZX0lYCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gcGFyYW1zLnRpdGxlIGFzIHN0cmluZ1tdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xyXG4gICAgICAgICAgICBxdWVyeS53aGVyZShcImJvb2tzX2Jvb2sudGl0bGVcIiwgXCJpTGlrZVwiLCBgJSR7dmFsdWVzW2ldfSVgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5Lm9yV2hlcmUoXCJib29rc19ib29rLnRpdGxlXCIsIFwiaUxpa2VcIiwgYCUke3ZhbHVlc1tpXX0lYCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbWltZVR5cGVcclxuICAgIGlmIChwYXJhbXMubWltZVR5cGUpIHtcclxuICAgICAgcXVlcnkuaW5uZXJKb2luUmVsYXRlZChcIltmb3JtYXRzKGZvcm1hdHNGaWx0ZXIpXVwiKS5tb2RpZmllcnMoe1xyXG4gICAgICAgIGZvcm1hdHNGaWx0ZXI6IChidWlsZGVyKSA9PiB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHBhcmFtcy5taW1lVHlwZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBidWlsZGVyLndoZXJlKFwibWltZV90eXBlXCIsIHBhcmFtcy5taW1lVHlwZS50cmltKCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnVpbGRlci53aGVyZShcclxuICAgICAgICAgICAgICBcIm1pbWVfdHlwZVwiLFxyXG4gICAgICAgICAgICAgIFwiaW5cIixcclxuICAgICAgICAgICAgICAocGFyYW1zLm1pbWVUeXBlIGFzIHN0cmluZ1tdKS5tYXAoKHYpID0+IHYudHJpbSgpKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGF1dGhvcnNcclxuICAgIGlmIChwYXJhbXMuYXV0aG9yKSB7XHJcbiAgICAgIHF1ZXJ5LmlubmVySm9pblJlbGF0ZWQoXCJbYXV0aG9ycyhhdXRob3JGaWx0ZXIpXVwiKS5tb2RpZmllcnMoe1xyXG4gICAgICAgIGF1dGhvckZpbHRlcjogKGJ1aWxkZXIpID0+IG5hbWVGaWx0ZXIoYnVpbGRlciwgXCJhdXRob3JcIiwgcGFyYW1zLmF1dGhvciksXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxhbmdcclxuICAgIGlmIChwYXJhbXMubGFuZykge1xyXG4gICAgICBxdWVyeS5pbm5lckpvaW5SZWxhdGVkKFwiW2xhbmd1YWdlcyhsYW5ndWFnZUZpbHRlcildXCIpLm1vZGlmaWVycyh7XHJcbiAgICAgICAgbGFuZ3VhZ2VGaWx0ZXI6IChidWlsZGVyKSA9PiB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHBhcmFtcy5sYW5nID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGJ1aWxkZXIud2hlcmUoXCJjb2RlXCIsIHBhcmFtcy5sYW5nLnRyaW0oKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBidWlsZGVyLndoZXJlKFxyXG4gICAgICAgICAgICAgIFwiY29kZVwiLFxyXG4gICAgICAgICAgICAgIFwiaW5cIixcclxuICAgICAgICAgICAgICAocGFyYW1zLmxhbmcgYXMgc3RyaW5nW10pLm1hcCgodikgPT4gdi50cmltKCkpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdG9waWNcclxuICAgIGlmIChwYXJhbXMudG9waWMpIHtcclxuICAgICAgY29uc3QgcTEgPSBxdWVyeS5jbG9uZSgpO1xyXG4gICAgICBjb25zdCBxMiA9IHF1ZXJ5LmNsb25lKCk7XHJcbiAgICAgIHExLmlubmVySm9pblJlbGF0ZWQoXCJbc3ViamVjdHMoc3ViamVjdEZpbHRlciksIHNoZWx2ZXNdXCIpLm1vZGlmaWVycyh7XHJcbiAgICAgICAgc3ViamVjdEZpbHRlcjogKGJ1aWxkZXIpID0+XHJcbiAgICAgICAgICBuYW1lRmlsdGVyKGJ1aWxkZXIsIFwic3ViamVjdFwiLCBwYXJhbXMudG9waWMpLFxyXG4gICAgICB9KTtcclxuICAgICAgcTIuaW5uZXJKb2luUmVsYXRlZChcIltzdWJqZWN0cywgc2hlbHZlcyhzaGVsZkZpbHRlcildXCIpLm1vZGlmaWVycyh7XHJcbiAgICAgICAgc2hlbGZGaWx0ZXI6IChidWlsZGVyKSA9PiBuYW1lRmlsdGVyKGJ1aWxkZXIsIFwic2hlbGZcIiwgcGFyYW1zLnRvcGljKSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBxdWVyeSA9IHExLnVuaW9uQWxsKHEyKTtcclxuICAgIH1cclxuXHJcbiAgICBxdWVyeS5kaXN0aW5jdE9uKFwiaWRcIikuZ3JvdXBCeShcImJvb2tzX2Jvb2suaWRcIik7XHJcblxyXG4gICAgY29uc3QgcTMgPSBxdWVyeS5jbG9uZSgpO1xyXG4gICAgY29uc3QgcTQgPSBCb29rTW9kZWwucXVlcnkoKVxyXG4gICAgICAuY291bnQoXCIqXCIsIHsgYXM6IFwidG90YWxDb3VudFwiIH0pXHJcbiAgICAgIC5mcm9tKHEzLmFzKFwiYm9va3NcIikpO1xyXG5cclxuICAgIHF1ZXJ5ID0gQm9va01vZGVsLnF1ZXJ5KClcclxuICAgICAgLndpdGgoXCJ0b3RhbENvdW50XCIsIChidWlsZGVyKSA9PiBidWlsZGVyLmZyb20ocTQuYXMoXCJib29rc0NvdW50XCIpKSlcclxuICAgICAgLnNlbGVjdChcIipcIilcclxuICAgICAgLmZyb20ocTMuYXMoXCJib29rc1wiKSlcclxuICAgICAgLmlubmVySm9pbihCb29rTW9kZWwucmF3KGBcInRvdGFsQ291bnRcIiBhcyBcInRvdGFsQ291bnRcIiBvbiB0cnVlYCkpXHJcbiAgICAgIC5vcmRlckJ5KFwiYm9va3MuZG93bmxvYWRfY291bnRcIiwgXCJkZXNjXCIpXHJcbiAgICAgIC5vZmZzZXQocGFyYW1zLnNraXApXHJcbiAgICAgIC5saW1pdChwYXJhbXMucGFnZVNpemUpO1xyXG5cclxuICAgIGNvbnN0IHE2ID0gcXVlcnkuY2xvbmUoKTtcclxuICAgIHF1ZXJ5ID0gQm9va01vZGVsLnF1ZXJ5KClcclxuICAgICAgLndpdGgoXCJmaWx0ZXJlZF9ib29rc1wiLCAoYnVpbGRlcikgPT4gYnVpbGRlci5mcm9tKHE2LmFzKFwiYm9va3NcIikpKVxyXG4gICAgICAud2l0aEdyYXBoSm9pbmVkKFwiW2F1dGhvcnMsbGFuZ3VhZ2VzLHN1YmplY3RzLHNoZWx2ZXMsZm9ybWF0c11cIilcclxuICAgICAgLnNlbGVjdChCb29rTW9kZWwucmF3KGBcImZpbHRlcmVkX2Jvb2tzXCIuXCJ0b3RhbENvdW50XCJgKSlcclxuICAgICAgLmlubmVySm9pbihCb29rTW9kZWwucmF3KGBcImZpbHRlcmVkX2Jvb2tzXCIgYXMgXCJmaWx0ZXJlZF9ib29rc1wiIG9uIHRydWVgKSlcclxuICAgICAgLndoZXJlUmF3KGBcImJvb2tzX2Jvb2tcIi5cImlkXCIgaW4gKFNFTEVDVCBcImlkXCIgRlJPTSBcImZpbHRlcmVkX2Jvb2tzXCIpYCk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnk7XHJcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgIGNvbnNvbGUubG9nKHF1ZXJ5LnRvS25leFF1ZXJ5KCkudG9RdWVyeSgpKTtcclxuXHJcbiAgICBjb25zdCB0b3RhbENvdW50ID0gcmVzdWx0WzBdID8gcmVzdWx0WzBdLnRvdGFsQ291bnQgOiAwO1xyXG4gICAgY29uc29sZS5sb2coXCJ0b3RhbENvdW50XCIsIHRvdGFsQ291bnQpO1xyXG4gICAgY29uc3QgYm9va3M6IEJvb2tbXSA9IFtdO1xyXG4gICAgY29uc3QgcGFnZUluZm8gPSB7XHJcbiAgICAgIHRvdGFsQ291bnQsXHJcbiAgICB9O1xyXG4gICAgcmVzdWx0LmZvckVhY2goKHJlY29yZCkgPT4gYm9va3MucHVzaChCb29rTW9kZWwuZm9ybWF0KHJlY29yZCkpKTtcclxuICAgIHJldHVybiB7IGJvb2tzLCBwYWdlSW5mbyB9O1xyXG4gIH1cclxufVxyXG4iXX0=