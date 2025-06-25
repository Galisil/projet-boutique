import { testApiRoute } from "../../fixtures/setup";
import { testUser1, testUser2 } from "../../fixtures/mockData";
import registerHandler from "../../pages/api/auth/register";
import { UserService } from "../../modules/users/service/User.service";

// Type pour la réponse de login
type RegisterResponse = {
  success: boolean;
  message?: string;
  userId?: number;
  //token?: string;
};

describe("Tests de la route POST /api/auth/register", () => {

  it("devrait enregistrer un utilisateur dans la bdd avec valeurs entrées valides", async () => {
    const registerData = {
      email: testUser2.email,
      name: testUser2.name,
      password: testUser2.password,
    };

    const response = await testApiRoute(registerHandler, "POST", registerData);

    const data = response.data as RegisterResponse;
    expect(data.success).toBe(true);
    expect(data.userId).toBeDefined();
    // expect(data.token).toBeDefined();
  });

  // it("devrait retourner une erreur 401? si les mots de passe ne correspondent pas", async () => {
  //   const registerData = {
  //     emailOrName: testUser.email,
  //     password: "mauvaisMotDePasse",
  //   };

  //   const response = await testApiRoute(loginHandler, "POST", loginData);

  //   const data = response.data as LoginResponse;
  //   expect(data.success).toBe(false);
  //   expect(response.statusCode).toBe(401);
  // });

  it("devrait retourner une erreur 401 avec un email déjà pris", async () => {
    const userService = new UserService();
    await userService.register(testUser1.email, testUser1.name, testUser1.password);
    const registerData = {
      email: testUser1.email,
      name: testUser2.name,
      password: testUser2.password,
    };

    const response = await testApiRoute(registerHandler, "POST", registerData);

    const data = response.data as RegisterResponse;
    expect(data.success).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(data.message).toBe("Cet email est déjà utilisé");
  });
});

it("devrait retourner une erreur 401 avec un pseudo déjà pris", async () => {
  const userService = new UserService();
  await userService.register(testUser1.email, testUser1.name, testUser1.password);
  const registerData = {
    email: testUser2.email,
    name: testUser1.name,
    password: testUser2.password,
  };

  const response = await testApiRoute(registerHandler, "POST", registerData);

  const data = response.data as RegisterResponse;
  expect(data.success).toBe(false);
  expect(response.statusCode).toBe(400);
  expect(data.message).toBe("Ce nom d'utilisateur est déjà pris");
});

//faire un test pour vérifier que le mdp est bien hashé avant enregistrement
// genre password !== testUser2.password
