import { Router } from 'express';
import { 
  createBooking, 
  getUserBookings, 
  updateBooking,
  updateBookingStatus,
  deleteBooking 
} from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createBooking);
router.get('/me', getUserBookings);
router.put('/:id', updateBooking);
router.patch('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;