//fichier pour la configuration typeorm

import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { entities } from "@/entity";

const config: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "mdppgsql25",
  database: process.env.DB_NAME || "site-echoppe-onirique",
  synchronize: true,
  logging: true,
  //synchronize: process.env.NODE_ENV !== "production", // Ne pas utiliser en production
  //logging: process.env.NODE_ENV !== "production",
  //entities: ["src/entity/**/*.ts"],
  entities: entities,
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
};

console.log("Configuration de la base de données:", {
  ...config,
  password: "****", // Masquer le mot de passe dans les logs
});

export const AppDataSource = new DataSource(config);
