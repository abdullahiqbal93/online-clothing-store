import winston from "winston";
import { getDebugLog, getErrorLog, getInfoLog, getSuccessLog, getWarnLog, levels } from "@/lib/logger/helper";
import { LEVEL, MESSAGE, SPLAT } from "triple-beam";

// const maskPassword = (password) => password ? '*'.repeat(password.length) : '[HIDDEN]';

const prettyPrintWithColor = () =>
  winston.format.printf((message) => {
    const stripped = Object.assign({}, message);

    delete stripped[LEVEL];
    delete stripped[MESSAGE];
    delete stripped[SPLAT];

    // if (stripped.body && stripped.body.password) {
    //   stripped.body.password = maskPassword(stripped.body.password);
    // }

    if (stripped.method === "GET" || stripped.method === "DELETE") {
      delete stripped.body;
    }
    switch (stripped.level) {
      case "error":
        return getErrorLog(stripped);
      case "success":
        return getSuccessLog(stripped);
      case "warn":
        return getWarnLog(stripped);
      case "debug":
        return getDebugLog(stripped);
      default:
        return getInfoLog(stripped);
    }
  });

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  prettyPrintWithColor(),
);

const transports = [new winston.transports.Console({ level: "debug" })];

export const mainLogger = winston.createLogger({
  levels,
  transports,
  format,
});