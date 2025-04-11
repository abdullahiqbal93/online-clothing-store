import { env } from "@/lib/config.js";
import { handleError } from "@/lib/utils/error-handle.js";
import { getPKCS8PrivateKey } from "@/lib/utils/keypair.js";
import { compare, genSalt, hash } from "bcryptjs";
import { SignJWT, importPKCS8, jwtVerify } from "jose";
import { mainLogger } from "@/lib/logger/winston.js";


const algorithm = "RS256";

export const hashUserPassword = async (password) => {
  try {
    const salt = await genSalt(env.SALT_FACTOR);
    return await hash(password, salt);
  } catch (error) {
    mainLogger.error("Error hashing user password:", error);
  }
};

export const compareUserPassword = async (password, hash) => {
  try {
    return await compare(password, hash);
  } catch (error) {
    mainLogger.error("Error comparing user password:", error);
  }
};

export const generateToken = async (payload) => {
  try {
    const pkcs8 = await getPKCS8PrivateKey();
    const pk = await importPKCS8(pkcs8, algorithm);
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: algorithm, publicKey: true })
      .setExpirationTime("1d")
      .setIssuedAt()
      .sign(pk);
  } catch (error) {
    mainLogger.error("Error generating token:", error);
    return handleError(error);
  }
};

export const verifyToken = async (token) => {
  try {
    const pkcs8 = await getPKCS8PrivateKey();
    const pk = await importPKCS8(pkcs8, algorithm);
    return await jwtVerify(token, pk);
  } catch (error) {
    mainLogger.error("Error verifying token:", error);
    return null;
  }
};

