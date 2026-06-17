'use client';
import { fields, pageLayout } from '@/styles/global';
import { useState } from 'react';

type Props = {
    postId: string;
    initialText: string;
    isAuthor: boolean;
    isTime: boolean;
    onSave: (newText: string) => void;
};

export default function EditButton({ postId, initialText, isAuthor, isTime, onSave }: Props) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(initialText);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isAuthor || !isTime) return null;

    async function handleSave() {
        if (loading || !text.trim()) return;
        setLoading(true);
        setError('');

        const res = await fetch(`/api/posts/${postId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        const data = await res.json();
        if (res.ok) {
            onSave(data.text);
            setEditing(false);
        } else {
            setError(data.error || 'Failed to save');
        }
        setLoading(false);
    }

    if (editing) {
        return (
            <div className="w-full flex flex-col gap-2 mt-1">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={500}
                    className={`${fields.inputs} ${pageLayout.tweetInner} tweet p-2 h-fit bg-amber-50 outline-none`}
                    rows={3}
                    autoFocus
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={loading || !text.trim()}
                        className="btn frame px-4 bg-orange hover:bg-orange-dark"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={() => { setEditing(false); setText(initialText); setError(''); }}
                        className="btn frame px-4 bg-orange hover:bg-orange-dark"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setEditing(true)}
            title="Edit post (available for 3 min)"
            className="btn frame px-4 bg-orange hover:bg-orange-dark"
        >
            Edit
        </button>
    );
}
