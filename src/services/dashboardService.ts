import { DashboardRepository } from '../repositories/dashboardRepository';
import { AuthRepository } from '../repositories/authRepository'; 
import mqtt from 'mqtt';

export class DashboardService {
  private repo: DashboardRepository;
  private authRepo: AuthRepository;

  constructor() {
    this.repo = new DashboardRepository();
    this.authRepo = new AuthRepository();
  }

  async getLiveView(superviseurId: number) {
    return await this.repo.getLiveSessions(superviseurId);
  }

  async getHistory(superviseurId: number) {
    return await this.repo.getHistory(superviseurId);
  }

  async forceClose(sessionId: number) {
    const session = await this.repo.getActiveSessionById(sessionId);
    if (!session) return;

    await this.repo.closeIssue(sessionId);
    const totalPause = await this.repo.getSessionPause(sessionId);
    
    const endTime = new Date();
    if (session.startTime === null) {
      throw new Error('Debut de session time est null');
    }
    const durationSec = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);
    
    // 1. Fermeture dans la base de données
    await this.repo.updateSession(sessionId, endTime, Math.max(0, durationSec - totalPause));

    // 2. NOUVEAU : Envoi du signal d'extinction à l'ESP32 via MQTT
    const client = mqtt.connect('mqtt://185.53.209.197:1883');
    
    client.on('connect', () => {
      // On utilise l'adresse MAC de la session pour cibler le bon ESP32
      const topic = `labo/device/${session.macAddress}/command`;
      
      // On forge le message JSON d'extinction
      const payload = JSON.stringify({ 
        led: 0, 
        oled: "Fermeture\nForcee" 
      });
      
      client.publish(topic, payload, () => {
        // On se déconnecte proprement une fois le message envoyé
        client.end(); 
      });
    });
  }

  async getProfile(superviseurId: number) {
    return await this.authRepo.findSuperviseurById(superviseurId);
  }
}