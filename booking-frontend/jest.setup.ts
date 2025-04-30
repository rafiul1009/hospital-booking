import '@testing-library/jest-dom';
import mockRouter from 'next-router-mock';

// Mock next/router
jest.mock('next/router', () => mockRouter);

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));