import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../service/User.service";
import { withDatabase } from "../../../middleware/withDatabase";

// Types pour les requêtes
export type RegisterRequest = {
  email: string;
  name: string;
  password: string;
};

// Types pour les réponses
export type RegisterResponse = {
  message: string;
  success: boolean;
  token?: string;
  userId?: number;
};

// Handler pour l'inscription
async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Méthode non autorisée", success: false });
  }

  try {
    const { email, name, password } = req.body as RegisterRequest;
    const userService = new UserService();

    const { token, userId } = await userService.register(email, name, password);

    return res.status(200).json({
      message: "Inscription réussie",
      success: true,
      token,
      userId,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Erreur lors de l'inscription",
      success: false,
    });
  }
}

export default withDatabase(registerHandler);
