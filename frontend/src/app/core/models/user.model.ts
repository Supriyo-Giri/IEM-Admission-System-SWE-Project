export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'applicant' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

