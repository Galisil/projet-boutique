import type { NextApiRequest, NextApiResponse } from "next";
import { TenantService } from "../service/Tenant.service";
import { withDatabase } from "../../../middleware/withDatabase";

// type pour les requêtes
export type CreateTenantRequest = {
  name: string;
  password: string;
  userId: number;
};

// Types pour les réponses
export type CreateTenantResponse = {
  message: string;
  success: boolean;
};

// Handler pour l'inscription
async function createTenantHandler(
  req: NextApiRequest,
  res: NextApiResponse<CreateTenantResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Méthode non autorisée", success: false });
  }

  try {
    const { name, password, userId } = req.body as CreateTenantRequest;
    const tenantService = new TenantService();

    await tenantService.register(name, password, userId);

    return res.status(200).json({
      message: "Inscription réussie",
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la boutique:", error);
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de la boutique",
      success: false,
    });
  }
}

export default withDatabase(createTenantHandler);
