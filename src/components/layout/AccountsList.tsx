'use client';
import { useEffect, useState } from 'react';
import { IUser } from '@/types';
import Account from '../ui/Account';

type Props = {
    currentUserId?: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function AccountsList({ isOpen, onClose }: Props) {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

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
        <aside onClick={onClose} className={`card tab accountsbar p-10 bg-sea-light ${isOpen ? 'shown' : ''}`}>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-3 right-3 text-xl">✕</button>
            <div className="flex flex-col gap-4 items-center">
                {users.map((user) => (
                    <Account key={user._id} user={user} />
                ))}
            </div>
        </aside>
    )
}
