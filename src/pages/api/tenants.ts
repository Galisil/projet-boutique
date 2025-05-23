import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabaseConnection } from "@/lib/db";
import { Tenant } from "@/entity/Tenant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dataSource = await getDatabaseConnection();
  const tenantRepository = dataSource.getRepository(Tenant);

  switch (req.method) {
    case "GET":
      try {
        const tenants = await tenantRepository.find();
        res.status(200).json(tenants);
      } catch (error) {
        res
          .status(500)
          .json({ error: "Erreur lors de la récupération des tenants" });
      }
      break;

    case "POST":
      try {
        const newTenant = new Tenant();
        newTenant.name = req.body.name;
        newTenant.creationDate = new Date();
        const savedTenant = await tenantRepository.save(newTenant);
        res.status(201).json(savedTenant);
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création du tenant" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
