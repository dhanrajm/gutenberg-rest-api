import debug from "debug";

const logger = debug("gutenberg-rest-api");

export default function (name: string) {
  return logger.extend(name);
}
