import { createClient, COLLECTIONS } from '@/lib/pocketbase';
import { MusicPost } from '@/types';
import MusicPostCard from '@/components/MusicPostCard';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { User, Mail, Music } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const pb = await createClient();
  const user = pb.authStore.model;

  if (!user) {
    redirect('/login');
  }

  let posts: any = { items: [] };
  try {
    posts = await pb.collection(COLLECTIONS.MUSIC_POSTS).getList<MusicPost>(1, 50, {
      sort: '-created',
      filter: `username = "${user.username}"`,
    });
  } catch (error) {
    console.error('Failed to fetch user posts:', error);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">マイページ</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <User className="w-5 h-5" /> {user.username}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-5 h-5" /> {user.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Music className="w-5 h-5" /> {posts.totalItems || posts.items.length} Posts
                </div>
            </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">あなたの投稿</h2>
        {posts.items.length > 0 ? (
            <div className="space-y-6">
            {posts.items.map((post: MusicPost) => (
                <MusicPostCard key={post.id} post={post} />
            ))}
            </div>
        ) : (
            <p className="text-muted-foreground">まだ投稿がありません。</p>
        )}
      </div>
    </div>
  );
}
