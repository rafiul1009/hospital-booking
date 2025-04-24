import { Router } from 'express';
import {
  getAllHospitals,
  getHospitalServices,
  createHospital,
  updateHospital,
  deleteHospital
} from '../controllers/hospital.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

// Public routes
router.get('/', getAllHospitals);
router.get('/:hospitalId/services', getHospitalServices);

// Protected admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/', createHospital);
router.put('/:id', updateHospital);
router.delete('/:id', deleteHospital);

export default router;