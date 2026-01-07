
'use client'

import { addMusicPost } from '@/app/actions';
import { useRef } from 'react';
import { useFormStatus } from 'react-dom'; // 追加

export default function AddMusicForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus(); // 追加

  async function clientAction(formData: FormData) {
    // Server Actionを呼び出し
    const result = await addMusicPost(formData);

    if (result.success) {
      // 成功したらフォームをクリア
      formRef.current?.reset();
      alert('保存しました！');
    } else {
      alert('エラーが発生しました');
    }
  }

  return (
    <form ref={formRef} action={clientAction} className="bg-white p-4 rounded shadow mb-8">
      <h2 className="font-bold mb-4">新しい音楽を追加</h2>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">投稿者</label>
        <select name="username" className="w-full border p-2 rounded">
          <option value="自分">自分</option>
          <option value="友人A">友人A</option>
          <option value="友人B">友人B</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">URL</label>
        <input
          type="url"
          name="url"
          required
          placeholder="https://..."
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">コメント</label>
        <textarea
          name="comment"
          className="w-full border p-2 rounded"
          placeholder="ここが最高！"
        />
      </div>

      <button
        type="submit"
        disabled={pending} // 追加
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {pending ? '保存中...' : '保存する'} {/* 追加 */}
      </button>
    </form>
  );
}
