import Link from "next/link";
import { news } from "./newsData";

export default function NewsListPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="w-full h-40 bg-gray-100 flex items-end justify-center" style={{backgroundImage: 'url(/news-header.jpg)', backgroundSize: 'cover'}}>
        <h1 className="text-4xl font-bold text-white mb-6 drop-shadow">お知らせ</h1>
      </div>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:underline">HOME</Link> &gt; お知らせ
          </nav>
          <ul className="space-y-4">
            {news.map((item) => (
              <li key={item.id} className="bg-white border rounded p-4 flex flex-col md:flex-row md:items-center md:gap-4">
                <div className="flex items-center gap-4 mb-2 md:mb-0">
                  <span className="text-sm text-gray-500">{item.date}</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                </div>
                <Link href={`/news/${item.id}`} className="font-medium hover:underline text-lg">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
} 