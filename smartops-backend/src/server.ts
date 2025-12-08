// server.ts

import 'dotenv/config'; // ES Module way to load .env files
import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes'; // Note the .js extension

// Import custom types if needed (like the AuthPayload for the error handler)
import { AuthPayload } from './types/auth';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const MONGODB_URI: string = process.env.MONGODB_URI!; // Assert presence
const JWT_SECRET: string = process.env.JWT_SECRET!;

// --- Middleware ---
app.use(morgan('dev'));
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(cookieParser(JWT_SECRET)); // Use JWT_SECRET for signing if needed

// --- Routes ---
app.use('/auth', authRoutes);

// --- Default Route for Protected Resources ---
// If the request makes it here, the user is authenticated (e.g., req.user is set)
app.get('/protected', (req: Request, res: Response) => {
    const userPayload = (req.user as AuthPayload) || {};
    res.status(200).json({
        message: "You have accessed a protected route!",
        user: { userId: userPayload.userId }
    });
});


// --- 404 handler ---
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

// --- Error handler ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Global Error:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});

// --- Server + graceful shutdown ---
async function startServer() {
    if (!MONGODB_URI) {
        console.error('FATAL: MONGODB_URI not defined in environment variables.');
        process.exit(1);
    }
    if (!JWT_SECRET) {
        console.error('FATAL: JWT_SECRET not defined in environment variables.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server listening on http://localhost:${PORT}`);
        });

        // Graceful shutdown logic (similar to your original)
        const shutdown = async (signal: string) => {
             // ... (Implementation omitted for brevity, keeping your original logic)
             console.log(`\nReceived ${signal}. Shutting down...`);
             server.close(async () => {
                 try {
                     await mongoose.connection.close();
                     console.log('MongoDB connection closed.');
                     process.exit(0);
                 } catch (closeErr) {
                     console.error('Error closing MongoDB connection', closeErr);
                     process.exit(1);
                 }
             });

             setTimeout(() => {
                 console.error('Force shutdown');
                 process.exit(1);
             }, 10000);
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

startServer();
