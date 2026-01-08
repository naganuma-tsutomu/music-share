import { pb, COLLECTIONS } from '@/lib/pocketbase';
import { MusicPost } from '@/types';
import MusicPostCard from '@/components/MusicPostCard';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let posts: any = { items: [] };

  try {
    const filter = q 
      ? `title ~ "${q}" || platform ~ "${q}"` 
      : '';
      
    posts = await pb.collection(COLLECTIONS.MUSIC_POSTS).getList<MusicPost>(1, 50, {
      sort: '-created',
      filter,
    });
  } catch (error) {
    console.error('Failed to fetch music posts:', error);
  }

  if (posts.items.length === 0) {
      return (
          <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No music posts found.</p>
              {q && <p className="text-sm mt-2">Try searching for something else.</p>}
          </div>
      )
  }

  return (
    <div className="space-y-6">
      {posts.items.map((post: MusicPost) => (
        <MusicPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
