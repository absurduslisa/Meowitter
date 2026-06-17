import { connectToDB } from "@/lib/database";
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await connectToDB();
        const { username, email, password, age } = await req.json();

        if ( !username || !email || !password || !age) {
            return Response.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json(
                { error: 'Wrong email format' },
                { status: 400 }
            );
        }

        if (age && (age < 1 || age > 120)) {
            return Response.json(
                { error: 'The age should be between 1 and 120' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
            return Response.json(
                { error: 'Email or username already exists' },
                { status: 409 }
            );
            }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            age,
        });

        return Response.json({
            message: 'Success!',
            userId: user._id,

        })
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map((e: any) => e.message)[0];
            return Response.json({ error: message }, { status: 400 });
        }
        return Response.json({ error: 'Server error' }, { status: 500 });
    }
}