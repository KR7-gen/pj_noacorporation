"use client"

export function Header() {
  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault()
    const form = document.createElement('form')
    form.method = 'get'
    form.action = '/contact'
    document.body.appendChild(form)
    form.submit()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center">
            <span className="text-lg font-bold">NOA CORPORATION</span>
            <span className="ml-2 text-sm text-gray-500">株式会社ノアコーポレーション</span>
          </a>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              HOME
            </a>
            <a
              href="/inventory"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              販売在庫一覧
            </a>
            <a
              href="/purchase"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              買取はこちら
            </a>
            <a
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              私たちについて
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <div className="text-base font-bold text-gray-900">000-000-0000</div>
              <div className="text-xs text-gray-500">(受付時間) 月〜土 00:00-00:00</div>
            </div>
            <form action="/contact" method="get" className="m-0 p-0">
              <button 
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-[#4169E1] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3154B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1] transition-colors duration-200"
              >
                お問い合わせフォームへ
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
} 