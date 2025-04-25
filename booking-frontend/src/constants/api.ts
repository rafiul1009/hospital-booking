// API Base Url
export const PUBLIC_API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL

// Auth API Endpoints
export enum ApiEndpoints {
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  HOSPITALS = '/hospitals'
}

export const LOGIN: string = ApiEndpoints.LOGIN
export const REGISTER: string = ApiEndpoints.REGISTER
export const HOSPITALS: string = ApiEndpoints.HOSPITALS
