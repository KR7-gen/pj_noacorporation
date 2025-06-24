"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAnnouncements } from "@/lib/firebase-utils";
import type { Announcement } from "@/types";

export default function AdminNewsPage() {
  const [news, setNews] = useState<Announcement[]>([]);
  useEffect(() => {
    getAnnouncements().then(setNews);
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">お知らせ管理</h1>
        <Link href="/admin/news/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">新規</button>
        </Link>
      </div>
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">日付</th>
              <th className="px-4 py-3 text-left">件名</th>
              <th className="px-4 py-3 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {news.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">{item.createdAt instanceof Date ? `${item.createdAt.getFullYear()}.${String(item.createdAt.getMonth()+1).padStart(2,"0")}.${String(item.createdAt.getDate()).padStart(2,"0")}` : ""}</td>
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/admin/news/${item.id}`}>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded">詳細</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 