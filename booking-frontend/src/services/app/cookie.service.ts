/**
 * Service for managing browser cookies with secure defaults
 */
class CookieService {
  static set(key: string, value: string, expiryMinutes: number): void {
    const expiryDate = new Date()

    expiryDate.setTime(expiryDate.getTime() + parseInt(String(expiryMinutes)) * 60 * 1000)
    document.cookie = `${key}=${value}; path=/; expires=${expiryDate.toUTCString()}; Secure; SameSite=Strict`
  }

  static get(key: string): string | null {
    const cookies = document.cookie.split('; ')
    const cookie = cookies.find(row => row.startsWith(`${key}=`))

    return cookie ? cookie.split('=')[1] : null
  }

  static remove(key: string): void {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`
  }

  static clear(): void {
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`
    document.cookie = `refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`
  }
}

export default CookieService
