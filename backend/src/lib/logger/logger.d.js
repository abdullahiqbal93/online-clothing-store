import chalk from "chalk";

export const logNames = {
  db: {
    error: "DB ERROR",
    success: "DB SUCCESS",
    info: "DB INFO",
    debug: "DB DEBUG",
    warn: "DB WARNING",
  },
  http: {
    error: "HTTP ERROR",
    success: "HTTP SUCCESS",
    info: "HTTP INFO",
    debug: "HTTP DEBUG",
    warn: "HTTP WARNING",
  },
  validation: {
    success: "VALIDATION SUCCESS",
    error: "VALIDATION ERROR",
    warn: "VALIDATION WARNING",
  },
  app: {
    error: "APP ERROR",
    info: "APP INFO",
    debug: "APP DEBUG",
    warn: "APP WARNING",
  },
};


export const MorganMessage = {
  body: undefined,
  query: undefined,
  params: undefined,
  validation: undefined,
  method: undefined, 
  url: undefined, 
  status: "", 
  responseTime: undefined, 
  remote: undefined, 
  contentLength: undefined, 
  agent: undefined, 
  level: "",
  stack: undefined, 
  name: undefined, 
  message: "", 
  timestamp: "", 
};

export const MessageBuilderFunc = (message, pad = "") => {
  return message;
};

export const SegmentFunc = (segment = chalk, title = chalk) => {
  return (message, pad = "") => {
    return segment(`${pad}${message}${pad}`);
  };
};

export const ColorBuilderFunc = (segmentBuilder, titleBuilder) => {
  return (message) => {
    return `${segmentBuilder(message)} ${titleBuilder(message)}`;
  };
};