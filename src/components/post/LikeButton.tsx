'use client';
import { useState } from 'react';

type Props = {
    postId: string;
    initialLikes: number;
    initialLiked: boolean;
    isAuthor: boolean;
};

function HeartSVG({ filled }: { filled: boolean }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 88.761 88.761"
            className="w-5 h-5"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={filled ? 0 : 4}
        >
            <path d="M88.748,28.822C87.433,14.123,76.639,6.532,67.17,5.703C55.521,4.682,49.389,8.26,44.38,13.056
              C39.372,8.257,33.218,4.677,21.59,5.7C12.116,6.53,1.324,14.121,0.014,28.822L0,33.34l0.011,0.303
              C1.346,49.021,15.246,64.855,42.51,82.055l1.868,1.182l1.869-1.182c27.263-17.199,41.166-33.037,42.498-48.411l0.017-4.511
              L88.748,28.822z" />
        </svg>
    );
}

export default function LikeButton({ postId, initialLikes, initialLiked, isAuthor }: Props) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);

    async function handleLike() {
        if (loading) return;
        setLoading(true);
        const res = await fetch(`/api/posts/${postId}/likes`, { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            setLiked(data.liked);
            setLikes(data.likes);
        }
        setLoading(false);
    }

    return (
        <button
            onClick={isAuthor ? undefined : handleLike}
            disabled={isAuthor || loading}
            title={isAuthor ? 'Your post' : liked ? 'Unlike' : 'Like'}
            className={`flex flex-row items-center gap-1 ${isAuthor ? 'hidden' : liked ? 'text-red-500' : 'text-black hover:text-red-400'}`}
        >
            <HeartSVG filled={liked} />
            <span>{likes}</span>
        </button>
    );
}
