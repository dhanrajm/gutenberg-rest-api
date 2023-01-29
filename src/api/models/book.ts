import debug from "debug";
import DB, { Model } from "../../db";
import {
  Author,
  Book,
  BookConnection,
  BookFormat,
  Bookshelf,
  DbBookQueryParams,
  Language,
  Subject,
} from "../../types";
import AuthorModel from "./author";
import BookshelfModel from "./bookshelf";
import FormatModel from "./format";
import LanguageModel from "./language";
import SubjectModel from "./subject";

const log = debug("api:models:books");

export default class BookModel extends Model {
  authors: any;
  totalCount: any;
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

  static format(record: any): Book {
    const book = {
      id: record.id,
      title: record.title,
      authors: [] as Author[],
      genres: [],
      languages: [] as Language[],
      subjects: [] as Subject[],
      bookshelfs: [] as Bookshelf[],
      downloadLinks: [] as BookFormat[],
    };

    (record.authors || []).forEach((a: Author) =>
      book.authors.push({
        id: a.id,
        name: a.name,
        birth_year: a.birth_year,
        death_year: a.death_year,
      })
    );

    (record.languages || []).forEach((a: Language) =>
      book.languages.push({
        id: a.id,
        code: a.code,
      })
    );

    (record.subjects || []).forEach((a: Subject) =>
      book.subjects.push({
        id: a.id,
        name: a.name,
      })
    );

    (record.bookshelfs || []).forEach((a: Bookshelf) =>
      book.bookshelfs.push({
        id: a.id,
        name: a.name,
      })
    );

    (record.formats || []).forEach((a: BookFormat) =>
      book.downloadLinks.push({
        mime_type: a.mime_type,
        url: a.url,
      })
    );

    return book;
  }
  async getMany(params: DbBookQueryParams): Promise<BookConnection | null> {
    console.log(`getMany: called ${JSON.stringify(params)}`);
    const nameFilter = (
      builder: any,
      _type: string,
      value: string | string[] | null
    ) => {
      if (typeof value === "string") {
        builder.where("name", "iLike", `%${value}%`);
      } else {
        const values = value as string[];
        if (values.length === 0) return;
        let t = builder.where("name", "iLike", `%${values[0]}%`);
        for (let i = 1; i < values.length; i++) {
          t = t.orWhere("name", "iLike", `%${values[i]}%`);
        }
      }
    };

    log("called", DB, params);
    let query = BookModel.query();

    query
      .select(
        BookModel.raw(`
      "books_book"."id" as "id",
      "books_book"."download_count" AS "download_count"
      `)
      )
      .where("download_count", "is not", null);

    // id
    if (params.id) {
      if (typeof params.id !== "object") {
        query.where("books_book.id", parseInt(params.id));
      } else {
        query.where(
          "books_book.id",
          "in",
          (params.id as string[]).map((v) => parseInt(v))
        );
      }
    }

    // title
    if (params.title) {
      if (typeof params.title === "string") {
        query.where("books_book.title", "iLike", `%${params.title}%`);
      } else {
        const values = params.title as string[];
        for (let i = 0; i < values.length; i++) {
          if (i === 0) {
            query.where("books_book.title", "iLike", `%${values[i]}%`);
          } else {
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
          } else {
            builder.where(
              "mime_type",
              "in",
              (params.mimeType as string[]).map((v) => v.trim())
            );
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
          } else {
            builder.where(
              "code",
              "in",
              (params.lang as string[]).map((v) => v.trim())
            );
          }
        },
      });
    }

    // topic
    if (params.topic) {
      const q1 = query.clone();
      const q2 = query.clone();
      q1.innerJoinRelated("[subjects(subjectFilter), shelves]").modifiers({
        subjectFilter: (builder) =>
          nameFilter(builder, "subject", params.topic),
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
    const books: Book[] = [];
    const pageInfo = {
      totalCount,
    };
    result.forEach((record) => books.push(BookModel.format(record)));
    return { books, pageInfo };
  }
}
