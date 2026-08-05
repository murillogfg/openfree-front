export type UserRole =
  | 'FREELANCER'
  | 'EMPRESA';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  expiresIn: number;
  role: UserRole;
}