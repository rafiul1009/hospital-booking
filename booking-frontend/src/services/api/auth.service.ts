/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LOGIN,
  PUBLIC_API_URL,
  REGISTER,
} from '@/constants/api'
import StorageService from '../app/storage.service'
import apiHeader from './api.header'

class AuthService {
  static async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + LOGIN,
        {
          method: 'POST',
          headers: apiHeader(),
          body: JSON.stringify({ email, password })
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async register(name: string, email: string, password: string): Promise<any> {
    try {
      const response = await fetch(PUBLIC_API_URL + REGISTER, {
        method: 'POST',
        headers: apiHeader(),
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      if (data.success && data.data?.data) {
        StorageService.set('user', data.data.data)
      }

      return data.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }
}

export default AuthService
