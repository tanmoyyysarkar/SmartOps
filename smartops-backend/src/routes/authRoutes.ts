// src/routes/authRoutes.ts

import express, { Router } from 'express';
import { Middleware, Controller } from '../types/handlers.js';

// Apply the custom types (Middleware/Controller) to the imported functions
import {
    preventLoginAccess,
    requireLogin
} from '../middleware/auth.js';

import {
    signup,
    renderSignup,
    login,
    renderlogin,
    renderTodo, // Protected route placeholder
    logout,
    logoutAll
} from '../controllers/authControllers.js';

// Initialize the router
const router: Router = express.Router();

// --- Public Routes ---

router.get('/signup',
    preventLoginAccess as Middleware,
    renderSignup as Controller
);
router.post('/signup', signup as Controller);

router.get('/login',
    preventLoginAccess as Middleware,
    renderlogin as Controller
);
router.post('/login', login as Controller);


// --- Protected Routes (Example) ---

// Route for a protected resource
router.get('/',
    requireLogin as Middleware,
    renderTodo as Controller
);

// Logout routes
router.post('/logout', // Changed to POST for security best practice
    requireLogin as Middleware,
    logout as Controller
);
router.post('/logout-all', // Changed to POST for security best practice
    requireLogin as Middleware,
    logoutAll as Controller
);

export default router;
