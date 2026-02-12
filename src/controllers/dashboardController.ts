import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';
import { AuthRequest } from '../middleware/authMiddleware';

export class DashboardController {
  private service: DashboardService;

  constructor() {
    this.service = new DashboardService();
  }


  getLive = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) return res.status(401).json({ error: 'Non authentifié' });

      const data = await this.service.getLiveView(userId);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };


  getHistory = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) return res.status(401).json({ error: 'Non authentifié' });

      const data = await this.service.getHistory(userId);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };


  forceClose = async (req: Request, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id as string);
      if (isNaN(sessionId)) return res.status(400).json({ error: 'ID invalide' });

      await this.service.forceClose(sessionId);
      return res.json({ success: true, message: 'Session fermée' });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };


  getMe = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) return res.status(401).json({ error: 'Non authentifié' });

      const user = await this.service.getProfile(userId);
      if (!user) return res.status(404).json({ error: 'Prof introuvable' });

      const { password, ...safeUser } = user;
      return res.json(safeUser);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };
}