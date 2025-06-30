import bcrypt from "bcrypt";
import { AppDataSource } from "../../../lib/data-source";
import { User } from "../../../modules/users/database/User";
import { Tenant } from "../../../modules/tenants/database/Tenant";
import { generateToken } from "../../../lib/jwt";

//fonction pour vérifier si le format du mail est valide
function validateEmail(email: string) {
  // Vérifier que l'email n'est pas vide
  if (!email || email.trim() === "") {
    return false;
  }

  const emailReg = new RegExp(
    /^(?!.*\.\.)(?!.*\s)[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@(?!.*\.\.)[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/i
  );
  return emailReg.test(email);
}

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private tenantRepository = AppDataSource.getRepository(Tenant);

  async register(email: string, name: string, password: string) {
    //appel fonction vérif format email
    if (validateEmail(email) === false) {
      throw new Error("Veuillez renseigner un email avec un format valide.");
    }
    // Vérifier si l'email existe déjà
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (!name || name.trim() === "") {
      throw new Error("Un nom d'utilisateur est requis.");
    }
    if (existingEmail) {
      throw new Error("Cet email est déjà utilisé");
    }

    // Vérifier si le nom existe déjà
    const existingName = await this.userRepository.findOne({ where: { name } });
    if (existingName) {
      throw new Error("Ce nom d'utilisateur est déjà pris");
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //créer la fk tenant_id public
    const publicTenant = await this.tenantRepository.findOne({
      where: { name: "Public" },
    });
    if (!publicTenant) {
      throw new Error("Le tenant 'Public' n'existe pas !");
    }
    // Créer l'utilisateur
    const newUser = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    newUser.tenants = [publicTenant];
    const savedUser = await this.userRepository.save(newUser);
    if (!savedUser.id) {
      console.error("savedUser.id est undefined !", savedUser);
      throw new Error(
        "Erreur lors de la création de l'utilisateur : id manquant"
      );
    }

    // Générer le token avec l'ID de l'utilisateur qui a VRAIMENT été sauvegardé
    return {
      token: generateToken(savedUser.id.toString()),
      userId: savedUser.id,
    };
  }

  async login(emailOrName: string, password: string) {
    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrName }, { name: emailOrName }],
    });

    if (!user) {
      throw new Error("Email ou nom d'utilisateur incorrect");
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Mot de passe incorrect");
    }
    if (!user.id) {
      console.error("user.id est undefined !", user);
      throw new Error("Erreur lors de la connexion : id manquant");
    }
    // Générer le token
    return {
      token: generateToken(user.id.toString()),
      userId: user.id,
    };
  }

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ["tenants"],
    });
  }
}
