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
        console.log(record);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvbW9kZWxzL2Jvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBV3JDLE9BQU8sV0FBVyxNQUFNLFVBQVUsQ0FBQztBQUNuQyxPQUFPLGNBQWMsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxXQUFXLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sYUFBYSxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLFlBQVksTUFBTSxXQUFXLENBQUM7QUFFckMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFdEMsTUFBTSxDQUFDLE9BQU8sT0FBTyxTQUFVLFNBQVEsS0FBSztJQUMxQyxPQUFPLENBQU07SUFDYixVQUFVLENBQU07SUFDaEIsTUFBTSxLQUFLLFNBQVM7UUFDbEIsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELE1BQU0sS0FBSyxnQkFBZ0I7UUFDekIsT0FBTztZQUNMLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUUsS0FBSyxDQUFDLGtCQUFrQjtnQkFDbEMsVUFBVSxFQUFFLFdBQVc7Z0JBQ3ZCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsZUFBZTtvQkFDckIsT0FBTyxFQUFFO3dCQUNQLHdDQUF3Qzt3QkFDeEMsSUFBSSxFQUFFLDRCQUE0Qjt3QkFDbEMsRUFBRSxFQUFFLDhCQUE4QjtxQkFDbkM7b0JBQ0QsRUFBRSxFQUFFLGlCQUFpQjtpQkFDdEI7YUFDRjtZQUNELE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUUsS0FBSyxDQUFDLGtCQUFrQjtnQkFDbEMsVUFBVSxFQUFFLGNBQWM7Z0JBQzFCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsZUFBZTtvQkFDckIs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akUsZUFBZSxDQUFDLDhDQUE4QyxDQUFDO2FBQy9ELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7YUFDdEQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQzthQUN4RSxRQUFRLENBQUMsMERBQTBELENBQUMsQ0FBQztRQUV4RSxNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQztRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sS0FBSyxHQUFXLEVBQUUsQ0FBQztRQUN6QixNQUFNLFFBQVEsR0FBRztZQUNmLFVBQVU7U0FDWCxDQUFDO1FBQ0YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IERCLCB7IE1vZGVsIH0gZnJvbSBcIi4uLy4uL2RiXCI7XHJcbmltcG9ydCB7XHJcbiAgQXV0aG9yLFxyXG4gIEJvb2ssXHJcbiAgQm9va0Nvbm5lY3Rpb24sXHJcbiAgQm9va0Zvcm1hdCxcclxuICBCb29rc2hlbGYsXHJcbiAgRGJCb29rUXVlcnlQYXJhbXMsXHJcbiAgTGFuZ3VhZ2UsXHJcbiAgU3ViamVjdCxcclxufSBmcm9tIFwiLi4vLi4vdHlwZXNcIjtcclxuaW1wb3J0IEF1dGhvck1vZGVsIGZyb20gXCIuL2F1dGhvclwiO1xyXG5pbXBvcnQgQm9va3NoZWxmTW9kZWwgZnJvbSBcIi4vYm9va3NoZWxmXCI7XHJcbmltcG9ydCBGb3JtYXRNb2RlbCBmcm9tIFwiLi9mb3JtYXRcIjtcclxuaW1wb3J0IExhbmd1YWdlTW9kZWwgZnJvbSBcIi4vbGFuZ3VhZ2VcIjtcclxuaW1wb3J0IFN1YmplY3RNb2RlbCBmcm9tIFwiLi9zdWJqZWN0XCI7XHJcblxyXG5jb25zdCBsb2cgPSBkZWJ1ZyhcImFwaTptb2RlbHM6Ym9va3NcIik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb29rTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XHJcbiAgYXV0aG9yczogYW55O1xyXG4gIHRvdGFsQ291bnQ6IGFueTtcclxuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcclxuICAgIHJldHVybiBcImJvb2tzX2Jvb2tcIjtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGF1dGhvcnM6IHtcclxuICAgICAgICByZWxhdGlvbjogTW9kZWwuTWFueVRvTWFueVJlbGF0aW9uLFxyXG4gICAgICAgIG1vZGVsQ2xhc3M6IEF1dGhvck1vZGVsLFxyXG4gICAgICAgIGpvaW46IHtcclxuICAgICAgICAgIGZyb206IFwiYm9va3NfYm9vay5pZFwiLFxyXG4gICAgICAgICAgdGhyb3VnaDoge1xyXG4gICAgICAgICAgICAvLyBib29rc19ib29rX2F1dGhvcnMgaXMgdGhlIGpvaW4gdGFibGUuXHJcbiAgICAgICAgICAgIGZyb206IFwiYm9va3NfYm9va19hdXRob3JzLmJvb2tfaWRcIixcclxuICAgICAgICAgICAgdG86IFwiYm9va3NfYm9va19hdXRob3JzLmF1dGhvcl9pZFwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRvOiBcImJvb2tzX2F1dGhvci5pZFwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHNoZWx2ZXM6IHtcclxuICAgICAgICByZWxhdGlvbjogTW9kZWwuTWFueVRvTWFueVJlbGF0aW9uLFxyXG4gICAgICAgIG1vZGVsQ2xhc3M6IEJvb2tzaGVsZk1vZGVsLFxyXG4gICAgICAgIGpvaW46IHtcclxuICAgICAgICAgIGZyb206IFwiYm9va3NfYm9vay5pZFwiLFxyXG4gICAgICAgICAgdGhyb3VnaDoge1xyXG4gICAgICAgICAgICAvLyBib29rc19ib29rX2Jvb2tzaGVsdmVzIGlzIHRoZSBqb2luIHRhYmxlLlxyXG4gICAgICAgICAgICBmcm9tOiBcImJvb2tzX2Jvb2tfYm9va3NoZWx2ZXMuYm9va19pZFwiLFxyXG4gICAgICAgICAgICB0bzogXCJib29rc19ib29rX2Jvb2tzaGVsdmVzLmJvb2tzaGVsZl9pZFwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRvOiBcImJvb2tzX2Jvb2tzaGVsZi5pZFwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHN1YmplY3RzOiB7XHJcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcclxuICAgICAgICBtb2RlbENsYXNzOiBTdWJqZWN0TW9kZWwsXHJcbiAgICAgICAgam9pbjoge1xyXG4gICAgICAgICAgZnJvbTogXCJib29rc19ib29rLmlkXCIsXHJcbiAgICAgICAgICB0aHJvdWdoOiB7XHJcbiAgICAgICAgICAgIC8vIGJvb2tzX2Jvb2tfc3ViamVjdHMgaXMgdGhlIGpvaW4gdGFibGUuXHJcbiAgICAgICAgICAgIGZyb206IFwiYm9va3NfYm9va19zdWJqZWN0cy5ib29rX2lkXCIsXHJcbiAgICAgICAgICAgIHRvOiBcImJvb2tzX2Jvb2tfc3ViamVjdHMuc3ViamVjdF9pZFwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRvOiBcImJvb2tzX3N1YmplY3QuaWRcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBsYW5ndWFnZXM6IHtcclxuICAgICAgICByZWxhdGlvbjogTW9kZWwuTWFueVRvTWFueVJlbGF0aW9uLFxyXG4gICAgICAgIG1vZGVsQ2xhc3M6IExhbmd1YWdlTW9kZWwsXHJcbiAgICAgICAgam9pbjoge1xyXG4gICAgICAgICAgZnJvbTogXCJib29rc19ib29rLmlkXCIsXHJcbiAgICAgICAgICB0aHJvdWdoOiB7XHJcbiAgICAgICAgICAgIC8vIGJvb2tzX2Jvb2tfbGFuZ3VhZ2VzIGlzIHRoZSBqb2luIHRhYmxlLlxyXG4gICAgICAgICAgICBmcm9tOiBcImJvb2tzX2Jvb2tfbGFuZ3VhZ2VzLmJvb2tfaWRcIixcclxuICAgICAgICAgICAgdG86IFwiYm9va3NfYm9va19sYW5ndWFnZXMubGFuZ3VhZ2VfaWRcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0bzogXCJib29rc19sYW5ndWFnZS5pZFwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGZvcm1hdHM6IHtcclxuICAgICAgICByZWxhdGlvbjogTW9kZWwuSGFzTWFueVJlbGF0aW9uLFxyXG4gICAgICAgIG1vZGVsQ2xhc3M6IEZvcm1hdE1vZGVsLFxyXG4gICAgICAgIGpvaW46IHtcclxuICAgICAgICAgIGZyb206IFwiYm9va3NfYm9vay5pZFwiLFxyXG4gICAgICAgICAgdG86IFwiYm9va3NfZm9ybWF0LmJvb2tfaWRcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBmb3JtYXQocmVjb3JkOiBhbnkpOiBCb29rIHtcclxuICAgIGNvbnNvbGUubG9nKHJlY29yZCk7XHJcbiAgICBjb25zdCBib29rID0ge1xyXG4gICAgICBpZDogcmVjb3JkLmlkLFxyXG4gICAgICB0aXRsZTogcmVjb3JkLnRpdGxlLFxyXG4gICAgICBhdXRob3JzOiBbXSBhcyBBdXRob3JbXSxcclxuICAgICAgZ2VucmVzOiBbXSxcclxuICAgICAgbGFuZ3VhZ2VzOiBbXSBhcyBMYW5ndWFnZVtdLFxyXG4gICAgICBzdWJqZWN0czogW10gYXMgU3ViamVjdFtdLFxyXG4gICAgICBib29rc2hlbGZzOiBbXSBhcyBCb29rc2hlbGZbXSxcclxuICAgICAgZG93bmxvYWRMaW5rczogW10gYXMgQm9va0Zvcm1hdFtdLFxyXG4gICAgfTtcclxuXHJcbiAgICAocmVjb3JkLmF1dGhvcnMgfHwgW10pLmZvckVhY2goKGE6IEF1dGhvcikgPT5cclxuICAgICAgYm9vay5hdXRob3JzLnB1c2goe1xyXG4gICAgICAgIGlkOiBhLmlkLFxyXG4gICAgICAgIG5hbWU6IGEubmFtZSxcclxuICAgICAgICBiaXJ0aF95ZWFyOiBhLmJpcnRoX3llYXIsXHJcbiAgICAgICAgZGVhdGhfeWVhcjogYS5kZWF0aF95ZWFyLFxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuXHJcbiAgICAocmVjb3JkLmxhbmd1YWdlcyB8fCBbXSkuZm9yRWFjaCgoYTogTGFuZ3VhZ2UpID0+XHJcbiAgICAgIGJvb2subGFuZ3VhZ2VzLnB1c2goe1xyXG4gICAgICAgIGlkOiBhLmlkLFxyXG4gICAgICAgIGNvZGU6IGEuY29kZSxcclxuICAgICAgfSlcclxuICAgICk7XHJcblxyXG4gICAgKHJlY29yZC5zdWJqZWN0cyB8fCBbXSkuZm9yRWFjaCgoYTogU3ViamVjdCkgPT5cclxuICAgICAgYm9vay5zdWJqZWN0cy5wdXNoKHtcclxuICAgICAgICBpZDogYS5pZCxcclxuICAgICAgICBuYW1lOiBhLm5hbWUsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG5cclxuICAgIChyZWNvcmQuYm9va3NoZWxmcyB8fCBbXSkuZm9yRWFjaCgoYTogQm9va3NoZWxmKSA9PlxyXG4gICAgICBib29rLmJvb2tzaGVsZnMucHVzaCh7XHJcbiAgICAgICAgaWQ6IGEuaWQsXHJcbiAgICAgICAgbmFtZTogYS5uYW1lLFxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuXHJcbiAgICAocmVjb3JkLmZvcm1hdHMgfHwgW10pLmZvckVhY2goKGE6IEJvb2tGb3JtYXQpID0+XHJcbiAgICAgIGJvb2suZG93bmxvYWRMaW5rcy5wdXNoKHtcclxuICAgICAgICBtaW1lX3R5cGU6IGEubWltZV90eXBlLFxyXG4gICAgICAgIHVybDogYS51cmwsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBib29rO1xyXG4gIH1cclxuICBhc3luYyBnZXRNYW55KHBhcmFtczogRGJCb29rUXVlcnlQYXJhbXMpOiBQcm9taXNlPEJvb2tDb25uZWN0aW9uIHwgbnVsbD4ge1xyXG4gICAgY29uc29sZS5sb2coYGdldE1hbnk6IGNhbGxlZCAke0pTT04uc3RyaW5naWZ5KHBhcmFtcyl9YCk7XHJcbiAgICBjb25zdCBuYW1lRmlsdGVyID0gKFxyXG4gICAgICBidWlsZGVyOiBhbnksXHJcbiAgICAgIF90eXBlOiBzdHJpbmcsXHJcbiAgICAgIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSB8IG51bGxcclxuICAgICkgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgYnVpbGRlci53aGVyZShcIm5hbWVcIiwgXCJpTGlrZVwiLCBgJSR7dmFsdWV9JWApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHZhbHVlIGFzIHN0cmluZ1tdO1xyXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHQgPSBidWlsZGVyLndoZXJlKFwibmFtZVwiLCBcImlMaWtlXCIsIGAlJHt2YWx1ZXNbMF19JWApO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB0ID0gdC5vcldoZXJlKFwibmFtZVwiLCBcImlMaWtlXCIsIGAlJHt2YWx1ZXNbaV19JWApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2coXCJjYWxsZWRcIiwgREIsIHBhcmFtcyk7XHJcbiAgICBsZXQgcXVlcnkgPSBCb29rTW9kZWwucXVlcnkoKTtcclxuXHJcbiAgICBxdWVyeVxyXG4gICAgICAuc2VsZWN0KFxyXG4gICAgICAgIEJvb2tNb2RlbC5yYXcoYFxyXG4gICAgICBcImJvb2tzX2Jvb2tcIi5cImlkXCIgYXMgXCJpZFwiLFxyXG4gICAgICBcImJvb2tzX2Jvb2tcIi5cImRvd25sb2FkX2NvdW50XCIgQVMgXCJkb3dubG9hZF9jb3VudFwiXHJcbiAgICAgIGApXHJcbiAgICAgIClcclxuICAgICAgLndoZXJlKFwiZG93bmxvYWRfY291bnRcIiwgXCJpcyBub3RcIiwgbnVsbCk7XHJcblxyXG4gICAgLy8gaWRcclxuICAgIGlmIChwYXJhbXMuaWQpIHtcclxuICAgICAgaWYgKHR5cGVvZiBwYXJhbXMuaWQgIT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICBxdWVyeS53aGVyZShcImJvb2tzX2Jvb2suaWRcIiwgcGFyc2VJbnQocGFyYW1zLmlkKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcXVlcnkud2hlcmUoXHJcbiAgICAgICAgICBcImJvb2tzX2Jvb2suaWRcIixcclxuICAgICAgICAgIFwiaW5cIixcclxuICAgICAgICAgIChwYXJhbXMuaWQgYXMgc3RyaW5nW10pLm1hcCgodikgPT4gcGFyc2VJbnQodikpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRpdGxlXHJcbiAgICBpZiAocGFyYW1zLnRpdGxlKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgcGFyYW1zLnRpdGxlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgcXVlcnkud2hlcmUoXCJib29rc19ib29rLnRpdGxlXCIsIFwiaUxpa2VcIiwgYCUke3BhcmFtcy50aXRsZX0lYCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gcGFyYW1zLnRpdGxlIGFzIHN0cmluZ1tdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xyXG4gICAgICAgICAgICBxdWVyeS53aGVyZShcImJvb2tzX2Jvb2sudGl0bGVcIiwgXCJpTGlrZVwiLCBgJSR7dmFsdWVzW2ldfSVgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5Lm9yV2hlcmUoXCJib29rc19ib29rLnRpdGxlXCIsIFwiaUxpa2VcIiwgYCUke3ZhbHVlc1tpXX0lYCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbWltZVR5cGVcclxuICAgIGlmIChwYXJhbXMubWltZVR5cGUpIHtcclxuICAgICAgcXVlcnkuaW5uZXJKb2luUmVsYXRlZChcIltmb3JtYXRzKGZvcm1hdHNGaWx0ZXIpXVwiKS5tb2RpZmllcnMoe1xyXG4gICAgICAgIGZvcm1hdHNGaWx0ZXI6IChidWlsZGVyKSA9PiB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHBhcmFtcy5taW1lVHlwZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBidWlsZGVyLndoZXJlKFwibWltZV90eXBlXCIsIHBhcmFtcy5taW1lVHlwZS50cmltKCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnVpbGRlci53aGVyZShcclxuICAgICAgICAgICAgICBcIm1pbWVfdHlwZVwiLFxyXG4gICAgICAgICAgICAgIFwiaW5cIixcclxuICAgICAgICAgICAgICAocGFyYW1zLm1pbWVUeXBlIGFzIHN0cmluZ1tdKS5tYXAoKHYpID0+IHYudHJpbSgpKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGF1dGhvcnNcclxuICAgIGlmIChwYXJhbXMuYXV0aG9yKSB7XHJcbiAgICAgIHF1ZXJ5LmlubmVySm9pblJlbGF0ZWQoXCJbYXV0aG9ycyhhdXRob3JGaWx0ZXIpXVwiKS5tb2RpZmllcnMoe1xyXG4gICAgICAgIGF1dGhvckZpbHRlcjogKGJ1aWxkZXIpID0+IG5hbWVGaWx0ZXIoYnVpbGRlciwgXCJhdXRob3JcIiwgcGFyYW1zLmF1dGhvciksXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxhbmdcclxuICAgIGlmIChwYXJhbXMubGFuZykge1xyXG4gICAgICBxdWVyeS5pbm5lckpvaW5SZWxhdGVkKFwiW2xhbmd1YWdlcyhsYW5ndWFnZUZpbHRlcildXCIpLm1vZGlmaWVycyh7XHJcbiAgICAgICAgbGFuZ3VhZ2VGaWx0ZXI6IChidWlsZGVyKSA9PiB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHBhcmFtcy5sYW5nID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGJ1aWxkZXIud2hlcmUoXCJjb2RlXCIsIHBhcmFtcy5sYW5nLnRyaW0oKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBidWlsZGVyLndoZXJlKFxyXG4gICAgICAgICAgICAgIFwiY29kZVwiLFxyXG4gICAgICAgICAgICAgIFwiaW5cIixcclxuICAgICAgICAgICAgICAocGFyYW1zLmxhbmcgYXMgc3RyaW5nW10pLm1hcCgodikgPT4gdi50cmltKCkpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdG9waWNcclxuICAgIGlmIChwYXJhbXMudG9waWMpIHtcclxuICAgICAgY29uc3QgcTEgPSBxdWVyeS5jbG9uZSgpO1xyXG4gICAgICBjb25zdCBxMiA9IHF1ZXJ5LmNsb25lKCk7XHJcbiAgICAgIHExLmlubmVySm9pblJlbGF0ZWQoXCJbc3ViamVjdHMoc3ViamVjdEZpbHRlciksIHNoZWx2ZXNdXCIpLm1vZGlmaWVycyh7XHJcbiAgICAgICAgc3ViamVjdEZpbHRlcjogKGJ1aWxkZXIpID0+XHJcbiAgICAgICAgICBuYW1lRmlsdGVyKGJ1aWxkZXIsIFwic3ViamVjdFwiLCBwYXJhbXMudG9waWMpLFxyXG4gICAgICB9KTtcclxuICAgICAgcTIuaW5uZXJKb2luUmVsYXRlZChcIltzdWJqZWN0cywgc2hlbHZlcyhzaGVsZkZpbHRlcildXCIpLm1vZGlmaWVycyh7XHJcbiAgICAgICAgc2hlbGZGaWx0ZXI6IChidWlsZGVyKSA9PiBuYW1lRmlsdGVyKGJ1aWxkZXIsIFwic2hlbGZcIiwgcGFyYW1zLnRvcGljKSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBxdWVyeSA9IHExLnVuaW9uQWxsKHEyKTtcclxuICAgIH1cclxuXHJcbiAgICBxdWVyeS5kaXN0aW5jdE9uKFwiaWRcIikuZ3JvdXBCeShcImJvb2tzX2Jvb2suaWRcIik7XHJcblxyXG4gICAgY29uc3QgcTMgPSBxdWVyeS5jbG9uZSgpO1xyXG4gICAgY29uc3QgcTQgPSBCb29rTW9kZWwucXVlcnkoKVxyXG4gICAgICAuY291bnQoXCIqXCIsIHsgYXM6IFwidG90YWxDb3VudFwiIH0pXHJcbiAgICAgIC5mcm9tKHEzLmFzKFwiYm9va3NcIikpO1xyXG5cclxuICAgIHF1ZXJ5ID0gQm9va01vZGVsLnF1ZXJ5KClcclxuICAgICAgLndpdGgoXCJ0b3RhbENvdW50XCIsIChidWlsZGVyKSA9PiBidWlsZGVyLmZyb20ocTQuYXMoXCJib29rc0NvdW50XCIpKSlcclxuICAgICAgLnNlbGVjdChcIipcIilcclxuICAgICAgLmZyb20ocTMuYXMoXCJib29rc1wiKSlcclxuICAgICAgLmlubmVySm9pbihCb29rTW9kZWwucmF3KGBcInRvdGFsQ291bnRcIiBhcyBcInRvdGFsQ291bnRcIiBvbiB0cnVlYCkpXHJcbiAgICAgIC5vcmRlckJ5KFwiYm9va3MuZG93bmxvYWRfY291bnRcIiwgXCJkZXNjXCIpXHJcbiAgICAgIC5vZmZzZXQocGFyYW1zLnNraXApXHJcbiAgICAgIC5saW1pdChwYXJhbXMucGFnZVNpemUpO1xyXG5cclxuICAgIGNvbnN0IHE2ID0gcXVlcnkuY2xvbmUoKTtcclxuICAgIHF1ZXJ5ID0gQm9va01vZGVsLnF1ZXJ5KClcclxuICAgICAgLndpdGgoXCJmaWx0ZXJlZF9ib29rc1wiLCAoYnVpbGRlcikgPT4gYnVpbGRlci5mcm9tKHE2LmFzKFwiYm9va3NcIikpKVxyXG4gICAgICAud2l0aEdyYXBoSm9pbmVkKFwiW2F1dGhvcnMsbGFuZ3VhZ2VzLHN1YmplY3RzLHNoZWx2ZXMsZm9ybWF0c11cIilcclxuICAgICAgLnNlbGVjdChCb29rTW9kZWwucmF3KGBcImZpbHRlcmVkX2Jvb2tzXCIuXCJ0b3RhbENvdW50XCJgKSlcclxuICAgICAgLmlubmVySm9pbihCb29rTW9kZWwucmF3KGBcImZpbHRlcmVkX2Jvb2tzXCIgYXMgXCJmaWx0ZXJlZF9ib29rc1wiIG9uIHRydWVgKSlcclxuICAgICAgLndoZXJlUmF3KGBcImJvb2tzX2Jvb2tcIi5cImlkXCIgaW4gKFNFTEVDVCBcImlkXCIgRlJPTSBcImZpbHRlcmVkX2Jvb2tzXCIpYCk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnk7XHJcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgIGNvbnNvbGUubG9nKHF1ZXJ5LnRvS25leFF1ZXJ5KCkudG9RdWVyeSgpKTtcclxuXHJcbiAgICBjb25zdCB0b3RhbENvdW50ID0gcmVzdWx0WzBdID8gcmVzdWx0WzBdLnRvdGFsQ291bnQgOiAwO1xyXG4gICAgY29uc29sZS5sb2coXCJ0b3RhbENvdW50XCIsIHRvdGFsQ291bnQpO1xyXG4gICAgY29uc3QgYm9va3M6IEJvb2tbXSA9IFtdO1xyXG4gICAgY29uc3QgcGFnZUluZm8gPSB7XHJcbiAgICAgIHRvdGFsQ291bnQsXHJcbiAgICB9O1xyXG4gICAgcmVzdWx0LmZvckVhY2goKHJlY29yZCkgPT4gYm9va3MucHVzaChCb29rTW9kZWwuZm9ybWF0KHJlY29yZCkpKTtcclxuICAgIHJldHVybiB7IGJvb2tzLCBwYWdlSW5mbyB9O1xyXG4gIH1cclxufVxyXG4iXX0=