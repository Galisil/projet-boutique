import type { NextApiRequest, NextApiResponse } from "next";
import { TenantService } from "../service/Tenant.service";
import { withDatabase } from "../../../middleware/withDatabase";

// Types pour les requêtes
export type ShopsListRequest = {
  userId: number;
};

// Types pour les réponses
export type ShopsListResponse = {
  message: string;
  success: boolean;
  shopsList: Array<{ id: number; name: string }> | null;
};

// Handler pour la connexion
async function shopsListDisplayHandler(
  req: NextApiRequest,
  res: NextApiResponse<ShopsListResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Méthode non autorisée",
      success: false,
      shopsList: null,
    });
  }

  try {
    const { userId } = req.query as { userId: string };

    // Validation des données requises
    if (!userId) {
      return res.status(400).json({
        message: "problème d'authentification. Veuillez vous connecter",
        success: false,
        shopsList: null,
      });
    }

    const tenantService = new TenantService();
    const tenants = await tenantService.getTenantsListByUserId(
      parseInt(userId, 10)
    );

    return res.status(200).json({
      message: "Liste des boutiques récupérée",
      success: true,
      shopsList: tenants,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des boutiques:", error);
    return res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de la récupération des boutiques",
      success: false,
      shopsList: null,
    });
  }
}

export default withDatabase(shopsListDisplayHandler);
