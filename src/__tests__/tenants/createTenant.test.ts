import { testApiRoute } from "../../fixtures/setup";
import { testUser1, testTenant1, testTenant2 } from "../../fixtures/mockData";
import createTenantHandler from "../../pages/api/tenants/createShop";
import { UserService } from "../../modules/users/service/User.service";
import { TenantService } from "../../modules/tenants/service/Tenant.service";
import { AppDataSource } from "../../fixtures/setup";
import { Tenant } from "../../modules/tenants/database/Tenant";
// Type pour la réponse de création de tenant
type CreateTenantResponse = {
  success: boolean;
  message?: string;
  tenantId?: number;
};

describe("Tests de la route POST /api/tenants/createShop", () => {
  let userId: number;

  beforeEach(async () => {
    // Créer un utilisateur pour le test
    const userService = new UserService();

    // Créer l'utilisateur avec testUser1
    const userResult = await userService.register(
      testUser1.email,
      testUser1.name,
      testUser1.password
    );

    userId = userResult.userId;
  });

  it("devrait enregistrer en bdd un nouveau tenant dont les entrées sont valides", async () => {
    const registerData = {
      name: testTenant1.name,
      password: testTenant1.password,
      userId: userId,
    };

    const response = await testApiRoute(
      createTenantHandler,
      "POST",
      registerData
    );

    const data = response.data as CreateTenantResponse;
    expect(data.success).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(data.message).toBe("Inscription réussie");
  });

  it("devrait retourner une erreur 400 avec un nom de boutique déjà pris", async () => {
    // Créer d'abord un tenant avec testTenant2
    const tenantService = new TenantService();
    await tenantService.register(
      testTenant1.name,
      testTenant1.password,
      userId
    );

    // Essayer de créer un autre tenant avec le même nom
    const registerData = {
      name: testTenant1.name, // Même nom que celui créé ci-dessus
      password: testTenant2.password,
      userId: userId,
    };

    const response = await testApiRoute(
      createTenantHandler,
      "POST",
      registerData
    );

    const data = response.data as CreateTenantResponse;
    expect(data.success).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(data.message).toBe("Ce nom de boutique est déjà pris !");
  });

  it("devrait retourner une erreur 400 avec un mot de passe trop court", async () => {
    const registerData = {
      name: testTenant1.name, // Même nom que celui créé ci-dessus
      password: "123",
      userId: userId,
    };

    const response = await testApiRoute(
      createTenantHandler,
      "POST",
      registerData
    );

    const data = response.data as CreateTenantResponse;
    expect(data.success).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(data.message).toBe(
      "Le mot de passe doit contenir au moins 6 caractères."
    );
  });

  it("devrait retourner une erreur 400 si le champ 'nom' du formulaire est vide", async () => {
    const registerData = {
      name: "",
      password: testTenant1.password,
      userId: userId,
    };

    const response = await testApiRoute(
      createTenantHandler,
      "POST",
      registerData
    );

    const data = response.data as CreateTenantResponse;
    console.log("MyLog: ", data);
    expect(data.success).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(data.message).toBe("Un nom de boutique est requis.");
  });

  it("devrait retourner une erreur 400 si le mot de passe n'est pas hashé en bdd", async () => {
    const tenantRepository = AppDataSource.getRepository(Tenant);
    const registerData = {
      name: testTenant1.name,
      password: testTenant1.password,
      userId: userId,
    };

    const response = await testApiRoute(
      createTenantHandler,
      "POST",
      registerData
    );
    const data = response.data as CreateTenantResponse;

    const savedData = await tenantRepository.findOne({
      where: { id: data.tenantId },
    });
    expect(savedData).not.toBeNull();
    expect(savedData!.password).not.toBe(testTenant1.password);
  });
});

// faire un test pour vérifier que le mdp est bien hashé avant enregistrement
// genre password !== testTenant.password
