import type { NextApiRequest, NextApiResponse } from "next";
import { withDatabase } from "../../../middleware/withDatabase";
import { TenantService } from "../service/Tenant.service";

// Types pour les requêtes
export type RequiredPasswordRequest = {
  shopId: number;
  userId: number;
  password: string;
};

// Types pour les réponses
export type RequiredPasswordResponse = {
  message: string;
  success: boolean;
};

// Handler pour la connexion
async function requiredPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse<RequiredPasswordResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Méthode non autorisée", success: false });
  }

  try {
    const { shopId, userId, password } = req.body as RequiredPasswordRequest;

    // Validation des données requises
    if (!password) {
      return res.status(400).json({
        message: "Mot de passe requis",
        success: false,
      });
    }

    const tenantService = new TenantService();
    await tenantService.login(shopId, userId, password);

    return res.status(200).json({
      message: "Connexion réussie",
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return res.status(401).json({
      message:
        error instanceof Error ? error.message : "Erreur lors de la connexion",
      success: false,
    });
  }
}

export default withDatabase(requiredPasswordHandler);
