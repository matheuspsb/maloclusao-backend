import { Request } from "express";

export interface AuthPayload {
  sub: string;
  role: "PROFESSOR" | "STUDENT";
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export type PaginationQuery = {
  page?: number;
  limit?: number;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
