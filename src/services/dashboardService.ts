import { DashboardRepository } from '../repositories/dashboardRepository';
import { AuthRepository } from '../repositories/authRepository'; 

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
    return await this.repo.forceCloseSession(sessionId);
  }

  async getProfile(superviseurId: number) {
    return await this.authRepo.findSuperviseurById(superviseurId);
  }
}