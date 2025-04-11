import * as fs from "node:fs/promises";
import { env } from "@/lib/config.js";
import { JWTError } from "@/lib/utils/error-handle.js";
import { mainLogger } from "@/lib/logger/winston.js";

export const getPKCS8PrivateKey = async () => {
  try {
    return await fs.readFile(env.PRIVATE_KEY_PATH, "utf8");
  } catch (error) {
    mainLogger.error("Error reading private key:", error);
    throw new JWTError("Error reading private key");
  }
};