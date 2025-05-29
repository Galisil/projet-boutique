import { NextApiHandler } from "next";
import { getDatabaseConnection } from "../lib/db";

export function withDatabase(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    try {
      // Initialiser la connexion à la base de données
      await getDatabaseConnection();

      // Continuer avec le handler original
      return handler(req, res);
    } catch (error) {
      console.error("Erreur de connexion à la base de données:", error);
      return res.status(500).json({
        message: "Erreur de connexion à la base de données",
        success: false,
      });
    }
  };
}
