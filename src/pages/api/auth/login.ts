import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "../../../lib/jwt";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../../lib/data-source";
import { User } from "../../../entity/User";
import { withDatabase } from "../../../middleware/withDatabase";

type RequestBody = {
  emailOrName: string;
  password: string;
};

type ResponseData = {
  message: string;
  success: boolean;
  token?: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Méthode non autorisée", success: false });
  }

  try {
    const { emailOrName, password } = req.body as RequestBody;

    // Vérifier si l'utilisateur existe (par email ou nom)
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: [{ email: emailOrName }, { name: emailOrName }],
    });

    if (!user) {
      console.log("Email ou nom d'utilisateur incorrect");
      return res.status(401).json({
        message: "Email ou nom d'utilisateur incorrect",
        success: false,
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("mot de passe invalide");
      return res.status(401).json({
        message: "Mot de passe incorrect",
        success: false,
      });
    }

    // Générer un token JWT
    const token = generateToken(user.id.toString());

    return res.status(200).json({
      message: "Connexion réussie",
      success: true,
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return res.status(500).json({
      message: "Erreur lors de la connexion",
      success: false,
    });
  }
}

export default withDatabase(handler);
