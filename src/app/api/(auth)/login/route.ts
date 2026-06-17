import { connectToDB } from "@/lib/database";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await connectToDB();
        const { login, password } = await req.json();

        if (!login || !password) {
            return Response.json(
                { error: 'Please enter login and password'},
                { status: 400 }
            )
        }

        const user = await User.findOne({ $or: [{ email: login }, { username: login }] });
        if (!user) {
            return Response.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // compare password
        const isPasswordCorect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorect) {
            return Response.json(
                { error: 'Password is not correct' },
                { status: 401 }
            );
        }

        return Response.json({
            message: 'Success!',
            userId: user._id,
        })

    } catch (error) {
        return Response.json(
            { error: 'Server error'},
            { status: 500 }
        )
    }
}