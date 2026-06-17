import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDB } from '@/lib/database';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Сredentials',
            credentials: {
                login: { label: 'Email or Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (!credentials?.login || !credentials?.password) return null;

                await connectToDB();

                const user = await User.findOne({
                    $or: [
                        { email: credentials.login },
                        { username: credentials.login },
                    ],
                });

                if (!user) return null;

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordCorrect) return null;

                return {
                    id:        user._id.toString(),
                    username:  user.username,
                    email:     user.email,
                    avatar:    user.avatar || null,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id;
                token.username = (user as any).username;
                token.avatar = (user as any).avatar || null;
            }
            if (trigger === 'update') {
                // re-fetch from DB so avatar changes appear immediately
                await connectToDB();
                const dbUser = await User.findById(token.id as string);
                if (dbUser) token.avatar = dbUser.avatar || null;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.avatar = (token.avatar as string) || null;
            }
            return session;
        },
    },

    pages: {
        signIn: '/auth',
    },

    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
