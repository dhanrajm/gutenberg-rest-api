import { Schema } from "express-validator/src/middlewares/schema";

const bookListQuerySanitizer = (
  path: string,
  value: string | null | undefined,
  toInt: boolean
) => {
  console.log(`bookListQuerySanitizer: ${path} ${value} ${toInt}`);
  if (!value) return null;
  let values = String(value)
    .split(",")
    .map((s) => (toInt ? parseInt(s.trim()) : s.trim()));
  if (values.length === 0) return null;
  if (values.length === 1) return values[0];
  console.log(`bookListQuerySanitizer: ${JSON.stringify(values)}`);
  return values;
};
const bookListQuery: Schema = {
  skip: {
    in: ["query"],
    notEmpty: true,
    isInt: true,
    customSanitizer: {
      options: (value) => parseInt(value),
    },
  },
  pageSize: {
    in: ["query"],
    notEmpty: true,
    isInt: true,
    customSanitizer: {
      options: (value) => (parseInt(value) > 25 ? 25 : parseInt(value)),
    },
  },
  id: {
    in: ["query"],
    customSanitizer: {
      options: (value, { path }) => bookListQuerySanitizer(path, value, true),
    },
    errorMessage: "passed id wrong",
  },
  title: {
    in: ["query"],
    customSanitizer: {
      options: (value, { path }) => bookListQuerySanitizer(path, value, false),
    },
    errorMessage: "passed title is wrong",
  },
  author: {
    in: ["query"],
    customSanitizer: {
      options: (value, { path }) => bookListQuerySanitizer(path, value, false),
    },
    errorMessage: "passed author value is wrong",
  },
  lang: {
    in: ["query"],
    customSanitizer: {
      options: (value, { path }) => bookListQuerySanitizer(path, value, false),
    },
    errorMessage: "passed lang value is wrong",
  },
  topic: {
    in: ["query"],
    customSanitizer: {
      options: (value, { path }) => bookListQuerySanitizer(path, value, false),
    },
    errorMessage: "passed topic value wrong",
  },
  "mime-type": {
    in: ["query"],
    customSanitizer: {
      options: (value, { path }) => bookListQuerySanitizer(path, value, false),
    },
    errorMessage: "passed mimeType is wrong",
  },
};

export default {
  bookListQuery,
};
