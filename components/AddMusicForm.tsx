'use client'

import { addMusicPost } from '@/app/actions';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { X } from 'lucide-react';
import { User } from '@/types';

export default function AddMusicForm({ onSuccess, user }: { onSuccess?: () => void, user?: User | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  const [url, setUrl] = useState('');
  const [comment, setComment] = useState('');

  async function clientAction(formData: FormData) {
    const result = await addMusicPost(formData);

    if (result.success) {
      formRef.current?.reset();
      setUrl('');
      setComment('');
      toast.success('保存しました！');
      onSuccess?.();
    } else {
      toast.error('エラーが発生しました');
    }
  }

  return (
    <form ref={formRef} action={clientAction} className="space-y-4">
      {/* 投稿者フィールドを削除。サーバー側で認証ユーザー名を使用。 */}
      
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="url">
          URL
        </Label>
        <div className="relative">
            <Input
              type="url"
              id="url"
              name="url"
              required
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pr-8"
            />
            {url && (
                <button 
                    type="button" 
                    onClick={() => setUrl('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="comment">
          コメント
        </Label>
        <div className="relative">
            <Textarea
              id="comment"
              name="comment"
              placeholder="ここが最高！"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="pr-8"
            />
            {comment && (
                <button 
                    type="button" 
                    onClick={() => setComment('')}
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending} 
        className="w-full"
      >
        {pending ? '保存中...' : '保存する'} 
      </Button>
    </form>
  );
}