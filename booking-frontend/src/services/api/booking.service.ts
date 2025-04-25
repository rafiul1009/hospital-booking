/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PUBLIC_API_URL,
  BOOKINGS,
} from '@/constants/api'
import apiHeader from './api.header'

class BookingService {
  static async getUserBookings(): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + BOOKINGS + '/my-bookings',
        {
          method: 'GET',
          headers: apiHeader(),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No bookings found')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async createBooking(bookingData: {
    serviceId: number;
    startDate: string;
    endDate: string;
  }): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + BOOKINGS,
        {
          method: 'POST',
          headers: apiHeader(),
          body: JSON.stringify(bookingData),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async updateBooking(bookingId: number, bookingData: {
    serviceId?: number;
    startDate?: string;
    endDate?: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  }): Promise<any> {
    try {
      const response = await fetch(
        `${PUBLIC_API_URL}${BOOKINGS}/${bookingId}`,
        {
          method: 'PUT',
          headers: apiHeader(),
          body: JSON.stringify(bookingData),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async deleteBooking(bookingId: number): Promise<any> {
    try {
      const response = await fetch(
        `${PUBLIC_API_URL}${BOOKINGS}/${bookingId}`,
        {
          method: 'DELETE',
          headers: apiHeader(),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete booking')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }
}

export default BookingService
