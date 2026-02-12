import { IotRepository } from '../repositories/iotRepository';

export class IotService {
  private repo: IotRepository;

  constructor() {
    this.repo = new IotRepository();
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
        await this.repo.closeSession(activeSession.id);
        return { type: 'LOGOUT', studentName: student.name };
      } else {
        await this.repo.closeSession(activeSession.id);
        await this.repo.createSession(student.id, mac);
        return { type: 'LOGIN', studentName: student.name };
      }
    } else {
      await this.repo.createSession(student.id, mac);
      return { type: 'LOGIN', studentName: student.name };
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