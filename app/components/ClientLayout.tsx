'use client'

import { usePathname } from "next/navigation"
import { Header } from "./Header"
import { Footer } from "@/components/Footer"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <div className="bg-white">
      {!isAdminPage && <Header />}
      {children}
      {!isAdminPage && <Footer />}
    </div>
  )
} 