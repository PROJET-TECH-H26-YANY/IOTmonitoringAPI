import { Request, Response } from 'express';
import { StudentService } from '../services/studentService';
import { AuthRequest } from '../middleware/authMiddleware';

export class StudentController {
  private service: StudentService;

  constructor() {
    this.service = new StudentService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) return res.status(401).json({ error: 'Non authentifié' });

      const { nom, nfcUid } = req.body; 

      if (!nom) {
        return res.status(400).json({ error: 'Le champ "nom" est requis' });
      }

      const newId = await this.service.createStudent(userId, nom, nfcUid);
      return res.status(201).json({ id: newId, message: 'Étudiant créé' });

    } catch (error: any) {
         return res.status(409).json({ error: 'Ce NFC est déjà utilisé' });
    }
  };


  getAll = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) return res.status(401).json({ error: 'Non authentifié' });

      const students = await this.service.getMyStudents(userId);
      return res.json(students);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lecture' });
    }
  };


  update = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) return res.status(401).json({ error: 'Non authentifié' });

      const studentId = parseInt(req.params.id as string);
      if (isNaN(studentId)) return res.status(400).json({ error: 'ID invalide' });

      const { nom, nfcUid } = req.body;

      await this.service.updateStudent(studentId, userId, nom, nfcUid);
      return res.json({ success: true, message: 'Mise à jour effectuée' });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur mise à jour' });
    }
  };


  delete = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) return res.status(401).json({ error: 'Non authentifié' });

      const studentId = parseInt(req.params.id as string);
      await this.service.deleteStudent(studentId, userId);
      
      return res.json({ success: true, message: 'Supprimé' });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur suppression' });
    }
  };
}