
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string, role?: 'admin' | 'client') => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}
