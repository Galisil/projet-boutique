import bcrypt from "bcrypt";
import { AppDataSource } from "../../../lib/data-source";
import { User } from "../../../modules/users/database/User";
import { generateToken } from "../../../lib/jwt";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async register(email: string, name: string, password: string) {
    // Vérifier si l'email existe déjà
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
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

    // Créer l'utilisateur
    const newUser = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);

    // Générer le token
    return generateToken(newUser.id.toString());
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

    // Générer le token
    return generateToken(user.id.toString());
  }

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
}
