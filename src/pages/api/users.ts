import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabaseConnection } from "@/lib/db";
import { User } from "@/entity/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const dataSource = await getDatabaseConnection();
    const userRepository = dataSource.getRepository(User);

    switch (req.method) {
      case "GET":
        try {
          const users = await userRepository.find();
          res.status(200).json(users);
        } catch (error) {
          console.error("Erreur lors de la récupération des users:", error);
          res
            .status(500)
            .json({ error: "Erreur lors de la récupération des users" });
        }
        break;

      case "POST":
        try {
          const newUser = new User();
          newUser.name = req.body.name;
          newUser.email = req.body.email;
          newUser.password = req.body.password;
          const savedUser = await userRepository.save(newUser);
          res.status(201).json(savedUser);
        } catch (error) {
          console.error("Erreur lors de la création du user:", error);
          res.status(500).json({ error: "Erreur lors de la création du user" });
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    res.status(500).json({ error: "Erreur de connexion à la base de données" });
  }
}
