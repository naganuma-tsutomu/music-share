'use client';

import { useState } from 'react';
import { MusicPost } from '@/types';
import { updateMusicPost, deleteMusicPost } from '@/app/actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Edit2, Trash2, Calendar, User, MessageCircle, ExternalLink, Youtube, Music, Disc } from 'lucide-react';

interface MusicPostCardProps {
  post: MusicPost;
}

export default function MusicPostCard({ post }: MusicPostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handlePlatformClick = (platform: string) => {
    router.push(`/?q=${encodeURIComponent(platform)}`);
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return (
          <Badge 
            variant="secondary" 
            className="bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer gap-1"
            onClick={() => handlePlatformClick('youtube')}
          >
            <Youtube className="w-3 h-3" /> YouTube
          </Badge>
        );
      case 'apple_music':
        return (
          <Badge 
            variant="secondary" 
            className="bg-pink-100 text-pink-600 hover:bg-pink-200 cursor-pointer gap-1"
            onClick={() => handlePlatformClick('apple_music')}
          >
            <Music className="w-3 h-3" /> Apple Music
          </Badge>
        );
      default:
        return (
          <Badge 
            variant="secondary" 
            className="cursor-pointer gap-1"
            onClick={() => handlePlatformClick(platform)}
          >
            <Disc className="w-3 h-3" /> {platform}
          </Badge>
        );
    }
  };

  const handleUpdate = async (formData: FormData) => {
    setIsSaving(true);
    formData.append('id', post.id);

    const result = await updateMusicPost(formData);
    setIsSaving(false);

    if (result.success) {
      setIsEditing(false);
      toast.success('更新しました！');
    } else {
      toast.error('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return;
    const result = await deleteMusicPost(post.id);
    if (result.success) {
      toast.success('削除しました');
    } else {
      toast.error('削除に失敗しました');
    }
  }

  if (isEditing) {
    return (
      <Card className="border-blue-200 shadow-sm">
        <CardHeader className="pb-4">
          <h3 className="font-bold text-gray-700">編集モード</h3>
        </CardHeader>
        <CardContent>
          <form action={handleUpdate} className="space-y-4">
            {/* 投稿者フィールドを削除。サーバー側で認証ユーザー名を使用。 */}

            <div className="space-y-2">
                <Label>URL</Label>
                <Input
                    type="url"
                    name="url"
                    required
                    defaultValue={post.url}
                />
            </div>

            <div className="space-y-2">
                <Label>コメント</Label>
                <Textarea
                    name="comment"
                    defaultValue={post.comment}
                />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? '保存中...' : '保存'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow group overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {post.username.slice(0, 2)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm truncate flex items-center gap-2">
                {post.username}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1" suppressHydrationWarning>
               <Calendar className="w-3 h-3" /> {new Date(post.created).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 shrink-0">
            {getPlatformBadge(post.platform)}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold hover:text-primary transition-colors block mb-3 break-all flex items-start gap-2"
        >
          {post.title ? post.title : post.url}
          <ExternalLink className="w-4 h-4 mt-1 opacity-50 shrink-0" />
        </a>

        {post.thumbnail && (
          <a href={post.url} target="_blank" className="block group/image relative overflow-hidden rounded-md bg-muted aspect-video">
            <img
              src={post.thumbnail}
              alt={post.title || "thumbnail"}
              className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {post.platform === 'youtube' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/image:bg-black/30 transition-colors">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                   <div className="ml-1 border-t-[8px] border-t-transparent border-l-[14px] border-l-red-600 border-b-[8px] border-b-transparent"></div>
                </div>
              </div>
            )}
          </a>
        )}

        {post.comment && (
          <div className="mt-4 p-3 bg-muted/50 rounded-md flex gap-2 items-start text-sm text-muted-foreground">
            <MessageCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{post.comment}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="h-8 px-2 text-muted-foreground hover:text-primary"
          >
            <Edit2 className="w-4 h-4 mr-1" /> 編集
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            className="h-8 px-2 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" /> 削除
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
