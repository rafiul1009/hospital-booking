import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

/*
  @desc   Get all hospitals with their services
  @route  GET /api/hospitals
  @access Public
*/
export const getAllHospitals = async (_req: Request, res: Response) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        services: true
      }
    });

    res.json({
      message: 'All Hospitals List',
      data: hospitals
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Get services for a specific hospital
  @route  GET /api/hospitals/:hospitalId/services
  @access Public
  @params hospitalId - Hospital ID
*/
export const getHospitalServices = async (req: Request, res: Response) => {
  try {
    const { hospitalId } = req.params;

    const services = await prisma.service.findMany({
      where: {
        hospitalId: parseInt(hospitalId)
      }
    });

    res.json({
      message: 'Hospital Services List',
      data: services
    });
  } catch (error) {
    console.error('Error fetching hospital services:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Create new hospital with services
  @route  POST /api/hospitals
  @access Private (Admin only)
  @body   name - Hospital name
          services - Array of services [{ name: string, description: string, price: number }]
*/
export const createHospital = async (req: AuthRequest, res: Response) => {
  try {
    const { name, services } = req.body;
    const userId = req.user!.id;

    if (!name) {
      return res.status(400).json({ message: 'Hospital name is required' });
    }

    if (!Array.isArray(services)) {
      return res.status(400).json({ message: 'Services must be an array' });
    }

    const hospital = await prisma.$transaction(async (tx) => {
      // Create the hospital first
      const newHospital = await tx.hospital.create({
        data: {
          name,
          userId
        }
      });

      // Create all services for this hospital
      const createdServices = await Promise.all(
        services.map((service: { name: string; description: string; price: number }) =>
          tx.service.create({
            data: {
              ...service,
              hospitalId: newHospital.id
            }
          })
        )
      );

      return {
        ...newHospital,
        services: createdServices
      };
    });

    res.json({
      message: 'Hospital Created Successfully',
      data: hospital
    });
  } catch (error) {
    console.error('Error creating hospital:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Update hospital and its services
  @route  PUT /api/hospitals/:id
  @access Private (Admin only)
  @params id - Hospital ID
  @body   name - Hospital name
          services - Array of services [{ name: string, description: string, price: number }]
*/
export const updateHospital = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, services } = req.body;
    const userId = req.user!.id;

    if (!name) {
      return res.status(400).json({ message: 'Hospital name is required' });
    }

    if (!Array.isArray(services)) {
      return res.status(400).json({ message: 'Services must be an array' });
    }

    const hospital = await prisma.hospital.findUnique({
      where: { id: parseInt(id) }
    });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    if (hospital.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this hospital' });
    }

    const updatedHospital = await prisma.$transaction(async (tx) => {
      // Update hospital name
      const updated = await tx.hospital.update({
        where: { id: parseInt(id) },
        data: { name }
      });

      // Delete existing services
      await tx.service.deleteMany({
        where: { hospitalId: parseInt(id) }
      });

      // Create new services
      const updatedServices = await Promise.all(
        services.map((service: { name: string; description: string; price: number }) =>
          tx.service.create({
            data: {
              ...service,
              hospitalId: parseInt(id)
            }
          })
        )
      );

      return {
        ...updated,
        services: updatedServices
      };
    });

    res.json({
      message: 'Hospital Updated Successfully',
      data: updatedHospital
    });
  } catch (error) {
    console.error('Error updating hospital:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Delete hospital and all its services
  @route  DELETE /api/hospitals/:id
  @access Private (Admin only)
  @params id - Hospital ID
*/
export const deleteHospital = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const hospital = await prisma.hospital.findUnique({
      where: { id: parseInt(id) }
    });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    if (hospital.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this hospital' });
    }

    await prisma.hospital.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    console.error('Error deleting hospital:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};