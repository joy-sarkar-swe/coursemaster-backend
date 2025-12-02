import { Request } from "express";

export interface IUser {
  _id: string;
  email: string;
  role: "student" | "admin";
  name: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface ErrorResponse extends Error {
  statusCode?: number;
}
