import { AppDataSource } from "../../../lib/data-source";
import { Tenant } from "../database/Tenant";
import { User } from "../../users/database/User";
import bcrypt from "bcrypt";

export class TenantService {
  private tenantRepository = AppDataSource.getRepository(Tenant);
  private userRepository = AppDataSource.getRepository(User);
  async register(name: string, password: string, userId: number) {
    if (!password) {
      throw new Error("Un mot de passe est requis pour créer une boutique.");
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

    await AppDataSource.createQueryBuilder()
      .relation(User, "tenants")
      .of(user)
      .add(newTenant);

    return newTenant;
  }
}
