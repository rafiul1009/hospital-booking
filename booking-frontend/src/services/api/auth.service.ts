/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PUBLIC_API_URL,
  LOGIN,
  REGISTER,
  LOGOUT,
  USER_DETAILS,
} from '@/constants/api'
import apiHeader from './api.header'

class AuthService {
  static async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + LOGIN,
        {
          method: 'POST',
          headers: apiHeader(),
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Get the cookie from response headers and store it
      const setCookieHeader = response.headers.get('Set-Cookie')
      if (setCookieHeader) {
        document.cookie = setCookieHeader
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
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Get the cookie from response headers and store it
      const setCookieHeader = response.headers.get('Set-Cookie')
      if (setCookieHeader) {
        document.cookie = setCookieHeader
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async logout(): Promise<any> {
    try {
      const response = await fetch(PUBLIC_API_URL + LOGOUT, {
        method: 'GET',
        headers: apiHeader(),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Logout failed')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async getUserDetails(): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + USER_DETAILS,
        {
          method: 'GET',
          headers: apiHeader(),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No details found')
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

export default AuthService
