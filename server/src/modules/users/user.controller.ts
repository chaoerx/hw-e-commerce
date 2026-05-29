import type { Request, Response } from "express";
import { BadRequestError } from "../../core/errors";
import { userService } from "./user.service";
import type { UserListQueryParams } from "./types";

const getRouteParam = (
  value: string | string[] | undefined,
): string | undefined => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
};

const parseQueryParams = (req: Request): UserListQueryParams => {
  const { limit, skip } = req.query;
  const parsedLimit = limit !== undefined ? Number(limit) : undefined;
  const parsedSkip = skip !== undefined ? Number(skip) : undefined;

  return {
    limit: parsedLimit,
    skip: parsedSkip,
  };
};

export const getUsers = (req: Request, res: Response): void => {
  const params = parseQueryParams(req);
  const result = userService.getUsers(params);
  res.json(result);
};

export const getUserByUsername = (req: Request, res: Response): void => {
  const username = getRouteParam(req.params.username);

  if (!username) {
    throw new BadRequestError("username is required");
  }

  const user = userService.getUserByUsername(username);
  res.json(user);
};

export const getUserByEmail = (req: Request, res: Response): void => {
  const email =
    typeof req.query.email === "string" ? req.query.email : undefined;

  if (!email) {
    throw new BadRequestError("email query parameter is required");
  }

  const user = userService.getUserByEmail(email);
  res.json(user);
};

export const getUserById = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const user = userService.getUserById(id);
  res.json(user);
};

export const createUser = (req: Request, res: Response): void => {
  const user = userService.createUser(req.body);
  res.status(201).json(user);
};

export const updateUser = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const user = userService.updateUser(id, req.body);
  res.json(user);
};

export const deleteUser = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const user = userService.deleteUser(id);
  res.json(user);
};
