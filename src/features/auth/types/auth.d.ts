export interface JwtPayload {
  user_id: string;
  role_id: string;
  role_name: string;
  exp: number;
  iat: number;
}

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}