import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const controller = new DashboardController();


router.get('/admin/live', authenticateToken, controller.getLive);
router.get('/admin/history', authenticateToken, controller.getHistory);
router.delete('/admin/session/:id', authenticateToken, controller.forceClose);
router.get('/admin/me', authenticateToken, controller.getMe);

export default router;