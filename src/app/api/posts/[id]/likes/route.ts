import { connectToDB } from '@/lib/database';
import { Like } from '@/models/Like';
import { Post } from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return Response.json({ error: 'Not authorized' }, { status: 401 });
        }

        await connectToDB();
        const { id: postId } = await params;
        const userId = session.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return Response.json({ error: 'Post not found' }, { status: 404 });
        }

        if (post.author.toString() === userId) {
            return Response.json({ error: 'Cannot like your own post' }, { status: 403 });
        }

        const existingLike = await Like.findOne({ post: postId, user: userId });

        if (existingLike) {
            await Like.deleteOne({ _id: existingLike._id });
            post.likes = Math.max(0, post.likes - 1);
            await post.save();
            return Response.json({ liked: false, likes: post.likes });
        } else {
            await Like.create({ post: postId, user: userId });
            post.likes += 1;
            await post.save();
            return Response.json({ liked: true, likes: post.likes });
        }
    } catch (error) {
        return Response.json({ error: 'Server error' }, { status: 500 });
    }
}
