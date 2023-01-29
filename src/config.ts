import * as dotenv from "dotenv";
dotenv.config();

// export interface ServerConfig {
//   readonly port: string;
//   readonly name: string;
//   readonly env: string;
// }
// export interface SequelizeConfig {
//   readonly connectionUri: string;
// }
// export interface Config {
//   readonly service: ServerConfig;
//   readonly sequelize: SequelizeConfig;
// }
export default {
  server: {
    port: process.env.SERVER_PORT as string,
    name: process.env.SERVER_NAME as string,
    env: process.env.SERVER_ENV as string,
  },
  api: {
    version: process.env.API_VERSION as string,
  },
  sequelize: {
    connectionUri: process.env.DB_CONNECTION_URI as string,
  },
  db: {
    connectionUri: process.env.DB_CONNECTION_URI as string,
  },
};
