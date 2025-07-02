import { testApiRoute } from "../../fixtures/setup";
import { testUser1, testTenant1 } from "../../fixtures/mockData";
import requiredPasswordHandler from "../../pages/api/warnings/requiredPassword";
import { UserService } from "../../modules/users/service/User.service";
import { TenantService } from "../../modules/tenants/service/Tenant.service";
import loginHandler from "../../pages/api/auth/login";
import { Tenant } from "../../modules/tenants/database/Tenant";
import type { LoginResponse } from "../../modules/users/presentation/users-login.route";

// Type pour la réponse de RequiredPassword
export type RequiredPasswordRequest = {
  shopId: number;
  userId: number;
  password: string;
};

type RequiredPasswordResponse = {
  success: boolean;
  message?: string;
};

describe("Tests de la route POST /api/warnings/requiredPassword", () => {
  let userId: number | null;
  let shopId: number | null;
  beforeEach(async () => {
    // Créer un utilisateur avant chaque test de connexion
    const userService = new UserService();
    await userService.register(
      testUser1.email,
      testUser1.name,
      testUser1.password
    );

    const loginData = {
      emailOrName: testUser1.email,
      password: testUser1.password,
    };

    const userResponse = await testApiRoute(loginHandler, "POST", loginData);
    const loginResponse = userResponse.data as LoginResponse;
    userId = loginResponse.userId || null;
    if (!userId) {
      throw new Error("userId non trouvé dans la réponse de login");
    }

    const tenantService = new TenantService();
    await tenantService.register(
      testTenant1.name,
      testTenant1.password,
      userId
    );

    const tenantData = await Tenant.findOne({
      where: { name: testTenant1.name },
    });
    shopId = tenantData?.id || null;
  });

  it("devrait permettre l'accès au shop si le mdp est valide", async () => {
    const passwordData = {
      shopId,
      userId,
      password: testTenant1.password,
    };

    const response = await testApiRoute(
      requiredPasswordHandler,
      "POST",
      passwordData
    );

    const data = response.data as RequiredPasswordResponse;
    expect(data.success).toBe(true);
  });

  it("devrait retourner une erreur 401 avec un mot de passe incorrect", async () => {
    const passwordData = {
      shopId,
      userId,
      password: "wrongPassword",
    };

    const response = await testApiRoute(
      requiredPasswordHandler,
      "POST",
      passwordData
    );

    const data = response.data as RequiredPasswordResponse;
    expect(data.success).toBe(false);
  });

  it("devrait retourner un userId n'appartenant pas au tenant", async () => {
    const passwordData = {
      shopId,
      userId: 0,
      password: testTenant1.password,
    };

    const response = await testApiRoute(
      requiredPasswordHandler,
      "POST",
      passwordData
    );

    const data = response.data as RequiredPasswordResponse;
    expect(data.success).toBe(false);
  });
});
