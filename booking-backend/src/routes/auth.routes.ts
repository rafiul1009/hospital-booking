import { Router } from 'express';
import { register, login, logout, getUserDetails } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.use(authMiddleware);

router.get('/me', getUserDetails);

export default router;