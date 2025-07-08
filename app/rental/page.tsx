import Link from "next/link";

const rentalVehicles = [
  {
    type: "平ボディ",
    image: "/placeholder.jpg",
    maker: "UD トラックス",
    model: "コンドル",
    modelCode: "000-0000000",
    year: "令和0年00月",
    capacity: "0,000kg",
    size: { l: "L0,000", w: "W0,000", h: "H0000" },
    totalWeight: "0,000kg",
    turbo: "あり",
    displacement: "0,000cc",
    fuel: "軽油",
    priceDay: "00,000",
    priceMonth: "00,000"
  },
  {
    type: "小型",
    image: "/placeholder.jpg",
    maker: "UD トラックス",
    model: "コンドル",
    modelCode: "000-0000000",
    year: "令和0年00月",
    capacity: "0,000kg",
    size: { l: "L0,000", w: "W0,000", h: "H0000" },
    totalWeight: "0,000kg",
    turbo: "あり",
    displacement: "0,000cc",
    fuel: "軽油",
    priceDay: "00,000",
    priceMonth: "00,000"
  },
  {
    type: "中型",
    image: "/placeholder.jpg",
    maker: "UD トラックス",
    model: "コンドル",
    modelCode: "000-0000000",
    year: "令和0年00月",
    capacity: "0,000kg",
    size: { l: "L0,000", w: "W0,000", h: "H0000" },
    totalWeight: "0,000kg",
    turbo: "あり",
    displacement: "0,000cc",
    fuel: "軽油",
    priceDay: "00,000",
    priceMonth: "00,000"
  },
  {
    type: "大型",
    image: "/placeholder.jpg",
    maker: "UD トラックス",
    model: "コンドル",
    modelCode: "000-0000000",
    year: "令和0年00月",
    capacity: "0,000kg",
    size: { l: "L0,000", w: "W0,000", h: "H0000" },
    totalWeight: "0,000kg",
    turbo: "あり",
    displacement: "0,000cc",
    fuel: "軽油",
    priceDay: "00,000",
    priceMonth: "00,000"
  }
];

export default function RentalPage() {
  return (
    <div className="bg-[#F7F7F7] min-h-screen flex flex-col">
      {/* ヒーロー画像＋タイトル */}
      <div className="relative w-full h-[220px] md:h-[320px] flex items-center justify-center">
        <img src="/placeholder.jpg" alt="レンタル車両" className="absolute w-full h-full object-cover brightness-75" />
        <h1 className="relative text-white text-3xl md:text-5xl font-bold tracking-wider">レンタル車両</h1>
      </div>
      {/* 一覧タイトル */}
      <div className="max-w-5xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-xs text-blue-700 tracking-widest mb-2">RENTAL</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">レンタル車両一覧</h2>
        </div>
        {/* 車両一覧 */}
        {rentalVehicles.map((v, idx) => (
          <div key={idx} className="mb-12">
            <div className="bg-black text-white px-4 py-2 text-lg font-bold mb-2">{v.type}</div>
            <div className="flex flex-col md:flex-row bg-white rounded shadow p-4 md:p-8">
              <img src={v.image} alt={v.model} className="w-full md:w-1/2 max-w-md object-cover rounded mb-4 md:mb-0 md:mr-8" />
              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="font-bold text-lg mb-2">料金</div>
                  <table className="mb-2">
                    <tbody>
                      <tr><td className="pr-4">当日</td><td className="font-mono text-xl">{v.priceDay}</td><td>円(税別)</td></tr>
                      <tr><td className="pr-4">1ヶ月</td><td className="font-mono text-xl">{v.priceMonth}</td><td>円(税別)</td></tr>
                    </tbody>
                  </table>
                  <div className="text-xs text-gray-700 mb-4">免責補償手数料：2000円税別(1日)</div>
                  <Link href="/contact">
                    <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-8 rounded shadow transition">予約を申し込む</button>
                  </Link>
                </div>
                <div className="mt-6">
                  <div className="text-xs text-gray-500 mb-1">DETAIL(車輌情報)</div>
                  <table className="w-full border-t border-blue-200 text-sm">
                    <tbody>
                      <tr><th className="text-left font-medium py-1">メーカー</th><td>{v.maker}</td><th className="text-left font-medium py-1">車体寸法(mm)</th><td>{v.size.l} {v.size.w} {v.size.h}</td></tr>
                      <tr><th className="text-left font-medium py-1">車種</th><td>{v.model}</td><th className="text-left font-medium py-1">車両総重量</th><td>{v.totalWeight}</td></tr>
                      <tr><th className="text-left font-medium py-1">型式</th><td>{v.modelCode}</td><th className="text-left font-medium py-1">過給器</th><td>{v.turbo}</td></tr>
                      <tr><th className="text-left font-medium py-1">年式</th><td>{v.year}</td><th className="text-left font-medium py-1">排気量</th><td>{v.displacement}</td></tr>
                      <tr><th className="text-left font-medium py-1">最大積載量</th><td>{v.capacity}</td><th className="text-left font-medium py-1">燃料</th><td>{v.fuel}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* レンタルの流れ */}
      <div className="bg-[#F3F3F3] py-16">
        <div className="max-w-2xl mx-auto w-full px-4">
          <div className="text-xs text-blue-700 tracking-widest mb-2">FLOW</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">レンタルの流れ</h2>
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-center text-gray-700 mb-8">お申し込みから返却までの流れをご紹介します。</p>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="text-blue-700 font-bold text-lg min-w-[48px]">FLOW<br/>01</div>
                <div>
                  <div className="font-bold mb-1">レンタルのお問い合わせ・お申し込み <span className='inline-block align-middle'>✉️</span></div>
                  <div className="text-gray-700 text-sm">「予約を申し込む」よりお問い合わせください。空車状況をすぐに確認したい方はお電話でのお問い合わせも可能です。</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-blue-700 font-bold text-lg min-w-[48px]">FLOW<br/>02</div>
                <div>
                  <div className="font-bold mb-1">ご連絡 <span className='inline-block align-middle'>🚚</span></div>
                  <div className="text-gray-700 text-sm">弊社より、「空き状況」「問い合わせ内容」などのご確認をさせて頂きます。※この時点では、予約は確定しておりません。</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-blue-700 font-bold text-lg min-w-[48px]">FLOW<br/>03</div>
                <div>
                  <div className="font-bold mb-1">ご来店・ご入金 <span className='inline-block align-middle'>🏢💴</span></div>
                  <div className="text-gray-700 text-sm">レンタル当日に、ご来店いただき必要書類をご記入・お支払いをしていただきます。レンタル開始時間はやや少し前に、お越しください。</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-blue-700 font-bold text-lg min-w-[48px]">FLOW<br/>04</div>
                <div>
                  <div className="font-bold mb-1">車両の引き渡し <span className='inline-block align-middle'>🔑</span></div>
                  <div className="text-gray-700 text-sm">車両のお引き渡しをします。弊社スタッフに車両の確認をして頂きます。</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-blue-700 font-bold text-lg min-w-[48px]">FLOW<br/>05</div>
                <div>
                  <div className="font-bold mb-1">車両のご返却 <span className='inline-block align-middle'>🔄</span></div>
                  <div className="text-gray-700 text-sm">お引き渡しと同様に、当社の本社または営業所にご返却ください。※当社では燃料満タン状態でのご返却をお願いしております。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 