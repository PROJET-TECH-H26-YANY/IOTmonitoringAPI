import { IotRepository } from '../repositories/iotRepository';

export class IotService {
  private repo: IotRepository;

  constructor() {
    this.repo = new IotRepository();
  }

  // IA pour aider à calculer le temps de travail en prenant en compte les pauses (issues)
  private async closeActiveSession(session: any) {
    await this.repo.closeIssue(session.id);
    const totalPause = await this.repo.getSessionPause(session.id);
    const endTime = new Date();
    const durationSec = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);
    await this.repo.closeSession(session.id, endTime, Math.max(0, durationSec - totalPause));
  }

  // je me suis aider de IA pour ne pas me perdre dans la logique métier de l'authentification et de la gestion des sessions
  async handleAuth(mac: string, nfc: string) {
    const student = await this.repo.findStudentByNfc(nfc);
    if (!student) {
      throw new Error('Badge non reconnu');
    }

    const activeSession = await this.repo.findActiveSessionByMac(mac);

    if (activeSession) {
      if (activeSession.studentId === student.id) {
        await this.closeActiveSession(activeSession);
        return { type: 'LOGOUT', studentName: student.name, studentId: student.id};
      } else {
        await this.closeActiveSession(activeSession);
        await this.repo.createSession(student.id, mac);
        return { type: 'LOGIN', studentName: student.name, studentId: student.id };
      }
    } else {
      await this.repo.createSession(student.id, mac);
      return { type: 'LOGIN', studentName: student.name, studentId: student.id };
    }
  }

  async handleAlert(mac: string) {
    const activeSession = await this.repo.findActiveSessionByMac(mac);
    if (activeSession) {
      await this.repo.createIssue(activeSession.id);
      return true; 
    }
    return false; 
  }

  async handleRecovery(mac: string) {
    const activeSession = await this.repo.findActiveSessionByMac(mac);
    if (activeSession) {
      await this.repo.closeIssue(activeSession.id);
      return true; 
    }
    return false;
  }
}