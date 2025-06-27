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

    return user.tenants;
  }

  // // Méthode alternative utilisant QueryBuilder pour plus de flexibilité
  // async getTenantsByUserIdWithQueryBuilder(userId: number): Promise<Tenant[]> {
  //   const tenants = await this.tenantRepository
  //     .createQueryBuilder("tenant")
  //     .innerJoin("tenant.users", "user")
  //     .where("user.id = :userId", { userId })
  //     .getMany();

  //   return tenants;
  // }

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

    // Sauvegarder le nouveau tenant
    await this.tenantRepository.save(newTenant);

    // // Ajouter la relation many-to-many
    // await AppDataSource.createQueryBuilder()
    //   .relation(User, "tenants")
    //   .of(user)
    //   .add(newTenant);

    // Récupérer la liste des tenants de l'utilisateur
    const shopsList = await this.getTenantsByUserId(userId);
    console.log("TENANTS BY USERID: ", shopsList);

    return { newTenant, shopsList };
  }
}

// //solution méthodes suppp par cursor, avec query builder :
// // Vérifier si un utilisateur appartient à un tenant
// async userBelongsToTenant(userId: number, tenantId: number): Promise<boolean> {
//   const count = await this.tenantRepository
//     .createQueryBuilder("tenant")
//     .innerJoin("tenant.users", "user")
//     .where("user.id = :userId", { userId })
//     .andWhere("tenant.id = :tenantId", { tenantId })
//     .getCount();

//   return count > 0;
// }

// // Ajouter un utilisateur à un tenant existant
// async addUserToTenant(userId: number, tenantId: number): Promise<void> {
//   const user = await this.userRepository.findOneBy({ id: userId });
//   const tenant = await this.tenantRepository.findOneBy({ id: tenantId });

//   if (!user || !tenant) {
//     throw new Error("Utilisateur ou tenant non trouvé");
//   }

//   await AppDataSource.createQueryBuilder()
//     .relation(User, "tenants")
//     .of(user)
//     .add(tenant);
// }
