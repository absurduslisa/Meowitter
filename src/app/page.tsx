import { connectToDB } from '@/lib/database';
import { Post } from '@/models/Post';
import { Like } from '@/models/Like';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PostCard from '@/components/post/PostCard';
import CreatePost from '@/components/post/CreatePost';
import { pageLayout } from '@/styles/global';
import { IPost } from '@/types';

export const dynamic = 'force-dynamic';

export default async function MeowitterPage() {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const rawPosts = await Post.find()
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .lean();

  const posts: IPost[] = JSON.parse(JSON.stringify(rawPosts));

  if (currentUserId) {
    const postIds = posts.map(p => p._id);
    const userLikes = await Like.find({ user: currentUserId, post: { $in: postIds } }).lean();
    const likedSet = new Set(userLikes.map(l => l.post.toString()));
    posts.forEach(p => { p.likedByMe = likedSet.has(p._id); });
  }

  return (
    <main>
      <div className={pageLayout.mainCenter}>
          <h1 className='text-6xl font-extrabold mt-8 text-blue-800'>Meowitter</h1>
          <p className='mb-8'>Don't hold your voice!</p>
          <div className={`flex flex-col gap-8`}>
            {session && <CreatePost />}
            {posts.map((post) => (
              <PostCard key={post._id} post={post} isLoggedIn={!!session} currentUserId={currentUserId} />
            ))}
          </div>
        </div>
    </main>
  )
}