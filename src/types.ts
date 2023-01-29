export type PageInfo = {
  totalCount: number;
};
export type Author = {
  id: number;
  name: string;
  birth_year: string | null;
  death_year: string | null;
};
export type Genre = {
  id: number;
  name: string;
};
export type Language = {
  id: number;
  code: string;
};
export type Subject = {
  id: number;
  name: string;
};
export type Bookshelf = {
  id: number;
  name: string;
};
export type BookFormat = {
  mime_type: string;
  url: string;
};
export type Book = {
  id: number;
  title: string;
  authors: Author[];
  genres: Genre[];
  languages: Language[];
  subjects: Subject[];
  bookshelfs: Bookshelf[];
  downloadLinks: BookFormat[];
};
export type BookConnection = {
  books: Book[];
  pageInfo: PageInfo;
};

export type DbBookQueryParams = {
  skip: number;
  pageSize: number;
  id: string[] | string | null;
  title: string[] | string | null;
  author: string[] | string | null;
  lang: string[] | string | null;
  topic: string[] | string | null;
  mimeType: string[] | string | null;
};

export interface Keyable {
  [key: string]: any;
}
