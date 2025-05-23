//fichier pour la configuration typeorm

import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "mdppgsql25",
  database: process.env.DB_NAME || "site-echoppe-onirique",
  synchronize: true,
  //logging: true,
  //synchronize: process.env.NODE_ENV !== "production", // Ne pas utiliser en production
  logging: process.env.NODE_ENV !== "production",
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});
