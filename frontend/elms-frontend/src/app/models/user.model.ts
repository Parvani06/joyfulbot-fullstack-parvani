export interface User {
  id: number;
  name: string;
  email: string;
  role: 'EMPLOYEE' | 'MANAGER';
  departmentId: number;
  departmentName: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: 'EMPLOYEE' | 'MANAGER';
}
