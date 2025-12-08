// src/models/User.ts

import mongoose, { Schema, Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

// 1. Define the Mongoose Document interface
export interface IUser extends Document {
    username: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserModel extends Model<IUser> {}

// 3. Define the Schema
const UserSchema: Schema<IUser, UserModel> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    }
});

// --- Pre-save Hook for Password Hashing (FINAL, ROBUST FIX) ---
// Use an ASYNC function and REMOVE the 'next' argument.
// Mongoose detects the returned Promise and handles flow control automatically.
UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) {
        return; // Exits the hook, allowing save to proceed
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // If successful, the promise resolves and Mongoose proceeds.
    } catch (err) {
        // If an error occurs, throwing it signals Mongoose to abort the save
        // and send the error to the calling function.
        throw new Error(`Password hashing failed: ${(err as Error).message}`);
    }
});


// --- Instance Method for Password Comparison ---
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};


// 4. Create and export the model
const User: UserModel = mongoose.model<IUser, UserModel>('User', UserSchema);
export default User;
