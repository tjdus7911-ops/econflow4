import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import {
  companies,
  economicEdges,
  economicEvents,
  economicNodes,
  marketData,
  searchCatalog,
  todayIssues
} from "../src/mock-data.js";

function hasPath(sequence) {
  return sequence.slice(0, -1).every((from, index) =>
    economicEdges.some((edge) => edge.from === from && edge.to === sequence[index + 1])
  );
}

await Promise.all([
  access(new URL("../index.html", import.meta.url)),
  access(new URL("../src/app.js", import.meta.url)),
  access(new URL("../src/styles.css", import.meta.url))
]);

assert.ok(Object.keys(economicNodes).length >= 20, "경제지도에 충분한 mock 노드가 있어야 합니다.");
assert.ok(economicEdges.length >= 25, "사용자가 탐색할 수 있는 관계가 충분해야 합니다.");
assert.ok(todayIssues.length >= 4, "오늘의 핵심 변화가 네 개 이상이어야 합니다.");
assert.ok(economicEvents.some((event) => event.id === "boj-meeting"), "BOJ 회의 일정이 있어야 합니다.");
assert.ok(companies.samsung, "삼성전자 기업 상세 데이터가 있어야 합니다.");
assert.ok(Object.values(marketData).every((items) => items.length >= 3), "모든 시장 분류에 항목이 있어야 합니다.");

assert.ok(hasPath(["us-rate", "dollar", "usdkrw", "import-prices"]), "시나리오 A의 경제 흐름이 연결되어야 합니다.");
assert.ok(hasPath(["boj", "japan-rate", "yen", "japan-travel"]), "시나리오 B의 경제 흐름이 연결되어야 합니다.");
assert.ok(searchCatalog.some((item) => item.terms.includes("엔화는 왜 움직이는 거야") && item.target === "yen"), "시나리오 C 자연어 검색 결과가 있어야 합니다.");
assert.ok(hasPath(["consumption", "inflation", "interest-rate", "loan"]), "인플레이션 개념 흐름이 연결되어야 합니다.");

console.log(`✓ EconFlow smoke checks passed (${Object.keys(economicNodes).length} nodes, ${economicEdges.length} edges, ${economicEvents.length} events)`);
