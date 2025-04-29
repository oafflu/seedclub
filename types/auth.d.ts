export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface AuthHook {
  user: User | null;
  loading: boolean;
} 