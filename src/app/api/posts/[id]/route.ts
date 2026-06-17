import { connectToDB } from "@/lib/database";
import { Post } from '@/models/Post';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDB();
        const { id } = await params;
        const post = await Post.findById(id).populate('author', 'username avatar');

        if (!post) {
            return Response.json({ error: 'Post not found' }, { status: 404 });
        }

        return Response.json(post);
    } catch (error) {
        return Response.json({ error: 'Server error for post' }, { status: 500 });
    }
}

// EDIT if post time less than 3 min
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: 'Not authorized' }, { status: 401 });
        }

        await connectToDB();
        const { id } = await params;
        const { text } = await req.json();

        if (!text?.trim()) {
            return Response.json({ error: 'Text is required' }, { status: 400 });
        }

        const post = await Post.findById(id);
        if (!post) {
            return Response.json({ error: 'Post not found' }, { status: 404 });
        }

        if (post.author.toString() !== session.user.id) {
            return Response.json({ error: 'Not your post' }, { status: 403 });
        }

        const threeMinutes = 3 * 60 * 1000;
        const timePassed = Date.now() - new Date(post.createdAt).getTime();
        if (timePassed > threeMinutes) {
            return Response.json({ error: 'Can only edit within 3 minutes' }, { status: 403 });
        }

        post.text = text.trim();
        await post.save();

        return Response.json({ message: 'Post updated', text: post.text });
    } catch (error) {
        return Response.json({ error: 'Post server error' }, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: 'Not authorized' }, { status: 401 });
        }

        await connectToDB();
        const { id } = await params;

        const post = await Post.findById(id);
        if (!post) {
            return Response.json({ error: 'Post not found' }, { status: 404 });
        }

        if (post.author.toString() !== session.user.id) {
            return Response.json({ error: 'Not your post' }, { status: 403 });
        }

        await Post.findByIdAndDelete(id);
        return Response.json({ message: 'Post deleted' });
    } catch (error) {
        return Response.json({ error: 'Server error deleting post' }, { status: 500 });
    }
}
