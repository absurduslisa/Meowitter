'use client';
import { useEffect } from 'react';
import { useSession } from "next-auth/react";

import Link from 'next/link';
import LogoutButton from "../auth/LogoutButton";
import { pageLayout } from "@/styles/global";
import Avatar from '../auth/Avatar';
import UploadAvatar from '../auth/UploadAvatar';

type Props = {
    currentUserId?: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function Sidebar({ currentUserId, isOpen, onClose }: Props) {
    const { data: session } = useSession();

    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <aside onClick={onClose} className={`card tab sidebar bg-sea-light ${isOpen ? 'shown' : ''}`}>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-3 right-3 text-xl">✕</button>
            <div className="flex flex-col gap-4 items-center">
                <div className='frame w-48 h-48'>
                    <Avatar />
                </div>
                <div className='btn'>
                    <p>Hello dear</p>
                    <span>@{session?.user?.username}</span>
                </div>
                <Link href='/liked-posts' className='btn text-sm hover:bg-sea w-full py-4'>Liked Posts</Link>
                <UploadAvatar />
                <LogoutButton />
            </div>
        </aside>
    )
}
