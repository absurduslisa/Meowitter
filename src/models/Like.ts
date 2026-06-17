import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ILike extends Document {
    post: Types.ObjectId;
    user: Types.ObjectId;
    createdAt: Date;
}

const LikeSchema = new Schema<ILike>({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
})

LikeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = (mongoose.models.Like as mongoose.Model<ILike>) || mongoose.model<ILike>('Like', LikeSchema)
