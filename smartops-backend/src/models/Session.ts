// src/models/Session.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the Document Interface
export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    lastActivity: Date;
}

// 2. Define the Model Interface (optional but good practice)
export interface SessionModel extends Model<ISession> {}

// 3. Define the Schema
const SessionSchema: Schema<ISession, SessionModel> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800, // 30 minutes
    },
    lastActivity: {
        type: Date,
        default: Date.now,
    }
});

// Compound index for faster lookups (as in your original file)
SessionSchema.index({ userId: 1, sessionId: 1 });
SessionSchema.index({ sessionId: 1, ipAddress: 1, userAgent: 1 });

// 4. Create and export the model
const Session: SessionModel = mongoose.model<ISession, SessionModel>('Session', SessionSchema);
export default Session;
