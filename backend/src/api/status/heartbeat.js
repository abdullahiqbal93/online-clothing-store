import { createSuccessResponse, createSuccessResponseForSwagger } from "@/lib/services/success";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";


export const getHeartBeatRegistry = () => {
  const heartBeatRegistry = new OpenAPIRegistry();

  heartBeatRegistry.registerPath({
    method: "get",
    path: "/heartbeat",
    tags: ["Heart Beat"],
    responses: createSuccessResponseForSwagger(z.null()),
  });

  return heartBeatRegistry;
};

export const heartbeat = (router) => {
  router.get("/heartbeat", (_, response) => {
    return createSuccessResponse(response, "API is running healthy", StatusCodes.OK);
  });
  return router;
};
