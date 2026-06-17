import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    username: string;
    age: number;
    email: string;
    password: string;
    createdAt: Date;
    avatar?: string;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true, trim: true },
    age: { type: Number, min: 1, max: 120, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Wrong email format'] },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    avatar: { type: String },
})

export const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
