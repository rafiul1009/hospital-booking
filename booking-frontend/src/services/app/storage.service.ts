'use client'

type StorageType = typeof localStorage | null;
const STORAGE: StorageType = typeof window !== 'undefined' ? localStorage : null;

class StorageService {
  static get<T>(key: string): T | null {
    if (!STORAGE) return null;
    const value = STORAGE.getItem(key);

    try {
      return value === null || value === 'undefined' ? null : JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  static set<T>(key: string, value: T): void {
    if (!STORAGE) return;
    STORAGE.setItem(key, JSON.stringify(value));
  }

  static unset(key: string): void {
    if (!STORAGE) return;
    if (this.isset(key)) {
      STORAGE.removeItem(key);
    }
  }

  static clear(): void {
    this.unset('user');
  }

  static isset(key: string): boolean {
    return this.get(key) !== null;
  }
}

export default StorageService;
