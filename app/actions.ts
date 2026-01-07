// app/actions.ts
'use server'

import { pb } from '@/lib/pocketbase';
import { revalidatePath } from 'next/cache';

// URLからタイトルを取得するヘルパー関数
async function fetchMetaTitle(url: string): Promise<string> {
  try {
    // 1. YouTubeの場合 (公式のoEmbed機能を使用・一番確実)
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        return data.title; // 動画タイトルを返す
      }
    }

    // 2. その他のサイト (Apple Musicなど)
    // ページのHTMLを取得して <title> タグの中身を簡易的に抜き出す
    const res = await fetch(url, { headers: { 'User-Agent': 'bot' } });
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);

    if (titleMatch && titleMatch[1]) {
      // "曲名 - アーティスト" などの余計な空白を除去して返す
      return titleMatch[1].replace(' - Apple Music', '').trim();
    }
  } catch (error) {
    console.error('Title fetch failed:', error);
  }

  return ''; // 失敗したら空文字
}

export async function addMusicPost(formData: FormData) {
  const url = formData.get('url') as string;
  const comment = formData.get('comment') as string;
  const username = formData.get('username') as string;

  // プラットフォーム自動判定
  let platform = 'other';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    platform = 'youtube';
  } else if (url.includes('music.apple.com')) {
    platform = 'apple_music';
  }

  // ★ここでタイトルを自動取得
  const title = await fetchMetaTitle(url);

  try {
    await pb.collection('music_posts').create({
      url,
      comment,
      username,
      platform,
      title, // 取得したタイトルも保存
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('PocketBase Error:', error);
    return { success: false };
  }
}