import { Request, Response } from 'express';
import { IotService } from '../services/iotService';

export class IotController {
  private service: IotService;

  constructor() {
    this.service = new IotService();
  }

  auth = async (req: Request, res: Response) => {
    try {
      const { mac, nfc } = req.body;
      if (!mac || !nfc) return res.status(400).json({ error: 'Données manquantes' });

      const result = await this.service.handleAuth(mac, nfc);

      if (result.type === 'LOGIN') {
        return res.json({
          success: true,
          command: 'LED_ON_100',
          student: result.studentName,
          message: 'Session ouverte'
        });
      } else {
        return res.json({
          success: true,
          command: 'LED_OFF',
          student: result.studentName,
          message: 'Session fermée'
        });
      }

    } catch (error: any) {
      return res.json({
        error: 'Badge non reconnu', 
        command: 'LED_RED_BLINK'
      });
    }
  };

  alert = async (req: Request, res: Response) => {
    try {
      const { mac } = req.body;
      const success = await this.service.handleAlert(mac);

      if (success) {
        return res.json({
          success: true,
          command: 'BUZZER_ON',
          message: 'Incident enregistré'
        });
      } else {
        return res.status(400).json({ error: 'Pas de session active' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };

 
  resolve = async (req: Request, res: Response) => {
    try {
      const { mac } = req.body;
      const success = await this.service.handleRecovery(mac);

      if (success) {
        return res.json({
          success: true,
          command: 'BUZZER_OFF_LED_ON',
          message: 'Incident clôturé'
        });
      } else {
        return res.json({ message: 'Aucun incident à clôturer' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };
}