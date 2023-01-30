# Description

REST API for fetching books from Project Gutenberg Data.

# Getting Started

## Running the app locally

- create `.env` file at root folder with following values

```
SERVER_PORT=5000
SERVER_NAME=gutenberg-rest-api
SERVER_ENV=development
API_VERSION=1
DB_CONNECTION_URI=<postgres connection string>
```

- `yarn install`
- `yarn dev`

##### The server should runnig at localhost 5000

## Hosting

A demo version is hosted on render.com at https://gutenberg-rest-api.onrender.com

## API

`GET /api/v1/books`

Query params:

```
id (integer, integer array) (optional)
lang (string, string array) (optional)
mime-type (string, string array) (optional)
topic (string, string array) (optional)
author (string, string array) (optional)
title (string, string array) (optional)
skip (integer, integer array) (mandatory)
pageSize (integer, integer array) (mandatory)
```

Response structure

- 200
  ```
  {
      "books": <list of books>,
      "pageInfo": {
          "totalCount": <total books for the query>
      }
  }
  ```
- Others
  ```
  {
      "message": <list of books>,
      "code": <internal error code, not sent in prod env>,
      "stack": <error stack, not sent in prod env>
  }
  ```
