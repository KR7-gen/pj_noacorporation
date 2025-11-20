import Link from "next/link";

export default function RentalPage() {
  return (
    <div className="bg-[#F7F7F7] min-h-screen flex flex-col">
      {/* 1. Main Headline */}
      <div className="relative w-full h-[28rem] flex items-center justify-center">
        <img src="/sub_background.jpg" alt="レンタル車両" className="absolute w-full h-full object-cover brightness-75" />
        <div 
          className="absolute w-full h-full"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.4) 43.5%, rgba(255, 255, 255, 0) 100%)'
          }}
        />
        <h1 className="relative text-white text-3xl md:text-5xl font-bold tracking-wider">レンタル車両一覧</h1>
      </div>

      {/* 2. RENTAL */}
      <div className="w-full max-w-[1000px] mx-auto px-4 py-12">
        <div style={{ marginBottom: "2.857rem", display: "flex", justifyContent: "center" }}>
          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div 
              style={{
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "1.8rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "left",
                color: "#1A1A1A",
                whiteSpace: "nowrap",
                marginBottom: "0.57rem",
              }}
            >
              レンタル車両サービスのご案内
            </div>
          </div>
        </div>
        
        {/* レンタルサービス詳細リンク */}
        <div className="text-center py-8">
          <p className="text-lg mb-4">
            当社のレンタルサービスに関しましてはこちらから詳細ご確認願います。
          </p>
          <a 
            href="https://torakari.jp/shop/detail/36" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            https://torakari.jp/shop/detail/36
          </a>
        </div>
      </div>
    </div>
  );
} 