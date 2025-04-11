import { connect } from "mongoose";
import { GenericContainer } from "testcontainers";
import { mainLogger } from "@/lib/logger/winston.js";

export const getClientAndDB = async (name = "mongo") => {
  try {
    const container = await new GenericContainer("mongo:latest")
      .withName(name)
      .withExposedPorts(27017, 27017)
      .withDefaultLogDriver()
      .start();

    const URL = `${container.getHost()}:${container.getMappedPort(27017)}`;
    const client = await connect(`mongodb://${URL}`);
    mainLogger.info("Test database connected successfully.");
    return { client, container };
  } catch (error) {
    mainLogger.error("Error connecting to test database:", error);
  }
};