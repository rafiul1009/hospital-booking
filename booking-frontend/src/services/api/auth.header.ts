import CookieService from '../app/cookie.service'

export default function authHeader() {
  const token = CookieService.get('token')

  // Construct and return the headers
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}
