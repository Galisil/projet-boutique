import { testApiRoute } from "../../fixtures/setup";
import { testUser1 } from "../../fixtures/mockData";
import loginHandler from "../../pages/api/auth/login";
import { UserService } from "../../modules/users/service/User.service";

// Type pour la réponse de login
type LoginResponse = {
  success: boolean;
  message?: string;
  userId?: number;
  token?: string;
};

describe("Tests de la route POST /api/auth/login", () => {
  beforeEach(async () => {
    // Créer un utilisateur avant chaque test de connexion
    const userService = new UserService();
    await userService.register(
      testUser1.email,
      testUser1.name,
      testUser1.password
    );
  });

  it("devrait connecter un utilisateur avec des identifiants valides", async () => {
    const loginData = {
      emailOrName: testUser1.email,
      password: testUser1.password,
    };

    const response = await testApiRoute(loginHandler, "POST", loginData);

    const data = response.data as LoginResponse;
    expect(data.success).toBe(true);
    expect(data.userId).toBeDefined();
    expect(data.token).toBeDefined();
  });

  it("devrait retourner une erreur 401 avec un mot de passe incorrect", async () => {
    const loginData = {
      emailOrName: testUser1.email,
      password: "mauvaisMotDePasse",
    };

    const response = await testApiRoute(loginHandler, "POST", loginData);

    const data = response.data as LoginResponse;
    expect(data.success).toBe(false);
    expect(response.statusCode).toBe(401);
  });

  it("devrait retourner une erreur 401 avec un email inexistant", async () => {
    const loginData = {
      emailOrName: "inexistant@test.com",
      password: testUser1.password,
    };

    const response = await testApiRoute(loginHandler, "POST", loginData);

    const data = response.data as LoginResponse;
    expect(data.success).toBe(false);
    expect(response.statusCode).toBe(401);
    expect(data.message).toBe("Email ou nom d'utilisateur incorrect");
  });
});
