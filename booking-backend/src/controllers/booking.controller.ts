import { Response } from 'express';
import { PrismaClient, BookingStatus } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

/*
  @desc   Create Booking
  @route  POST /api/bookings
  @access Private
  @body   startDate - Start date
          endDate - End date
          serviceId - Hospital Service ID
*/
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId, startDate, endDate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!serviceId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Service ID, start date, and end date are required' });
    }
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    if (startDateTime > endDateTime) {
      return res.status(400).json({ message: 'Start date cannot be greater than end date' });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        startDate: startDateTime,
        endDate: endDateTime,
        status: 'pending'
      },
      include: {
        service: true
      }
    });
    res.json({
      message: 'Appointment Created Successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Get User's Bookings
  @route  GET /api/bookings/user
  @access Private
*/
export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId
      },
      include: {
        service: {
          include: {
            hospital: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    res.json({
      message: 'Appointment List',
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Update Booking Details
  @route  PUT /api/bookings/:id
  @access Private
  @params id - Booking ID
  @body   startDate - New start date
          endDate - New end date
          status - New booking status
          serviceId - New service ID
*/
export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, status, serviceId } = req.body;
    const userId = req.user?.id;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date, and end date are required' });
    }

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    if (startDateTime > endDateTime) {
      return res.status(400).json({ message: 'Start date cannot be greater than end date' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (existingBooking.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Validate serviceId if provided
    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId }
      });

      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        ...(startDate && { startDate: startDateTime }),
        ...(endDate && { endDate: endDateTime }),
        ...(status && { status: status as BookingStatus }),
        ...(serviceId && { serviceId: serviceId })
      },
      include: {
        service: {
          include: {
            hospital: true
          }
        }
      }
    });
    res.json({
      message: 'Appointment Updated Successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Update Booking Status
  @route  PATCH /api/bookings/:id/status
  @access Private
  @params id - Booking ID
  @body   status - New booking status (pending/confirmed/cancelled/completed)
*/
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (existingBooking.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: status as BookingStatus },
      include: {
        service: {
          include: {
            hospital: true
          }
        }
      }
    });
    res.json({
      message: 'Appointment Status Updated Successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Delete Booking
  @route  DELETE /api/bookings/:id
  @access Private
  @params id - Booking ID
*/
export const deleteBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await prisma.booking.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};