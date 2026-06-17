import { connectToDB } from '@/lib/database';
import { Post } from '@/models/Post';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


// GET all posts
export async function GET() {
    try {
        await connectToDB();
        const posts = await Post.find().populate('author', 'firstname username avatar').sort({createdAt: -1});
        return Response.json(posts);
    } catch(error) {
        return Response.json(
            { error: 'Server error posts' },
            { status: 500 }
        )
    }
}

// POST for auth user
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session) {
            return Response.json(
                {error: 'Not authorized'},
                {status: 401}
            );
        }

        await connectToDB();
        const { text } = await req.json();

        if(!text) {
            return Response.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        const post = await Post.create({
            text, author: session.user.id,
        });

        return Response.json(post, { status: 201 });

    } catch(error) {
        return Response.json(
            { error: 'Server error creating post' },
            { status: 500 }
        )
    }
}