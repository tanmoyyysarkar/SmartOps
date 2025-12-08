// src/utils/jwt.ts

import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types/auth'; // Define the structure

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!; // Assert presence
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

/**
 * Signs an Access Token.
 * @param payload The data to include in the token (userId, sessionId).
 * @returns The signed JWT string.
 */
export const signAccessToken = (payload: AuthPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
}

/**
 * Signs a Refresh Token.
 * @param payload The data to include in the token (userId, sessionId).
 * @returns The signed JWT string.
 */
export const signRefreshToken = (payload: AuthPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
}
