import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "中古トラック販売 - グルーウェーブ",
  description: "業界最安値を目指す、千葉の中古トラック販売店です。",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
        {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
