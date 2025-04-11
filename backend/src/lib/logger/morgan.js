import morgan from "morgan";
import { logFormat, streamFunc } from "@/lib/logger/helper";

export const morganMiddleware = morgan(logFormat, {
  stream: streamFunc(),
  skip: () => process.env.NODE_ENV === "test"
}
);

