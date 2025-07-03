import type { NextApiRequest, NextApiResponse } from "next";
import { TenantService } from "../service/Tenant.service";
import { withDatabase } from "../../../middleware/withDatabase";

// Types pour les requêtes
export type GetShopRequest = {
  userId: number;
};

export type CreateAdminRequest = {
  email: string;
  name: string;
  password: string;
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

export type CreateAdminResponse = {
  message: string;
  success: boolean;
  admin?: {
    id: number;
    email: string;
    name: string;
  };
};

// Handler pour récupérer une boutique spécifique et créer des administrateurs
async function handleShopHandler(
  req: NextApiRequest,
  res: NextApiResponse<GetShopResponse | CreateAdminResponse>
) {
  if (req.method === "GET") {
    // Logique existante pour GET
    return handleGetShop(req, res);
  } else if (req.method === "POST") {
    // Nouvelle logique pour POST (création d'administrateur)
    return handleCreateAdmin(req, res);
  } else {
    return res.status(405).json({
      message: "Méthode non autorisée",
      success: false,
      shop: null,
    });
  }
}

async function handleGetShop(
  req: NextApiRequest,
  res: NextApiResponse<GetShopResponse>
) {
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

async function handleCreateAdmin(
  req: NextApiRequest,
  res: NextApiResponse<CreateAdminResponse>
) {
  try {
    const { id } = req.query as { id: string };
    const { email, name, password } = req.body as CreateAdminRequest;

    // Validation des données requises
    if (!id || !email || !name || !password) {
      return res.status(400).json({
        message: "Toutes les données sont requises (email, name, password)",
        success: false,
      });
    }

    const tenantService = new TenantService();
    const admin = await tenantService.createAdminForShop(
      parseInt(id, 10),
      email,
      name,
      password
    );

    return res.status(201).json({
      message: "Administrateur créé avec succès",
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'administrateur:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de l'administrateur",
      success: false,
    });
  }
}

export default withDatabase(handleShopHandler);
