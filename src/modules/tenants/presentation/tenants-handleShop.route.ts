import type { NextApiRequest, NextApiResponse } from "next";
import { TenantService } from "../service/Tenant.service";
import { withDatabase } from "../../../middleware/withDatabase";

// Types pour les requêtes
export type GetShopRequest = {
  userId: number;
};

// Types pour les réponses
export type GetShopResponse = {
  message: string;
  success: boolean;
  shop: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

// Handler pour récupérer une boutique spécifique
async function handleShopHandler(
  req: NextApiRequest,
  res: NextApiResponse<GetShopResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Méthode non autorisée",
      success: false,
      shop: null,
    });
  }

  try {
    const { id } = req.query as { id: string };
    const { userId } = req.query as { userId: string };

    // Validation des données requises
    if (!id || !userId) {
      return res.status(400).json({
        message: "ID de boutique et ID utilisateur requis",
        success: false,
        shop: null,
      });
    }

    const tenantService = new TenantService();
    const shop = await tenantService.getShopByIdAndUserId(
      parseInt(id, 10),
      parseInt(userId, 10)
    );

    if (!shop) {
      return res.status(404).json({
        message: "Boutique non trouvée ou accès non autorisé",
        success: false,
        shop: null,
      });
    }

    return res.status(200).json({
      message: "Boutique récupérée avec succès",
      success: true,
      shop: {
        id: shop.id,
        name: shop.name,
        createdAt: shop.createdAt.toISOString(),
        updatedAt: shop.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la boutique:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de la récupération de la boutique",
      success: false,
      shop: null,
    });
  }
}

export default withDatabase(handleShopHandler);
