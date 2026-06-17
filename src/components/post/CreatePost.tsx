'use client';
import { fields, pageLayout } from '@/styles/global';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit() {
        if (!text.trim()) return;
        setLoading(true);

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text}),
        });

        if (res.ok) {
            setText('');
            router.refresh();
        } else {
            const data = await res.json();
            console.error('Failed to create post:', data.error);
        }
        setLoading(false);
    }

    return (
        <div className={`card ${pageLayout.tweetCardsWrapper} flex flex-col gap-2 bg-ohra`}>
            <textarea
                className={`${fields.tweet} ${pageLayout.tweetInner} text-start wrap-break-word`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='What is in your meowind?'
                maxLength={450}>
            </textarea>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`btn-cta ${fields.buttons} lg:max-w-[250px] self-end`}>
                    {loading ? 'Posting...' : 'Post'}
            </button>
        </div>
    )
}
