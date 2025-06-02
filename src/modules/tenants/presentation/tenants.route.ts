import type { NextApiRequest, NextApiResponse } from "next";
import { TenantService } from "../service/Tenant.service";
import { withDatabase } from "../../../middleware/withDatabase";
import { Tenant } from "../database/Tenant";

// Types pour les requêtes
export type CreateTenantRequest = {
  name: string;
};

export type UpdateTenantRequest = {
  name: string;
};

// Types pour les réponses
export type TenantResponse = {
  message: string;
  success: boolean;
  data?: Tenant | Tenant[] | null;
};

// Handler pour les tenants
async function tenantHandler(
  req: NextApiRequest,
  res: NextApiResponse<TenantResponse>
) {
  const tenantService = new TenantService();

  try {
    switch (req.method) {
      case "GET":
        if (req.query.id) {
          const tenant = await tenantService.getTenantById(
            Number(req.query.id)
          );
          return res.status(200).json({
            message: "Tenant récupéré avec succès",
            success: true,
            data: tenant,
          });
        } else {
          const tenants = await tenantService.getAllTenants();
          return res.status(200).json({
            message: "Tenants récupérés avec succès",
            success: true,
            data: tenants,
          });
        }

      case "POST":
        const { name } = req.body as CreateTenantRequest;
        const newTenant = await tenantService.createTenant(name);
        return res.status(201).json({
          message: "Tenant créé avec succès",
          success: true,
          data: newTenant,
        });

      case "PUT":
        if (!req.query.id) {
          return res.status(400).json({
            message: "ID du tenant requis",
            success: false,
          });
        }
        const { name: updatedName } = req.body as UpdateTenantRequest;
        const updatedTenant = await tenantService.updateTenant(
          Number(req.query.id),
          updatedName
        );
        return res.status(200).json({
          message: "Tenant mis à jour avec succès",
          success: true,
          data: updatedTenant,
        });

      case "DELETE":
        if (!req.query.id) {
          return res.status(400).json({
            message: "ID du tenant requis",
            success: false,
          });
        }
        await tenantService.deleteTenant(Number(req.query.id));
        return res.status(200).json({
          message: "Tenant supprimé avec succès",
          success: true,
        });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({
          message: `Méthode ${req.method} non autorisée`,
          success: false,
        });
    }
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Erreur serveur",
      success: false,
    });
  }
}

export default withDatabase(tenantHandler);
