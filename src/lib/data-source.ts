//fichier pour la configuration typeorm

import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { entities } from "../modules/allEntities"; //pointe vers index.ts de dir 'entity' pour regrouper toutes les entities

const isTest = process.env.NODE_ENV === "test";

const config: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "mdppgsql25",
  database: isTest
    ? "site-echoppe-onirique-test"
    : process.env.DB_NAME || "site-echoppe-onirique",
  synchronize: true,
  logging: true,
  entities: entities,
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
};

console.log("Configuration de la base de données:", {
  ...config,
  password: "****", // Masquer le mot de passe dans les logs
  database: isTest ? "site-echoppe-onirique-test" : config.database,
});

export const AppDataSource = new DataSource(config);
