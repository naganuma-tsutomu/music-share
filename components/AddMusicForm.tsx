'use client'

import { addMusicPost } from '@/app/actions';
import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function AddMusicForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  async function clientAction(formData: FormData) {
    const result = await addMusicPost(formData);

    if (result.success) {
      formRef.current?.reset();
      toast.success('保存しました！');
    } else {
      toast.error('エラーが発生しました');
    }
  }

  return (
    <form ref={formRef} action={clientAction} className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="username">
          投稿者
        </Label>
        {/* Using native select with Input styles for simplicity without Radix Select */}
        <div className="relative">
            <select 
                id="username"
                name="username" 
                className={cn(
                  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                )}
            >
            <option value="自分">自分</option>
            <option value="友人A">友人A</option>
            <option value="友人B">友人B</option>
            </select>
             <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="url">
          URL
        </Label>
        <Input
          type="url"
          id="url"
          name="url"
          required
          placeholder="https://..."
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="comment">
          コメント
        </Label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="ここが最高！"
          rows={3}
        />
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