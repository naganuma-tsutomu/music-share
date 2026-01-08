'use server';

import { createClient } from '@/lib/pocketbase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const pb = await createClient();

  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    
    if (pb.authStore.isValid) {
        const token = pb.authStore.token;
        const model = pb.authStore.model;
        
        const authValue = JSON.stringify({ token, model });
        
        const cookieStore = await cookies();
        cookieStore.set('pb_auth', authValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });
    }

  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, message: 'メールアドレスまたはパスワードが間違っています。' };
  }

  redirect('/');
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('passwordConfirm') as string;
  const username = formData.get('username') as string;

  if (password !== passwordConfirm) {
    return { success: false, message: 'パスワードが一致しません。' };
  }

  const pb = await createClient();

  try {
    // ユーザー作成
    await pb.collection('users').create({
      email,
      password,
      passwordConfirm,
      username,
    });

    // 作成後、自動ログイン
    // loginアクションを直接呼ぶとredirectしてしまうため、内部ロジックを再利用するか、redirectをキャッチする必要がある。
    // ここでは再度 authWithPassword を行う。
    
    await pb.collection('users').authWithPassword(email, password);
    
    if (pb.authStore.isValid) {
        const token = pb.authStore.token;
        const model = pb.authStore.model;
        const authValue = JSON.stringify({ token, model });
        
        const cookieStore = await cookies();
        cookieStore.set('pb_auth', authValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });
    }

  } catch (error: any) {
    console.error('Signup failed:', error);
    const message = error?.data?.data?.username?.message || error?.data?.data?.email?.message || 'アカウント作成に失敗しました。';
    return { success: false, message };
  }

  redirect('/');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('pb_auth');
  redirect('/login');
}