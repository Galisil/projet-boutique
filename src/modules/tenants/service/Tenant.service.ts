import { AppDataSource } from "../../../lib/data-source";
import { Tenant } from "../database/Tenant";
import { User } from "../../users/database/User";
import bcrypt from "bcrypt";

export class TenantService {
  private tenantRepository = AppDataSource.getRepository(Tenant);
  private userRepository = AppDataSource.getRepository(User);

  // Méthode pour récupérer tous les tenants d'un utilisateur
  async getTenantsByUserId(userId: number): Promise<Tenant[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["tenants"], // Charge la relation many-to-many
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return user.tenants.filter((tenant) => tenant.name !== "Public");
  }

  async register(name: string, password: string, userId: number) {
    if (!name || name.trim() === "") {
      throw new Error("Un nom de boutique est requis.");
    }

    if (!password) {
      throw new Error("Un mot de passe est requis pour créer une boutique.");
    }

    if (password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
    }

    const existingName = await this.tenantRepository.findOne({
      where: { name },
    });
    if (existingName) {
      throw new Error("Ce nom de boutique est déjà pris !");
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTenant = this.tenantRepository.create({
      name,
      password: hashedPassword,
    });

    await this.tenantRepository.save(newTenant);
    // Charger l'utilisateur avec ses tenants existants
    const userWithTenants = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["tenants"],
    });
    if (!userWithTenants) {
      throw new Error("Utilisateur non trouvé");
    }
    if (!userWithTenants.tenants) {
      userWithTenants.tenants = [];
    }

    // Associer le nouveau tenant à l'utilisateur
    userWithTenants.tenants.push(newTenant);
    await this.userRepository.save(userWithTenants);
    // Récupérer la liste des tenants de l'utilisateur
    const shopsList = await this.getTenantsByUserId(userId);
    console.log("TENANTS BY USERID: ", shopsList);

    return { newTenant, shopsList };
  }
}
