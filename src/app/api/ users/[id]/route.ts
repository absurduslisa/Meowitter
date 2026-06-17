import { connectToDB } from "@/lib/database";
import { User } from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, {params}: { params: Promise<{ id: string }>}) {
    try {
        await connectToDB();
        const { url } = await req.json();
        const { id } = await params;
        if(!url) {
            return;
        }
        const user = await User.findById(id);
        user.avatar = url.trim();
        await user.save();

        return Response.json({ message: 'Photo updated' });

    } catch {
        return Response.json({ error: 'User server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request, {params}: { params: Promise<{ id: string }>}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: 'Not authorized' }, { status: 401 });
        }

        await connectToDB();
        const { id } = await params;
        const { avatar, password, age } = await req.json();
        const user = await User.findById(id);


        return Response.json(
            {message: 'Success!',
            userId: user._id}
        )

    } catch (error: any) {
        return Response.json({ error: 'Server error' }, { status: 500 });
    }
}
