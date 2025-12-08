// src/controllers/authController.ts

import { Request, Response } from 'express';
import User from '../models/Users.js';
import Session from '../models/Session.js';
import { signAccessToken } from '../utils/jwt.js';
import { Controller } from '../types/handlers.js';
import { v4 as uuidv4 } from 'uuid'; // To generate unique session IDs

const JWT_COOKIE_NAME = 'token';
const JWT_COOKIE_EXPIRES_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Handles user registration (Signup).
 */
export const signup: Controller = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send({ message: 'Username and password are required' });
        return;
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(409).send({ message: 'Username already taken' });
            return;
        }

        const newUser = new User({ username, password });
        await newUser.save();

        // 1. Successful creation - log them in immediately
        await handleLoginSuccess(req, res, newUser._id.toString());

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send({ message: 'Failed to create user' });
        return;
    }
};

/**
 * Handles user login.
 */
export const login: Controller = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send({ message: 'Username and password are required' });
        return;
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).send({ message: 'Invalid credentials' });
            return;
        }

        // Use the instance method defined on the User schema
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).send({ message: 'Invalid credentials' });
            return;
        }

        // 1. Successful authentication - handle session creation and token issue
        await handleLoginSuccess(req, res, user._id.toString());

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: 'Login failed' });
        return;
    }
};

/**
 * Logs out the current session.
 */
export const logout: Controller = async (req: Request, res: Response) => {
    if (!req.user) {
        // Already logged out or token failed verification
        res.status(200).send({ message: 'Logout successful' });
        return;
    }

    try {
        // Delete the specific session from the database
        await Session.deleteOne({
            userId: req.user.userId,
            sessionId: req.user.sessionId
        });

        // Clear the cookie
        res.clearCookie(JWT_COOKIE_NAME);
        res.status(200).send({ message: 'Logout successful' });
        return;

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send({ message: 'Logout failed' });
        return;
    }
};

/**
 * Logs out all active sessions for the user.
 */
export const logoutAll: Controller = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(200).send({ message: 'Logout successful' });
        return;
    }

    try {
        // Delete ALL sessions for this user ID
        await Session.deleteMany({ userId: req.user.userId });

        // Clear the current cookie
        res.clearCookie(JWT_COOKIE_NAME);
        res.status(200).send({ message: 'Logged out of all sessions' });
        return;

    } catch (error) {
        console.error('Logout All error:', error);
        res.status(500).send({ message: 'Logout All failed' });
        return;
    }
};


// --- Helper Function ---

/**
 * Creates a new session record, signs a JWT, and sets the cookie.
 */
async function handleLoginSuccess(req: Request, res: Response, userId: string): Promise<Response> {
    const sessionId = uuidv4();
    const ipAddress = req.ip || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    // 1. Create a new session record in MongoDB
    const newSession = new Session({
        userId,
        sessionId,
        ipAddress,
        userAgent,
    });
    await newSession.save();

    // 2. Sign a new Access Token with the session ID
    const token = signAccessToken({ userId, sessionId });

    // 3. Set the JWT as an HTTP-only cookie
    res.cookie(JWT_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: JWT_COOKIE_EXPIRES_MS,
    });

    // 4. Send success response
    return res.status(200).send({ message: 'Login successful', userId });
}

// --- Placeholder for rendering (since you don't need EJS/view routes) ---
export const renderSignup: Controller = (req, res) => res.status(200).send({ message: 'Signup page endpoint (API mode)' });
export const renderlogin: Controller = (req, res) => res.status(200).send({ message: 'Login page endpoint (API mode)' });
export const renderTodo: Controller = (req, res) => res.status(200).send({ message: 'Protected resource endpoint' });
