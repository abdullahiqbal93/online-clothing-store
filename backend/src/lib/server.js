import { getApiRouter } from '@/api/';
import { getOpenApiRouter } from "@/api/docs/open-api";
import { API_PATH, SWAGGER_PATH } from '@/lib/config';
import { morganMiddleware } from '@/lib/logger/morgan';
import { mainLogger } from '@/lib/logger/winston';
import { expressErrorHandler } from "@/lib/services/error";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import { env } from '@/lib/config';
// import { loginRateLimiter } from './middlewares/user-middleware';


morgan.token("body", (req) => {
  try {
    return JSON.stringify(req.body);
  } catch (e) {
    mainLogger.error(e);
    return req.body;
  }
});

export const getServer = () => {
  const app = express();


  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: env.CLIENT_BASE_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());

  // app.use(loginRateLimiter);
  // app.set("trust proxy", 1);

  app.use(morganMiddleware);
  app.use(API_PATH, getApiRouter());
  app.use(API_PATH + SWAGGER_PATH, getOpenApiRouter());

  app.get("/favicon.ico", (_, res) => res.status(StatusCodes.NO_CONTENT).send());

  app.get("/", (_, res) => {
    res.status(200).send({
      success: true,
      message: "Server is running",
      apiList: [
        {
          name: "API",
          endpoints: [
            {
              name: "API Status",
              url: `http://${env.HOST}:${env.PORT}${API_PATH}heartbeat`,
            },
            {
              name: "User",
              url: `http://${env.HOST}:${env.PORT}${API_PATH}user`,
            },
            {
              name: "Product",
              url: `http://${env.HOST}:${env.PORT}${API_PATH}product`,
            },
            {
              name: "Cart",
              url: `http://${env.HOST}:${env.PORT}${API_PATH}cart`,
            },
            {
              name: "Address",
              url: `http://${env.HOST}:${env.PORT}${API_PATH}address`,
            },
            {
              name: "Order",
              url: `http://${env.HOST}:${env.PORT}${API_PATH}order`,
            },
            {
              name: "Newsletter",
              url: `http://${env.HOST}:${env.PORT}${API_PATH}newsletter`,
            },
          ],
        },
        {
          name: "Swagger",
          url: `${env.HOST}:${env.PORT}${API_PATH}${SWAGGER_PATH}`,
        },
      ],
    });
  });

  app.all("*", function (_, res) {
    res.status(StatusCodes.NOT_FOUND).send({
      success: false,
      message: "404",
    });
  });

  app.use(expressErrorHandler);

  return app;
};
