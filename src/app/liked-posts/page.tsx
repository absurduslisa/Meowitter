import { connectToDB } from '@/lib/database';
import { Post } from '@/models/Post';
import { Like } from '@/models/Like';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PostCard from '@/components/post/PostCard';
import { pageLayout } from '@/styles/global';
import { IPost } from '@/types';

export const dynamic = 'force-dynamic';

export default async function LikedPostsPage() {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  if (!currentUserId) redirect('/auth');

  const userLikes = await Like.find({ user: currentUserId }).lean();
  const likedPostIds = userLikes.map(l => l.post);

  const rawPosts = await Post.find({ _id: { $in: likedPostIds } })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .lean();

  const posts: IPost[] = JSON.parse(JSON.stringify(rawPosts));
  posts.forEach(p => { p.likedByMe = true; });

  return (
    <main>
      <div className={pageLayout.mainCenter}>
        <h1 className='text-6xl font-extrabold mt-8 text-blue-800'>Your liked posts!</h1>
        <div className="flex flex-col gap-8 mt-8">
          {posts.length === 0 ? (
            <p className="text-gray-400">You haven't liked any posts yet.</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} isLoggedIn={true} currentUserId={currentUserId} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
