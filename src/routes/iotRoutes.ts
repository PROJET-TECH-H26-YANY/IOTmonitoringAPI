import { Router } from 'express';
import { IotController } from '../controllers/iotController';

const router = Router();
const controller = new IotController();


router.post('/iot/auth', controller.auth);
router.post('/iot/issue', controller.alert);
router.put('/iot/issue', controller.resolve);

export default router;