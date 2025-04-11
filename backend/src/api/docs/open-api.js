import { generateOpenAPIDocument } from "@/lib/open-api-generator";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import swaggerUi from "swagger-ui-express";

export const getOpenApiRouter = () => {
  const router = Router();

  const options = {
    validatorUrl: null,
    oauth: {
      clientId: "",
      clientSecret: "",
      change: "",
      state: "",
      additionalQueryStringParams: { test: "123" },
      useBasicAuthenticationWithAccessCodeGrant: true,
      usePkceWithAuthorizationCodeGrant: true,
    },
  };

  router.get("/json", async (_, response) => {
    const docs = await generateOpenAPIDocument();
    response.setHeader("Content-Type", "application/json");
    response.status(StatusCodes.OK).send(docs);
  });

  router.use(
    "/",
    swaggerUi.serve,
    async (_, response, next) => {
      const docs = await generateOpenAPIDocument();
      response.setHeader("Content-Security-Policy", "'connect-src' ''");
      swaggerUi.setup(docs, undefined, options)(_, response, next);
    }
  );

  return router;
};