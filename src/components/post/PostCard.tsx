'use client';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useSession } from "next-auth/react";
import { IPost } from '@/types';
import { fields, pageLayout } from '@/styles/global';
import LikeButton from './LikeButton';
import EditButton from './EditButton';
import { useTranslate } from '@/context/TranslateContext';

type Props = {
  post: IPost;
  isLoggedIn: boolean;
  currentUserId?: string;
};

export default function PostCard({ post,  isLoggedIn, currentUserId }: Props) {
  const { data: session } = useSession();
  const { translate } = useTranslate();
  const [displayText, setDisplayText] = useState(post.text);
  const translatedText = post.translatedText;

  const isAuthor = !!currentUserId && currentUserId === post.author?._id;
  const threeMinutes = 3 * 60 * 1000;
  const timePassed = Date.now() - new Date(post.createdAt).getTime();
  const isTime = timePassed < threeMinutes;

  return (
      <article key={post._id} className={`card bg-yellow ${pageLayout.tweetCardsWrapper} flex flex-col gap-4`}>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row gap-2 items-center '>
            {/* <img className='frame w-12 h-12 bg-sea ' src={post.author?.avatar ? post.author?.avatar : '' } alt={post.author?.username} /> */}
            <div className='frame w-12 h-12'>

              {post.author.avatar ? (
                <img
                src={post.author?.avatar}
                alt={post.author?.username}
                className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-pink flex items-center justify-center font-bold">
                  {post.author.username[0].toUpperCase()}
                </div>
              )}
            </div>

            <p className='text-xl font-bold'>{post.author?.username}</p>
          </div>
          <p>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
        </div>
        <p className={`tweet ${fields.all} ${fields.tweet} ${pageLayout.tweetInner} text-left`}>
          {translate && translatedText ? translatedText : displayText}
        </p>

        { session ? (
        <div className="flex gap-2 mt-2">
            <LikeButton
              postId={post._id}
              initialLikes={post.likes}
              initialLiked={!!post.likedByMe}
              isAuthor={isAuthor}/>

          <EditButton
              postId={post._id}
              initialText={post.text}
              isTime={isTime}
              isAuthor={isAuthor}
              onSave={setDisplayText} />
        </div>
        ) : ''
            }
      </article>
  )
}
