export interface Hospital {
  id: number;
  name: string;
  services: Service[];
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: number;
  hospitalId: number;
  name: string;
  description: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: number;
  userId: string;
  hospitalId: string;
  serviceId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface User {
  id: number;
  email: string;
  name: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  auth: {
    user: User | null;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}