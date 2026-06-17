import { connectToDB } from '@/lib/database';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);
        const currentUserId = session?.user?.id;

        const users = await User.find(
            currentUserId ? { _id: { $ne: currentUserId } } : {}
        ).select('username avatar').lean();

        return Response.json(users);
    } catch {
        return Response.json({ error: 'Server error' }, { status: 500 });
    }
}
