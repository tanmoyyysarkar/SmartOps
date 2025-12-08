// src/types/auth.ts

/**
 * Defines the structure of the data stored in the JWT payload and attached to req.user.
 */
export interface AuthPayload {
    userId: string;
    sessionId: string;
}
