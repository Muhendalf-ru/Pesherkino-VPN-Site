export interface IServer {
  _id: string;
  label: string;
  url: string;
  username: string;
  password: string;
  sessionCookie?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServerRequest {
  label: string;
  url: string;
  username: string;
  password: string;
  isActive?: boolean;
}

export interface UpdateServerRequest {
  label?: string;
  url?: string;
  username?: string;
  password?: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 