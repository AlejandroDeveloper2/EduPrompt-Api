import dotenv from "dotenv";

dotenv.config();

/** Constante con la configuración y variables de entorno necesarias para el proyecto */
export const config = {
  PORT: process.env.PORT || 3000,
  LOCAL_MONGO_DB_URI: process.env.LOCAL_MONGO_DB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  NODE_MAILER_USER: process.env.NODE_MAILER_USER || "",
  NODE_MAILER_PASSWORD: process.env.NODE_MAILER_PASSWORD || "",
  ADMIN_USER: process.env.ADMIN_USER || "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
  OPEN_IA_API_KEY: process.env.OPEN_IA_API_KEY || "",
  GROQ_IA_API_KEY: process.env.GROQ_IA_API_KEY || "",
  HF_TOKEN: process.env.HF_TOKEN || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_SECRET_KEY: process.env.PAYPAL_SECRET_KEY || "",
  PAYPAL_API_URL: process.env.PAYPAL_API_URL || "",
  PAYPAL_RETURN_URL: process.env.PAYPAL_RETURN_URL || "",
};
