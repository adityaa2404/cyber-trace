export interface User {
  user_id: number;
  name: string;
  email: string;
  department_id: number;
  department_name?: string;
}

export interface UserCreate {
  name: string;
  email: string;
  department_id: number;
}

export interface UserUpdate extends Partial<UserCreate> {}
