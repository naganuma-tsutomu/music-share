import { pb, COLLECTIONS } from '@/lib/pocketbase';
import { MusicPost } from '@/types';
import AddMusicForm from '@/components/AddMusicForm';

export const dynamic = 'force-dynamic';

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getPlatformBadge = (platform: string) => {
  switch (platform) {
    case 'youtube':
      return <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">YouTube</span>;
    case 'apple_music':
      return <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-1 rounded">Apple Music</span>;
    default:
      return <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Other</span>;
  }
};

export default async function Home() {
  let posts: any = { items: [] };
  try {
    posts = await pb.collection(COLLECTIONS.MUSIC_POSTS).getList<MusicPost>(1, 50, {
      sort: '-created',
    });
  } catch (error) {
    console.error('Failed to fetch music posts:', error);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">🎵 Music History</h1>

        <AddMusicForm />

        <div className="space-y-6">
          {posts.items.map((post: MusicPost) => {
            const youtubeId = post.platform === 'youtube' ? getYouTubeId(post.url) : null;

            return (
              <div key={post.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      {post.username.slice(0, 2)}
                    </div>
                    <span className="font-bold text-gray-700">{post.username}</span>
                    {getPlatformBadge(post.platform)}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(post.created).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-3">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-bold hover:text-blue-600 block mb-2 break-all text-lg"
                  >
                    {post.title ? post.title : post.url}
                  </a>
                  {post.comment && (
                    <p className="text-gray-600 text-sm mb-2">
                      {post.comment}
                    </p>
                  )}
                  {post.platform === 'youtube' && youtubeId && (
                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="block mt-3 group relative overflow-hidden rounded-lg">
                      <img
                        src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                        alt="YouTube Thumbnail"
                        className="w-full object-cover aspect-video group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-red-600 border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </a>
                  )}
                  {post.comment && post.platform !== 'youtube' && (
                    <p className="text-gray-600 text-sm mt-2 bg-gray-50 p-2 rounded">
                      {post.comment}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
