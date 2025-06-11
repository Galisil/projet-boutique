import { getDatabaseConnection, stopDatabaseConnection } from "../lib/db";
import { AppDataSource } from "../lib/data-source";
import supertest from "supertest";
import express from "express";
import { Tenant } from "../modules/tenants/database/Tenant";
import loginHandler from "../pages/api/auth/login";
import type { NextApiRequest, NextApiResponse } from "next";

let request: ReturnType<typeof supertest>;

// Avant tous les tests, on se connecte à la base de données
beforeAll(async () => {
  await getDatabaseConnection();

  // Créer une application Express pour les tests
  const app = express();
  app.use(express.json());

  // Adapter le handler Next.js pour Express
  app.post("/api/auth/login", (req, res) => {
    const nextReq = req as unknown as NextApiRequest;
    const nextRes = res as unknown as NextApiResponse;
    loginHandler(nextReq, nextRes);
  });

  request = supertest(app);
});

// Après tous les tests, on ferme la connexion
afterAll(async () => {
  await stopDatabaseConnection();
});

// Avant chaque test, on vide toutes les tables et on recrée le tenant Public
beforeEach(async () => {
  // Désactiver temporairement les contraintes de clés étrangères
  await AppDataSource.query("SET session_replication_role = replica;");

  // Nettoyer toutes les tables avec CASCADE
  await AppDataSource.query('TRUNCATE TABLE "user" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "tenant" CASCADE');

  // Réactiver les contraintes de clés étrangères
  await AppDataSource.query("SET session_replication_role = DEFAULT;");

  // Créer le tenant Public
  const tenantRepository = AppDataSource.getRepository(Tenant);
  const publicTenant = tenantRepository.create({ name: "Public" });
  await tenantRepository.save(publicTenant);
});

export { AppDataSource, request };
