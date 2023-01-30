import express, { Application } from "express";
import morgan from "morgan";
import config from "./config";
import routes from "./api/routes";
import DB from "./db";
import { errorHandler, notFoundHandler } from "./helpers/error";
import logger from "./helpers/logger";

const log = logger("main");

const app: Application = express();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  // init db
  log("initializing database");
  await new DB().init();
  log("initialized database");

  const baseUrl = `/api/v${config.api.version}`;
  // mount all routes on /api path
  app.use(`${baseUrl}`, routes);

  // catch 404
  app.use(notFoundHandler);

  // use morgan to log http request and stream debug.js handler
  app.use(
    morgan("combined", {
      stream: {
        write: function (msg: any) {
          log.extend("morgan")(msg);
        },
      },
    })
  );

  // error handler
  app.use(errorHandler);

  app.listen(config.server.port, () => {
    log(`Server is running at http://localhost:${config.server.port}`);
  });
} catch (error) {
  console.log(`Error occurred: ${error}`);
}
