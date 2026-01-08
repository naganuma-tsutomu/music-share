'use client';

import { useActionState } from 'react';
import { login } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/30">
      <div className="w-full max-w-md mb-4 flex justify-start">
        <Button variant="ghost" size="icon" asChild className="rounded-full bg-background shadow-sm border border-border hover:bg-accent">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">ホームに戻る</span>
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>アカウントにログインして音楽をシェアしましょう。</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" name="email" type="email" required placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            
            {state?.success === false && (
              <p className="text-sm text-red-500">{state.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              ログイン
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            アカウントをお持ちでないですか？{' '}
            <Link href="/signup" className="text-primary hover:underline">
              サインアップ
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
