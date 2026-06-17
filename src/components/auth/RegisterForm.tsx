'use client';
import { pageLayout, fields } from '@/styles/global';
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

type FieldErrors = {
    username?: string;
    email?: string;
    age?: string;
    password?: string;
};

function validate(username: string, email: string, age: string, password: string): FieldErrors {
    const errors: FieldErrors = {};

    if (!username) errors.username = 'Username is required';

    if (!email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format';

    if (!age) errors.age = 'Age is required';
    else if (Number(age) < 1 || Number(age) > 120) errors.age = 'Age must be between 1 and 120';

    if (!password) errors.password = 'Password is required';
    else if (password.length < 4) errors.password = 'Min 4 characters';

    return errors;
}

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError('');

        const fieldErrors = validate(username, email, age, password);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }
        setErrors({});

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, age: Number(age) }),
        });

        const data = await res.json();

        if (!res.ok) {
            setServerError(data.error || 'Something went wrong');
        } else {
            setSuccess(true);
        }
    }

    if (success) {
        return (
            <div className={`card ${pageLayout.inputForms} text-center`}>
                <p className="text-4xl">🐱</p>
                <h2 className="text-xl font-semibold text-black">Welcome to Meowitter!</h2>
                <p className="text-sm text-brown">Your account has been created. You can now log in.</p>
                <a href="/auth" className={`btn-cta card ${fields.buttons} text-center`}>Go to Login</a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`card ${pageLayout.inputForms}`}>
            <p className="text-md text-brown text-center">Create your Meowitter account</p>

            {serverError && <p className="text-red-400 text-sm">{serverError}</p>}

            <div className="w-full">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setErrors(p => ({ ...p, username: undefined })); }}
                    className={`${fields.all} ${fields.inputs} ${errors.username ? fields.errorBorder : ''}`}
                />
                {errors.username && <p className={fields.error}>{errors.username}</p>}
            </div>

            <div className="w-full">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                    className={`${fields.all} ${fields.inputs} ${errors.email ? fields.errorBorder  : ''}`}
                />
                {errors.email && <p className={fields.error}>{errors.email}</p>}
            </div>

            <div className="w-full">
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => { setAge(e.target.value); setErrors(p => ({ ...p, age: undefined })); }}
                    className={`${fields.all} ${fields.inputs} ${errors.age ? fields.errorBorder  : ''}`}
                />
                {errors.age && <p className={fields.error}>{errors.age}</p>}
            </div>

            <div className="w-full">
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                        className={`${fields.all} ${fields.inputs} pr-10 ${errors.password ? fields.errorBorder  : ''}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500"
                    >
                        {showPassword ? <EyeOpen /> : <EyeClosed />}
                    </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <button type="submit" className={`btn-cta ${fields.buttons}`}>
                Sign up
            </button>
        </form>
    );
}
