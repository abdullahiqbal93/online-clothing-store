import dotenv from 'dotenv';

dotenv.config();

export const env = {
  VERSION: "v1",
  NODE_ENV: process.env.NODE_ENV,
  HOST: "localhost",
  PORT: process.env.PORT,
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
  API_BASE_URL: process.env.API_BASE_URL,
  DB_URL: process.env.MONGO_URI,
  SALT_FACTOR: 10,
  PRIVATE_KEY_PATH: process.env.PRIVATE_KEY_PATH,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
};

export const SWAGGER_PATH = "docs";
export const API_PATH = `/api/${env.VERSION}/`;
