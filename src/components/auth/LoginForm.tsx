'use client';
import { pageLayout, fields } from '@/styles/global';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

function EyeOpen() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function EyeClosed() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" transform="translate(2 10)"><path d="m0 .5c2.53705308 3.66666667 5.37038642 5.5 8.5 5.5 3.1296136 0 5.9629469-1.83333333 8.5-5.5"/><path d="m2.5 3.423-2 2.077"/><path d="m14.5 3.423 2 2.077"/><path d="m10.5 6 1 2.5"/><path d="m6.5 6-1 2.5"/></g></svg>
    );
}

export default function LoginForm() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            login,
            password,
            redirect: false,
        });

        if (result?.ok) {
            window.location.href = '/';
        } else {
            setError('Invalid email/username or password');
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`card ${pageLayout.inputForms}`}>
            <p className="text-md text-brown text-center">Welcome back</p>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <input
                type="text"
                placeholder="Email or username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className={`${fields.all} ${fields.inputs}`}
            />

            <div className="relative w-full">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${fields.all} ${fields.inputs} pr-10`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500"
                >
                    {showPassword ? <EyeOpen /> : <EyeClosed />}
                </button>
            </div>

            <button type="submit" className={`btn-cta ${fields.buttons}`}>
                Login
            </button>
        </form>
    );
}
