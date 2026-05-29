import bcrypt from "bcrypt";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../core/errors";
import rawUsers from "../../db/seed/users.json";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserListQueryParams,
  UserRecord,
  UsersListResponse,
} from "./types";

const SALT_ROUNDS = 10;

interface SeedUser {
  username: string;
  email: string;
  plainPassword: string;
  role: string;
  firstName: string;
  lastName: string;
  phone?: string;
  image: string;
}

const toPublicUser = ({ password: _password, ...user }: UserRecord): User => user;

const seedUsers = (): UserRecord[] =>
  (rawUsers as SeedUser[]).map((user, index) => ({
    id: index + 1,
    username: user.username,
    email: user.email.toLowerCase(),
    password: bcrypt.hashSync(user.plainPassword, SALT_ROUNDS),
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    image: user.image,
  }));

export class UserService {
  private users: UserRecord[];
  private nextId: number;

  constructor(initialUsers: UserRecord[] = seedUsers()) {
    this.users = initialUsers;
    this.nextId =
      initialUsers.length > 0
        ? Math.max(...initialUsers.map((user) => user.id)) + 1
        : 1;
  }

  private validateListParams(params: UserListQueryParams): void {
    if (
      params.limit !== undefined &&
      (!Number.isFinite(params.limit) || params.limit < 0)
    ) {
      throw new BadRequestError("Invalid limit parameter");
    }

    if (
      params.skip !== undefined &&
      (!Number.isFinite(params.skip) || params.skip < 0)
    ) {
      throw new BadRequestError("Invalid skip parameter");
    }
  }

  private parseId(id: number): number {
    if (!Number.isFinite(id)) {
      throw new BadRequestError("Invalid user id");
    }
    return id;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private findRecordById(id: number): UserRecord {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return user;
  }

  private assertUniqueUsername(username: string, excludeId?: number): void {
    const taken = this.users.some(
      (user) =>
        user.username.toLowerCase() === username.toLowerCase() &&
        user.id !== excludeId,
    );

    if (taken) {
      throw new ConflictError(`Username "${username}" is already taken`);
    }
  }

  private assertUniqueEmail(email: string, excludeId?: number): void {
    const normalized = this.normalizeEmail(email);
    const taken = this.users.some(
      (user) => user.email === normalized && user.id !== excludeId,
    );

    if (taken) {
      throw new ConflictError(`Email "${email}" is already registered`);
    }
  }

  private validateCreateInput(input: CreateUserInput): void {
    if (!input.username?.trim()) {
      throw new BadRequestError("username is required");
    }

    if (!input.email?.trim()) {
      throw new BadRequestError("email is required");
    }

    if (!input.password) {
      throw new BadRequestError("password is required");
    }

    if (!input.firstName?.trim()) {
      throw new BadRequestError("firstName is required");
    }

    if (!input.lastName?.trim()) {
      throw new BadRequestError("lastName is required");
    }
  }

  getUsers(params: UserListQueryParams): UsersListResponse {
    this.validateListParams(params);

    const safeSkip = params.skip ?? 0;
    const safeLimit = params.limit ?? this.users.length;
    const users = this.users
      .slice(safeSkip, safeSkip + safeLimit)
      .map(toPublicUser);

    return {
      users,
      total: this.users.length,
      skip: safeSkip,
      limit: safeLimit,
    };
  }

  getUserById(id: number): User {
    return toPublicUser(this.findRecordById(this.parseId(id)));
  }

  getUserByUsername(username: string): User {
    if (!username?.trim()) {
      throw new BadRequestError("username is required");
    }

    const user = this.users.find(
      (item) => item.username.toLowerCase() === username.toLowerCase(),
    );

    if (!user) {
      throw new NotFoundError(`User with username "${username}" not found`);
    }

    return toPublicUser(user);
  }

  getUserByEmail(email: string): User {
    if (!email?.trim()) {
      throw new BadRequestError("email is required");
    }

    const normalized = this.normalizeEmail(email);
    const user = this.users.find((item) => item.email === normalized);

    if (!user) {
      throw new NotFoundError(`User with email "${email}" not found`);
    }

    return toPublicUser(user);
  }

  createUser(input: CreateUserInput): User {
    this.validateCreateInput(input);
    this.assertUniqueUsername(input.username);
    this.assertUniqueEmail(input.email);

    const record: UserRecord = {
      id: this.nextId++,
      username: input.username.trim(),
      email: this.normalizeEmail(input.email),
      password: bcrypt.hashSync(input.password, SALT_ROUNDS),
      role: input.role ?? "user",
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: input.phone,
      gender: input.gender,
      image:
        input.image ??
        `https://dummyjson.com/icon/${input.username.trim()}/128`,
      age: input.age,
    };

    this.users.push(record);
    return toPublicUser(record);
  }

  updateUser(id: number, input: UpdateUserInput): User {
    const user = this.findRecordById(this.parseId(id));

    if (input.username !== undefined) {
      if (!input.username.trim()) {
        throw new BadRequestError("username cannot be empty");
      }
      this.assertUniqueUsername(input.username, user.id);
      user.username = input.username.trim();
    }

    if (input.email !== undefined) {
      if (!input.email.trim()) {
        throw new BadRequestError("email cannot be empty");
      }
      this.assertUniqueEmail(input.email, user.id);
      user.email = this.normalizeEmail(input.email);
    }

    if (input.password !== undefined) {
      if (!input.password) {
        throw new BadRequestError("password cannot be empty");
      }
      user.password = bcrypt.hashSync(input.password, SALT_ROUNDS);
    }

    if (input.role !== undefined) user.role = input.role;
    if (input.firstName !== undefined) user.firstName = input.firstName.trim();
    if (input.lastName !== undefined) user.lastName = input.lastName.trim();
    if (input.phone !== undefined) user.phone = input.phone;
    if (input.gender !== undefined) user.gender = input.gender;
    if (input.image !== undefined) user.image = input.image;
    if (input.age !== undefined) user.age = input.age;

    return toPublicUser(user);
  }

  deleteUser(id: number): User {
    const userId = this.parseId(id);
    const index = this.users.findIndex((item) => item.id === userId);

    if (index === -1) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }

    const [removed] = this.users.splice(index, 1);
    return toPublicUser(removed);
  }
}

export const userService = new UserService();
