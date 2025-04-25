/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PUBLIC_API_URL,
  HOSPITALS,
} from '@/constants/api'
import apiHeader from './api.header'
import { HospitalFormData } from '@/types'

class HospitalService {
  static async getAllHospitals(): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + HOSPITALS,
        {
          method: 'GET',
          headers: apiHeader(),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No hospitals found')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async createHospital(formData: HospitalFormData): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + HOSPITALS,
        {
          method: 'POST',
          headers: apiHeader(),
          body: JSON.stringify(formData),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Hospital creation failed')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async updateHospital(id: number, formData: HospitalFormData): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + HOSPITALS + `/${id}`,
        {
          method: 'PUT',
          headers: apiHeader(),
          body: JSON.stringify(formData),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Hospital update failed')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async deleteHospital(id: number): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + HOSPITALS + `/${id}`,
        {
          method: 'DELETE',
          headers: apiHeader(),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Hospital deletion failed')
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

export default HospitalService
