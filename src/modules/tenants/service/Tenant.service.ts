import { AppDataSource } from "../../../lib/data-source";
import { Tenant } from "../database/Tenant";
import { User } from "../../users/database/User";
import bcrypt from "bcrypt";

interface TenantList {
  id: number;
  name: string;
}

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

  // Méthode pour récupérer la liste des tenants avec format simplifié
  async getTenantsListByUserId(userId: number): Promise<TenantList[]> {
    const tenants = await this.getTenantsByUserId(userId);
    return tenants.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
    }));
  }

  // Méthode pour récupérer une boutique spécifique et vérifier les permissions
  async getShopByIdAndUserId(
    shopId: number,
    userId: number
  ): Promise<Tenant | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["tenants"],
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérifier que l'utilisateur a accès à cette boutique
    const userShop = user.tenants.find((tenant) => tenant.id === shopId);

    if (!userShop) {
      return null; // L'utilisateur n'a pas accès à cette boutique
    }

    return userShop;
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

  async login(shopId: number, userId: number, password: string) {
    // Récupérer la boutique et vérifier l'accès de l'utilisateur
    const shop = await this.getShopByIdAndUserId(shopId, userId);

    if (!shop) {
      throw new Error("Boutique non trouvée ou accès non autorisé");
    }

    // Vérifier le mot de passe
    if (!shop.password) {
      throw new Error("Mot de passe de la boutique non configuré");
    }

    const isPasswordValid = await bcrypt.compare(password, shop.password);
    if (!isPasswordValid) {
      throw new Error("Mot de passe incorrect");
    }

    return { success: true, shop };
  }
}
