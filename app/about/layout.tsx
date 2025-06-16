export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">私たちについて</h1>
          <p className="text-xl mt-2">COMPANY INFORMATION</p>
        </div>
      </section>
      {children}
    </div>
  )
} 