import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  email: string;
}
// code recupéré de l'ancienne session et adapté pour le projet
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret_de_dev';
    const decoded = jwt.verify(token, secret) as TokenPayload;
    (req as AuthRequest).user = decoded;
    next(); 
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide ou expiré.' });
  }
};