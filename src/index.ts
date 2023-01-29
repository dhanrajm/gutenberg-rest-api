import express, { Application } from "express";
import config from "./config";
import routes from "./api/routes";
import DB from "./db";
import { errorFormatter, errorHandler, notFoundHandler } from "./helpers/error";

const app: Application = express();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  // init db
  await new DB().init();

  const baseUrl = `/api/v${config.api.version}`;
  // mount all routes on /api path
  app.use(`${baseUrl}`, routes);

  // format errors
  app.use(errorFormatter);

  // catch 404
  app.use(notFoundHandler);

  // log error in winston transports except when executing test suite
  // if (config.env !== "test") {
  //   app.use(expressWinston.errorLogger({ winstonInstance }));
  // }

  // error handler
  app.use(errorHandler);

  app.listen(config.server.port, () => {
    console.log(
      `[server]: Server is running at http://localhost:${config.server.port}`
    );
  });
} catch (error) {
  console.log(`Error occurred: ${error}`);
}
