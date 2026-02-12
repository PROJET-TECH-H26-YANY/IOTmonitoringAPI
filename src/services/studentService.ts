import { StudentRepository } from '../repositories/studentRepository';
import { Student } from '../types/models';

export class StudentService {
  private repo: StudentRepository;

  constructor() {
    this.repo = new StudentRepository();
  }

  async createStudent(superviseurId: number, name: string, nfcUid?: string) {
    return await this.repo.create(superviseurId, name, nfcUid);
  }

  async getMyStudents(superviseurId: number) {
    return await this.repo.findAllBySuperviseurId(superviseurId);
  }

  async updateStudent(id: number, superviseurId: number, name?: string, nfcUid?: string) {
    return await this.repo.update(id, superviseurId, { name, nfcUid });
  }

  async deleteStudent(id: number, superviseurId: number) {
    return await this.repo.delete(id, superviseurId);
  }
}