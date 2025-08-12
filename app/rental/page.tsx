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
      {/* 1. Main Headline */}
      <div className="relative w-full h-[28rem] flex items-center justify-center">
        <img src="/sub_background.jpg" alt="レンタル車両" className="absolute w-full h-full object-cover brightness-75" />
        <div 
          className="absolute w-full h-full"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.4) 43.5%, rgba(255, 255, 255, 0) 100%)'
          }}
        />
        <h1 className="relative text-white text-3xl md:text-5xl font-bold tracking-wider">レンタル車両</h1>
      </div>

      {/* 2. RENTAL */}
      <div className="w-full max-w-[1000px] mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-xs text-blue-700 tracking-widest mb-2">RENTAL</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">レンタル車両一覧</h2>
        </div>
        
        {/* 車両一覧 */}
        {rentalVehicles.map((v, idx) => (
          <div key={idx} className="mb-[2.857rem]">
            {/* 1. 車両タイトル */}
            <div className="bg-black text-white px-4 py-2 text-lg font-bold mb-2">{v.type}</div>
            
            {/* 2. 写真と3. 料金+申し込みボタンを横並びにするコンテナ */}
            <div className="flex flex-col md:flex-row bg-white rounded shadow mb-2">
              {/* 2. 写真 */}
              <div 
                className="bg-gray-300 mb-4 md:mb-0 md:mr-8"
                style={{
                  width: '42.7%',
                  height: '22.857rem', // 320px ÷ 14px = 22.857rem
                  marginLeft: 0,
                  marginRight: 0
                }}
              />
              
               {/* 3. 料金 +申し込みボタン */}
               <div 
                 className="flex flex-col justify-center items-center"
                 style={{ width: '57.3%' }}
               >
                                   {/* 料金 */}
                  <div className="text-center mb-4 flex flex-col items-center">
                    <div className="font-bold text-lg mb-2 text-left w-full">料金</div>
                    <table className="mb-2" style={{borderCollapse: 'collapse', width: '150%'}}>
                      <tbody>
                        <tr>
                          <td style={{width: '50%', background: '#F2F2F2', height: '3.429rem', borderWidth: '0px 1px 1px 1px', borderStyle: 'solid', borderColor: '#CCCCCC'}}>当日</td>
                          <td style={{width: '50%', height: '3.429rem', borderWidth: '0px 1px 1px 1px', borderStyle: 'solid', borderColor: '#CCCCCC'}}>{v.priceDay}円(税別)</td>
                        </tr>
                        <tr>
                          <td style={{width: '50%', background: '#F2F2F2', height: '3.429rem', borderWidth: '0px 1px 1px 1px', borderStyle: 'solid', borderColor: '#CCCCCC'}}>1ヶ月</td>
                          <td style={{width: '50%', height: '3.429rem', borderWidth: '0px 1px 1px 1px', borderStyle: 'solid', borderColor: '#CCCCCC'}}>{v.priceMonth}円(税別)</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="text-xs text-gray-700 text-left w-full">免責補償手数料：2000円税別(1日)</div>
                  </div>
                 
                 {/* 申し込みボタン */}
                 <div className="text-center flex justify-center">
                   <Link href="/contact">
                     <button 
                       className="text-white font-bold rounded transition flex items-center justify-center gap-2"
                       style={{
                         width: '120%',
                         height: '2.857rem', // 40px ÷ 14px = 2.857rem
                         background: 'linear-gradient(180deg, #1154AF 0%, #053B65 100%)',
                         boxShadow: '2px 2px 2px 0px #00000040'
                       }}
                     >
                       予約を申し込む
                       <svg 
                         width="16" 
                         height="16" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         xmlns="http://www.w3.org/2000/svg"
                       >
                         <path 
                           d="M9.4 18L15.4 12L9.4 6" 
                           stroke="currentColor" 
                           strokeWidth="2" 
                           strokeLinecap="round" 
                           strokeLinejoin="round"
                         />
                       </svg>
                     </button>
                   </Link>
                 </div>
               </div>
            </div>
            
            {/* 4. 車両の詳細・仕様 */}
            <div className="bg-white rounded shadow">
              <div style={{
                fontSize: '1rem',
                fontStyle: 'normal',
                color: '#1a1a1a',
                marginBottom: '0.25rem',
                padding: '1rem',
                paddingTop: '1rem',
                paddingBottom: '0'
              }}>DETAIL(車輌情報)</div>
              <table className="w-full" style={{borderCollapse: 'collapse'}}>
                <tbody>
                  <tr>
                    <th className="text-left px-4" style={{
                      width: '16%', 
                      background: '#F2F2F2', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>メーカー</th>
                    <td className="px-4" style={{
                      width: '34%', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontStyle: 'normal',
                      color: '#1a1a1a'
                    }}>{v.maker}</td>
                    <th className="text-left px-4" style={{
                      width: '16%', 
                      background: '#F2F2F2', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>車体寸法(mm)</th>
                    <td className="px-4" style={{
                      width: '34%', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontStyle: 'normal',
                      color: '#1a1a1a'
                    }}>{v.size.l} {v.size.w} {v.size.h}</td>
                  </tr>
                  <tr>
                    <th className="text-left px-4" style={{
                      width: '16%', 
                      background: '#F2F2F2', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>車種</th>
                    <td className="px-4" style={{
                      width: '34%', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontStyle: 'normal',
                      color: '#1a1a1a'
                    }}>{v.model}</td>
                    <th className="text-left px-4" style={{
                      width: '16%', 
                      background: '#F2F2F2', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>車両総重量</th>
                    <td className="px-4" style={{
                      width: '34%', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontStyle: 'normal',
                      color: '#1a1a1a'
                    }}>{v.totalWeight}</td>
                  </tr>
                  <tr>
                    <th className="text-left px-4" style={{
                      width: '16%', 
                      background: '#F2F2F2', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>型式</th>
                    <td className="px-4" style={{
                      width: '34%', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontStyle: 'normal',
                      color: '#1a1a1a'
                    }}>{v.modelCode}</td>
                    <th className="text-left px-4" style={{
                      width: '16%', 
                      background: '#F2F2F2', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>過給器</th>
                    <td className="px-4" style={{
                      width: '34%', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontStyle: 'normal',
                      color: '#1a1a1a'
                    }}>{v.turbo}</td>
                  </tr>
                  <tr>
                    <th className="text-left px-4" style={{
                      width: '16%', 
                      background: '#F2F2F2', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>年式</th>
                    <td className="px-4" style={{
                      width: '34%', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontStyle: 'normal',
                      color: '#1a1a1a'
                    }}>{v.year}</td>
                    <th className="text-left px-4" style={{
                      width: '16%', 
                      background: '#F2F2F2', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>排気量</th>
                    <td className="px-4" style={{
                      width: '34%', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontStyle: 'normal',
                      color: '#1a1a1a'
                    }}>{v.displacement}</td>
                  </tr>
                  <tr>
                    <th className="text-left px-4" style={{
                      width: '16%', 
                      background: '#F2F2F2', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>最大積載量</th>
                    <td className="px-4" style={{
                      width: '34%', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontStyle: 'normal',
                      color: '#1a1a1a'
                    }}>{v.capacity}</td>
                    <th className="text-left px-4" style={{
                      width: '16%', 
                      background: '#F2F2F2', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>燃料</th>
                    <td className="px-4" style={{
                      width: '34%', 
                      height: '3.143rem', 
                      borderWidth: '0px 1px 1px 1px', 
                      borderStyle: 'solid', 
                      borderColor: '#CCCCCC',
                      fontSize: '1rem',
                      fontStyle: 'normal',
                      color: '#1a1a1a'
                    }}>{v.fuel}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* 3. FLOW */}
      <div className="bg-[#F3F3F3] py-16">
        <div className="w-full max-w-[1000px] mx-auto px-4">
          <div className="text-xs text-blue-700 tracking-widest mb-2 text-left" style={{position: 'relative', left: '25.2rem'}}>FLOW</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">レンタルの流れ</h2>
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-center text-gray-700 mb-8">お申し込みから返却までの流れをご紹介します。</p>
                         <div className="space-y-8">
               <div className="flex items-start">
                 <div className="text-blue-700 font-bold flex flex-col items-center justify-center" style={{
                   height: '6.75rem',
                   width: '10.8%',
                   borderRight: '1px solid #DEEBEF',
                   marginRight: '0.75rem'
                 }}>
                   <div className="text-sm">FLOW</div>
                   <div className="text-3xl">01</div>
                 </div>
                                  <div>
                    <div className="font-bold" style={{
                      height: '2.5rem',
                      marginBottom: '0.5rem',
                      fontSize: '1.25rem'
                    }}>レンタルのお問い合わせ・お申し込み <span className='inline-block align-middle'>✉️</span></div>
                                        <div style={{
                       height: '3.5rem',
                       fontFamily: 'Noto Sans JP',
                       fontStyle: 'normal',
                       fontSize: '1rem',
                       color: '#1a1a1a'
                     }}>「予約を申し込む」よりお問い合わせください。<br />空車状況をすぐに確認したい方はお電話でのお問い合わせも可能です。</div>
                   </div>
                 </div>
                 
                                   {/* 上向き三角形 */}
                  <div className="flex justify-center w-full" style={{marginTop: '1.25rem', marginBottom: '1.25rem'}}>
                    <svg width="3.875rem" height="1.25rem" viewBox="0 0 62 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31 20L0 0H62L31 20Z" fill="#2B5EC5"/>
                    </svg>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-blue-700 font-bold flex flex-col items-center justify-center" style={{
                      height: '6.75rem',
                      width: '10.8%',
                      borderRight: '1px solid #DEEBEF',
                      marginRight: '0.75rem'
                    }}>
                      <div className="text-sm">FLOW</div>
                      <div className="text-3xl">02</div>
                    </div>
                   <div>
                     <div className="font-bold" style={{
                       height: '2.5rem',
                       marginBottom: '0.5rem',
                       fontSize: '1.25rem'
                     }}>ご連絡 <span className='inline-block align-middle'>🚚</span></div>
                     <div style={{
                       height: '3.5rem',
                       fontFamily: 'Noto Sans JP',
                       fontStyle: 'normal',
                       fontSize: '1rem',
                       color: '#1a1a1a'
                     }}>弊社より、「空き状況」「問い合わせ内容」などのご確認をさせて頂きます。<br />※この時点では、予約は確定しておりません。</div>
                   </div>
                 </div>
                 
                                   {/* 上向き三角形 */}
                  <div className="flex justify-center w-full" style={{marginTop: '1.25rem', marginBottom: '1.25rem'}}>
                    <svg width="3.875rem" height="1.25rem" viewBox="0 0 62 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31 20L0 0H62L31 20Z" fill="#2B5EC5"/>
                    </svg>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-blue-700 font-bold flex flex-col items-center justify-center" style={{
                      height: '6.75rem',
                      width: '10.8%',
                      borderRight: '1px solid #DEEBEF',
                      marginRight: '0.75rem'
                    }}>
                      <div className="text-sm">FLOW</div>
                      <div className="text-3xl">03</div>
                    </div>
                   <div>
                     <div className="font-bold" style={{
                       height: '2.5rem',
                       marginBottom: '0.5rem',
                       fontSize: '1.25rem'
                     }}>ご来店・ご入金 <span className='inline-block align-middle'>🏢💴</span></div>
                     <div style={{
                       height: '3.5rem',
                       fontFamily: 'Noto Sans JP',
                       fontStyle: 'normal',
                       fontSize: '1rem',
                       color: '#1a1a1a'
                     }}>レンタル当日に、ご来店いただき必要書類をご記入・お支払いをしていただきます。<br />レンタル開始時間はやや少し前に、お越しください。</div>
                   </div>
                 </div>
                 
                                   {/* 上向き三角形 */}
                  <div className="flex justify-center w-full" style={{marginTop: '1.25rem', marginBottom: '1.25rem'}}>
                    <svg width="3.875rem" height="1.25rem" viewBox="0 0 62 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31 20L0 0H62L31 20Z" fill="#2B5EC5"/>
                    </svg>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-blue-700 font-bold flex flex-col items-center justify-center" style={{
                      height: '6.75rem',
                      width: '10.8%',
                      borderRight: '1px solid #DEEBEF',
                      marginRight: '0.75rem'
                    }}>
                      <div className="text-sm">FLOW</div>
                      <div className="text-3xl">04</div>
                    </div>
                   <div>
                     <div className="font-bold" style={{
                       height: '2.5rem',
                       marginBottom: '0.5rem',
                       fontSize: '1.25rem'
                     }}>車両の引き渡し <span className='inline-block align-middle'>🔑</span></div>
                     <div style={{
                       height: '3.5rem',
                       fontFamily: 'Noto Sans JP',
                       fontStyle: 'normal',
                       fontSize: '1rem',
                       color: '#1a1a1a'
                     }}>車両のお引き渡しをします。<br />弊社スタッフに車両の確認をして頂きます。</div>
                   </div>
                 </div>
                 
                                   {/* 上向き三角形 */}
                  <div className="flex justify-center w-full" style={{marginTop: '1.25rem', marginBottom: '1.25rem'}}>
                    <svg width="3.875rem" height="1.25rem" viewBox="0 0 62 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31 20L0 0H62L31 20Z" fill="#2B5EC5"/>
                    </svg>
                  </div>
                 
                 <div className="flex items-start">
                   <div className="text-blue-700 font-bold flex flex-col items-center justify-center" style={{
                     height: '6.75rem',
                     width: '10.8%',
                     borderRight: '1px solid #DEEBEF',
                     marginRight: '0.75rem'
                   }}>
                     <div className="text-sm">FLOW</div>
                     <div className="text-3xl">05</div>
                   </div>
                   <div>
                     <div className="font-bold" style={{
                       height: '2.5rem',
                       marginBottom: '0.5rem',
                       fontSize: '1.25rem'
                     }}>車両のご返却 <span className='inline-block align-middle'>🔄</span></div>
                     <div style={{
                       height: '3.5rem',
                       fontFamily: 'Noto Sans JP',
                       fontStyle: 'normal',
                       fontSize: '1rem',
                       color: '#1a1a1a'
                     }}>お引き渡しと同様に、当社の本社または営業所にご返却ください。<br />※当社では燃料満タン状態でのご返却をお願いしております。</div>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 