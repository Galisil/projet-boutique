import { testApiRoute } from "../../fixtures/setup";
import { testUser1, testUser2 } from "../../fixtures/mockData";
import registerHandler from "../../pages/api/auth/register";
import { UserService } from "../../modules/users/service/User.service";
import { AppDataSource } from "../../fixtures/setup";
import { User } from "../../modules/users/database/User";
import { invalidEmails } from "../../fixtures/mockData";

// Type pour la réponse de login
type RegisterResponse = {
  message: string;
  success: boolean;
  token?: string;
  userId?: number;
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
    console.log("data1: ", data);
    expect(data.success).toBe(true);
    expect(data.userId).toBeDefined();
  });

  it("devrait retourner une erreur 401 avec un email déjà pris", async () => {
    const userService = new UserService();
    await userService.register(
      testUser1.email,
      testUser1.name,
      testUser1.password
    );
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

  it("devrait retourner une erreur 401 avec un pseudo déjà pris", async () => {
    const userService = new UserService();
    await userService.register(
      testUser1.email,
      testUser1.name,
      testUser1.password
    );
    const registerData = {
      email: testUser2.email,
      name: testUser1.name,
      password: testUser2.password,
    };

    const response = await testApiRoute(registerHandler, "POST", registerData);

    const data = response.data as RegisterResponse;
    console.log("data2: ", data);
    expect(data.success).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(data.message).toBe("Ce nom d'utilisateur est déjà pris");
  });

  it("devrait retourner une erreur 400 si le champ 'nom' du formulaire est vide", async () => {
    const registerData = {
      email: testUser1.email,
      name: "",
      password: testUser1.password,
    };

    const response = await testApiRoute(registerHandler, "POST", registerData);

    const data = response.data as RegisterResponse;
    console.log("MyLog: ", data);
    expect(data.success).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(data.message).toBe("Un nom d'utilisateur est requis.");
  });

  it("devrait retourner une erreur 400 si le format du 'email' est invalide", async () => {
    for (const invalidEmail of invalidEmails) {
      const registerData = {
        email: invalidEmail,
        name: testUser1.name,
        password: testUser1.password,
      };

      const response = await testApiRoute(
        registerHandler,
        "POST",
        registerData
      );

      const data = response.data as RegisterResponse;
      expect(data.success).toBe(false);
      expect(response.statusCode).toBe(400);
      expect(data.message).toBe(
        "Veuillez renseigner un email avec un format valide."
      );
    }
  });

  it("devrait retourner une erreur 400 si le mot de passe n'est pas hashé en bdd", async () => {
    const userRepository = AppDataSource.getRepository(User);
    const registerData = {
      email: testUser1.email,
      name: testUser1.name,
      password: testUser1.password,
    };

    const response = await testApiRoute(registerHandler, "POST", registerData);
    const data = response.data as RegisterResponse;

    const savedData = await userRepository.findOne({
      where: { id: data.userId },
    });
    expect(savedData).not.toBeNull();
    expect(savedData!.password).not.toBe(testUser1.password);
  });
});
