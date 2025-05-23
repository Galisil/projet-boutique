import { AppDataSource } from "./data-source";

let isInitialized = false;

export async function getDatabaseConnection() {
  if (!isInitialized) {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      isInitialized = true;
      console.log("Connexion à la base de données établie");
    } catch (error) {
      console.error("Erreur lors de la connexion à la base de données:", error);
      throw error;
    }
  }
  return AppDataSource;
}

getDatabaseConnection();
