import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

// クライアントサイド用（シングルトンでも良いが、基本はサーバーサイド経由で使うことを推奨）
export const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

export const COLLECTIONS = {
  MUSIC_POSTS: 'music_posts',
  USERS: 'users',
};

// サーバーサイド用（Server Actions / Server Components）
export async function createClient() {
  const cookieStore = await cookies();
  const client = new PocketBase(PB_URL);
  client.autoCancellation(false);

  // リクエストのクッキーから認証情報をロード
  const authCookie = cookieStore.get('pb_auth');
  if (authCookie) {
    try {
      const auth = JSON.parse(authCookie.value);
      client.authStore.save(auth.token, auth.model);
    } catch (e) {
      // JSONパースに失敗した場合（または以前の形式）は loadFromCookie を試す
      client.authStore.loadFromCookie(authCookie.value);
    }
  }

  return client;
}