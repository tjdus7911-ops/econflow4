import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import {
  companies,
  economicEdges,
  economicEvents,
  economicNodes,
  marketData,
  searchCatalog,
  todayIssues
} from "../src/mock-data.js";
import {
  bondMarketData,
  companyVariables,
  concepts,
  eventDetails,
  issueInsights,
  nodeExtensions,
  yieldCurveData
} from "../src/extended-data.js";

function hasPath(sequence) {
  return sequence.slice(0, -1).every((from, index) =>
    economicEdges.some((edge) => edge.from === from && edge.to === sequence[index + 1])
  );
}

await Promise.all([
  access(new URL("../index.html", import.meta.url)),
  access(new URL("../src/app.js", import.meta.url)),
  access(new URL("../src/styles.css", import.meta.url)),
  access(new URL("../src/assets/econflow-hero-v1.png", import.meta.url))
]);

const [appSource, styleSource] = await Promise.all([
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8")
]);

assert.match(appSource, /class="skip-link"/, "키보드 사용자를 위한 본문 건너뛰기 링크가 있어야 합니다.");
assert.match(appSource, /aria-current="page"/, "현재 내비게이션 위치를 보조 기술에 알려야 합니다.");
assert.match(appSource, /role="status" aria-live="polite"/, "상태 알림은 비방해적으로 전달되어야 합니다.");
assert.match(styleSource, /:focus-visible/, "전역 키보드 포커스 스타일이 있어야 합니다.");
assert.match(styleSource, /env\(safe-area-inset-bottom\)/, "모바일 하단 내비게이션은 안전 영역을 고려해야 합니다.");

assert.ok(Object.keys(economicNodes).length >= 20, "경제지도에 충분한 mock 노드가 있어야 합니다.");
assert.ok(economicEdges.length >= 25, "사용자가 탐색할 수 있는 관계가 충분해야 합니다.");
assert.ok(todayIssues.length >= 4, "오늘의 핵심 변화가 네 개 이상이어야 합니다.");
assert.ok(economicEvents.some((event) => event.id === "boj-meeting"), "BOJ 회의 일정이 있어야 합니다.");
assert.ok(companies.samsung, "삼성전자 기업 상세 데이터가 있어야 합니다.");
assert.ok(Object.values(marketData).every((items) => items.length >= 3), "모든 시장 분류에 항목이 있어야 합니다.");

assert.ok(hasPath(["us-rate", "dollar", "usdkrw", "import-prices"]), "시나리오 A의 경제 흐름이 연결되어야 합니다.");
assert.ok(hasPath(["us-inflation", "us-rate", "us-treasury-10y", "dollar", "usdkrw", "import-prices"]), "경제 탐색 필수 시나리오가 한 단계씩 직접 연결되어야 합니다.");
assert.ok(hasPath(["boj", "japan-rate", "yen", "japan-travel"]), "시나리오 B의 경제 흐름이 연결되어야 합니다.");
assert.ok(searchCatalog.some((item) => item.terms.includes("엔화는 왜 움직이는 거야") && item.target === "yen"), "시나리오 C 자연어 검색 결과가 있어야 합니다.");
assert.ok(hasPath(["consumption", "inflation", "interest-rate", "loan"]), "인플레이션 개념 흐름이 연결되어야 합니다.");

assert.ok(Object.keys(concepts).length >= 20, "충분한 경제 개념 mock data가 있어야 합니다.");
assert.ok(["inflation", "cpi", "treasury", "bond-price", "bond-yield", "yield-spread", "yield-curve"].every((id) => concepts[id]), "핵심 물가·국채 개념이 있어야 합니다.");
assert.ok(bondMarketData.length >= 12, "국가·만기별 국채 데이터가 있어야 합니다.");
assert.ok(["미국", "한국", "일본", "독일"].every((country) => bondMarketData.some((bond) => bond.country === country)), "미국·한국·일본·독일 국채가 있어야 합니다.");
assert.ok(yieldCurveData.length === 12, "4개국의 현재·1개월 전·1년 전 수익률곡선이 있어야 합니다.");
assert.ok(yieldCurveData.every((curve) => curve.maturities.length === 7 && curve.yields.length === 7), "수익률곡선 만기와 수익률 데이터가 일치해야 합니다.");
assert.ok(["UPCOMING", "LIVE", "RELEASED", "UPDATED"].every((status) => economicEvents.some((event) => event.releaseState === status)), "캘린더의 네 가지 발표 상태가 모두 있어야 합니다.");
assert.ok(Object.keys(nodeExtensions).length >= 5, "주요 노드에 현재 값·타임라인·관련 개념이 있어야 합니다.");
assert.ok(companyVariables.length >= 6, "기업 관련 경제변수가 충분해야 합니다.");
assert.ok(issueInsights["fx-volatility"]?.factors.length >= 5, "오늘 카드 WHY 상세 요인이 있어야 합니다.");

assert.ok(hasPath(["us-cpi", "fed", "us-treasury-10y", "dollar", "usdkrw", "import-prices", "consumer-prices"]), "확장 시나리오 1이 연결되어야 합니다.");
assert.ok(hasPath(["japan-cpi", "boj", "japan-rate", "jgb-10y", "yen", "japan-travel"]), "확장 시나리오 2 여행 경로가 연결되어야 합니다.");
assert.ok(hasPath(["japan-cpi", "boj", "japan-rate", "jgb-10y", "yen", "japan-exporters"]), "확장 시나리오 2 기업 경로가 연결되어야 합니다.");
assert.ok(hasPath(["oil", "transport-cost", "corporate-cost", "consumer-prices", "rate-expectation", "us-treasury-10y"]), "확장 시나리오 3이 연결되어야 합니다.");
assert.ok(hasPath(["ai-investment", "data-center", "semiconductor", "memory", "samsung"]), "확장 시나리오 4가 연결되어야 합니다.");
assert.ok(hasPath(["us-economy", "us-employment", "consumption", "inflation", "fed", "us-treasury-10y", "global-capital"]), "확장 시나리오 5가 연결되어야 합니다.");

console.log(`✓ EconFlow smoke checks passed (${Object.keys(economicNodes).length} nodes, ${economicEdges.length} edges, ${economicEvents.length} events)`);
