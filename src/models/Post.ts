import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IPostDoc extends Document {
    author: Types.ObjectId;
    text: string;
    translatedText: string;
    likes: number;
    createdAt: Date;
    // comments?: Types.ObjectId;
    // isRepost: boolean;
    // originalPost?: Types.ObjectId;
}

const PostSchema = new Schema<IPostDoc>({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxlength: 500 },
    translatedText: { type: String, maxlength: 500 },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    // comments: { type: Schema.Types.ObjectId, ref: 'Comments' },
    // isRepost: { type: Boolean, default: false },
    // originalPost: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
})

export const Post = (mongoose.models.Post as mongoose.Model<IPostDoc>) || mongoose.model<IPostDoc>('Post', PostSchema);
