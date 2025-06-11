import { AppDataSource } from "./data-source";

let isInitialized = false;

const getDatabaseConnection = async() =>{
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

const stopDatabaseConnection = async() => {
  if (isInitialized && AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    isInitialized = false;
    console.log("Connexion à la base de données fermée");
  }
}
export {getDatabaseConnection, stopDatabaseConnection}
