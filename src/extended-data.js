import {
  economicEdges,
  economicEvents,
  economicNodes,
  marketCategories,
  todayIssues
} from "./mock-data.js";

const concept = (id, name, shortDescription, overrides = {}) => ({
  id,
  name,
  shortDescription,
  description: shortDescription,
  whyItMatters: "경제 흐름을 이해할 때 다른 지표와 함께 살펴보는 기본 개념이에요.",
  causes: [],
  relatedIndicators: [],
  relatedConcepts: [],
  relatedNodes: [],
  sources: ["한국은행 경제용어사전"],
  ...overrides
});

export const concepts = {
  inflation: concept("inflation", "인플레이션", "상품과 서비스의 전반적인 가격 수준이 지속적으로 상승하는 현상이에요.", {
    description: "일부 품목의 일시적인 가격 상승이 아니라, 경제 전반의 가격 수준이 일정 기간 오르는 현상을 뜻해요. 여러 요인이 함께 영향을 줄 수 있습니다.",
    whyItMatters: "생활비, 금리, 국채, 대출, 기업 비용과 자산시장까지 폭넓게 연결될 수 있어요.",
    causes: [
      ["수요 증가", "소비와 투자가 공급 여력을 웃돌면 가격 상승 압력으로 작용할 수 있어요."],
      ["원자재·임금 상승", "기업 비용 증가가 판매가격에 일부 전달될 수 있어요."],
      ["환율 변화", "수입가격 변화를 통해 국내 물가에 영향을 줄 수 있어요."],
      ["통화·신용 여건", "소비와 투자 여건을 바꿔 물가에 영향을 줄 수 있어요."]
    ],
    relatedIndicators: ["CPI", "PCE", "근원물가"],
    relatedConcepts: ["cpi", "pce", "policy-rate", "bond-yield"],
    relatedNodes: ["inflation", "consumer-prices", "interest-rate"],
    sources: ["Bank of Korea", "U.S. BLS", "U.S. BEA"],
    currentData: [["한국", "2.0%"], ["미국", "2.6%"], ["일본", "2.8%"], ["유럽", "2.2%"]]
  }),
  cpi: concept("cpi", "CPI", "소비자가 구입하는 상품과 서비스의 가격 변화를 측정하는 대표적인 물가지표예요.", {
    description: "기준 시점과 비교해 소비자가 자주 구입하는 품목 묶음의 가격이 얼마나 달라졌는지 보여줘요. 국가마다 품목과 가중치는 다를 수 있어요.",
    whyItMatters: "가계가 체감하는 물가와 중앙은행의 금리 판단을 이해하는 핵심 단서 중 하나예요.",
    causes: [["상품 가격", "에너지·식품·내구재 가격이 지수에 반영돼요."], ["서비스 가격", "주거·의료·외식 등 서비스 비용도 함께 반영돼요."]],
    relatedIndicators: ["근원 CPI", "생활물가지수", "PCE"],
    relatedConcepts: ["inflation", "pce", "policy-rate"],
    relatedNodes: ["us-cpi", "consumer-prices", "us-inflation"],
    sources: ["Statistics Korea", "U.S. BLS"]
  }),
  pce: concept("pce", "PCE 물가지수", "미국 가계의 소비 지출 구성을 반영해 가격 변화를 측정하는 물가지표예요.", {
    whyItMatters: "미국 연방준비제도가 물가 흐름을 판단할 때 중요하게 참고하는 지표예요.",
    relatedIndicators: ["Headline PCE", "Core PCE", "CPI"],
    relatedConcepts: ["inflation", "cpi", "fomc"],
    relatedNodes: ["us-inflation", "us-rate"],
    sources: ["U.S. BEA", "Federal Reserve"]
  }),
  gdp: concept("gdp", "GDP", "한 나라 안에서 일정 기간 생산된 최종 재화와 서비스의 가치를 나타내요.", {
    whyItMatters: "경제 규모와 성장 속도를 살펴보는 대표 지표지만, 생활 수준을 전부 설명하지는 않아요.",
    relatedIndicators: ["실질 GDP", "명목 GDP", "GDP 성장률"],
    relatedConcepts: ["recession", "employment"],
    relatedNodes: ["us-economy"],
    sources: ["Bank of Korea", "U.S. BEA"]
  }),
  "policy-rate": concept("policy-rate", "기준금리", "중앙은행이 통화정책의 기준으로 정하는 금리예요.", {
    whyItMatters: "예금·대출·시장금리에 영향을 줄 수 있지만 모든 금리가 같은 폭과 속도로 움직이는 것은 아니에요.",
    causes: [["물가", "물가 안정 필요성이 정책 판단에 반영될 수 있어요."], ["성장·고용", "경기와 고용 여건도 함께 고려돼요."], ["금융 안정", "신용과 자산시장 위험도 판단 요소가 될 수 있어요."]],
    relatedIndicators: ["Fed Funds Rate", "한국 기준금리", "BOJ 정책금리", "ECB 예금금리"],
    relatedConcepts: ["fomc", "bond-yield", "yield-curve"],
    relatedNodes: ["us-rate", "interest-rate", "japan-rate"],
    sources: ["Federal Reserve", "Bank of Korea", "Bank of Japan", "ECB"]
  }),
  treasury: concept("treasury", "국채", "정부가 필요한 자금을 조달하기 위해 발행하는 채권이에요.", {
    description: "정부가 일정 기간 뒤 원금과 약속된 이자를 지급하는 조건으로 발행해요. 만기와 발행 국가에 따라 금리와 위험이 달라질 수 있어요.",
    whyItMatters: "국채금리는 대출, 기업 자금조달, 주식 가치평가 등 여러 금융 가격의 기준점으로 참고돼요.",
    causes: [["정책금리 기대", "특히 단기 국채금리와 밀접하게 관련될 수 있어요."], ["물가·경기 전망", "장기 구매력과 성장 전망이 장기 금리에 반영될 수 있어요."], ["국채 수급", "발행량과 투자자 수요도 가격과 수익률에 영향을 줄 수 있어요."]],
    relatedIndicators: ["2년 국채", "10년 국채", "30년 국채"],
    relatedConcepts: ["bond-price", "bond-yield", "short-bond", "long-bond", "yield-curve"],
    relatedNodes: ["us-treasury-10y", "jgb-10y", "global-capital"],
    sources: ["U.S. Treasury", "기획재정부", "Bank of Japan", "Deutsche Finanzagentur"]
  }),
  "bond-price": concept("bond-price", "국채가격", "이미 발행된 국채가 시장에서 거래되는 가격이에요.", {
    description: "일반적으로 기존 채권의 가격과 수익률은 반대 방향으로 움직이는 관계가 있습니다. 새로 요구되는 시장금리가 오르면 기존의 낮은 이자를 주는 채권 가격은 상대적으로 낮아질 수 있어요.",
    whyItMatters: "가격과 수익률의 반대 관계를 알면 채권시장 변화가 훨씬 쉽게 보여요.",
    relatedIndicators: ["국채 수익률", "쿠폰금리", "듀레이션"],
    relatedConcepts: ["treasury", "bond-yield"],
    relatedNodes: ["us-treasury-10y", "jgb-10y"],
    sources: ["U.S. Treasury", "Bank of Korea"]
  }),
  "bond-yield": concept("bond-yield", "국채금리·수익률", "국채를 현재 가격에 샀을 때 기대할 수 있는 수익의 정도를 연율로 나타낸 값이에요.", {
    description: "표면 이자만이 아니라 현재 거래가격과 만기까지의 현금흐름을 함께 반영해요. 일반적으로 채권 가격이 오르면 수익률은 낮아지고, 가격이 내리면 수익률은 높아지는 관계가 있어요.",
    whyItMatters: "정부와 기업의 자금조달 비용, 주식 가치평가, 환율과 대출금리에 참고되는 중요한 시장 금리예요.",
    relatedIndicators: ["2년물", "10년물", "30년물", "기간 프리미엄"],
    relatedConcepts: ["treasury", "bond-price", "yield-spread", "yield-curve"],
    relatedNodes: ["us-treasury-10y", "jgb-10y"],
    sources: ["U.S. Treasury", "Federal Reserve"]
  }),
  "short-bond": concept("short-bond", "단기채", "통상 만기가 1~2년 안팎으로 짧은 채권을 뜻해요.", {
    whyItMatters: "장기채보다 가까운 시점의 기준금리 기대에 민감하게 반응할 수 있어요.",
    relatedIndicators: ["3개월물", "1년물", "2년물"],
    relatedConcepts: ["long-bond", "yield-spread", "policy-rate"],
    relatedNodes: ["us-rate", "us-treasury-10y"],
    sources: ["U.S. Treasury"]
  }),
  "long-bond": concept("long-bond", "장기채", "통상 만기가 10년 이상인 채권을 뜻해요.", {
    whyItMatters: "기준금리 기대뿐 아니라 장기 물가·성장 전망과 국채 수급 등 여러 요인이 반영될 수 있어요.",
    relatedIndicators: ["10년물", "30년물", "기간 프리미엄"],
    relatedConcepts: ["short-bond", "yield-spread", "yield-curve"],
    relatedNodes: ["us-treasury-10y", "jgb-10y"],
    sources: ["U.S. Treasury", "Federal Reserve"]
  }),
  "yield-spread": concept("yield-spread", "장단기 금리차", "장기 국채 수익률에서 단기 국채 수익률을 뺀 차이예요.", {
    whyItMatters: "시장 참여자의 경기·물가·정책 기대가 만기별 금리에 어떻게 반영되는지 살펴보는 단서예요. 하나의 지표만으로 침체를 단정할 수는 없어요.",
    relatedIndicators: ["10년-2년", "10년-3개월"],
    relatedConcepts: ["short-bond", "long-bond", "yield-curve", "recession"],
    relatedNodes: ["us-treasury-10y", "us-economy"],
    sources: ["Federal Reserve", "U.S. Treasury"]
  }),
  "yield-curve": concept("yield-curve", "수익률곡선", "같은 발행자의 국채 수익률을 만기별로 이어 그린 선이에요.", {
    description: "3개월부터 30년까지 만기별 수익률을 한눈에 비교해 정책금리 기대와 장기 물가·성장 전망이 어떻게 다른지 살펴볼 수 있어요.",
    whyItMatters: "곡선의 높이와 기울기 변화는 시장의 정책·경기 기대를 이해하는 데 도움을 주지만 미래를 확정적으로 예측하지 않아요.",
    causes: [["단기 구간", "가까운 시점의 기준금리 기대가 크게 반영될 수 있어요."], ["장기 구간", "장기 물가·성장·수급과 기간 프리미엄이 함께 관련될 수 있어요."]],
    relatedIndicators: ["3M", "2Y", "10Y", "30Y"],
    relatedConcepts: ["yield-spread", "short-bond", "long-bond", "bond-yield"],
    relatedNodes: ["us-rate", "us-treasury-10y"],
    sources: ["U.S. Treasury", "각국 재무부·중앙은행"]
  }),
  exchange: concept("exchange", "환율", "서로 다른 두 통화가 교환되는 비율이에요.", {
    whyItMatters: "수입가격, 해외여행 비용, 수출기업의 환산 실적과 글로벌 자금 흐름에 연결될 수 있어요.",
    relatedIndicators: ["USD/KRW", "USD/JPY", "JPY/KRW"],
    relatedConcepts: ["dollar-index", "policy-rate", "yield-spread"],
    relatedNodes: ["usdkrw", "yen", "dollar"],
    sources: ["Bank of Korea", "Federal Reserve"]
  }),
  "dollar-index": concept("dollar-index", "달러지수", "달러 가치를 주요 통화 묶음과 비교해 나타낸 지수예요.", {
    whyItMatters: "글로벌 달러 강도를 살펴보는 하나의 기준이지만 모든 개별 환율과 똑같이 움직이지는 않아요.",
    relatedIndicators: ["DXY", "미국 금리", "실질금리"],
    relatedConcepts: ["exchange", "policy-rate"],
    relatedNodes: ["dollar", "usdkrw"],
    sources: ["ICE Benchmark Administration", "Federal Reserve"]
  }),
  employment: concept("employment", "고용·실업률", "일할 수 있는 사람들의 취업과 구직 상태를 보여주는 지표예요.", {
    whyItMatters: "소득과 소비, 임금, 경기와 중앙은행 정책 판단에 연결될 수 있어요.",
    relatedIndicators: ["비농업고용", "실업률", "임금상승률"],
    relatedConcepts: ["gdp", "inflation", "fomc"],
    relatedNodes: ["us-employment", "consumption", "us-rate"],
    sources: ["U.S. BLS", "Statistics Korea"]
  }),
  liquidity: concept("liquidity", "유동성", "자금이 얼마나 쉽게 조달되고 거래될 수 있는지를 나타내는 개념이에요.", {
    whyItMatters: "신용과 투자 여건을 통해 소비, 기업 활동, 자산시장에 영향을 줄 수 있어요.",
    relatedIndicators: ["M2", "은행 준비금", "신용스프레드"],
    relatedConcepts: ["qe", "qt", "policy-rate"],
    relatedNodes: ["money-credit", "global-capital"],
    sources: ["Bank of Korea", "Federal Reserve"]
  }),
  qe: concept("qe", "양적완화", "중앙은행이 채권 등을 매입해 장기금리와 금융여건에 영향을 주려는 정책이에요.", { relatedConcepts: ["qt", "liquidity", "treasury"], relatedNodes: ["money-credit", "us-treasury-10y"], sources: ["Federal Reserve", "Bank of Japan", "ECB"] }),
  qt: concept("qt", "양적긴축", "중앙은행이 보유자산을 줄여 시장에 공급된 유동성을 축소하는 정책이에요.", { relatedConcepts: ["qe", "liquidity", "treasury"], relatedNodes: ["money-credit", "us-treasury-10y"], sources: ["Federal Reserve", "Bank of Japan", "ECB"] }),
  recession: concept("recession", "경기침체", "경제 활동이 여러 부문에서 상당 기간 위축되는 상태를 뜻해요.", { whyItMatters: "GDP 하나만으로 즉시 단정하지 않고 고용·소비·생산·소득을 함께 살펴봐야 해요.", relatedIndicators: ["GDP", "고용", "소비", "산업생산"], relatedConcepts: ["gdp", "employment", "yield-spread"], relatedNodes: ["us-economy", "us-employment"], sources: ["NBER", "Bank of Korea"] }),
  oil: concept("oil", "원유", "정제 전의 석유로, 운송과 산업 생산에 폭넓게 쓰이는 핵심 에너지원이에요.", { whyItMatters: "운송비와 기업 비용, 수입물가를 거쳐 소비자물가에 연결될 수 있어요.", relatedIndicators: ["WTI", "Brent", "원유재고"], relatedConcepts: ["inflation"], relatedNodes: ["oil", "transport-cost", "import-prices"], sources: ["U.S. EIA", "OPEC"] }),
  gold: concept("gold", "금", "실물자산이자 안전자산으로 인식되는 귀금속이에요.", { whyItMatters: "실질금리, 달러와 위험 선호가 함께 관련될 수 있어요.", relatedIndicators: ["금 현물", "실질금리", "달러지수"], relatedConcepts: ["bond-yield", "dollar-index"], relatedNodes: ["gold", "us-rate", "dollar"], sources: ["LBMA", "World Gold Council"] }),
  fomc: concept("fomc", "FOMC", "미국 연방준비제도의 통화정책을 결정하는 회의체예요.", { whyItMatters: "정책금리 결정과 경제전망, 위원들의 설명이 미국 금리·국채·달러 흐름에 연결될 수 있어요.", relatedIndicators: ["Fed Funds Rate", "점도표", "경제전망"], relatedConcepts: ["policy-rate", "treasury", "inflation"], relatedNodes: ["us-rate", "us-treasury-10y", "dollar"], sources: ["Federal Reserve"] }),
  bok: concept("bok", "금통위", "한국은행에서 기준금리를 결정하는 금융통화위원회예요.", { relatedIndicators: ["한국 기준금리", "통화정책방향"], relatedConcepts: ["policy-rate", "inflation"], relatedNodes: ["interest-rate", "usdkrw"], sources: ["Bank of Korea"] }),
  boj: concept("boj", "BOJ", "일본의 중앙은행인 일본은행과 그 통화정책 결정을 뜻해요.", { whyItMatters: "일본 금리와 국채, 엔화, 일본 금융시장에 영향을 줄 수 있는 정책 신호를 제공해요.", relatedIndicators: ["BOJ 정책금리", "JGB", "전망보고서"], relatedConcepts: ["policy-rate", "treasury", "exchange"], relatedNodes: ["boj", "japan-rate", "jgb-10y", "yen"], sources: ["Bank of Japan"] }),
  ecb: concept("ecb", "ECB", "유로화를 사용하는 국가들의 통화정책을 담당하는 유럽중앙은행이에요.", { relatedIndicators: ["예금금리", "주요 재융자금리"], relatedConcepts: ["policy-rate", "inflation"], relatedNodes: ["interest-rate"], sources: ["European Central Bank"] }),
  per: concept("per", "PER", "주가를 주당순이익으로 나눈 주가수익비율이에요.", { whyItMatters: "기업 이익 대비 시장 평가 수준을 비교하는 참고 지표지만 업종과 성장성 등을 함께 봐야 해요.", relatedIndicators: ["주가", "EPS"], relatedConcepts: ["eps", "pbr"], relatedNodes: ["samsung"], sources: ["DART", "기업 IR"] }),
  pbr: concept("pbr", "PBR", "주가를 주당순자산으로 나눈 주가순자산비율이에요.", { relatedIndicators: ["주가", "BPS"], relatedConcepts: ["per", "eps"], relatedNodes: ["samsung"], sources: ["DART", "기업 IR"] }),
  eps: concept("eps", "EPS", "기업의 순이익을 발행주식 수로 나눈 주당순이익이에요.", { relatedIndicators: ["당기순이익", "주식 수"], relatedConcepts: ["per", "pbr"], relatedNodes: ["samsung"], sources: ["DART", "기업 IR"] })
};

export const bondMarketData = [
  ["미국", "US Treasury", "2년", 3.82, 4, 99.42, [3.66,3.71,3.69,3.75,3.78,3.82]],
  ["미국", "US Treasury", "5년", 3.91, 3, 98.84, [3.79,3.82,3.80,3.86,3.88,3.91]],
  ["미국", "US Treasury", "10년", 4.18, 5, 97.63, [4.01,4.05,4.08,4.10,4.13,4.18]],
  ["미국", "US Treasury", "30년", 4.47, 4, 95.28, [4.34,4.38,4.35,4.41,4.43,4.47]],
  ["한국", "국고채", "3년", 2.79, -2, 100.17, [2.88,2.85,2.84,2.82,2.81,2.79]],
  ["한국", "국고채", "5년", 2.91, -1, 99.74, [2.98,2.96,2.95,2.93,2.92,2.91]],
  ["한국", "국고채", "10년", 3.08, 1, 98.92, [3.02,3.04,3.03,3.06,3.07,3.08]],
  ["일본", "JGB", "2년", 0.78, 1, 99.81, [.70,.72,.74,.73,.76,.78]],
  ["일본", "JGB", "10년", 1.34, 3, 98.46, [1.21,1.24,1.27,1.29,1.31,1.34]],
  ["일본", "JGB", "30년", 2.36, 2, 96.75, [2.24,2.27,2.29,2.31,2.34,2.36]],
  ["독일", "Bund", "2년", 2.08, -1, 100.04, [2.16,2.13,2.12,2.10,2.09,2.08]],
  ["독일", "Bund", "10년", 2.54, 2, 98.31, [2.43,2.46,2.47,2.50,2.52,2.54]]
].map(([country, bondType, maturity, bondYield, yieldChangeBp, price, history], index) => ({
  id: `bond-${index + 1}`,
  country,
  bondType,
  maturity,
  yield: bondYield,
  yieldChangeBp,
  price,
  updatedAt: "09.23 10:20 · Mock",
  history,
  relatedNode: country === "일본" ? "jgb-10y" : country === "미국" ? "us-treasury-10y" : "interest-rate"
}));

const curve = (country, current, month, year) => ([
  ["현재", current], ["1개월 전", month], ["1년 전", year]
].map(([period, yields]) => ({ country, date: period, maturities: ["3M","6M","1Y","2Y","5Y","10Y","30Y"], yields })));

export const yieldCurveData = [
  ...curve("미국", [4.31,4.12,3.92,3.82,3.91,4.18,4.47], [4.39,4.24,4.02,3.90,3.88,4.05,4.34], [5.42,5.38,5.12,4.91,4.54,4.43,4.58]),
  ...curve("한국", [2.71,2.70,2.73,2.76,2.91,3.08,3.02], [2.82,2.80,2.81,2.84,2.96,3.04,3.01], [3.54,3.48,3.43,3.39,3.42,3.51,3.44]),
  ...curve("일본", [.41,.48,.55,.78,1.02,1.34,2.36], [.36,.43,.51,.70,.94,1.24,2.27], [.08,.12,.19,.31,.52,.79,1.65]),
  ...curve("독일", [2.42,2.31,2.18,2.08,2.22,2.54,2.78], [2.50,2.42,2.27,2.16,2.25,2.46,2.68], [3.72,3.61,3.43,3.18,2.87,2.74,2.83])
];

const newNodes = {
  "us-cpi": { id:"us-cpi", name:"미국 CPI", category:"물가 지표", region:"미국", status:"결과 업데이트", change:"전월 대비 흐름 확인", metric:"CPI · Core CPI", what:"미국 소비자가 구입하는 상품과 서비스의 가격 변화를 보여주는 대표 지표예요.", watch:["다음 CPI", "Core CPI", "Fed 회의"], sources:["U.S. BLS"], updated:"09.23 08:30" },
  fed: { id:"fed", name:"Fed 금리 기대", category:"중앙은행", region:"미국", status:"경로 재조정", change:"CPI·고용 반영", metric:"Fed Funds Futures", what:"시장 참여자가 예상하는 미국 기준금리의 향후 경로예요. 발표된 정책과는 구분해서 봐야 해요.", watch:["FOMC", "미국 CPI", "고용보고서"], sources:["Federal Reserve", "CME"], updated:"09.23 10:15" },
  "us-treasury-10y": { id:"us-treasury-10y", name:"미국 국채 10년", category:"국채", region:"미국", status:"수익률 변동", change:"4.18% · +5bp", metric:"US10Y", what:"미국 정부가 발행하는 장기 국채의 대표적인 시장 금리 중 하나예요. 정책 기대뿐 아니라 물가·성장·수급도 함께 관련될 수 있어요.", watch:["미국 CPI", "FOMC", "국채 입찰"], sources:["U.S. Treasury", "Federal Reserve"], updated:"09.23 10:20" },
  "japan-cpi": { id:"japan-cpi", name:"일본 CPI", category:"물가 지표", region:"일본", status:"서비스 물가 주시", change:"도쿄·전국 CPI 확인", metric:"Japan CPI", what:"일본 소비자물가의 변화를 보여주는 지표로 BOJ의 정책 판단과 연결될 수 있어요.", watch:["도쿄 CPI", "전국 CPI", "BOJ 회의"], sources:["Statistics Bureau of Japan"], updated:"09.23 08:30" },
  "jgb-10y": { id:"jgb-10y", name:"일본 국채 JGB 10년", category:"국채", region:"일본", status:"수익률 상승", change:"1.34% · +3bp", metric:"JGB 10Y", what:"일본 정부가 발행하는 10년 만기 국채의 시장 수익률이에요. BOJ 정책과 장기 물가·성장 전망이 함께 관련될 수 있어요.", watch:["BOJ 회의", "JGB 입찰", "일본 CPI"], sources:["Japan Ministry of Finance", "Bank of Japan"], updated:"09.23 10:20" },
  "japan-exporters": { id:"japan-exporters", name:"일본 수출기업", category:"기업", region:"일본", status:"환율 민감", change:"엔화 환산 영향 확인", metric:"수출·환산 실적", what:"해외 매출 비중이 높은 일본 기업들이에요. 엔화 변화는 매출 환산과 수입비용에 서로 다른 방향으로 작용할 수 있어요.", watch:["엔화", "기업 실적", "글로벌 수요"], sources:["기업 IR", "Japan Customs"], updated:"09.22 18:00" },
  "rate-expectation": { id:"rate-expectation", name:"금리 기대", category:"금융여건", region:"글로벌", status:"물가 반영", change:"국채금리와 연결", metric:"정책금리 선물", what:"시장 참여자가 예상하는 앞으로의 기준금리 경로예요. 실제 결정과 다를 수 있어요.", watch:["중앙은행 회의", "CPI", "고용"], sources:["각국 중앙은행", "공식 시장 데이터"], updated:"09.23 10:10" },
  "us-economy": { id:"us-economy", name:"미국 경기", category:"실물경제", region:"미국", status:"완만한 흐름", change:"성장·고용 교차 확인", metric:"GDP · 산업생산", what:"미국 경제의 생산과 지출, 소득 전반의 흐름이에요. 단일 지표보다 여러 데이터를 함께 봐야 해요.", watch:["GDP", "산업생산", "소매판매"], sources:["U.S. BEA", "Federal Reserve"], updated:"09.22 17:00" },
  "us-employment": { id:"us-employment", name:"미국 고용", category:"고용", region:"미국", status:"완만한 증가", change:"고용·임금 함께 확인", metric:"NFP · 실업률", what:"취업자 수, 실업률, 임금 등 미국 노동시장의 흐름이에요. 소비와 물가, Fed 판단에 연결될 수 있어요.", watch:["고용보고서", "실업수당", "임금"], sources:["U.S. BLS"], updated:"09.23 09:00" },
  "global-capital": { id:"global-capital", name:"글로벌 자금 흐름", category:"금융시장", region:"글로벌", status:"금리차 민감", change:"국가·자산 간 이동", metric:"펀드 플로우", what:"국가와 자산 사이에서 이동하는 투자 자금의 흐름이에요. 금리와 위험 선호, 환율이 함께 관련될 수 있어요.", watch:["미국 국채금리", "달러", "위험선호"], sources:["공식 국제수지", "거래소 데이터"], updated:"09.23 09:50" }
};

Object.assign(economicNodes, newNodes);

const additionalEdges = [
  ["us-cpi","fed","미국 CPI는 Fed의 정책 판단과 시장의 금리 기대에 영향을 줄 수 있어요.","물가 지표","CPI 결과 → 정책 기대 재평가 → 금리 경로",["고용","금융 안정","기대인플레이션"],["미국 CPI","Fed Funds Rate"]],
  ["us-rate","us-treasury-10y","미국의 금리 경로 기대가 달라지면 채권 가격이 조정되면서 미국 국채 수익률에도 영향을 줄 수 있어요.","시장금리에 영향","미국 금리 기대 → 채권 가격 조정 → 미국 국채 수익률",["물가 기대","경기 전망","국채 수급","기간 프리미엄"],["Fed Funds Rate","미국 국채 2년","미국 국채 10년"]],
  ["fed","us-treasury-10y","정책금리 기대와 장기 국채금리는 여러 경로를 통해 관련될 수 있어요.","정책 기대","정책 기대 → 채권시장 기대 → 국채 수익률",["물가 기대","경기 전망","국채 수급","글로벌 자금 흐름"],["Fed 기준금리","미국 국채 10년","CPI"]],
  ["us-treasury-10y","dollar","미국 장기금리 변화는 달러 자산의 상대적 매력과 연결될 수 있어요.","금리 차이","국채 수익률 → 달러 자산 선호 → 달러",["위험 선호","다른 국가 금리","경상수지"],["미국 10년물","달러지수"]],
  ["japan-cpi","boj","일본 물가 흐름은 BOJ의 정책 판단에 영향을 줄 수 있어요.","물가·정책","일본 CPI → BOJ 판단 → 정책 신호",["임금","성장","금융여건"],["일본 CPI","BOJ 정책금리"]],
  ["japan-rate","jgb-10y","일본의 정책금리 기대는 JGB 수익률곡선에 영향을 줄 수 있어요.","정책 기대","BOJ 기대 → 채권시장 → JGB 수익률",["일본 물가","국채 수급","글로벌 금리"],["BOJ 금리","JGB 10년"]],
  ["jgb-10y","yen","일본 국채금리는 미·일 금리차와 자금 흐름을 통해 엔화와 관련될 수 있어요.","금리 차이","JGB → 미·일 금리차 → 엔화 수요",["미국 금리","위험선호","무역수지"],["JGB 10년","USD/JPY"]],
  ["yen","japan-exporters","엔화 변화는 수출기업의 해외매출 환산과 수입비용에 영향을 줄 수 있어요.","환율 환산","엔화 → 매출·비용 환산 → 기업 실적",["해외 수요","원재료 가격","가격 정책"],["USD/JPY","기업 실적"]],
  ["consumer-prices","rate-expectation","소비자물가 흐름은 중앙은행 금리 기대에 영향을 줄 수 있어요.","물가·정책","소비자물가 → 정책 판단 → 금리 기대",["성장","고용","금융 안정"],["CPI","정책금리"]],
  ["rate-expectation","us-treasury-10y","금리 기대는 국채의 만기별 수익률에 영향을 줄 수 있어요.","정책 기대","금리 기대 → 채권 가격 조정 → 국채금리",["국채 수급","기간 프리미엄","글로벌 금리"],["정책금리 선물","미국 10년물"]],
  ["us-economy","us-employment","경기 흐름은 기업의 채용과 노동 수요에 영향을 줄 수 있어요.","실물경제","생산·매출 → 노동 수요 → 고용",["생산성","임금","산업별 수요"],["GDP","비농업고용"]],
  ["us-employment","consumption","고용과 임금은 가계 소득을 통해 소비 여력에 영향을 줄 수 있어요.","소득 경로","고용 → 가계소득 → 소비",["저축률","신용","소비심리"],["고용","소매판매"]],
  ["inflation","fed","인플레이션 흐름은 Fed의 정책금리 판단에 중요한 근거가 될 수 있어요.","물가·정책","물가 → Fed 판단 → 금리 경로",["고용","성장","금융 안정"],["CPI","PCE","Fed Funds Rate"]],
  ["us-treasury-10y","global-capital","미국 국채금리는 국가와 자산 간 상대 수익률을 바꿔 글로벌 자금 흐름에 영향을 줄 수 있어요.","자금 이동","국채금리 → 상대 매력 → 글로벌 자금 흐름",["위험선호","환율","유동성"],["미국 10년물","국제수지"]]
].map(([from,to,description,relationshipType,detailedExplanation,otherFactors,relatedIndicators], index) => ({
  id:`edge-x-${index + 1}`,
  from,
  to,
  sourceNodeId: from,
  targetNodeId: to,
  description,
  shortExplanation: description,
  relationshipType,
  detailedExplanation,
  transmissionPath: detailedExplanation.split(" → "),
  otherFactors,
  relatedIndicators,
  sources:["공식 통계·중앙은행 자료", "EconFlow 관계 모델"]
}));

economicEdges.push(...additionalEdges);
economicEdges.forEach((edge) => {
  edge.sourceNodeId ||= edge.from;
  edge.targetNodeId ||= edge.to;
  edge.shortExplanation ||= edge.description;
  edge.relationshipType ||= "경제적 전달 경로";
  edge.detailedExplanation ||= edge.description;
  edge.transmissionPath ||= [economicNodes[edge.from]?.name, "관련 여건 변화", economicNodes[edge.to]?.name];
  edge.otherFactors ||= ["다른 경제지표", "시장 기대", "글로벌 여건"];
  edge.relatedIndicators ||= [economicNodes[edge.from]?.metric, economicNodes[edge.to]?.metric].filter(Boolean);
  edge.sources ||= ["공식 데이터·기관 자료"];
});

export const nodeExtensions = {
  "us-inflation": { oneLine:"미국에서 상품과 서비스의 가격이 전반적으로 얼마나 움직이는지 보여주는 흐름이에요.", currentValues:[["미국 CPI","2.7%","전년 대비"],["Core PCE","2.6%","전년 대비"]], relatedConcepts:["inflation","cpi","pce","policy-rate"] },
  "us-rate": { oneLine:"미국 중앙은행의 정책금리와 앞으로의 금리 경로에 대한 시장 기대예요.", currentValues:[["미국 정책금리","4.25–4.50%","현재 범위"],["미국 10년물","4.18%","+5bp"]], relatedConcepts:["policy-rate","fomc","treasury","yield-curve"] },
  "import-prices": { oneLine:"해외 상품과 원재료를 들여올 때 원화로 치르는 가격의 흐름이에요.", currentValues:[["수입물가지수","환율·유가 반영","Mock"],["원/달러","1,338.40","+0.41%"]], relatedConcepts:["inflation","exchange","oil"] },
  yen: {
    oneLine:"일본의 공식 통화입니다.",
    currentValues:[["USD/JPY","147.82","+0.42%"],["JPY/KRW (100)","925.18","-0.26%"]],
    relatedConcepts:["exchange","policy-rate","treasury","yield-spread"],
    timeline:[["09/17","BOJ 정책 관련 발표","관련 흐름 변화","past"],["09/19","미국 금리 기대 변화","미·일 금리차 관련 흐름 변화","past"],["09/21","USD/JPY 변동 확대","시장 데이터 업데이트","past"],["오늘","새로운 BOJ 관련 설명","NOW","now"],["10/29","BOJ 금융정책결정회의","예정","future"],["10/30","BOJ 전망보고서","예정","future"]]
  },
  usdkrw: {
    oneLine:"미국 달러 1단위와 교환되는 원화의 비율이에요.",
    currentValues:[["USD/KRW","1,338.40","+0.41%"],["달러지수","101.24","+0.18%"]],
    relatedConcepts:["exchange","dollar-index","policy-rate","yield-spread"],
    timeline:[["09/18","Fed 정책 설명","달러 흐름 재평가","past"],["09/21","외국인 자금 흐름 변화","원화 수요 연결","past"],["오늘","장중 변동 확대","NOW","now"],["10/02","미국 고용보고서","예정","future"],["10/14","미국 CPI","예정","future"]]
  },
  "us-treasury-10y": {
    oneLine:"미국 정부가 발행하는 장기 국채의 대표적인 시장 금리 중 하나예요.",
    currentValues:[["10년 수익률","4.18%","+5bp"],["2년 수익률","3.82%","+4bp"],["10Y-2Y","+36bp","+1bp"]],
    relatedConcepts:["treasury","bond-price","bond-yield","yield-curve"],
    timeline:[["09/16","국채 입찰 결과","수급 기대 변화","past"],["09/20","Fed 발언","정책 경로 재평가","past"],["오늘","10년물 4.18%","NOW","now"],["10/14","미국 CPI","예정","future"],["10/28","FOMC","예정","future"]]
  },
  inflation: { oneLine:"상품과 서비스의 전반적인 가격 수준이 지속적으로 상승하는 현상이에요.", currentValues:[["한국 CPI","2.0%","YoY"],["미국 Core PCE","2.6%","YoY"]], relatedConcepts:["inflation","cpi","pce","policy-rate"], timeline:[["09/03","한국 CPI 발표","품목별 흐름 확인","past"],["오늘","주요국 물가 비교","NOW","now"],["10/14","미국 CPI","예정","future"]] },
  "jgb-10y": { oneLine:"일본 정부가 발행하는 10년 만기 국채의 시장 수익률이에요.", currentValues:[["JGB 10년","1.34%","+3bp"],["JGB 2년","0.78%","+1bp"]], relatedConcepts:["treasury","bond-yield","boj","yield-curve"], timeline:[["09/18","BOJ 국채매입 공지","수급 변화","past"],["오늘","JGB 수익률 상승","NOW","now"],["10/29","BOJ 회의","예정","future"]] }
};

Object.entries(nodeExtensions).forEach(([id, extension]) => Object.assign(economicNodes[id], extension));
Object.values(economicNodes).forEach((node) => {
  node.description ||= node.what;
  node.currentStatus ||= node.status;
  node.currentValue ||= node.currentValues?.[0]?.[1] || node.metric;
  node.unit ||= "";
  node.updatedAt ||= node.updated;
  node.whyNodes ||= economicEdges.filter((edge) => edge.to === node.id).map((edge) => edge.from);
  node.impactNodes ||= economicEdges.filter((edge) => edge.from === node.id).map((edge) => edge.to);
  node.watchEvents ||= economicEvents.filter((event) => event.nodeId === node.id).map((event) => event.id);
  node.relatedConcepts ||= node.category === "환율" ? ["exchange"] : node.category === "금리" ? ["policy-rate"] : node.category === "물가" ? ["inflation","cpi"] : [];
});

export const eventDetails = {
  "fed-released": { releaseState:"RELEASED", explainer:"미국 연방준비제도가 기준금리와 향후 정책 방향을 발표한 날이에요.", releasedAt:"2026-09-18 03:00 KST", previousValue:"4.50%", currentValue:"4.25%", unit:"상단", resultLabel:"25bp 인하", whatReleased:"정책금리 목표 범위와 경제전망이 발표됐어요.", background:"최근 물가와 고용의 균형 변화를 함께 반영한 결정으로 설명됐어요.", impact:["미국 국채","달러","글로벌 자금 흐름"], updatedAt:"09.18 04:10" },
  "fed-briefing-live": { releaseState:"LIVE", explainer:"Fed 관계자가 최근 정책 결정과 경제 전망을 설명하는 공개 발언이에요.", previousValue:"최근 FOMC 결정", relatedIndicator:"미국 국채금리 · 달러", conceptId:"fomc", updatedAt:"09.23 10:20" },
  "us-cpi": { releaseState:"UPCOMING", explainer:"미국 소비자물가의 월간·연간 변화를 발표하는 날이에요.", previousValue:"2.7%", relatedIndicator:"Core CPI", conceptId:"cpi" },
  "boj-meeting": { releaseState:"UPCOMING", explainer:"일본은행이 통화정책 방향을 결정하고 경제 전망을 설명하는 회의예요.", previousValue:"정책금리 0.50%", relatedIndicator:"일본 CPI · 임금", conceptId:"boj" },
  "boj-opinions": { releaseState:"UPDATED", explainer:"BOJ 정책위원들의 최근 판단과 의견을 요약해 공개하는 자료예요.", releasedAt:"2026-09-23 08:50 JST", previousValue:"이전 회의 의견", currentValue:"추가 의견 공개", unit:"문서", resultLabel:"자료 업데이트", whatReleased:"일부 위원의 물가와 정책 정상화 경로에 대한 설명이 추가됐어요.", background:"정책 결정이 아니라 위원들의 다양한 견해를 확인하는 자료예요.", impact:["일본 금리","JGB","엔화"], updatedAt:"09.23 09:15", conceptId:"boj" },
  "ecb-meeting": { releaseState:"UPCOMING", explainer:"ECB가 유로존의 정책금리와 통화정책 방향을 정하는 회의예요.", previousValue:"예금금리 2.00%", relatedIndicator:"유로존 CPI", conceptId:"ecb" },
  "korea-trade": { releaseState:"UPCOMING", explainer:"한국의 품목·지역별 수출과 수입 실적을 발표하는 날이에요.", previousValue:"수출 +5.8% YoY", relatedIndicator:"반도체 수출" },
  "us-jobs": { releaseState:"UPCOMING", explainer:"미국의 취업자 수, 실업률, 임금 변화를 발표하는 날이에요.", previousValue:"+142K", relatedIndicator:"실업률 · 임금", conceptId:"employment" },
  "boj-outlook": { releaseState:"UPCOMING", explainer:"BOJ가 일본의 성장과 물가 전망을 공개하는 자료예요.", previousValue:"이전 전망", relatedIndicator:"일본 CPI", conceptId:"boj" },
  "opec-meeting": { releaseState:"UPCOMING", explainer:"주요 산유국이 원유 생산 정책을 논의하는 일정이에요.", previousValue:"기존 생산 계획", relatedIndicator:"WTI · Brent", conceptId:"oil" }
};

economicEvents.unshift({
  id:"fed-released", date:"2026-09-18", dayLabel:"9월 18일", region:"미국", flag:"US", type:"금리 결정", title:"FOMC 금리 결정", status:"결과 발표", time:"03:00 KST", importance:"high", nodeId:"fed", flow:["FOMC","Fed 금리 기대","미국 국채","달러"], why:"정책 결정과 향후 경로 설명은 국채금리와 달러, 글로벌 금융여건에 연결될 수 있어요.", source:"Federal Reserve"
});

economicEvents.splice(1, 0, {
  id:"fed-briefing-live", date:"2026-09-23", dayLabel:"오늘", region:"미국", flag:"US", type:"중앙은행 주요 발언", title:"Fed 정책 브리핑", status:"진행 중", time:"10:00 KST", importance:"high", nodeId:"fed", flow:["Fed 설명","금리 기대","미국 국채","달러"], why:"정책 결정 이후의 설명은 시장의 금리 경로 해석과 국채·달러 흐름에 연결될 수 있어요.", source:"Federal Reserve"
});

economicEvents.forEach((event) => {
  const detail = eventDetails[event.id] || { releaseState:"UPCOMING", explainer:`${event.title}의 공식 결과와 설명을 확인하는 일정이에요.` };
  Object.assign(event, detail, {
    country:event.region,
    category:event.type,
    scheduledAt:event.date,
    importance:event.importance,
    relatedNodes:[event.nodeId],
    whyImportant:event.why,
    source:event.source,
    updatedAt:detail.updatedAt || "09.23 10:20"
  });
});

export const issueInsights = {
  "fx-volatility": {
    whyNow:"수입가격과 여행비, 기업 비용까지 연결될 수 있어 오늘의 생활·기업 물가 흐름을 이해하는 출발점이에요.",
    factors:[["미국 금리 기대 변화","달러 가치와 연결될 수 있어요.","fed"],["미국 국채금리","달러와 글로벌 자금 흐름에 연결될 수 있어요.","us-treasury-10y"],["한국 금리 전망","원화의 상대적 여건과 연결될 수 있어요.","interest-rate"],["외국인 자금 흐름","원화 수요와 연결될 수 있어요.","global-capital"],["글로벌 위험선호","안전자산으로 인식되는 달러 수요와 관련될 수 있어요.","dollar"]],
    impacts:[["수입가격","import-prices"],["기업 비용","corporate-cost"],["소비자물가","consumer-prices"],["해외여행 비용","japan-travel"],["수출기업 환산 실적","samsung"]]
  },
  "rate-expectation": { whyNow:"미국 국채와 달러를 거쳐 글로벌 시장의 자금 조달 여건에 연결될 수 있어요.", factors:[["미국 CPI","물가 흐름과 연결돼요.","us-cpi"],["미국 고용","성장과 임금 압력을 보여줘요.","us-employment"],["Fed 설명","정책 경로 기대에 영향을 줄 수 있어요.","fed"]], impacts:[["미국 국채 10년","us-treasury-10y"],["달러","dollar"],["글로벌 자금 흐름","global-capital"]] },
  "oil-move": { whyNow:"운송비와 기업 비용을 거쳐 생활물가에 전달될 수 있는 대표적인 비용 경로예요.", factors:[["산유국 공급","원유 공급 기대와 관련돼요.","oil"],["세계 수요 전망","경기와 에너지 소비에 연결돼요.","us-economy"]], impacts:[["운송비","transport-cost"],["기업 비용","corporate-cost"],["소비자물가","consumer-prices"]] },
  "ai-capex": { whyNow:"기업의 투자 계획이 반도체와 전력 인프라 수요로 실제 전달되는지 확인할 시점이에요.", factors:[["빅테크 CAPEX","데이터센터 투자와 연결돼요.","ai-investment"],["AI 서버 출하","고성능 반도체 수요와 연결돼요.","data-center"]], impacts:[["반도체 수요","semiconductor"],["메모리","memory"],["삼성전자","samsung"],["전력 수요","power"]] }
};

todayIssues.forEach((issue) => Object.assign(issue, issueInsights[issue.id] || {}));

export const marketContext = {
  "us-rate":["미국 CPI","고용","Fed 정책 설명"], usdkrw:["미국 국채금리","달러지수","외국인 자금 흐름"], yen:["BOJ","JGB 금리","미·일 금리차"], samsung:["AI·반도체","메모리 가격","원/달러"], "ai-investment":["미국 국채금리","AI 투자","기업 실적"], oil:["산유국 공급","원유 재고","세계 수요"], gold:["미국 실질금리","달러","위험 선호"], "consumer-prices":["수입물가","서비스물가","소비"], "us-inflation":["CPI","PCE","임금"]
};

export const companyVariables = [
  ["반도체 가격","메모리 사업의 판매가격과 수익성에 연결될 수 있어요.","memory"],
  ["원/달러 환율","해외매출 환산과 수입 비용 양쪽에 영향을 줄 수 있어요.","usdkrw"],
  ["AI 투자","데이터센터와 고성능 메모리 수요에 연결될 수 있어요.","ai-investment"],
  ["글로벌 경기","전자제품과 반도체 최종 수요에 영향을 줄 수 있어요.","us-economy"],
  ["금리·국채금리","시장 가치평가와 기업 자금 환경에 연결될 수 있어요.","us-treasury-10y"],
  ["중국 경기","글로벌 IT 수요와 공급망 흐름에 연결될 수 있어요.","semiconductor"]
].map(([name, explanation, nodeId], index) => ({ id:`company-var-${index + 1}`, name, explanation, nodeId }));

const rateCategory = marketCategories.find((item) => item[0] === "rates");
if (rateCategory) rateCategory[1] = "금리/채권";
