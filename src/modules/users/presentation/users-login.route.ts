import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "..//service/User.service";
import { withDatabase } from "../../../middleware/withDatabase";

// Types pour les requêtes
export type LoginRequest = {
  emailOrName: string;
  password: string;
};

// Types pour les réponses
export type LoginResponse = {
  message: string;
  success: boolean;
  token?: string;
};

// Handler pour la connexion
async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Méthode non autorisée", success: false });
  }

  try {
    const { emailOrName, password } = req.body as LoginRequest;

    // Validation des données requises
    if (!emailOrName || !password) {
      return res.status(400).json({
        message: "Email/nom d'utilisateur et mot de passe requis",
        success: false,
      });
    }

    const userService = new UserService();
    const token = await userService.login(emailOrName, password);

    return res.status(200).json({
      message: "Connexion réussie",
      success: true,
      token,
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

export default withDatabase(loginHandler);
