import { AppDataSource } from "../../../lib/data-source";
import { Tenant } from "../database/Tenant";

export class TenantService {
  private tenantRepository = AppDataSource.getRepository(Tenant);

  async createTenant(name: string) {
    const newTenant = this.tenantRepository.create({
      name,
      creationDate: new Date(),
    });
    return await this.tenantRepository.save(newTenant);
  }

  async getAllTenants() {
    return await this.tenantRepository.find();
  }

  async getTenantById(id: number) {
    return await this.tenantRepository.findOne({ where: { id } });
  }

  async updateTenant(id: number, name: string) {
    const tenant = await this.getTenantById(id);
    if (!tenant) {
      throw new Error("Tenant non trouvé");
    }
    tenant.name = name;
    return await this.tenantRepository.save(tenant);
  }

  async deleteTenant(id: number) {
    const tenant = await this.getTenantById(id);
    if (!tenant) {
      throw new Error("Tenant non trouvé");
    }
    return await this.tenantRepository.remove(tenant);
  }
}
