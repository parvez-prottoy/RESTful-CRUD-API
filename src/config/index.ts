import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 8000,
  dbConnectionString: process.env.DB_CONNECTION_STRING || "",
};

export const { port, dbConnectionString } = config;
