import { hashUserPassword, verifyToken } from "@/lib/utils/auth";
import { StatusCodes } from "http-status-codes";
import rateLimit from 'express-rate-limit';


export const verifyUserToken = async (req, res, next) => {
  const token = (req.cookies["authToken"] || req.headers["authorization"] || "").replace(/bearer\s*/i, "");
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Auth failed: No token provided" });
  }
  const decoded = await verifyToken(token);

  if (!decoded) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Auth failed: Invalid token" });
  }

  req.user = decoded;
  next();
};


export const addFakePasswordForUser = async (req, _, next) => {
  if (req.body) {
    req.body.password = "f@kePassword1";
  }
  next();
};

export const addFakeEmailForUser = async (req, _, next) => {
  if (req.body && !req.body.email) {
    req.body.email = `user-${Math.floor(10000 + Math.random() * 90000)}@fake.com`;
  }
  next();
};

export const userPasswordHashing = async (req, res, next) => {
  try {
    if (req.body) {
      req.body.password = await hashUserPassword(req.body.password);
    }
    next();
  } catch (e) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "User password hashing error" });
  }
};

export const deleteConfirmPassword = (req, _, next) => {
  const body = req.body;
  delete body.confirmPassword;
  req.body = body;
  next();
};

export const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: "Too many login attempts, please try again after 1 minute.",
  keyGenerator: (req) => {
    console.log("Rate limiter key:", req.ip);
    return req.ip;
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});


