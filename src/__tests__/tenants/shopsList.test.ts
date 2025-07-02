import { testApiRoute } from "../../fixtures/setup";
import { TenantService } from "../../modules/tenants/service/Tenant.service";
import {
  testUser1,
  testUser2,
  testTenant1,
  testTenant2,
} from "../../fixtures/mockData";
import { UserService } from "../../modules/users/service/User.service";
import shopsListHandler from "../../pages/api/tenants/shopsList";

type ShopsListResponse = {
  message: string;
  success: boolean;
  shopsList: Array<string> | null;
  id: number;
};

describe("Tests de la route GET /api/tenants/shopsList", () => {
  let userId1: number;
  let userId2: number;

  beforeEach(async () => {
    // Créer un utilisateur pour le test
    const userService = new UserService();
    const tenantService = new TenantService();

    // Créer l'utilisateur avec testUser1 (celui qui aura ses tenants)
    const userResult1 = await userService.register(
      testUser1.email,
      testUser1.name,
      testUser1.password
    );

    userId1 = userResult1.userId;

    // Créer l'utilisateur avec testUser1 (celui qui aura ses tenants)
    const userResult2 = await userService.register(
      testUser2.email,
      testUser2.name,
      testUser2.password
    );

    userId2 = userResult2.userId;

    // Créer les tenants avec testTenant1 et testTenant2
    await tenantService.register(
      testTenant1.name,
      testTenant1.password,
      userId1
    );

    await tenantService.register(
      testTenant2.name,
      testTenant2.password,
      userId1
    );
    const user = await userService.getUserById(userId1);
    console.log("Tenants de l'utilisateur après création :", user?.tenants);
  });

  it("devrait supprimer le tenant 'Public' de la liste des shops de l'utilisateur", async () => {
    const response = await testApiRoute(
      shopsListHandler,
      "GET",
      undefined, // body
      { userId: userId1.toString() } // query parameters
    );

    const data = response.data as ShopsListResponse;
    expect(data.success).toBe(true);
    expect(data.shopsList).not.toContain("Public");
  });

  it("devrait afficher la liste des shops détenus par le user authentifié s'il en détient", async () => {
    const response = await testApiRoute(shopsListHandler, "GET", undefined, {
      userId: userId1.toString(),
    });
    console.log("response: ", response);

    const data = response.data as ShopsListResponse;
    console.log("data: ", data.shopsList);
    expect(data.success).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(data.shopsList?.length).toBeGreaterThan(0);
  });

  it("devrait retourner une liste vide si le user n'a pas de tenant", async () => {
    const response = await testApiRoute(shopsListHandler, "GET", undefined, {
      userId: userId2.toString(),
    });
    console.log("response: ", response);

    const data = response.data as ShopsListResponse;
    console.log("data: ", data);
    expect(data.success).toBe(true);
    expect(response.statusCode).toBe(200);
    // expect(data.shopsList?.length).toBe(0);
    // Vérifier que la liste est bien un tableau vide et non null
    expect(data.shopsList).toEqual([]);
  });
});
