// src/types/handlers.ts

import { Request, Response, NextFunction } from "express";

// Standard Express Controller (Request and Response only)
export type Controller = (req: Request, res: Response) => void | Promise<void> | Response<any, Record<string, any>>;

// Standard Express Middleware (Request, Response, and Next)
export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
