export interface Hospital {
  id: string;
  name: string;
  location: string;
  image?: string;
}

export interface Service {
  id: string;
  hospitalId: string;
  name: string;
  description: string;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  hospitalId: string;
  serviceId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
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