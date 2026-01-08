// app/actions.ts
'use server'

import { createClient } from '@/lib/pocketbase';
import { revalidatePath } from 'next/cache';

// URLからメタデータ（タイトル・画像）を取得する関数
async function fetchMetaData(url: string) {
  let title = '';
  let thumbnail = '';

  try {
    // 1. YouTubeの場合 (専用処理)
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // タイトルはoEmbedで取得
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        title = data.title;
        // サムネイルは高画質版を生成
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        if (videoId) {
          thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }
      }
    }
    // 2. Apple Music やその他 (OGPタグからスクレイピング)
    else {
      const res = await fetch(url, { headers: { 'User-Agent': 'bot' } });
      const html = await res.text();

      // <title>タグの取得
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(' - Apple Music', '').trim();
      }

      // <meta property="og:image" ...> の取得
      const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
      if (imageMatch && imageMatch[1]) {
        thumbnail = imageMatch[1];

        // Apple Musicの画像はサイズ指定ができる場合があるので、高画質化の調整（任意）
        // 例: {w}x{h}bb.jpg -> 600x600bb.jpg に置換など
        thumbnail = thumbnail.replace('{w}x{h}', '600x600');
      }
    }
  } catch (error) {
    console.error('Metadata fetch failed:', error);
  }

  return { title, thumbnail };
}

export async function addMusicPost(formData: FormData) {
  const pb = await createClient();
  const url = formData.get('url') as string;
  const comment = formData.get('comment') as string;
  
  // ログインしているユーザーがいればその名前を使用、いなければフォームの値（またはAnonymous）
  const username = pb.authStore.model?.username || (formData.get('username') as string) || 'Anonymous';

  let platform = 'other';
  if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'youtube';
  else if (url.includes('music.apple.com')) platform = 'apple_music';

  // ★メタデータを一括取得
  const { title, thumbnail } = await fetchMetaData(url);

  try {
    await pb.collection('music_posts').create({
      url,
      comment,
      username,
      platform,
      title,
      thumbnail, // 画像URLも保存
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('PocketBase Error:', error);
    return { success: false };
  }
}

export async function updateMusicPost(formData: FormData) {
  const pb = await createClient();
  const id = formData.get('id') as string;
  const url = formData.get('url') as string;
  const comment = formData.get('comment') as string;
  
  // 更新時もログインユーザーを優先
  const username = pb.authStore.model?.username || (formData.get('username') as string) || 'Anonymous';

  let platform = 'other';
  if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'youtube';
  else if (url.includes('music.apple.com')) platform = 'apple_music';

  // メタデータを再取得（URLが変更されている可能性があるため）
  const { title, thumbnail } = await fetchMetaData(url);

  try {
    await pb.collection('music_posts').update(id, {
      url,
      comment,
      username,
      platform,
      title,
      thumbnail,
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('PocketBase Update Error:', error);
    return { success: false };
  }
}

export async function deleteMusicPost(id: string) {
  const pb = await createClient();
  try {
    await pb.collection('music_posts').delete(id);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('PocketBase Delete Error:', error);
    return { success: false };
  }
}