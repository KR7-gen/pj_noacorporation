"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminNewsNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [date, setDate] = useState("");

  // 日付をYYYY.MM.DD形式で返す関数
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  // 登録処理（本来はAPIやDB連携だが、ここではalertでモック）
  const handleRegister = () => {
    setDate(getToday());
    // ここでAPIやDBに保存する処理を入れる
    alert("お知らせを登録しました（モック）\n\n件名: " + title + "\n内容: " + detail + "\n日付: " + getToday());
    router.push("/admin/news");
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <input
          className="text-2xl font-bold border px-2 py-1 flex-1 mr-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="件名を入力"
        />
      </div>
      <div className="mb-6">
        <textarea
          className="w-full border rounded px-2 py-1 min-h-[180px]"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="内容を入力"
        />
      </div>
      <div className="flex justify-end">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={handleRegister}
        >
          更新する
        </button>
      </div>
      {date && <div className="mt-8 text-sm text-gray-500">日付: {date}</div>}
    </div>
  );
} 