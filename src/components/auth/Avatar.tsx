'use client';
import { useSession } from "next-auth/react";

export default function Avatar() {
  const { data: session } = useSession();

    if (!session) return null;

return (
    <>
      {session.user.avatar ? (
        <img
        src={session.user.avatar}
        alt={session.user.username}
        className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-pink flex items-center justify-center font-bold text-center">
          {session.user.username.toUpperCase()}
        </div>
      )}
      </>
  );
}
