export const APP_DATE = "2026-09-23";

export const economicNodes = {
  "us-inflation": {
    id: "us-inflation",
    name: "미국 물가",
    category: "물가",
    region: "미국",
    status: "최근 흐름 확인 필요",
    change: "CPI 발표 이후 기대 재조정",
    metric: "CPI · PCE",
    what: "미국의 상품과 서비스 가격 흐름이에요. 시장은 헤드라인 물가뿐 아니라 에너지와 식품을 제외한 근원 지표도 함께 살펴봐요.",
    watch: ["미국 CPI", "PCE 물가지수", "기대인플레이션"],
    sources: ["U.S. BLS", "U.S. BEA"],
    updated: "09.23 09:40"
  },
  "us-rate": {
    id: "us-rate",
    name: "미국 금리",
    category: "금리",
    region: "미국",
    status: "기대 변화",
    change: "금리 경로에 대한 눈높이 조정",
    metric: "정책금리 · 국채금리",
    what: "미국의 정책금리와 시장금리 기대가 다시 조정되고 있어요. 물가·고용 지표와 Fed의 설명을 함께 봐야 방향을 더 잘 이해할 수 있어요.",
    watch: ["Fed 회의", "미국 CPI", "미국 고용보고서"],
    sources: ["Federal Reserve", "U.S. Treasury"],
    updated: "09.23 10:10"
  },
  dollar: {
    id: "dollar",
    name: "달러",
    category: "환율",
    region: "글로벌",
    status: "강도 변화",
    change: "금리 기대와 함께 변동",
    metric: "달러지수",
    what: "주요 통화 대비 달러의 상대적인 강도를 뜻해요. 미국 금리, 위험 선호, 다른 지역의 통화정책이 함께 영향을 줄 수 있어요.",
    watch: ["미국 금리", "Fed 주요 발언", "달러지수"],
    sources: ["Federal Reserve", "ICE Benchmark Administration"],
    updated: "09.23 10:15"
  },
  usdkrw: {
    id: "usdkrw",
    name: "원/달러 환율",
    category: "환율",
    region: "한국",
    status: "변동 확대",
    change: "장중 움직임이 커지는 구간",
    metric: "USD/KRW",
    what: "최근 원/달러 환율의 움직임이 커지고 있어요. 달러 흐름과 외국인 자금, 국내외 금리 여건 등이 함께 관련될 수 있어요.",
    watch: ["미국 CPI", "Fed 회의", "한국은행 회의", "달러지수"],
    sources: ["Bank of Korea", "Federal Reserve"],
    updated: "09.23 10:20"
  },
  "import-prices": {
    id: "import-prices",
    name: "수입물가",
    category: "물가",
    region: "한국",
    status: "비용 경로 주시",
    change: "환율·유가 영향 점검",
    metric: "수입물가지수",
    what: "해외에서 들여오는 원재료와 상품의 원화 가격 흐름이에요. 환율과 국제 원자재 가격이 중요한 연결 고리가 될 수 있어요.",
    watch: ["수입물가지수", "원/달러 환율", "국제유가"],
    sources: ["Bank of Korea", "Korea Customs Service"],
    updated: "09.23 08:30"
  },
  "consumer-prices": {
    id: "consumer-prices",
    name: "소비자물가",
    category: "물가",
    region: "한국",
    status: "둔화 속도 확인",
    change: "서비스·생활물가 차이",
    metric: "CPI",
    what: "가계가 소비하는 상품과 서비스의 가격 변화를 보여주는 지표예요. 품목별 움직임과 근원물가를 함께 확인하는 것이 좋아요.",
    watch: ["한국 CPI", "근원물가", "생활물가지수"],
    sources: ["Statistics Korea", "Bank of Korea"],
    updated: "09.23 08:00"
  },
  inflation: {
    id: "inflation",
    name: "인플레이션",
    category: "경제 개념",
    region: "글로벌",
    status: "30초 이해",
    change: "물가의 전반적·지속적 상승",
    metric: "CPI · PCE · 근원물가",
    what: "한마디로, 전반적인 물가가 지속적으로 오르는 현상이에요. 한두 품목의 일시적인 가격 상승과는 구분해 여러 지표와 기간을 함께 살펴봐야 해요.",
    learn: [
      ["수요", "사람들의 소비가 강해지면 가격 상승 압력으로 이어질 수 있어요."],
      ["비용", "원자재·인건비 같은 기업 비용이 상품 가격에 영향을 줄 수 있어요."],
      ["통화·신용", "돈과 신용 여건이 소비·투자를 통해 물가 압력과 연결될 수 있어요."],
      ["환율", "수입 가격 변화가 국내 생산비와 소비자 가격에 전달될 수 있어요."]
    ],
    watch: ["CPI 소비자물가지수", "PCE 물가지수", "근원물가"],
    sources: ["Bank of Korea", "U.S. BLS", "U.S. BEA"],
    updated: "09.23 09:30"
  },
  consumption: {
    id: "consumption",
    name: "소비",
    category: "실물경제",
    region: "글로벌",
    status: "수요 흐름",
    change: "가계 지출 강도 확인",
    metric: "소매판매 · 소비지출",
    what: "가계의 상품과 서비스 지출이에요. 소득, 금리, 심리와 함께 움직이며 가격과 성장에 영향을 줄 수 있어요.",
    watch: ["소매판매", "소비자심리지수", "가계소득"],
    sources: ["Statistics Korea", "U.S. Census Bureau"],
    updated: "09.22 16:00"
  },
  "raw-materials": {
    id: "raw-materials",
    name: "원자재 비용",
    category: "원자재",
    region: "글로벌",
    status: "품목별 차별화",
    change: "에너지·금속 가격 점검",
    metric: "원자재 지수",
    what: "생산에 투입되는 에너지·금속·곡물 등의 가격이에요. 기업 비용을 거쳐 상품과 서비스 가격에 영향을 줄 수 있어요.",
    watch: ["에너지 가격", "산업금속", "곡물 가격"],
    sources: ["World Bank", "CME Group"],
    updated: "09.23 09:00"
  },
  "money-credit": {
    id: "money-credit",
    name: "통화·신용",
    category: "금융여건",
    region: "글로벌",
    status: "유동성 여건",
    change: "신용 공급 강도 확인",
    metric: "M2 · 신용증가율",
    what: "경제 안의 통화량과 대출·신용 공급 여건이에요. 소비와 투자를 거쳐 수요와 물가에 연결될 수 있어요.",
    watch: ["M2", "은행 대출", "금융상황지수"],
    sources: ["Bank of Korea", "Federal Reserve"],
    updated: "09.22 15:30"
  },
  "interest-rate": {
    id: "interest-rate",
    name: "금리",
    category: "금리",
    region: "글로벌",
    status: "정책 반응",
    change: "물가·성장 균형 주시",
    metric: "정책금리",
    what: "돈을 빌리고 맡기는 가격이에요. 중앙은행의 정책과 시장 기대가 대출·자산가격·환율 등 다양한 경로에 영향을 줄 수 있어요.",
    watch: ["중앙은행 회의", "물가", "성장률"],
    sources: ["Bank of Korea", "Federal Reserve", "Bank of Japan"],
    updated: "09.23 09:20"
  },
  loan: {
    id: "loan",
    name: "대출",
    category: "생활경제",
    region: "한국",
    status: "부담 변화",
    change: "대출금리 전가 시차",
    metric: "가계대출금리",
    what: "가계와 기업이 자금을 빌리는 활동이에요. 정책금리와 은행의 조달 비용이 시차를 두고 대출 조건에 반영될 수 있어요.",
    watch: ["대출금리", "가계대출", "연체율"],
    sources: ["Bank of Korea", "Financial Services Commission"],
    updated: "09.22 14:10"
  },
  housing: {
    id: "housing",
    name: "부동산",
    category: "생활경제",
    region: "한국",
    status: "지역별 차이",
    change: "금리와 공급 여건 확인",
    metric: "주택가격지수",
    what: "주택 가격과 거래 흐름이에요. 금리, 소득, 공급, 지역 수요 같은 여러 요인이 함께 작용할 수 있어요.",
    watch: ["주택가격", "거래량", "주택담보대출"],
    sources: ["Korea Real Estate Board", "Bank of Korea"],
    updated: "09.22 11:00"
  },
  oil: {
    id: "oil",
    name: "국제유가",
    category: "원자재",
    region: "글로벌",
    status: "변동성 확대",
    change: "공급 뉴스와 수요 전망 교차",
    metric: "WTI · Brent",
    what: "세계 시장에서 거래되는 원유 가격이에요. 산유국 공급, 지정학, 세계 수요 전망과 재고가 복합적으로 관련될 수 있어요.",
    watch: ["OPEC+ 회의", "미국 원유재고", "세계 수요 전망"],
    sources: ["U.S. EIA", "OPEC", "ICE"],
    updated: "09.23 10:05"
  },
  "transport-cost": {
    id: "transport-cost",
    name: "운송비",
    category: "기업비용",
    region: "글로벌",
    status: "비용 전가 확인",
    change: "연료비·물류비 영향",
    metric: "운임지수",
    what: "상품과 사람을 이동시키는 데 드는 비용이에요. 연료 가격과 물류 병목이 기업 비용과 소비자 가격에 연결될 수 있어요.",
    watch: ["해상운임", "항공유", "물류 병목"],
    sources: ["Baltic Exchange", "U.S. EIA"],
    updated: "09.23 07:50"
  },
  "corporate-cost": {
    id: "corporate-cost",
    name: "기업비용",
    category: "기업",
    region: "글로벌",
    status: "마진 압력 점검",
    change: "원료·인건비·환율 복합",
    metric: "생산자물가 · 마진",
    what: "기업이 상품과 서비스를 만드는 데 드는 비용이에요. 원자재, 인건비, 환율이 수익성과 판매가격에 영향을 줄 수 있어요.",
    watch: ["생산자물가", "기업실적", "투입비용"],
    sources: ["Statistics Korea", "기업 IR"],
    updated: "09.22 18:20"
  },
  boj: {
    id: "boj",
    name: "BOJ 회의",
    category: "중앙은행",
    region: "일본",
    status: "10월 29~30일",
    change: "정책결정회의 예정",
    metric: "정책금리 · 전망보고서",
    what: "일본은행이 금융정책 방향을 논의하는 회의예요. 정책 결정뿐 아니라 물가·임금 전망과 총재 설명이 시장 기대에 영향을 줄 수 있어요.",
    watch: ["BOJ 금융정책결정회의", "전망보고서", "총재 기자회견"],
    sources: ["Bank of Japan"],
    updated: "일정 기준 09.23"
  },
  "japan-rate": {
    id: "japan-rate",
    name: "일본 금리",
    category: "금리",
    region: "일본",
    status: "정상화 경로 주시",
    change: "임금·물가 확인 중",
    metric: "정책금리 · JGB",
    what: "일본은행의 정책금리와 국채금리 흐름이에요. 일본 물가·임금과 BOJ의 정책 신호가 핵심 연결 요인이 될 수 있어요.",
    watch: ["BOJ 회의", "도쿄 CPI", "일본 임금"],
    sources: ["Bank of Japan", "Statistics Bureau of Japan"],
    updated: "09.23 10:00"
  },
  yen: {
    id: "yen",
    name: "엔화",
    category: "환율",
    region: "일본",
    status: "금리차 민감",
    change: "일·미 금리 기대와 함께 변동",
    metric: "USD/JPY · JPY/KRW",
    what: "일본의 통화예요. 일본과 미국의 금리 차이, 위험 선호, 일본의 무역 흐름 등이 엔화 가치와 관련될 수 있어요.",
    watch: ["BOJ 회의", "미국 금리", "일본 CPI", "달러/엔"],
    sources: ["Bank of Japan", "Federal Reserve"],
    updated: "09.23 10:18"
  },
  "japan-travel": {
    id: "japan-travel",
    name: "일본 여행비",
    category: "생활경제",
    region: "일본",
    status: "환율 경로",
    change: "원/엔·현지물가 영향",
    metric: "JPY/KRW · 여행물가",
    what: "한국 여행자가 일본에서 체감하는 교통·숙박·쇼핑 비용이에요. 원/엔 환율과 일본 현지 물가가 함께 영향을 줄 수 있어요.",
    watch: ["원/엔 환율", "일본 CPI", "항공 운임"],
    sources: ["Bank of Korea", "Statistics Bureau of Japan"],
    updated: "09.23 09:10"
  },
  "ai-investment": {
    id: "ai-investment",
    name: "AI 투자",
    category: "산업",
    region: "글로벌",
    status: "투자 확대",
    change: "인프라 지출 증가",
    metric: "CAPEX · 서버 투자",
    what: "기업들이 AI 모델과 서비스를 위해 컴퓨팅 인프라에 지출하는 흐름이에요. 데이터센터, 반도체, 전력 수요로 연결될 수 있어요.",
    watch: ["빅테크 CAPEX", "AI 서버 출하", "클라우드 실적"],
    sources: ["기업 IR", "SEC Filings"],
    updated: "09.23 08:45"
  },
  "data-center": {
    id: "data-center",
    name: "데이터센터",
    category: "인프라",
    region: "글로벌",
    status: "증설 진행",
    change: "서버·전력 수요 확대",
    metric: "설비투자 · 전력사용량",
    what: "서버와 네트워크 장비를 운영하는 시설이에요. AI 연산 확대는 고성능 반도체와 전력 인프라 수요에 영향을 줄 수 있어요.",
    watch: ["데이터센터 CAPEX", "전력망 투자", "서버 출하"],
    sources: ["기업 IR", "U.S. EIA"],
    updated: "09.22 17:30"
  },
  semiconductor: {
    id: "semiconductor",
    name: "반도체 수요",
    category: "산업",
    region: "글로벌",
    status: "AI 중심 차별화",
    change: "고성능 메모리 수요 주시",
    metric: "출하 · 재고 · 가격",
    what: "스마트폰·PC·서버·자동차 등에 쓰이는 반도체의 수요 흐름이에요. 제품군과 최종 수요처별로 회복 속도가 다를 수 있어요.",
    watch: ["메모리 가격", "반도체 수출", "기업 실적"],
    sources: ["WSTS", "Korea Customs Service", "기업 IR"],
    updated: "09.23 08:50"
  },
  memory: {
    id: "memory",
    name: "메모리",
    category: "산업",
    region: "글로벌",
    status: "고부가 제품 주목",
    change: "HBM·서버 메모리 흐름",
    metric: "DRAM · NAND · HBM",
    what: "데이터를 저장하는 반도체 제품군이에요. AI 서버 수요, 공급 조절, 재고가 가격과 출하에 영향을 줄 수 있어요.",
    watch: ["메모리 고정거래가", "HBM 공급", "재고일수"],
    sources: ["기업 IR", "산업 통계"],
    updated: "09.23 09:05"
  },
  samsung: {
    id: "samsung",
    name: "삼성전자",
    category: "기업",
    region: "한국",
    status: "실적 변수 확인",
    change: "메모리·환율 흐름 연결",
    metric: "005930",
    what: "반도체, 모바일, 가전 등을 영위하는 기업이에요. 메모리 업황과 AI 투자, 환율 등 여러 경제 흐름과 연결될 수 있어요.",
    watch: ["잠정실적", "DART 공시", "메모리 가격"],
    sources: ["DART", "삼성전자 IR"],
    updated: "09.23 10:20"
  },
  power: {
    id: "power",
    name: "전력 수요",
    category: "인프라",
    region: "글로벌",
    status: "중장기 증가",
    change: "데이터센터 수요 연결",
    metric: "전력사용량 · 설비투자",
    what: "산업과 가계가 사용하는 전력의 흐름이에요. 데이터센터 증설은 지역별 전력망과 발전 설비 투자에 영향을 줄 수 있어요.",
    watch: ["전력수요 전망", "전력망 CAPEX", "발전설비"],
    sources: ["IEA", "U.S. EIA"],
    updated: "09.22 13:00"
  },
  gold: {
    id: "gold",
    name: "금",
    category: "원자재",
    region: "글로벌",
    status: "금리·달러 민감",
    change: "실질금리와 위험 선호 교차",
    metric: "Gold spot",
    what: "실물자산이자 안전자산으로 인식되는 원자재예요. 실질금리, 달러, 중앙은행 수요와 위험 선호가 함께 관련될 수 있어요.",
    watch: ["미국 실질금리", "달러지수", "중앙은행 매입"],
    sources: ["LBMA", "World Gold Council"],
    updated: "09.23 10:12"
  }
};

export const economicEdges = [
  ["us-inflation", "us-rate", "물가 흐름은 Fed의 금리 판단과 시장의 금리 기대에 영향을 줄 수 있습니다."],
  ["us-rate", "dollar", "미국 금리 기대 변화는 다른 통화 대비 달러의 상대적 매력에 영향을 줄 수 있습니다."],
  ["dollar", "usdkrw", "글로벌 달러 강도는 원/달러 환율의 주요 연결 요인 중 하나입니다."],
  ["usdkrw", "import-prices", "원화 가치 변화는 수입품의 원화 환산 가격에 영향을 줄 수 있습니다."],
  ["usdkrw", "japan-travel", "환율의 교차 움직임은 해외에서 체감하는 여행 비용에 영향을 줄 수 있습니다."],
  ["usdkrw", "corporate-cost", "수입 비중이 높은 기업은 환율 변화가 원재료 비용에 영향을 줄 수 있습니다."],
  ["oil", "import-prices", "원유를 수입하는 경제에서는 국제유가가 수입물가에 반영될 수 있습니다."],
  ["import-prices", "corporate-cost", "수입 원재료 가격 변화는 기업의 투입비용으로 전달될 수 있습니다."],
  ["import-prices", "consumer-prices", "수입물가 변화는 시차를 두고 소비자 가격에 일부 전달될 수 있습니다."],
  ["oil", "transport-cost", "유가 변화는 항공·해운·육상 운송의 연료비에 영향을 줄 수 있습니다."],
  ["transport-cost", "corporate-cost", "운송비 변화는 상품 유통과 기업의 공급 비용에 연결될 수 있습니다."],
  ["corporate-cost", "consumer-prices", "기업 비용은 수요와 경쟁 여건에 따라 판매가격에 일부 반영될 수 있습니다."],
  ["consumption", "inflation", "수요가 공급 여력을 웃돌면 전반적인 가격 상승 압력으로 작용할 수 있습니다."],
  ["raw-materials", "inflation", "원자재와 인건비 같은 투입비용 증가는 물가 압력으로 연결될 수 있습니다."],
  ["money-credit", "inflation", "통화·신용 여건은 소비와 투자를 거쳐 물가 흐름에 영향을 줄 수 있습니다."],
  ["usdkrw", "inflation", "환율 변화는 수입 가격을 통해 국내 물가에 영향을 줄 수 있습니다."],
  ["inflation", "interest-rate", "중앙은행은 물가 흐름을 금리 결정의 중요한 판단 근거로 활용합니다."],
  ["interest-rate", "loan", "정책금리 변화는 은행 조달비용과 대출금리에 시차를 두고 전달될 수 있습니다."],
  ["interest-rate", "housing", "금리 변화는 주택 구매의 자금 조달 비용과 수요에 영향을 줄 수 있습니다."],
  ["boj", "japan-rate", "BOJ 회의의 결정과 설명은 일본 금리 기대 형성에 영향을 줄 수 있습니다."],
  ["japan-rate", "yen", "일본 금리 기대는 미국 등과의 금리 차이를 통해 엔화에 영향을 줄 수 있습니다."],
  ["us-rate", "yen", "미국 금리 변화는 미·일 금리 차이 경로를 통해 달러/엔과 연결될 수 있습니다."],
  ["yen", "japan-travel", "엔화의 원화 환산 가치 변화는 일본 현지 지출의 체감 비용에 영향을 줄 수 있습니다."],
  ["ai-investment", "data-center", "AI 모델 학습과 서비스 확대는 데이터센터 설비투자 수요로 연결될 수 있습니다."],
  ["data-center", "semiconductor", "데이터센터 증설은 서버용 연산·메모리 반도체 수요에 영향을 줄 수 있습니다."],
  ["data-center", "power", "고성능 서버 운영은 전력 사용량과 전력 인프라 투자에 영향을 줄 수 있습니다."],
  ["semiconductor", "memory", "서버와 기기의 반도체 수요는 메모리 출하와 가격에 연결될 수 있습니다."],
  ["memory", "samsung", "메모리 업황은 삼성전자의 반도체 부문 실적과 관련될 수 있습니다."],
  ["usdkrw", "samsung", "환율은 수출 매출의 원화 환산과 수입 비용 양쪽에 영향을 줄 수 있습니다."],
  ["us-rate", "gold", "미국 금리와 실질금리 변화는 이자를 지급하지 않는 금의 상대적 매력에 영향을 줄 수 있습니다."],
  ["dollar", "gold", "달러 가치 변화는 달러로 거래되는 금의 수요와 가격에 영향을 줄 수 있습니다."]
].map(([from, to, description], index) => ({ id: `edge-${index + 1}`, from, to, description }));

export const todayIssues = [
  {
    id: "fx-volatility",
    eyebrow: "환율 · 오늘의 핵심",
    title: "원/달러 환율 변동 확대",
    summary: "달러와 국내외 금리 기대가 엇갈리며 장중 움직임이 커지고 있어요.",
    flow: ["미국 금리", "달러", "원/달러"],
    nodeId: "usdkrw",
    tone: "sage",
    source: "한국은행 · Federal Reserve",
    updated: "10:20"
  },
  {
    id: "rate-expectation",
    eyebrow: "금리",
    title: "미국 금리 기대 변화",
    summary: "물가와 고용 데이터를 해석하는 눈높이가 달라지며 금리 경로가 재조정되고 있어요.",
    flow: ["미국 물가", "금리 기대", "달러", "글로벌 시장"],
    nodeId: "us-rate",
    tone: "violet",
    source: "U.S. BLS · Federal Reserve",
    updated: "10:10"
  },
  {
    id: "oil-move",
    eyebrow: "원자재",
    title: "국제유가 움직임 확대",
    summary: "공급 관련 소식과 수요 전망이 교차하며 비용 경로를 다시 살펴볼 때예요.",
    flow: ["국제유가", "운송비", "기업비용", "물가"],
    nodeId: "oil",
    tone: "sand",
    source: "U.S. EIA · OPEC",
    updated: "10:05"
  },
  {
    id: "ai-capex",
    eyebrow: "산업",
    title: "AI 인프라 투자 확대",
    summary: "기업 설비투자가 데이터센터와 고성능 반도체, 전력 수요로 이어지고 있어요.",
    flow: ["AI 투자", "데이터센터", "반도체", "전력"],
    nodeId: "ai-investment",
    tone: "blue",
    source: "기업 IR · SEC Filings",
    updated: "09:45"
  }
];

export const popularFlows = [
  { title: "AI 인프라의 확장 경로", nodes: ["AI 투자", "반도체", "메모리", "기업"], target: "ai-investment", viewers: "1.8k" },
  { title: "미국 금리가 한국까지 오는 길", nodes: ["미국 금리", "달러", "원/달러", "국내 물가"], target: "us-rate", viewers: "1.3k" },
  { title: "유가가 생활물가로 전해지는 길", nodes: ["국제유가", "운송비", "기업비용", "소비자물가"], target: "oil", viewers: "986" }
];

export const marketData = {
  indices: [
    ["KOSPI", "2,684.32", "+0.62%", "상승", "한국", "samsung"],
    ["S&P 500", "5,742.18", "-0.18%", "혼조", "미국", "us-rate"],
    ["NASDAQ", "18,102.44", "+0.31%", "상승", "미국", "ai-investment"],
    ["Nikkei 225", "38,842.10", "-0.44%", "하락", "일본", "yen"]
  ],
  fx: [
    ["USD/KRW", "1,338.40", "+0.41%", "변동 확대", "한국", "usdkrw"],
    ["JPY/KRW (100)", "925.18", "-0.26%", "금리차 민감", "일본", "yen"],
    ["EUR/KRW", "1,492.60", "+0.12%", "보합권", "유럽", "dollar"]
  ],
  rates: [
    ["한국 기준금리", "2.75%", "0.00%p", "동결", "한국", "interest-rate"],
    ["미국 정책금리", "4.25–4.50%", "0.00%p", "기대 변화", "미국", "us-rate"],
    ["일본 정책금리", "0.50%", "0.00%p", "경로 주시", "일본", "japan-rate"]
  ],
  commodities: [
    ["Gold", "$2,638.20", "+0.35%", "금리 민감", "글로벌", "gold"],
    ["WTI", "$71.42", "+1.12%", "변동 확대", "글로벌", "oil"],
    ["Brent", "$74.96", "+0.84%", "공급 주시", "글로벌", "oil"],
    ["Natural Gas", "$2.61", "-0.52%", "수요 점검", "글로벌", "raw-materials"]
  ],
  indicators: [
    ["한국 CPI", "114.61", "+2.0% YoY", "둔화 속도", "한국", "consumer-prices"],
    ["미국 Core PCE", "124.82", "+2.6% YoY", "경로 주시", "미국", "us-inflation"],
    ["한국 수출", "$57.9B", "+6.4% YoY", "반도체 기여", "한국", "semiconductor"],
    ["미국 고용", "+142K", "월간", "완만한 증가", "미국", "us-rate"]
  ]
};

export const marketCategories = [
  ["indices", "주가지수"],
  ["fx", "환율"],
  ["rates", "금리"],
  ["commodities", "원자재"],
  ["indicators", "경제지표"]
];

export const economicEvents = [
  {
    id: "korea-trade",
    date: "2026-10-01",
    dayLabel: "10월 1일",
    region: "한국",
    flag: "KR",
    type: "경제지표",
    title: "9월 수출입 동향",
    status: "확정",
    time: "09:00 KST",
    importance: "high",
    nodeId: "semiconductor",
    flow: ["글로벌 수요", "수출", "반도체", "기업"],
    why: "수출 품목과 지역별 흐름은 제조업 경기와 기업 실적을 이해하는 단서가 될 수 있어요.",
    source: "산업통상자원부 · 관세청"
  },
  {
    id: "boj-opinions",
    date: "2026-10-01",
    dayLabel: "10월 1일",
    region: "일본",
    flag: "JP",
    type: "중앙은행",
    title: "BOJ Summary of Opinions",
    status: "확정",
    time: "08:50 JST",
    importance: "medium",
    nodeId: "japan-rate",
    flow: ["BOJ 의견", "일본 금리", "엔화"],
    why: "정책위원들의 물가·금리 판단을 통해 향후 정책 방향에 대한 단서를 얻을 수 있어요.",
    source: "Bank of Japan"
  },
  {
    id: "us-jobs",
    date: "2026-10-02",
    dayLabel: "10월 2일",
    region: "미국",
    flag: "US",
    type: "고용",
    title: "미국 고용보고서",
    status: "예정",
    time: "21:30 KST",
    importance: "high",
    nodeId: "us-rate",
    flow: ["고용", "경기", "금리 기대", "달러"],
    why: "고용의 강도는 미국 경기와 임금 압력을 보여줘 Fed 금리 기대에 영향을 줄 수 있어요.",
    source: "U.S. BLS"
  },
  {
    id: "us-cpi",
    date: "2026-10-14",
    dayLabel: "10월 14일",
    region: "미국",
    flag: "US",
    type: "물가",
    title: "미국 CPI 발표",
    status: "확정",
    time: "21:30 KST",
    importance: "high",
    nodeId: "us-inflation",
    flow: ["미국 물가", "금리 기대", "달러", "글로벌 시장"],
    why: "물가의 구성과 지속성은 Fed 정책과 금융시장 금리 기대에 연결될 수 있어요.",
    source: "U.S. BLS"
  },
  {
    id: "ecb-meeting",
    date: "2026-10-22",
    dayLabel: "10월 22일",
    region: "유럽",
    flag: "EU",
    type: "금리 결정",
    title: "ECB 통화정책회의",
    status: "확정",
    time: "21:15 KST",
    importance: "medium",
    nodeId: "interest-rate",
    flow: ["유럽 물가", "ECB", "유로", "글로벌 금리"],
    why: "유로존의 금리 결정과 성장·물가 평가는 글로벌 금리와 환율 흐름에 영향을 줄 수 있어요.",
    source: "European Central Bank"
  },
  {
    id: "boj-meeting",
    date: "2026-10-29",
    endDate: "2026-10-30",
    dayLabel: "10월 29~30일",
    region: "일본",
    flag: "JP",
    type: "금리 결정",
    title: "BOJ 금융정책결정회의",
    status: "확정",
    time: "결과 발표 시각 변동 가능",
    importance: "high",
    nodeId: "boj",
    flow: ["BOJ 회의", "일본 금리", "엔화", "여행·기업"],
    why: "정책 결정과 전망보고서가 일본 금리 기대를 바꾸고 엔화와 일본 자산에 영향을 줄 수 있어요.",
    source: "Bank of Japan"
  },
  {
    id: "boj-outlook",
    date: "2026-10-30",
    dayLabel: "10월 30일",
    region: "일본",
    flag: "JP",
    type: "중앙은행",
    title: "BOJ 전망보고서",
    status: "확정",
    time: "회의 결과와 함께",
    importance: "high",
    nodeId: "japan-rate",
    flow: ["물가·성장 전망", "일본 금리", "엔화"],
    why: "일본은행의 물가·성장 전망 변화는 향후 금리 경로를 해석하는 근거가 될 수 있어요.",
    source: "Bank of Japan"
  },
  {
    id: "opec-meeting",
    date: "2026-10-31",
    dayLabel: "10월 말",
    region: "글로벌",
    flag: "GL",
    type: "원자재",
    title: "OPEC+ 생산 정책 점검",
    status: "세부 일정 미정",
    time: "추후 발표",
    importance: "medium",
    nodeId: "oil",
    flow: ["산유국 공급", "국제유가", "운송비", "물가"],
    why: "산유국의 생산 계획은 원유 공급 기대와 국제유가 변동에 영향을 줄 수 있어요.",
    source: "OPEC"
  }
];

export const companies = {
  samsung: {
    id: "samsung",
    name: "삼성전자",
    code: "005930 · KOSPI",
    price: "79,400원",
    change: "+1.28%",
    updated: "09.23 10:20 · 15분 지연 mock",
    description: "반도체, 모바일, 디스플레이와 가전을 아우르는 글로벌 기술 기업이에요.",
    metrics: [
      ["시가총액", "473.9조원"],
      ["매출 (최근 연간)", "258.9조원"],
      ["영업이익률", "12.4%"],
      ["외국인 비중", "56.1%"]
    ],
    chart: [48, 52, 49, 57, 55, 63, 60, 68, 71, 69, 76, 74, 82, 79, 86, 84, 91],
    flows: [
      { label: "AI 투자에서 오는 경로", nodes: ["AI 투자", "반도체 수요", "메모리", "삼성전자"], target: "ai-investment" },
      { label: "환율에서 오는 경로", nodes: ["달러", "원/달러", "수출·환산 영향", "삼성전자"], target: "usdkrw" }
    ],
    disclosures: [
      ["09.20", "기업설명회(IR) 개최 안내", "DART"],
      ["09.12", "주요사항보고서", "DART"],
      ["08.31", "반기보고서", "DART"]
    ]
  }
};

export const catchUpChanges = [
  { id: "yen", title: "엔화", text: "BOJ 위원의 정책 경로 관련 설명이 추가됐어요.", badge: "새 근거 1" },
  { id: "gold", title: "금", text: "미국 실질금리 기대가 달라지며 연결 경로가 업데이트됐어요.", badge: "데이터 2" },
  { id: "samsung", title: "삼성전자", text: "새로운 기업 공시와 메모리 데이터가 연결됐어요.", badge: "공시 1" }
];

export const defaultInterests = ["yen", "gold", "ai-investment", "samsung"];
export const defaultWatchItems = ["boj-meeting", "us-cpi"];

export const searchCatalog = [
  {
    terms: ["엔화", "엔", "엔화는 왜 움직이는 거야", "일본 금리"],
    title: "엔화는 왜 움직일까요?",
    subtitle: "일본 금리 → 엔화 → 일본 여행비",
    kind: "경제 흐름",
    target: "yen",
    paths: ["일본 금리 → 엔화", "미국 금리 → 달러/엔", "일본 물가 → BOJ → 엔화"]
  },
  {
    terms: ["미국 금리", "미국 금리 오르면 한국은", "fed", "연준"],
    title: "미국 금리가 한국까지 오는 경로",
    subtitle: "미국 금리 → 달러 → 원/달러 → 국내 물가",
    kind: "경제 흐름",
    target: "us-rate",
    paths: ["미국 물가 → 미국 금리", "미국 금리 → 달러", "달러 → 원/달러 → 수입물가"]
  },
  {
    terms: ["유가", "비행기표", "유가 오르면 비행기표에도 영향 있어", "원유"],
    title: "유가가 생활 비용으로 전달되는 길",
    subtitle: "국제유가 → 운송비 → 기업비용 → 소비자물가",
    kind: "경제 흐름",
    target: "oil",
    paths: ["국제유가 → 항공유", "연료비 → 운송비", "운송비 → 기업비용"]
  },
  {
    terms: ["ai", "반도체", "ai 투자가 왜 반도체랑 연결돼", "메모리"],
    title: "AI 투자와 반도체의 연결",
    subtitle: "AI 투자 → 데이터센터 → 반도체 → 메모리",
    kind: "산업 흐름",
    target: "ai-investment",
    paths: ["AI 투자 → 데이터센터", "데이터센터 → 반도체", "반도체 수요 → 메모리"]
  },
  {
    terms: ["인플레이션", "물가", "cpi", "근원물가", "pce"],
    title: "인플레이션, 30초 이해",
    subtitle: "수요·비용·통화/신용·환율 → 물가 → 금리",
    kind: "경제 개념",
    target: "inflation",
    paths: ["소비 → 인플레이션", "원자재 → 인플레이션", "인플레이션 → 금리"]
  },
  {
    terms: ["삼성전자", "삼성", "005930"],
    title: "삼성전자",
    subtitle: "AI 투자·메모리·원/달러와 연결된 기업",
    kind: "기업",
    route: "#/company/samsung",
    paths: ["AI 투자 → 반도체 → 메모리", "원/달러 → 수출·환산 영향"]
  },
  {
    terms: ["금", "골드", "gold"],
    title: "금과 금리의 연결",
    subtitle: "미국 금리·달러 → 금",
    kind: "원자재 흐름",
    target: "gold",
    paths: ["미국 금리 → 실질금리 → 금", "달러 → 금"]
  }
];

export function getIncomingEdges(nodeId) {
  return economicEdges.filter((edge) => edge.to === nodeId);
}

export function getOutgoingEdges(nodeId) {
  return economicEdges.filter((edge) => edge.from === nodeId);
}

export function getNode(nodeId) {
  return economicNodes[nodeId] || economicNodes.usdkrw;
}
