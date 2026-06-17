'use client';
import { IUser } from '@/types';

type Props = {
  user: IUser;
};

export default function Account({ user }: Props) {
    return (
        <div className='card flex flex-col gap-2 items-center w-full bg-yellow-green'>
            <div className='frame w-28 h-28'>
                {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-pink flex items-center justify-center font-bold">
                        {user.username[0].toUpperCase()}
                    </div>
                )}
            </div>
            <p className='btn'>@{user.username}</p>
        </div>
    )
}
