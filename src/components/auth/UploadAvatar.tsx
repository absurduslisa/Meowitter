'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { genUploader } from 'uploadthing/client';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

const { uploadFiles } = genUploader<OurFileRouter>({ url: '/api/uploadthing' });

export default function UploadAvatar() {
    const { data: session, update } = useSession();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(session?.user?.avatar || null);
    const [error, setError] = useState('');

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setUploading(true);
        setError('');

        try {
            await uploadFiles('avatar', { files: [file] });
            await update(); // tells NextAuth to re-run the JWT callback, which re-fetches avatar from DB
        } catch (err) {
            setError('Upload failed. Please try again.');
            setPreview(session?.user?.avatar || null);
            console.error(err);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="btn flex flex-col items-center gap-3 hover:bg-sea w-full py-4">
            {error && <p className="text-red-400 text-xs">{error}</p>}

            <label className=" text-sm">
                {uploading ? 'Uploading...' : 'Change avatar'}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                />
            </label>
        </div>
    );
}
