'use client';
import { useState } from 'react';
import { useSession } from "next-auth/react";
import { pageLayout } from "@/styles/global";
import Sidebar from './Sidebar';
import AccountsList from './AccountsList';
import Avatar from '../auth/Avatar';
import { useTranslate } from '@/context/TranslateContext';

export default function Navbar() {
    const { translate, setTranslate } = useTranslate();
    const { data: session } = useSession();
    const [menuState, setMenuState] = useState(false);
    const [accountsState, setAccountsState] = useState(false);

    const currentUserId = session?.user?.id;

    return (
        <>
            <header className={`card justify-around ${pageLayout.mainCenter} bg-sea-light flex flex-wrap flex-row gap-2 mt-4 p-2`}>
                <a href="/" className="btn tab hover:bg-sea">Say meow</a>
                <button onClick={() => setTranslate(!translate)} className='btn tab hover:bg-sea'>Translate</button>
                { session ? '' : (
                    <a href="/auth" className="btn tab hover:bg-sea">Login</a>
                )}
            </header>
                { session ? (
                    <button onClick={() => setAccountsState(!accountsState) }
                        className="btn card p-0 fixed left-12 bg-pink  w-48 h-24 border-2 border-black">
                    Accounts
                    </button>
                ) : ''}

                { session ? (
                    <button onClick={() => setMenuState(!menuState) }
                        className="card p-0 fixed right-12 overflow-hidden w-48 h-48 border-2 border-black">
                        <Avatar/>
                    </button>
                ) : ''}
                <AccountsList currentUserId={currentUserId} isOpen={accountsState} onClose={() => setAccountsState(false)}/>
            <Sidebar currentUserId={currentUserId} isOpen={menuState} onClose={() => setMenuState(false)}/>
        </>
    )
}