export interface Admin {
  adminid: string;
  firstname: string;
  lastname: string;
  phoneno: string;
  email: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  phoneno: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    admin?: Admin;
    adminid?: string;
  };
  error?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: Admin;
  error?: string;
}
