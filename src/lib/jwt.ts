import jwt from "jsonwebtoken";

// La clé secrète devrait être dans les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET || "votre_clé_secrète";

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: "24h" } // Le token expire après 24h
  );
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    console.log(error);
    throw new Error("Token invalide");
  }
};
