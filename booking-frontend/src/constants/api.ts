// API Base Url
export const PUBLIC_API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL

// Auth API Endpoints
export enum ApiEndpoints {
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  LOGOUT = '/auth/logout',
  USER_DETAILS = '/auth/me',
  HOSPITALS = '/hospitals',
  BOOKINGS = '/bookings'
}

export const LOGIN: string = ApiEndpoints.LOGIN
export const REGISTER: string = ApiEndpoints.REGISTER
export const LOGOUT: string = ApiEndpoints.LOGOUT
export const USER_DETAILS: string = ApiEndpoints.USER_DETAILS
export const HOSPITALS: string = ApiEndpoints.HOSPITALS
export const BOOKINGS: string = ApiEndpoints.BOOKINGS
