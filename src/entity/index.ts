import { Tenant } from "./Tenant";
import { User } from "./User";

// Exportez toutes les entités ici
export const entities = [
  Tenant,
  User,
  // Ajoutez ici vos futures entités
  // Par exemple:
  // Product,
  // Order,
  // etc.
];

// Exportez aussi les entités individuellement pour pouvoir les utiliser directement
export { Tenant, User };
