import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import jwt from 'jsonwebtoken';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs (name, email, password) sont requis' });
      }

      const newId = await this.service.register(name, email, password);
      
      return res.status(201).json({ 
        success: true, 
        message: 'Compte créé avec succès', 
        id: newId 
      });

    } catch (error: any) {
      if (error.message === "Cet email est déjà utilisé") {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const user = await this.service.login(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }

      const secret = process.env.JWT_SECRET || 'secret_de_dev';
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        secret, 
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        token: token,
        user: { id: user.id, name: user.name, email: user.email }
      });

    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
  };
}