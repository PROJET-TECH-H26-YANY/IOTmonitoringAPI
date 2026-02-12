import { AuthRepository } from '../repositories/authRepository';
import bcrypt from 'bcrypt';
import { Superviseur } from '../types/models';

export class AuthService {
  private repo: AuthRepository;

  constructor() {
    this.repo = new AuthRepository();
  }


  async register(name: string, email: string, password: string): Promise<number> {
    const existingUser = await this.repo.findSuperviseurByEmail(email);
    if (existingUser) {
      throw new Error("Cet email est déjà utilisé");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return await this.repo.createSuperviseur(name, email, passwordHash);
  }


  async login(email: string, password: string): Promise<Superviseur | null> {
    const user = await this.repo.findSuperviseurByEmail(email);
    if (!user) return null; 

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null; 

    return user;
  }
}