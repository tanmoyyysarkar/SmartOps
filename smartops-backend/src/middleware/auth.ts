// src/middleware/auth.ts

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Session from '../models/Session.js';
import { Middleware } from '../types/handlers.js';
// Import the extended AuthPayload interface for type assertion
import { AuthPayload } from '../types/auth.js';

const JWT_SECRET = process.env.JWT_SECRET!; // Assert presence via .env setup

/**
 * Ensures the user is logged in (has a valid, uncompromised session).
 * If valid, it attaches the user payload to req.user and calls next().
 */
export const requireLogin: Middleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    // 1. Check for token presence
    if (!token) {
        res.status(401).send({ message: 'Authentication required' });
        return;
    }

    try {
        // 2. Verify and decode the JWT
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

        // 3. STRICT: Verify session exists in database
        const session = await Session.findOne({
            sessionId: decoded.sessionId,
            userId: decoded.userId
        });

        if (!session) {
            // Session doesn't exist (e.g., manually logged out)
            res.clearCookie('token');
            res.status(401).send({ message: 'Session expired or invalidated' });
            return;
        }

        // Retrieve current connection data
        const currentIP = req.ip;
        const currentUserAgent = req.get('user-agent');

        // 4. CRITICAL: Check for IP mismatch (Session Hijacking)
        if (session.ipAddress !== currentIP) {
             console.log('⚠️ IP mismatch detected! Session hijacking attempt.');
             await Session.deleteOne({ sessionId: decoded.sessionId });
             res.clearCookie('token');
             res.status(403).send({ message: 'Security check failed. IP mismatch.' });
             return;
        }

        // 5. CRITICAL: Check for User-Agent mismatch (Session Hijacking)
        if (session.userAgent !== currentUserAgent) {
             console.log('⚠️ User-Agent mismatch detected! Session hijacking attempt.');
             await Session.deleteOne({ sessionId: decoded.sessionId });
             res.clearCookie('token');
             res.status(403).send({ message: 'Security check failed. User-Agent mismatch.' });
             return;
        }

        // 6. Update last activity time
        session.lastActivity = new Date();
        await session.save();

        // 7. Attach the decoded payload to the request (req.user is now typed)
        req.user = decoded;
        next();

    } catch (err) {
        // Token is invalid, expired, or verification failed
        console.error('Auth error:', (err as Error).message);
        res.clearCookie('token');
        res.status(401).send({ message: 'Invalid or expired token' });
        return;
    }
};

/**
 * Prevents access to login/signup pages if the user is already authenticated.
 */
export const preventLoginAccess: Middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (token && JWT_SECRET) {
        try {
            // Attempt to verify the token without fetching the session
            jwt.verify(token, JWT_SECRET);
            // If verification succeeds, redirect to the protected route
            res.status(200).send({ message: 'Already logged in. Redirecting.' });
            return;
        } catch {
            // Token failed verification (expired, etc.) - allow access to login
        }
    }
    // No token or token is invalid/expired - proceed to route
    next();
};
