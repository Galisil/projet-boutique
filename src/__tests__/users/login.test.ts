import { AppDataSource, request } from "../../fixtures/setup";
import { testUser } from "../../fixtures/mockData";
import { UserService } from "../../modules/users/service/User.service";
//import { User } from "../../modules/users/database/User";
import { Tenant } from "../../modules/tenants/database/Tenant";
import "../../fixtures/setup"; //a priori à importer ds tous les fichiers de test

describe("Tests de connexion", () => {
  it("devrait connecter un utilisateur avec des identifiants valides", async () => {
    // Récupérer le tenant Public
    const tenantRepository = AppDataSource.getRepository(Tenant);
    const publicTenant = await tenantRepository.findOne({
      where: { name: "Public" },
    });

    if (!publicTenant) {
      throw new Error("Le tenant Public n'existe pas");
    }

    // Créer un utilisateur via le service
    const userService = new UserService();
    const token = await userService.register(
      testUser.email,
      testUser.name,
      testUser.password
    );

    // Tester la connexion
    const loginToken = await userService.login(
      testUser.email,
      testUser.password
    );

    expect(loginToken).toBeDefined();
    expect(typeof loginToken).toBe("string");
  });

  describe("Tests d'API de connexion", () => {
    it("devrait retourner un token JWT lors de la connexion via l'API", async () => {
      // Créer d'abord un utilisateur via le service
      const userService = new UserService();
      await userService.register(
        testUser.email,
        testUser.name,
        testUser.password
      );

      // Tester la connexion via l'API
      const response = await request.post("/api/auth/login").send({
        emailOrName: testUser.email,
        password: testUser.password,
      });

      // Vérifier la réponse
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    it("devrait retourner une erreur 401 avec des identifiants invalides", async () => {
      const response = await request.post("/api/auth/login").send({
        emailOrName: "invalid@test.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    it("devrait retourner une erreur 400 avec des données manquantes", async () => {
      const response = await request.post("/api/auth/login").send({
        emailOrName: testUser.email,
        // password manquant intentionnellement
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe(
        "Email/nom d'utilisateur et mot de passe requis"
      );
    });
  });
});
