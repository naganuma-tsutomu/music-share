export interface MusicPost {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;

  // 自分で定義するフィールド
  url: string;
  comment: string;
  username: string; // 投稿者名 (簡易的に)
  platform: 'youtube' | 'apple_music' | 'other';
  title?: string;
}