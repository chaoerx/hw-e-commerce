export interface UserRecord {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  image: string;
  age?: number;
}

export type User = Omit<UserRecord, "password">;

export interface UsersListResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserListQueryParams {
  limit?: number;
  skip?: number;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  image?: string;
  age?: number;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  image?: string;
  age?: number;
}
