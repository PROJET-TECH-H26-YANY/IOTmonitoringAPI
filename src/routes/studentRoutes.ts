import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const controller = new StudentController();


router.get('/admin/students', authenticateToken, controller.getAll);
router.post('/admin/student', authenticateToken, controller.create);
router.put('/admin/student/:id', authenticateToken, controller.update);
router.delete('/admin/student/:id', authenticateToken, controller.delete);

export default router;