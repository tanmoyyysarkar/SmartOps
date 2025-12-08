// src/types/express.d.ts

// 1. Import AuthPayload from the new module
import { AuthPayload } from './auth.js';

declare global {
  namespace Express {
    // 2. Reference the imported AuthPayload here
    export interface Request {
      user?: AuthPayload;

      cookies: {
        [key: string]: string | undefined;
        token?: string;
      };
      signedCookies: {
        [key: string]: string | undefined;
      };
    }
  }
}

export {};
