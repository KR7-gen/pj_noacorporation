"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getAnnouncements } from "@/lib/firebase-utils";
import type { Announcement } from "@/types";

export default function NewsDetailPage({ params }: { params: any }) {
  const id = typeof params.then === "function" ? use(params).id : params.id;
  const [item, setItem] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncements().then((list) => {
      const found = list.find((n) => n.id === id);
      setItem(found || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">読み込み中...</div>;
  }

  if (!item) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">お知らせが見つかりません</h1>
        <Link href="/news" className="text-blue-600 underline">お知らせ一覧へ戻る</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="w-full h-40 bg-gray-100 flex items-end justify-center" style={{backgroundImage: 'url(/news-header.jpg)', backgroundSize: 'cover'}}>
        <h1 className="text-4xl font-bold text-white mb-6 drop-shadow">お知らせ</h1>
      </div>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-gray-500">{item.createdAt instanceof Date ? `${item.createdAt.getFullYear()}.${String(item.createdAt.getMonth()+1).padStart(2,"0")}.${String(item.createdAt.getDate()).padStart(2,"0")}` : ""}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">お知らせ</span>
        </div>
        <div className="whitespace-pre-line text-base text-gray-800 mb-12">
          {item.content}
        </div>
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:underline">HOME</Link> &gt; <Link href="/news" className="hover:underline">お知らせ</Link> &gt; {item.title}
        </nav>
      </main>
    </div>
  );
} 