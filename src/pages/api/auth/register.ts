import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "../../../lib/jwt";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../../lib/data-source";
import { User } from "../../../entity/User";
import { withDatabase } from "../../../middleware/withDatabase";

type RequestBody = {
  email: string;
  name: string;
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
    const { email, name, password } = req.body as RequestBody;

    // Vérifier si l'email existe déjà
    const userRepository = AppDataSource.getRepository(User);
    const existingEmail = await userRepository.findOne({ where: { email } });

    if (existingEmail) {
      return res.status(400).json({
        message: "Cet email est déjà utilisé",
        success: false,
      });
    }
    const existingName = await userRepository.findOne({ where: { name } });
    if (existingName) {
      return res.status(400).json({
        message: "Ce nom d'utilisateur est déjà pris",
        success: false,
      });
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer l'utilisateur dans la base de données
    const newUser = userRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    await userRepository.save(newUser);

    // Générer un token JWT
    const token = generateToken(newUser.id.toString());

    return res.status(200).json({
      message: "Inscription réussie",
      success: true,
      token,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(500).json({
      message: "Erreur lors de l'inscription",
      success: false,
    });
  }
}

export default withDatabase(handler);
