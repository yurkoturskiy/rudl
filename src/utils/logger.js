import { pipe } from "ramda";

const log = require("loglevel");
const trace = logger => (...labels) => value => {
  logger.log.debug(logger.scope, ...labels, value);
  return value;
};

const setLog = scope => ({
  scope,
  log: log.getLogger(scope)
});

const setTrace = logger => ({
  ...logger,
  trace: trace(logger)
});

export default pipe(setLog, setTrace);
