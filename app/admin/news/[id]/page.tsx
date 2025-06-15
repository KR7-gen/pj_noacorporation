"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { news as initialNews } from "../../../news/newsData";

export default function AdminNewsDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const newsItem = initialNews.find((n) => n.id === params.id);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(newsItem?.title || "");
  const [detail, setDetail] = useState(newsItem?.detail || "");
  const [date, setDate] = useState(newsItem?.date || "");

  if (!newsItem) {
    return <div className="p-8">お知らせが見つかりません</div>;
  }

  // 日付をYYYY.MM.DD形式で返す関数
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  // 更新処理（本来はAPIやDB連携だが、ここではalertでモック）
  const handleUpdate = () => {
    setDate(getToday());
    // ここでAPIやDBに保存する処理を入れる
    alert("お知らせを更新しました（モック）\n\n件名: " + title + "\n内容: " + detail + "\n日付: " + getToday());
    setIsEdit(false);
    // ユーザー側newsDataにも反映する場合はAPI/DB必須
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        {isEdit ? (
          <input
            className="text-2xl font-bold border px-2 py-1 flex-1 mr-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="text-2xl font-bold">{title}</h1>
        )}
        <button
          className="ml-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          onClick={() => setIsEdit((v) => !v)}
        >
          {isEdit ? "編集をやめる" : "編集する"}
        </button>
      </div>
      <div className="mb-6">
        {isEdit ? (
          <textarea
            className="w-full border rounded px-2 py-1 min-h-[180px]"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        ) : (
          <pre className="whitespace-pre-line text-base text-gray-800">{detail}</pre>
        )}
      </div>
      {isEdit && (
        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={handleUpdate}
          >
            更新する
          </button>
        </div>
      )}
      <div className="mt-8 text-sm text-gray-500">日付: {date}</div>
    </div>
  );
} 