import { getDatabaseConnection, stopDatabaseConnection } from "../lib/db";
import { AppDataSource } from "../lib/data-source";
import { Tenant } from "../modules/tenants/database/Tenant";
import type { NextApiRequest, NextApiResponse } from "next";

// Fonction helper pour tester les API routes Next.js
export async function testApiRoute(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => unknown | Promise<unknown>,
  method: string = "GET",
  body?: Record<string, unknown>,
  query?: Record<string, string | string[]>
) {
  // Créer des objets mock simples pour les tests
  const req = {
    method,
    body,
    query,
    headers: {},
  } as NextApiRequest;

  let responseData: unknown = null;
  let statusCode = 200;

  const res = {
    status: (code: number) => {
      statusCode = code;
      return {
        json: (data: unknown) => {
          responseData = data;
          return res;
        },
      };
    },
    json: (data: unknown) => {
      responseData = data;
      return res;
    },
  } as unknown as NextApiResponse;

  await handler(req, res);

  return {
    data: responseData,
    statusCode,
  };
}

// Avant tous les tests, on se connecte à la base de données
beforeAll(async () => {
  await getDatabaseConnection();
});

// Avant chaque test, on nettoie la base de données
beforeEach(async () => {

  // Désactiver temporairement les contraintes de clés étrangères
  await AppDataSource.query("SET session_replication_role = replica;");

  // Nettoyer toutes les tables dans l'ordre correct
  await AppDataSource.query('TRUNCATE TABLE "user_tenants" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "user" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "tenant" CASCADE');

  // Réactiver les contraintes de clés étrangères
  await AppDataSource.query("SET session_replication_role = DEFAULT;");

  // Créer le tenant Public
  const tenantRepository = AppDataSource.getRepository(Tenant);
  const publicTenant = tenantRepository.create({ name: "Public" });
  await tenantRepository.save(publicTenant);

});

// Après tous les tests, on ferme la connexion
afterAll(async () => {
  await stopDatabaseConnection();
});

// Fonction pour nettoyer la base de données (à appeler manuellement si nécessaire)
export async function cleanDatabase() {

  // Désactiver temporairement les contraintes de clés étrangères
  await AppDataSource.query("SET session_replication_role = replica;");

  // Nettoyer toutes les tables dans l'ordre correct (d'abord les tables de jointure)
  await AppDataSource.query('TRUNCATE TABLE "user_tenants" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "user" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "tenant" CASCADE');

  // Réactiver les contraintes de clés étrangères
  await AppDataSource.query("SET session_replication_role = DEFAULT;");

  // Créer le tenant Public
  const tenantRepository = AppDataSource.getRepository(Tenant);
  const publicTenant = tenantRepository.create({ name: "Public" });
  await tenantRepository.save(publicTenant);

}

export { AppDataSource };
