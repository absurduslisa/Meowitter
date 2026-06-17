'use client';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button className='btn hover:bg-sea w-full py-2' onClick={() => signOut({ callbackUrl: '/auth' })}>
      Logout
    </button>
  );
}