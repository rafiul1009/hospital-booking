/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PUBLIC_API_URL,
  HOSPITALS,
} from '@/constants/api'
import apiHeader from './api.header'

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

 
}

export default HospitalService
