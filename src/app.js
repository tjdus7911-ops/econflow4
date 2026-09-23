import {
  APP_DATE,
  catchUpChanges,
  companies,
  defaultInterests,
  defaultWatchItems,
  economicEdges,
  economicEvents,
  economicNodes,
  getIncomingEdges,
  getNode,
  getOutgoingEdges,
  marketCategories,
  marketData,
  popularFlows,
  searchCatalog,
  todayIssues
} from "./mock-data.js";
import {
  bondMarketData,
  companyVariables,
  concepts,
  eventDetails,
  issueInsights,
  marketContext,
  yieldCurveData
} from "./extended-data.js";

const app = document.querySelector("#app");

const icons = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  reset: '<path d="M20 6v5h-5"/><path d="M18.3 15A7 7 0 1 1 18 8l2 3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.6-7.5a5.5 5.5 0 0 0 1.2-8.9Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  source: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  spark: '<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  building: '<path d="M3 21h18M6 21V5l6-3 6 3v16M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1"/>'
};

function icon(name, size = 18, filled = false) {
  return `<svg class="icon${filled ? " is-filled" : ""}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.info}</svg>`;
}

function readStored(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

const state = {
  searchOpen: false,
  searchQuery: "",
  interests: readStored("econflow_interests", defaultInterests),
  watchItems: readStored("econflow_watch", defaultWatchItems),
  exploreHistory: [],
  selectedEdge: null,
  edgeExpanded: false,
  exploreView: "easy",
  expandedWhy: false,
  expandedImpact: false,
  flowFocus: null,
  quickNode: null,
  detailNode: null,
  marketCategory: "indices",
  bondCountry: "미국",
  curveCountry: "미국",
  curvePeriod: "현재",
  calendarView: "upcoming",
  calendarRegion: "전체",
  modalEvent: null,
  conceptPopover: null,
  insightModal: null,
  companyTab: "overview",
  toast: ""
};

function persist() {
  localStorage.setItem("econflow_interests", JSON.stringify(state.interests));
  localStorage.setItem("econflow_watch", JSON.stringify(state.watchItems));
}

function parseRoute() {
  const parts = (location.hash || "#/today").replace(/^#\/?/, "").split("/").filter(Boolean);
  return { page: parts[0] || "today", id: parts[1] || null };
}

function go(route) {
  if (location.hash === route) {
    render();
    return;
  }
  location.hash = route;
}

function goToNode(nodeId, options = {}) {
  if (!economicNodes[nodeId]) return;
  if (options.reset || parseRoute().page !== "explore") state.exploreHistory = [nodeId];
  else if (state.exploreHistory.at(-1) !== nodeId) state.exploreHistory.push(nodeId);
  state.selectedEdge = options.edge || null;
  state.edgeExpanded = false;
  state.quickNode = options.quick === false ? null : nodeId;
  state.detailNode = null;
  state.expandedWhy = false;
  state.expandedImpact = false;
  state.flowFocus = null;
  go(`#/explore/${nodeId}`);
}

function showToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 2200);
}

function regionMark(region) {
  const map = { 한국: "KR", 미국: "US", 일본: "JP", 유럽: "EU", 글로벌: "GL" };
  return `<span class="region-mark region-${(map[region] || "GL").toLowerCase()}">${map[region] || "GL"}</span>`;
}

function renderHeader(activePage) {
  const navItems = [
    ["today", "오늘", "spark"],
    ["explore", "탐색", "layers"],
    ["market", "시장", "trend"],
    ["calendar", "캘린더", "calendar"],
    ["my", "MY", "heart"]
  ];
  return `
    <a class="skip-link" href="#main-content">본문으로 건너뛰기</a>
    <header class="app-header">
      <div class="header-inner">
        <a class="brand" href="#/today" aria-label="EconFlow 홈">
          <span class="brand-mark"><span></span><span></span><span></span></span>
          <span>EconFlow</span>
        </a>
        <nav class="main-nav" aria-label="주요 메뉴">
          ${navItems.map(([id, label, iconName]) => {
            const active = activePage === id || (id === "explore" && ["company", "concept"].includes(activePage));
            return `<a href="#/${id}" class="nav-link ${active ? "is-active" : ""}" ${active ? 'aria-current="page"' : ""}>
              <span class="nav-icon">${icon(iconName, 19)}</span>
              <span class="nav-label">${label}</span>
              ${id === "calendar" && state.watchItems.length ? `<span class="nav-dot" aria-label="지켜보는 일정 있음"></span>` : ""}
            </a>`;
          }).join("")}
        </nav>
        <button class="global-search-trigger" type="button" data-action="search-open">
          ${icon("search", 17)}
          <span>무엇이 궁금하세요?</span>
          <kbd>⌘ K</kbd>
        </button>
        <a class="header-profile" href="#/my" aria-label="내 경제지도"><span>EF</span></a>
      </div>
    </header>`;
}

function sectionHeading(kicker, title, aside = "") {
  return `<div class="section-heading"><div><p class="section-kicker">${kicker}</p><h2>${title}</h2></div>${aside}</div>`;
}

function sourceMeta(source, updated) {
  return `<div class="source-meta"><span>${icon("source", 14)} ${source}</span><span>${icon("clock", 14)} ${updated}</span></div>`;
}

function flowTrail(nodes, compact = false) {
  return `<div class="flow-trail ${compact ? "is-compact" : ""}">${nodes.map((node, index) => `${index ? `<span class="flow-arrow">${icon("arrow", 14)}</span>` : ""}<span class="flow-node">${node}</span>`).join("")}</div>`;
}

function conceptTrigger(conceptId, label = "") {
  const item = concepts[conceptId];
  if (!item) return "";
  return `<button class="concept-trigger" data-concept="${conceptId}" aria-label="${item.name} 개념 설명">${label ? `<span>${label}</span>` : ""}${icon("info", 14)}</button>`;
}

function conceptIdForNode(node) {
  if (node.relatedConcepts?.[0]) return node.relatedConcepts[0];
  const byCategory = { 환율:"exchange", 금리:"policy-rate", 국채:"treasury", 물가:"inflation", "물가 지표":"cpi", 원자재:node.id === "gold" ? "gold" : "oil", 중앙은행:node.id === "boj" ? "boj" : "fomc" };
  return byCategory[node.category] || null;
}

function miniLineSvg(values, className = "") {
  const width = 180, height = 52;
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
  const points = values.map((value, index) => `${(index / (values.length - 1)) * width},${height - ((value - min) / range) * 38 - 7}`).join(" ");
  return `<svg class="bond-mini-chart ${className}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}

function renderTodayIssue(issue, index) {
  return `
    <article class="issue-card tone-${issue.tone} ${index === 0 ? "is-featured" : ""}">
      <div class="issue-topline"><span class="eyebrow">${issue.eyebrow}</span><span class="live-dot"><i></i> 업데이트</span></div>
      <div class="issue-title-line"><h3>${issue.title}</h3>${conceptTrigger(conceptIdForNode(getNode(issue.nodeId)))}</div>
      <p>${issue.summary}</p>
      <div class="why-now-block"><span>왜 지금 봐야 해요?</span><p>${issue.whyNow || "지금 확인되는 변화가 다른 경제 흐름으로 어떻게 전달될 수 있는지 함께 살펴볼 수 있어요."}</p></div>
      <div class="card-flow-wrap"><span class="flow-label">관련 흐름</span>${flowTrail(issue.flow)}</div>
      <div class="issue-actions">
        <button class="text-button" data-insight="why:${issue.id}">WHY 왜?</button>
        <button class="primary-button small" data-insight="impact:${issue.id}">IMPACT 영향 보기 ${icon("arrow", 15)}</button>
      </div>
      ${sourceMeta(issue.source, `업데이트 ${issue.updated}`)}
    </article>`;
}

function renderToday() {
  return `
    <main class="page today-page">
      <section class="today-hero content-width">
        <div class="hero-copy">
          <p class="date-label"><span class="status-pulse"></span> 9월 23일 수요일</p>
          <p class="hero-kicker">오늘을 이해하는 가장 짧은 경로</p>
          <h1>오늘 경제를,<br><em><span>흐름으로</span> <span>이해하세요.</span></em></h1>
          <p class="hero-summary">흩어진 뉴스와 데이터를 원인부터 영향까지 연결했어요.<br>예측보다 이해에 집중해, 지금 중요한 변화만 선명하게 보여드려요.</p>
          <div class="hero-actions">
            <button class="primary-button hero-primary" data-node="usdkrw">3분 브리핑 시작 ${icon("arrow", 17)}</button>
            <a class="secondary-button hero-secondary" href="#/explore/usdkrw">경제지도 열기 ${icon("layers", 16)}</a>
          </div>
          <div class="hero-proof" role="list" aria-label="오늘의 콘텐츠 요약">
            <span role="listitem"><strong>${todayIssues.length}</strong> 핵심 변화</span>
            <span role="listitem"><strong>${popularFlows.length}</strong> 인기 흐름</span>
            <span role="listitem"><strong>공식</strong> 출처 우선</span>
          </div>
        </div>
        <aside class="briefing-card" aria-label="오늘의 추천 브리핑">
          <div class="briefing-art" aria-hidden="true">
            <img src="./src/assets/econflow-hero-v1.png" alt="" width="1536" height="1024">
            <span class="briefing-art-wash"></span>
            <span class="briefing-badge">${icon("spark", 16)} 오늘의 추천 브리핑</span>
          </div>
          <div class="briefing-content">
            <p class="briefing-eyebrow">가장 먼저 볼 변화</p>
            <h2>환율 움직임은<br>어디서 시작됐을까요?</h2>
            <p>미국 금리부터 수입물가까지, 연결된 네 단계를 40초 안에 확인해 보세요.</p>
            <button class="briefing-start" data-node="usdkrw">흐름 따라가기 ${icon("arrow", 16)}</button>
          </div>
        </aside>
      </section>

      <section class="catchup-strip content-width">
        <div class="catchup-icon">${icon("clock", 21)}</div>
        <div><span class="eyebrow">마지막 방문 이후</span><strong>중요한 변화 3개가 있었어요.</strong></div>
        <div class="catchup-chips"><span>엔화 <i>새 근거</i></span><span>금 <i>금리 기대</i></span><span>삼성전자 <i>공시</i></span></div>
        <a href="#/my" class="catchup-link">3분 만에 따라잡기 ${icon("arrow", 15)}</a>
      </section>

      <section class="content-width section-block">
        ${sectionHeading("TODAY'S SIGNAL", "오늘의 핵심 변화", '<span class="section-note">공식 데이터와 주요 보도를 묶어 정리했어요</span>')}
        <div class="issue-grid">${todayIssues.map(renderTodayIssue).join("")}</div>
      </section>

      <section class="soft-section">
        <div class="content-width section-block">
          ${sectionHeading("POPULAR FLOW", "오늘 많이 보는 경제 흐름", '<a href="#/explore/usdkrw" class="more-link">전체 경제지도 보기 ' + icon("arrow", 15) + "</a>")}
          <div class="popular-flow-list">
            ${popularFlows.map((flow, index) => `<button class="popular-flow-card" data-node="${flow.target}">
              <span class="flow-rank">0${index + 1}</span>
              <span class="popular-info"><strong>${flow.title}</strong>${flowTrail(flow.nodes, true)}</span>
              <span class="viewer-count">${icon("trend", 15)} ${flow.viewers}</span>
              <span class="round-arrow">${icon("arrow", 17)}</span>
            </button>`).join("")}
          </div>
        </div>
      </section>

      <section class="content-width section-block interest-section">
        ${sectionHeading("FOR YOU", "내 관심사와 관련된 변화", '<a href="#/my" class="more-link">관심사 관리 ' + icon("arrow", 15) + "</a>")}
        <div class="interest-update-grid">
          <article class="interest-update feature">
            <div class="interest-badge">관심 · 엔화</div><h3>일본 금리 기대와 연결된<br>새로운 데이터가 발표됐어요.</h3>
            ${flowTrail(["일본 금리", "엔화 ★", "일본 여행"])}
            <button class="secondary-button" data-node="yen">무엇이 달라졌는지 보기</button>
          </article>
          <article class="interest-update"><div class="mini-topic">GOLD</div><h3>금</h3><p>미국 실질금리 기대 경로가 업데이트됐어요.</p><button class="text-button" data-node="gold">연결 확인 ${icon("arrow", 14)}</button></article>
          <article class="interest-update"><div class="mini-topic">AI</div><h3>AI · 반도체</h3><p>데이터센터 투자 관련 기업 설명이 추가됐어요.</p><button class="text-button" data-node="ai-investment">연결 확인 ${icon("arrow", 14)}</button></article>
        </div>
      </section>
    </main>`;
}

const easyNodeNames = {
  "us-cpi": "미국 물가",
  fed: "미국 금리 기대",
  "us-treasury-10y": "미국 국채",
  "jgb-10y": "일본 국채",
  "rate-expectation": "앞으로의 금리 기대"
};

const easyHiddenNodes = new Set(["us-cpi", "fed", "rate-expectation"]);

const flowPriorities = {
  "us-inflation>us-rate": 1,
  "us-rate>us-treasury-10y": 1,
  "us-treasury-10y>dollar": 1,
  "dollar>usdkrw": 1,
  "usdkrw>import-prices": 1,
  "import-prices>consumer-prices": 1,
  "us-rate>dollar": 2,
  "us-rate>gold": 3,
  "usdkrw>corporate-cost": 2,
  "usdkrw>japan-travel": 3
};

const relationshipLabels = {
  "us-inflation>us-rate": "금리 결정의 주요 지표",
  "us-rate>us-treasury-10y": "시장금리에 영향",
  "us-rate>dollar": "금리차와 연결",
  "us-rate>gold": "금리·달러와 연결",
  "us-treasury-10y>dollar": "금리차와 자금 흐름",
  "dollar>usdkrw": "달러 강도와 연결",
  "usdkrw>import-prices": "수입 원화가격에 영향",
  "import-prices>consumer-prices": "생활물가로 일부 전달",
  "oil>import-prices": "원유 수입비용에 영향"
};

const detailedIndicators = {
  "us-inflation": ["CPI", "PCE", "근원물가"],
  "us-rate": ["Fed", "미국 국채 2Y·10Y", "Yield Curve"],
  "us-treasury-10y": ["2Y·10Y", "Yield Curve", "Fed"],
  dollar: ["DXY", "미국 국채 10Y", "Fed"],
  usdkrw: ["USD/KRW", "DXY", "한·미 금리차"]
};

function displayNodeName(node) {
  return state.exploreView === "easy" ? easyNodeNames[node.id] || node.name : node.name;
}

function relationshipLabel(edge) {
  const explicit = relationshipLabels[`${edge.from}>${edge.to}`];
  if (explicit) return explicit;
  if (edge.relationshipType && edge.relationshipType !== "경제적 전달 경로") return edge.relationshipType;
  const targetCategoryLabels = {
    금리: "금리 판단에 영향",
    환율: "통화 가치와 연결",
    국채: "시장금리에 영향",
    물가: "물가 흐름에 영향",
    "물가 지표": "물가 지표로 확인",
    중앙은행: "정책 판단에 영향",
    금융여건: "금융여건과 연결",
    금융시장: "자금 흐름과 연결",
    실물경제: "경기 흐름에 영향",
    고용: "고용 흐름에 영향",
    원자재: "원자재 가격과 연결",
    생활경제: "체감 비용으로 연결",
    기업비용: "기업 비용으로 전달",
    기업: "기업 실적과 연결",
    산업: "산업 수요와 연결",
    인프라: "투자 수요와 연결"
  };
  return targetCategoryLabels[getNode(edge.to).category] || "다음 경제 흐름과 연결";
}

function orderedFlowEdges(nodeId, direction) {
  const edges = direction === "incoming" ? getIncomingEdges(nodeId) : getOutgoingEdges(nodeId);
  const filtered = state.exploreView === "easy"
    ? edges.filter((edge) => !easyHiddenNodes.has(direction === "incoming" ? edge.from : edge.to))
    : edges;
  const visiblePool = filtered.length ? filtered : edges;
  return [...visiblePool].sort((left, right) => {
    const leftPriority = flowPriorities[`${left.from}>${left.to}`] ?? 50;
    const rightPriority = flowPriorities[`${right.from}>${right.to}`] ?? 50;
    return leftPriority - rightPriority;
  });
}

function renderFlowNodeCard(nodeId) {
  const node = getNode(nodeId);
  const detail = state.exploreView === "detailed" ? node.metric : node.status;
  return `<button class="flow-node-card ${state.interests.includes(nodeId) ? "is-interest" : ""}" data-node="${nodeId}" aria-label="${node.name}을 현재 항목으로 보기">
    <span class="node-category">${node.region} · ${node.category}</span>
    <strong>${displayNodeName(node)}</strong>
    <small>${detail}</small>
    ${state.exploreView === "detailed" ? `<p class="detail-only">${node.change}</p>` : ""}
    ${state.interests.includes(nodeId) ? '<span class="interest-star">★</span>' : ""}
  </button>`;
}

function renderFlowRelation(edge) {
  return `<button class="flow-relation" data-edge="${edge.id}" aria-label="${getNode(edge.from).name}에서 ${getNode(edge.to).name}으로 이어지는 관계 설명 보기">
    <span class="relation-label">${relationshipLabel(edge)}</span>
  </button>`;
}

function renderFlowLane(nodeId, direction) {
  const edges = orderedFlowEdges(nodeId, direction);
  if (!edges.length) return `<div class="empty-lane"><span>${direction === "incoming" ? "정리된 직접 원인이" : "정리된 직접 연결이"}<br>아직 없어요.</span></div>`;
  const expanded = direction === "incoming" ? state.expandedWhy : state.expandedImpact;
  const visible = expanded ? edges : edges.slice(0, 3);
  const hiddenCount = Math.max(0, edges.length - visible.length);
  return `${visible.map((edge) => {
    const relatedNodeId = direction === "incoming" ? edge.from : edge.to;
    return direction === "incoming"
      ? `<div class="flow-node-row why-row">${renderFlowNodeCard(relatedNodeId)}${renderFlowRelation(edge)}</div>`
      : `<div class="flow-node-row impact-row">${renderFlowRelation(edge)}${renderFlowNodeCard(relatedNodeId)}</div>`;
  }).join("")}${hiddenCount ? `<button class="expand-relations" data-action="expand-${direction === "incoming" ? "why" : "impact"}" aria-expanded="false">${icon("plus", 13)} 다른 ${direction === "incoming" ? "원인" : "연결"} ${hiddenCount}개</button>` : expanded && edges.length > 3 ? `<button class="expand-relations" data-action="collapse-${direction === "incoming" ? "why" : "impact"}" aria-expanded="true">간단히 보기</button>` : ""}`;
}

function renderCurrentFlowCard(nodeId) {
  const node = getNode(nodeId);
  const primaryValue = node.currentValues?.[0];
  const indicators = detailedIndicators[nodeId] || [node.metric];
  const conceptId = conceptIdForNode(node);
  return `<div class="flow-list">
    <article class="current-flow-card">
      <div class="current-card-head">
        <div><span>${node.region} · ${node.category}</span><strong>${displayNodeName(node)}</strong></div>
        ${conceptId ? conceptTrigger(conceptId, "이게 뭐예요?") : `<button class="concept-trigger" data-action="current-explain" data-id="${node.id}" aria-label="${node.name} 간단 설명">이게 뭐예요? ${icon("info", 14)}</button>`}
      </div>
      <div class="current-stat">
        <span>${primaryValue ? primaryValue[0] : "현재 흐름"}</span>
        <strong>${primaryValue ? primaryValue[1] : node.metric}</strong>
        <small>${primaryValue ? primaryValue[2] : node.updated}</small>
        <p>${node.change}</p>
      </div>
      ${state.exploreView === "detailed" ? `<div class="detail-only detailed-indicators"><span>함께 보는 전문 지표</span><div>${indicators.map((item) => `<b>${item}</b>`).join("")}</div></div>` : ""}
    </article>
    <div class="direction-actions" aria-label="탐색 방향 선택">
      <button class="direction-action ${state.flowFocus === "why" ? "is-active" : ""}" data-action="focus-why" aria-pressed="${state.flowFocus === "why"}">← 왜?</button>
      <button class="direction-action ${state.flowFocus === "impact" ? "is-active" : ""}" data-action="focus-impact" aria-pressed="${state.flowFocus === "impact"}">그래서? →</button>
    </div>
  </div>`;
}

function renderEconomicGraph(nodeId) {
  const focusClass = state.flowFocus ? ` is-focus-${state.flowFocus}` : "";
  const detailClass = state.exploreView === "detailed" ? " is-detailed" : "";
  return `<div class="flow-map-stage${focusClass}${detailClass}">
    <section class="flow-column why-column">
      <header class="flow-column-title"><span>WHY</span><strong>왜 이런 일이 생겼을까요?</strong></header>
      <p class="flow-branch-note">각 요인이 현재 항목과 따로 연결돼요.</p>
      <div class="flow-list">${renderFlowLane(nodeId, "incoming")}</div>
    </section>
    <section class="flow-column current-column">
      <header class="flow-column-title"><span>CURRENT</span><strong>지금 보고 있어요</strong></header>
      ${renderCurrentFlowCard(nodeId)}
      <div class="flow-story-arrow">다음 연결을 아래에서 이어 보세요</div>
    </section>
    <section class="flow-column impact-column">
      <header class="flow-column-title"><span>IMPACT</span><strong>어디로 연결될까요?</strong></header>
      <p class="flow-branch-note">각 항목은 현재 항목에서 따로 이어져요.</p>
      <div class="flow-list">${renderFlowLane(nodeId, "outgoing")}</div>
    </section>
  </div>`;
}

function detailLinkList(title, edges, direction) {
  return `<div class="detail-group"><div class="detail-title-row"><h3>${title}</h3><span>${edges.length}개 연결</span></div><div class="factor-list">
    ${edges.slice(0, 5).map((edge) => {
      const id = direction === "incoming" ? edge.from : edge.to;
      const node = getNode(id);
      return `<button data-node="${id}"><span class="factor-dot ${direction}"></span><span><strong>${node.name}</strong><small>${node.category} · ${node.status}</small></span>${icon("chevron", 16)}</button>`;
    }).join("") || '<p class="empty-copy">현재 정리된 직접 연결이 없어요.</p>'}
  </div></div>`;
}

function renderEdgeDetail(edge) {
  if (!edge) return "";
  const source = getNode(edge.from);
  const target = getNode(edge.to);
  return `<div class="selected-edge-card edge-detail-expanded">
    <div class="selected-edge-top"><span>${edge.relationshipType || "선택한 연결"}</span><button data-action="edge-clear" aria-label="연결 상세 닫기">${icon("close", 14)}</button></div>
    <strong>${source.name} ${icon("arrow", 14)} ${target.name}</strong>
    <section><b>왜 연결돼 있나요?</b><p>${edge.detailedExplanation || edge.description}</p></section>
    <section><b>전달 경로</b><div class="edge-path">${(edge.transmissionPath || [source.name, "관련 여건", target.name]).map((step, index) => `${index ? icon("arrow", 12) : ""}<span>${step}</span>`).join("")}</div></section>
    <section><b>다른 요인</b><div class="edge-other-factors">${(edge.otherFactors || []).map((factor) => `<span>${factor}</span>`).join("")}</div></section>
    <section><b>관련 데이터</b><div class="edge-other-factors">${(edge.relatedIndicators || []).map((item) => `<span>${item}</span>`).join("")}</div></section>
    <div class="evidence-mini">${icon("source", 14)} ${(edge.sources || ["공식 데이터·기관 자료"]).join(" · ")}</div>
    <p class="edge-caution">이 연결은 결과를 단정하지 않으며, 영향을 줄 수 있는 경제적 전달 경로를 설명합니다.</p>
  </div>`;
}

function renderNodeTimeline(node) {
  if (!node.timeline?.length) return "";
  return `<div class="detail-group node-timeline"><div class="detail-title-row"><h3>${icon("clock", 15)} 최근 흐름</h3><span>과거 ← 현재 → 예정</span></div><div class="timeline-list">${node.timeline.map(([date,title,text,status]) => `<div class="timeline-item is-${status}"><span class="timeline-dot"></span><time>${date}</time><div><strong>${title}</strong><small>${text}</small></div>${status === "now" ? '<b class="timeline-now">NOW</b>' : ""}</div>`).join("")}</div></div>`;
}

function renderRelatedConcepts(node) {
  const ids = node.relatedConcepts || [];
  if (!ids.length) return "";
  return `<div class="detail-group related-concepts"><div class="detail-title-row"><h3>관련 개념</h3><span>모르는 용어를 바로 확인하세요</span></div><div>${ids.map((id) => concepts[id] ? `<button data-concept="${id}"><span>${concepts[id].name}</span>${icon("info", 13)}</button>` : "").join("")}</div></div>`;
}

function renderNodeDetail(nodeId) {
  const node = getNode(nodeId);
  const incoming = getIncomingEdges(nodeId);
  const outgoing = getOutgoingEdges(nodeId);
  const selected = economicEdges.find((edge) => edge.id === state.selectedEdge);
  const interested = state.interests.includes(nodeId);
  const watched = state.watchItems.includes(`node:${nodeId}`);
  return `<aside class="node-detail-panel">
    <div class="panel-header">
      <div><span class="panel-category">${node.region} · ${node.category}</span><h2>${node.name}</h2><span class="status-chip"><i></i>${node.status}</span></div>
      <button class="icon-action ${interested ? "is-active" : ""}" data-action="interest-toggle" data-id="${nodeId}" aria-label="관심 등록">${icon("heart", 19, interested)}</button>
    </div>

    ${renderEdgeDetail(selected)}

    <div class="panel-scroll">
      <div class="what-block"><div class="node-one-line"><span>한 줄 이해</span><p>${node.oneLine || node.what}</p>${conceptTrigger(conceptIdForNode(node))}</div><span class="framework-label what">WHAT</span><h3>무슨 일이 있나요?</h3><p>${node.what}</p>${node.currentValues?.length ? `<div class="current-value-grid">${node.currentValues.map(([label,value,change]) => `<div class="current-value-card"><span>${label}</span><strong>${value}</strong><small>${change}</small></div>`).join("")}</div>` : `<div class="data-snapshot"><span>${node.metric}</span><strong>${node.change}</strong><small>Mock · ${node.updated}</small></div>`}</div>

      ${node.learn ? `<div class="inflation-learn"><div class="detail-title-row"><h3>왜 생겨요?</h3><span>여러 요인이 함께 작용</span></div><div class="learn-grid">${node.learn.map(([title, text], i) => `<div><b>0${i + 1}</b><strong>${title}</strong><p>${text}</p></div>`).join("")}</div></div>` : ""}

      ${detailLinkList('<span class="framework-label why">WHY</span> 관련 요인', incoming, "incoming")}
      ${detailLinkList('<span class="framework-label impact">IMPACT</span> 영향을 줄 수 있는 영역', outgoing, "outgoing")}

      ${renderNodeTimeline(node)}

      <div class="detail-group watch-group"><div class="detail-title-row"><h3><span class="framework-label watch">WATCH</span> 앞으로 확인할 것</h3></div><div class="watch-chip-list">${node.watch.map((item) => `<span>${icon("calendar", 14)} ${item}</span>`).join("")}</div><button class="watch-wide ${watched ? "is-watched" : ""}" data-action="watch-node" data-id="${nodeId}">${icon(watched ? "check" : "bell", 17)} ${watched ? "이 흐름을 지켜보는 중" : "이 흐름 지켜보기"}</button></div>

      ${renderRelatedConcepts(node)}

      <div class="detail-group evidence-group"><div class="detail-title-row"><h3>근거와 출처</h3><span>공식 우선</span></div>${node.sources.map((source) => `<div class="evidence-row">${icon("source", 16)}<span><strong>${source}</strong><small>공식 데이터 · 기준일 ${APP_DATE}</small></span><b>원문</b></div>`).join("")}<div class="panel-action-row"><button>근거 데이터 보기</button><button>관련 뉴스 보기</button></div><p class="evidence-note">이 설명은 인과를 확정하거나 미래 결과를 예측하지 않으며, 관련될 수 있는 경제적 경로를 보여줍니다.</p></div>
    </div>
  </aside>`;
}

function renderNodeQuickPopup() {
  if (!state.quickNode) return "";
  const node = getNode(state.quickNode);
  const descriptions = {
    dollar: "미국의 통화이자 글로벌 금융시장에서 널리 사용되는 대표적인 통화예요.",
    "us-rate": "미국 중앙은행의 정책과 시장 기대를 함께 보여주는 금리 흐름이에요.",
    "us-treasury-10y": "미국 정부가 발행한 장기 국채로, 세계 금융시장의 기준 금리 중 하나예요.",
    usdkrw: "미국 달러 1단위와 교환되는 원화의 비율이에요.",
    "import-prices": "해외 상품과 원재료를 들여올 때 원화로 치르는 가격의 흐름이에요."
  };
  return `<div class="quick-popup-layer">
    <article class="node-quick-popup" role="dialog" aria-modal="false" aria-labelledby="quick-node-title" data-modal-stop>
      <button class="modal-close" data-action="quick-close" aria-label="간단 설명 닫기">${icon("close", 17)}</button>
      <span>${node.region} · ${node.category}</span>
      <h3 id="quick-node-title">${displayNodeName(node)}</h3>
      <p>${descriptions[node.id] || node.oneLine || node.what}</p>
      <div class="quick-popup-actions">
        <button data-action="quick-concept" data-id="${node.id}">이게 뭐예요?</button>
        <button data-action="quick-why" data-id="${node.id}">왜 움직여요?</button>
        <button data-action="quick-impact" data-id="${node.id}">어디에 영향줘요?</button>
        <button data-action="quick-detail" data-id="${node.id}">자세히 알아보기 ${icon("arrow", 13)}</button>
      </div>
    </article>
  </div>`;
}

function renderRelationshipPopup() {
  if (!state.selectedEdge) return "";
  const edge = economicEdges.find((item) => item.id === state.selectedEdge);
  if (!edge) return "";
  const source = getNode(edge.from);
  const target = getNode(edge.to);
  const otherFactors = (edge.otherFactors || []).slice(0, 3).join(" · ");
  const expanded = state.edgeExpanded;
  return `<div class="relation-popup-layer">
    <article class="relation-popup ${expanded ? "is-expanded" : ""}" role="dialog" aria-modal="true" aria-labelledby="relation-popup-title" data-modal-stop>
      <button class="modal-close" data-action="edge-clear" aria-label="관계 설명 닫기">${icon("close", 17)}</button>
      <span class="section-kicker">RELATIONSHIP</span>
      <h2 id="relation-popup-title">왜 연결돼요?</h2>
      <div class="relation-popup-path"><strong>${displayNodeName(source)}</strong>${icon("arrow", 15)}<strong>${displayNodeName(target)}</strong></div>
      <p>${edge.description}</p>
      <div class="relation-caveat"><b>다른 요인도 함께 봐야 해요</b><span>${otherFactors || "경기·정책·시장 기대 등 여러 조건이 함께 작용할 수 있어요."}</span></div>
      ${expanded ? `<div class="relation-expanded">
        <section><b>어떻게 전달될까요?</b><div class="relation-transmission">${(edge.transmissionPath || [source.name, "관련 여건 변화", target.name]).map((step, index) => `${index ? icon("arrow", 12) : ""}<span>${step}</span>`).join("")}</div></section>
        <section><b>함께 확인할 데이터</b><div class="relation-data-chips">${(edge.relatedIndicators || []).map((item) => `<span>${item}</span>`).join("") || "관련 공식 지표"}</div></section>
        <p>${icon("info", 14)} 하나의 요인만으로 결과를 단정하지 않고, 함께 움직일 수 있는 경로를 설명해요.</p>
      </div>` : ""}
      <button class="primary-button small" data-action="${expanded ? "edge-collapse" : "edge-learn"}">${expanded ? `간단히 보기` : `30초 이해하기 ${icon("arrow", 13)}`}</button>
    </article>
  </div>`;
}

function renderNodeDetailModal() {
  if (!state.detailNode) return "";
  return `<div class="node-detail-backdrop">
    <section class="node-detail-modal" role="dialog" aria-modal="true" aria-label="${getNode(state.detailNode).name} 상세 정보" data-modal-stop>
      <button class="modal-close" data-action="detail-close" aria-label="상세 정보 닫기">${icon("close", 18)}</button>
      ${renderNodeDetail(state.detailNode)}
    </section>
  </div>`;
}

function renderExplore(nodeId = "usdkrw") {
  const node = getNode(nodeId);
  if (state.quickNode && state.quickNode !== nodeId) state.quickNode = null;
  if (state.detailNode && state.detailNode !== nodeId) state.detailNode = null;
  if (state.exploreHistory.at(-1) !== nodeId) {
    const previousIndex = state.exploreHistory.lastIndexOf(nodeId);
    if (previousIndex >= 0) state.exploreHistory = state.exploreHistory.slice(0, previousIndex + 1);
    else state.exploreHistory.push(nodeId);
  }
  const trail = state.exploreHistory.slice(-4);
  return `
    <main class="explore-page">
      <section class="explore-topbar">
        <div><p class="section-kicker">ECONOMIC MAP</p><h1>경제 탐색</h1></div>
        <div class="explore-help">${icon("info", 16)} 왼쪽에서 오른쪽으로 읽어보세요</div>
      </section>
      <div class="explore-shell">
        <section class="graph-panel">
          <div class="graph-toolbar">
            <button class="toolbar-button" data-action="explore-back" ${state.exploreHistory.length <= 1 ? "disabled" : ""}>${icon("back", 16)} 이전</button>
            <div class="breadcrumb"><span>탐색 경로</span>${trail.map((id, i) => `<b>${i ? icon("chevron", 12) : ""}${displayNodeName(getNode(id))}</b>`).join("")}</div>
            <div class="toolbar-right"><button class="toolbar-button" data-action="explore-reset">${icon("reset", 16)} 초기화</button><div class="explore-view-toggle" aria-label="경제지도 표시 수준"><button class="${state.exploreView === "easy" ? "is-active" : ""}" data-action="explore-view" data-id="easy" aria-pressed="${state.exploreView === "easy"}">쉽게 보기</button><button class="${state.exploreView === "detailed" ? "is-active" : ""}" data-action="explore-view" data-id="detailed" aria-pressed="${state.exploreView === "detailed"}">자세히 보기</button></div></div>
          </div>
          <div class="graph-intro"><div><span class="live-dot"><i></i>${node.status}</span><h2>경제는 연결되어 있어요.</h2></div><p>궁금한 항목을 선택하고 “왜?”와 “그래서?”를 따라가 보세요.</p></div>
          <div class="graph-canvas">${renderEconomicGraph(nodeId)}${renderNodeQuickPopup()}</div>
        </section>
      </div>
    </main>`;
}

function renderMarketCard(item) {
  const [name, value, change, status, region, target] = item;
  const direction = change.trim().startsWith("+") ? "up" : change.trim().startsWith("-") ? "down" : "flat";
  const context = marketContext[target] || ["공식 데이터", "시장 기대", "글로벌 흐름"];
  const conceptId = target === "usdkrw" || target === "yen" ? "exchange" : target === "gold" ? "gold" : target === "oil" ? "oil" : target === "consumer-prices" || target === "us-inflation" ? "cpi" : null;
  const interested = state.interests.includes(target);
  return `<article class="market-card enhanced"><div class="market-card-head">${regionMark(region)}<span>${region}</span><button class="mini-heart ${interested ? "is-active" : ""}" data-action="interest-toggle" data-id="${target}" aria-pressed="${interested}" aria-label="${name} ${interested ? "관심 해제" : "관심 등록"}">${icon("heart", 16, interested)}</button></div><div class="market-title-line"><h3>${name}</h3>${conceptId ? conceptTrigger(conceptId) : ""}</div><div class="market-value"><strong>${value}</strong><span class="move-${direction}">${change}</span></div><div class="market-range"><span>오늘 범위 <b>${direction === "up" ? "-0.18 ~ +0.72%" : "-0.68 ~ +0.21%"}</b></span><span>최근 1개월 <b>${direction === "down" ? "-1.4%" : "+2.8%"}</b></span></div><div class="market-status"><span>현재 맥락</span><b>${status}</b></div><div class="sparkline ${direction}"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="market-context-list"><span>오늘 시장과 함께 움직인 주요 요인</span>${context.map((factor) => `<b>${factor}</b>`).join("")}</div><div class="market-actions"><button class="text-button" data-node="${target}">왜 움직였지?</button><button class="primary-button ghost small" data-node="${target}">관련 경제 흐름 ${icon("arrow", 14)}</button></div><div class="updated-line">${icon("clock", 13)} 10:20 업데이트 · Mock</div></article>`;
}

function yieldCurveSvg(country, period) {
  const current = yieldCurveData.find((item) => item.country === country && item.date === "현재");
  const compare = yieldCurveData.find((item) => item.country === country && item.date === period);
  if (!current) return "";
  const series = period === "현재" ? [current] : [current, compare].filter(Boolean);
  const values = series.flatMap((item) => item.yields);
  const min = Math.min(...values) - .15, max = Math.max(...values) + .15, range = max - min || 1;
  const width = 720, height = 230, xPad = 36, yPad = 24;
  const points = (data) => data.map((value, index) => `${xPad + index * ((width - xPad * 2) / (data.length - 1))},${height - yPad - ((value - min) / range) * (height - yPad * 2)}`).join(" ");
  return `<div class="yield-chart"><svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-labelledby="yield-title-${country}"><title id="yield-title-${country}">${country} 국채 수익률곡선. 현재 만기별 수익률과 ${period} 값을 비교합니다.</title>${[0,1,2,3].map((i) => `<line x1="${xPad}" y1="${yPad + i * 58}" x2="${width-xPad}" y2="${yPad + i * 58}"/>`).join("")}<polyline class="curve-current" points="${points(current.yields)}" fill="none" vector-effect="non-scaling-stroke"/>${period !== "현재" && compare ? `<polyline class="curve-compare" points="${points(compare.yields)}" fill="none" vector-effect="non-scaling-stroke"/>` : ""}${current.yields.map((value,index) => `<circle class="curve-dot" cx="${xPad + index * ((width - xPad * 2) / 6)}" cy="${height-yPad-((value-min)/range)*(height-yPad*2)}" r="4"/><text x="${xPad + index * ((width - xPad * 2) / 6)}" y="${height-5}" text-anchor="middle">${current.maturities[index]}</text><text class="curve-value" x="${xPad + index * ((width - xPad * 2) / 6)}" y="${height-yPad-((value-min)/range)*(height-yPad*2)-10}" text-anchor="middle">${value.toFixed(2)}%</text>`).join("")}</svg></div>`;
}

function renderRatesMarket() {
  const policyRates = [...marketData.rates, ["ECB 정책금리", "2.00%", "0.00%p", "경로 주시", "유럽", "interest-rate"]];
  const countries = ["미국","한국","일본","독일"];
  const bonds = bondMarketData.filter((item) => item.country === state.bondCountry);
  return `<div class="rates-overview">
    <section class="policy-rate-section">${sectionHeading("POLICY RATE", `기준금리 ${conceptTrigger("policy-rate")}`, '<span class="section-note">중앙은행이 정하는 정책의 기준</span>')}<div class="policy-rate-grid">${policyRates.map(([name,value,change,status,region,target]) => `<article class="policy-rate-card"><div>${regionMark(region)}<span>${region}</span>${conceptTrigger(region === "일본" ? "boj" : region === "유럽" ? "ecb" : region === "미국" ? "fomc" : "bok")}</div><h3>${name}</h3><strong>${value}</strong><small>${change} · ${status}</small><button data-node="${target}">정책 흐름 보기 ${icon("arrow", 13)}</button></article>`).join("")}</div></section>
    <section class="bond-section">${sectionHeading("GOVERNMENT BONDS", `국채 시장 ${conceptTrigger("treasury")}`, '<span class="section-note">기준금리와 구분되는 시장 수익률</span>')}<div class="bond-country-tabs" role="group" aria-label="국채 국가 선택">${countries.map((country) => `<button class="${country === state.bondCountry ? "is-active" : ""}" data-action="bond-country" data-id="${country}" aria-pressed="${country === state.bondCountry}">${country}</button>`).join("")}</div><div class="bond-grid">${bonds.map((bond) => `<article class="bond-card"><div class="bond-card-head">${regionMark(bond.country)}<span>${bond.country} · ${bond.bondType}</span><b>${bond.maturity}</b></div><div class="bond-title-line"><h3>${bond.maturity} 국채</h3>${conceptTrigger("bond-yield")}</div><div class="bond-value"><strong>${bond.yield.toFixed(2)}%</strong><span class="${bond.yieldChangeBp >= 0 ? "is-up" : "is-down"}">${bond.yieldChangeBp >= 0 ? "+" : ""}${bond.yieldChangeBp}bp</span></div>${miniLineSvg(bond.history, bond.yieldChangeBp >= 0 ? "is-up" : "is-down")}<div class="bond-flow"><span>현재 연결된 흐름</span>${flowTrail(bond.country === "미국" ? ["Fed 기대",`${bond.maturity} 국채`,"달러·자금조달"] : bond.country === "일본" ? ["BOJ",`${bond.maturity} JGB`,"엔화"] : ["기준금리",`${bond.maturity} 국채`,"금융여건"], true)}</div><div class="market-actions"><button class="text-button" data-node="${bond.relatedNode}">왜 움직였지?</button><button class="primary-button ghost small" data-node="${bond.relatedNode}">경제지도에서 보기</button></div><div class="bond-concept-link">${conceptTrigger("treasury", "국채가 뭐예요?")}<span>${icon("clock", 12)} ${bond.updatedAt}</span></div></article>`).join("")}</div></section>
    <section class="yield-curve-card"><div class="yield-toolbar"><div><p class="section-kicker">YIELD CURVE</p><h2>수익률곡선 ${conceptTrigger("yield-curve")}</h2><p>만기별 국채 수익률의 높이와 기울기를 비교해 보세요.</p></div><div><div class="bond-country-tabs" role="group" aria-label="수익률곡선 국가 선택">${countries.map((country) => `<button class="${country === state.curveCountry ? "is-active" : ""}" data-action="curve-country" data-id="${country}" aria-pressed="${country === state.curveCountry}">${country}</button>`).join("")}</div><div class="curve-period-tabs" role="group" aria-label="비교 기간 선택">${["현재","1개월 전","1년 전"].map((period) => `<button class="${period === state.curvePeriod ? "is-active" : ""}" data-action="curve-period" data-id="${period}" aria-pressed="${period === state.curvePeriod}">${period}</button>`).join("")}</div></div></div>${yieldCurveSvg(state.curveCountry, state.curvePeriod)}<div class="yield-legend"><span><i></i>현재</span>${state.curvePeriod !== "현재" ? `<span><i></i>${state.curvePeriod}</span>` : ""}<p>${icon("info", 13)} 경제 상황을 이해하기 위한 Mock 시각화이며 미래를 예측하지 않습니다.</p></div></section>
  </div>`;
}

function renderMarket() {
  const items = marketData[state.marketCategory];
  const label = marketCategories.find(([id]) => id === state.marketCategory)?.[1];
  return `
    <main class="page content-width standard-page">
      <section class="page-hero compact"><div><p class="section-kicker">MARKET, WITH CONTEXT</p><h1>시장의 숫자보다<br><em>숫자 사이의 연결</em>을 보세요.</h1><p>가격과 지표는 출발점이에요. 왜 움직였는지, 어떤 경제 흐름과 관련되는지 함께 확인하세요.</p></div><div class="market-hero-art"><span class="art-line l1"></span><span class="art-line l2"></span><span class="art-dot d1"></span><span class="art-dot d2"></span><span class="art-dot d3"></span><strong>MARKET<br>CONTEXT</strong></div></section>
      <section class="market-summary-bar"><div><span>시장 업데이트</span><strong>09월 23일 · 10:20</strong></div><div><span>주요 흐름</span><strong>금리 기대 · 국채 · 환율 · AI</strong></div><div><span>데이터 기준</span><strong>15분 지연 Mock</strong></div><p>${icon("info", 15)} 실제 투자 판단용 데이터가 아니에요.</p></section>
      <section class="section-block market-section">
        <div class="tab-row" role="tablist" aria-label="시장 데이터 분류">${marketCategories.map(([id, name]) => `<button id="market-tab-${id}" role="tab" aria-selected="${id === state.marketCategory}" tabindex="${id === state.marketCategory ? "0" : "-1"}" class="tab-button ${id === state.marketCategory ? "is-active" : ""}" data-action="market-tab" data-id="${id}">${name}</button>`).join("")}</div>
        <div class="market-tab-panel" role="tabpanel" aria-labelledby="market-tab-${state.marketCategory}">${state.marketCategory === "rates" ? renderRatesMarket() : `${sectionHeading("MARKET DATA", label, '<span class="section-note">변화의 좋고 나쁨이 아닌 연결 경로를 확인해 보세요</span>')}<div class="market-grid">${items.map(renderMarketCard).join("")}</div>`}</div>
      </section>
      <section class="company-callout"><div><span class="company-logo">S</span><div><p class="section-kicker">COMPANY CONTEXT</p><h2>숫자와 연결된 기업도 살펴보세요.</h2><p>AI 투자, 메모리, 환율 흐름이 삼성전자와 어떻게 연결되는지 정리했어요.</p></div></div><a href="#/company/samsung" class="primary-button">삼성전자 보기 ${icon("arrow", 16)}</a></section>
    </main>`;
}

function eventCard(event) {
  const watched = state.watchItems.includes(event.id);
  const stateLabels = { UPCOMING:"발표 예정", LIVE:"진행 중", RELEASED:"발표 완료", UPDATED:"자료 업데이트" };
  const isReleased = ["RELEASED","UPDATED"].includes(event.releaseState);
  return `<article class="event-card importance-${event.importance}">
    <div class="event-date"><strong>${event.dayLabel}</strong><span>${event.time}</span></div>
    <div class="event-body"><div class="event-meta">${regionMark(event.region)}<span>${event.region}</span><i>${event.type}</i><b class="event-status-pill is-${event.releaseState.toLowerCase()}">${event.releaseState} · ${stateLabels[event.releaseState]}</b></div><div class="event-title-line"><h3>${event.title}</h3>${event.conceptId ? conceptTrigger(event.conceptId) : ""}</div><div class="event-explainer"><span>뭐 하는 날이에요?</span><p>${event.explainer}</p></div>${isReleased ? `<div class="release-result"><span>결과가 발표됐어요</span><strong>${event.resultLabel || event.currentValue}</strong><small>이전 ${event.previousValue || "-"} → 이번 ${event.currentValue || "-"}</small></div>` : `<div class="release-preview"><span>이전 결과</span><strong>${event.previousValue || "공식 발표 전"}</strong><small>${event.relatedIndicator || "관련 지표 확인"}</small></div>`}${flowTrail(event.flow, true)}<p><b>왜 중요해요?</b><br>${event.why}</p><div class="event-source">${icon("source", 14)} ${event.source} · ${event.updatedAt}</div></div>
    <div class="event-actions"><button class="secondary-button" data-event="${event.id}">${isReleased ? "발표 결과 보기" : "왜 중요한가?"}</button><button class="text-button" data-node="${event.nodeId}">경제 흐름 보기 ${icon("arrow", 14)}</button><button class="watch-icon ${watched ? "is-watched" : ""}" data-action="watch-event" data-id="${event.id}" aria-pressed="${watched}" aria-label="${event.title} ${watched ? "지켜보기 해제" : "지켜보기"}">${icon(watched ? "check" : "bell", 17)}</button></div>
  </article>`;
}

function renderMonthCalendar(events) {
  const cells = [...Array(4).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];
  return `<div class="month-calendar"><div class="weekdays">${["일", "월", "화", "수", "목", "금", "토"].map((d) => `<span>${d}</span>`).join("")}</div><div class="calendar-grid">${cells.map((day) => {
    if (!day) return '<div class="calendar-day is-empty"></div>';
    const dayEvents = events.filter((event) => Number(event.date.slice(-2)) === day);
    return `<div class="calendar-day ${day === 23 ? "is-today" : ""}"><b>${day}</b>${dayEvents.map((event) => `<button class="calendar-event-dot importance-${event.importance}" data-event="${event.id}"><span>${event.region}</span>${event.title}</button>`).join("")}</div>`;
  }).join("")}</div></div>`;
}

function renderCalendar() {
  const regions = ["전체", "미국", "한국", "일본", "유럽", "글로벌"];
  const events = state.calendarRegion === "전체" ? economicEvents : economicEvents.filter((event) => event.region === state.calendarRegion);
  return `
    <main class="page content-width standard-page calendar-page">
      <section class="page-hero calendar-hero"><div><p class="section-kicker">GLOBAL ECONOMIC CALENDAR</p><h1>앞으로 세계 경제에서<br><em>무엇을 봐야 할까요?</em></h1><p>발표일만 나열하지 않았어요. 일정이 어떤 흐름과 연결되는지 함께 확인하세요.</p></div><div class="next-event-card"><span>다음 중요 일정</span><strong>8일 후</strong><h3>BOJ Summary of Opinions</h3><p>10월 1일 · 일본</p><button data-event="boj-opinions">미리 보기 ${icon("arrow", 14)}</button></div></section>
      <section class="calendar-controls"><div class="view-switch" role="group" aria-label="캘린더 보기 방식"><button class="${state.calendarView === "upcoming" ? "is-active" : ""}" data-action="calendar-view" data-id="upcoming" aria-pressed="${state.calendarView === "upcoming"}">다가오는 일정</button><button class="${state.calendarView === "month" ? "is-active" : ""}" data-action="calendar-view" data-id="month" aria-pressed="${state.calendarView === "month"}">월간 보기</button></div><div class="region-filter" role="group" aria-label="지역 필터">${regions.map((region) => `<button class="${region === state.calendarRegion ? "is-active" : ""}" data-action="calendar-region" data-id="${region}" aria-pressed="${region === state.calendarRegion}">${region}</button>`).join("")}</div><div class="month-title"><strong>2026년 10월</strong></div></section>
      <section class="calendar-content">${state.calendarView === "month" ? renderMonthCalendar(events) : `<div class="upcoming-layout"><div class="date-rail"><span>SEP<strong>23</strong>오늘</span><i></i><span>OCT<strong>01</strong>8일 후</span><i></i><span>OCT<strong>30</strong>37일 후</span></div><div class="event-list">${events.map(eventCard).join("")}</div><aside class="calendar-aside"><div class="watch-summary"><span>${icon("bell", 20)}</span><h3>지켜보는 일정</h3><strong>${state.watchItems.filter((id) => economicEvents.some((event) => event.id === id)).length}개</strong><p>알림 기능은 mock 상태예요.<br>관심 일정은 MY에도 저장됩니다.</p><a href="#/my">MY에서 보기 ${icon("arrow", 14)}</a></div><div class="calendar-legend"><h4>발표 상태</h4><span><i class="confirmed"></i>UPCOMING · 예정</span><span><i class="live"></i>LIVE · 진행 중</span><span><i class="released"></i>RELEASED · 발표 완료</span><span><i class="updated"></i>UPDATED · 추가 자료</span></div></aside></div>`}</section>
    </main>`;
}

function renderMyMap() {
  const visible = state.interests.slice(0, 6);
  if (!visible.length) return `<div class="empty-my-map"><span>${icon("layers", 26)}</span><h3>아직 관심 항목이 없어요.</h3><p>경제지도에서 관심 항목을 저장하면 이곳에 연결이 만들어져요.</p><a href="#/explore/usdkrw">경제지도 둘러보기</a></div>`;
  return `<div class="my-map-stage"><div class="my-map-center">MY<small>경제지도</small></div>${visible.map((id, index) => { const node = getNode(id); return `<button class="my-map-node pos-${index + 1}" data-node="${id}"><span>${node.category}</span><strong>${node.name}</strong></button>`; }).join("")}<svg viewBox="0 0 600 320" preserveAspectRatio="none" aria-hidden="true"><path d="M300 160 C230 140 195 72 115 68"/><path d="M300 160 C390 135 424 70 500 68"/><path d="M300 160 C210 180 175 245 95 255"/><path d="M300 160 C390 175 425 245 515 252"/><path d="M300 160 C300 115 300 82 300 42"/><path d="M300 160 C300 205 300 245 300 282"/></svg></div>`;
}

function renderMy() {
  const watchedEvents = economicEvents.filter((event) => state.watchItems.includes(event.id));
  return `
    <main class="page content-width standard-page my-page">
      <section class="my-hero"><div><p class="section-kicker">MY ECONOMIC MAP</p><h1>내가 궁금한 경제만,<br><em>하나의 지도</em>로 모았어요.</h1><p>수익률 대신 변화와 연결을 저장합니다.</p></div><div class="my-stats"><div><strong>${state.interests.length}</strong><span>관심 항목</span></div><div><strong>${state.watchItems.length}</strong><span>지켜보기</span></div><div><strong>3</strong><span>새 변화</span></div></div></section>
      <section class="my-catchup"><div class="catchup-head"><div><span class="eyebrow">SINCE YOUR LAST VISIT</span><h2>마지막 방문 이후<br><strong>중요한 변화 3개</strong>가 있었어요.</h2></div><span class="catchup-time">지난 3일 동안</span></div><div class="change-list">${catchUpChanges.map((item, index) => `<button data-node="${item.id}"><span class="change-index">0${index + 1}</span><span><strong>${item.title}</strong><small>${item.text}</small></span><b>${item.badge}</b>${icon("arrow", 16)}</button>`).join("")}</div></section>
      <section class="my-grid section-block"><div class="my-map-card">${sectionHeading("YOUR MAP", "나의 경제지도", '<a href="#/explore/usdkrw" class="more-link">전체 화면 ' + icon("arrow", 14) + "</a>")}${renderMyMap()}</div><aside class="interest-manager"><div class="detail-title-row"><h2>관심 항목</h2><span>${state.interests.length}개</span></div><div class="interest-list">${state.interests.map((id) => { const node = getNode(id); return `<div><button data-node="${id}"><span>${node.category}</span><strong>${node.name}</strong></button><button class="remove-interest" data-action="interest-toggle" data-id="${id}" aria-label="${node.name} 관심 해제">${icon("close", 15)}</button></div>`; }).join("") || "<p>저장한 관심 항목이 없어요.</p>"}</div><button class="add-interest" data-action="search-open">${icon("plus", 16)} 관심 항목 추가</button></aside></section>
      <section class="watch-section section-block">${sectionHeading("WATCH", "앞으로 확인할 일정", '<a href="#/calendar" class="more-link">캘린더 전체 보기 ' + icon("arrow", 14) + "</a>")}<div class="watch-event-grid">${watchedEvents.map((event) => `<article><div>${regionMark(event.region)}<span>${event.dayLabel}</span><b class="status-${event.status}">${event.status}</b></div><h3>${event.title}</h3><p>${event.why}</p><div class="watch-event-actions"><button data-event="${event.id}">자세히</button><button class="is-watched" data-action="watch-event" data-id="${event.id}">${icon("check", 15)} 지켜보는 중</button></div></article>`).join("") || '<div class="empty-watch"><p>지켜보는 일정이 없어요.</p><a href="#/calendar">세계 경제 캘린더 보기</a></div>'}</div></section>
    </main>`;
}

function chartSvg(values) {
  const min = Math.min(...values), max = Math.max(...values), width = 680, height = 220;
  const points = values.map((value, index) => `${(index / (values.length - 1)) * width},${height - ((value - min) / (max - min)) * (height - 34) - 14}`).join(" ");
  const area = `0,${height} ${points} ${width},${height}`;
  return `<svg class="price-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-labelledby="company-chart-title"><title id="company-chart-title">삼성전자 최근 3개월 mock 가격 흐름</title><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4e6658" stop-opacity=".22"/><stop offset="1" stop-color="#4e6658" stop-opacity="0"/></linearGradient></defs><line x1="0" y1="55" x2="680" y2="55"/><line x1="0" y1="110" x2="680" y2="110"/><line x1="0" y1="165" x2="680" y2="165"/><polygon points="${area}" fill="url(#chartFill)"/><polyline points="${points}" fill="none" stroke="#354b40" stroke-width="3" vector-effect="non-scaling-stroke"/><circle cx="680" cy="${height - ((values.at(-1) - min) / (max - min)) * (height - 34) - 14}" r="5" fill="#354b40"/></svg>`;
}

function companyTabContent(company) {
  if (state.companyTab === "financials") return `<div class="company-table"><div><span>구분</span><b>2024</b><b>2025E</b><b>2026E</b></div><div><span>매출</span><b>258.9조</b><b>286.4조</b><b>312.1조</b></div><div><span>영업이익</span><b>32.1조</b><b>39.8조</b><b>46.2조</b></div><div><span>영업이익률</span><b>12.4%</b><b>13.9%</b><b>14.8%</b></div><p>모든 수치는 UI 시연을 위한 mock data입니다.</p></div>`;
  if (state.companyTab === "disclosures") return `<div class="disclosure-list">${company.disclosures.map(([date, title, source]) => `<div><span>${date}</span><strong>${title}</strong><b>${source}</b><span class="disclosure-more" aria-hidden="true">${icon("chevron", 15)}</span></div>`).join("")}</div>`;
  if (state.companyTab === "news") return `<div class="news-context-list"><article><span>AI · 반도체</span><h3>고성능 메모리 공급 계획을 둘러싼 시장의 관심</h3><p>단일 기사보다 AI 투자 → 데이터센터 → 메모리 수요 경로와 함께 보여줍니다.</p></article><article><span>환율 · 수출</span><h3>원/달러 변동이 실적에 연결되는 두 방향</h3><p>수출 환산 효과와 수입 비용이 동시에 작용할 수 있어요.</p></article></div>`;
  return `<div class="company-overview-grid">${company.metrics.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong><small>Mock · 최근 기준</small></div>`).join("")}</div>`;
}

function renderCompany(id = "samsung") {
  const company = companies[id] || companies.samsung;
  return `<main class="page content-width standard-page company-page">
    <a href="#/market" class="page-back">${icon("back", 16)} 시장으로 돌아가기</a>
    <section class="company-header"><div class="company-identity"><span class="company-logo large">S</span><div><p>${company.code}</p><h1>${company.name}</h1><span>${company.description}</span></div></div><div class="company-price"><span>현재가 · Mock</span><strong>${company.price}</strong><b>${company.change}</b><small>${company.updated}</small></div><div class="company-header-actions"><button class="icon-action ${state.interests.includes("samsung") ? "is-active" : ""}" data-action="interest-toggle" data-id="samsung" aria-pressed="${state.interests.includes("samsung")}" aria-label="삼성전자 ${state.interests.includes("samsung") ? "관심 해제" : "관심 등록"}">${icon("heart", 18, state.interests.includes("samsung"))}</button><button class="primary-button" data-node="samsung">경제지도에서 보기 ${icon("arrow", 15)}</button></div></section>
    <section class="company-main-grid"><div class="chart-card"><div class="card-title-row"><div><span class="section-kicker">PRICE CONTEXT</span><h2>가격 흐름</h2></div><div class="range-tabs"><span class="is-active">최근 3개월</span></div></div>${chartSvg(company.chart)}<div class="chart-axis"><span>06.23</span><span>07.23</span><span>08.23</span><span>09.23</span></div></div><aside class="company-flow-card"><span class="section-kicker">CONNECTED FLOW</span><h2>현재 연결된<br>경제 흐름</h2>${company.flows.map((flow) => `<button data-node="${flow.target}"><span>${flow.label}</span>${flowTrail(flow.nodes, true)}<b>흐름 보기 ${icon("arrow", 14)}</b></button>`).join("")}</aside></section>
    <section class="company-variable-section">${sectionHeading("ECONOMIC VARIABLES", "이 기업과 연결된 경제 변수", `<span class="section-note">${conceptTrigger("per", "PER")}${conceptTrigger("pbr", "PBR")}${conceptTrigger("eps", "EPS")}</span>`)}<p class="company-variable-intro">하나의 변수가 실적이나 주가를 결정하지 않아요. 현재 확인할 수 있는 주요 연결과 전달 경로를 함께 보여드려요.</p><div class="company-variable-grid">${companyVariables.map((variable) => `<article class="company-variable-card"><span>0${Number(variable.id.split("-").at(-1))}</span><h3>${variable.name}</h3><p>${variable.explanation}</p><div><button class="text-button" data-node="${variable.nodeId}">왜 연결되나요?</button><button class="primary-button ghost small" data-node="${variable.nodeId}">경제지도에서 보기 ${icon("arrow", 13)}</button></div></article>`).join("")}</div></section>
    <section class="company-detail-section"><div class="tab-row" role="tablist" aria-label="기업 상세 분류">${[["overview", "기업정보"], ["financials", "재무·실적"], ["disclosures", "공시"], ["news", "관련 뉴스"]].map(([tab, label]) => `<button id="company-tab-${tab}" role="tab" aria-selected="${state.companyTab === tab}" tabindex="${state.companyTab === tab ? "0" : "-1"}" class="tab-button ${state.companyTab === tab ? "is-active" : ""}" data-action="company-tab" data-id="${tab}">${label}</button>`).join("")}</div><div role="tabpanel" aria-labelledby="company-tab-${state.companyTab}">${companyTabContent(company)}</div></section>
    <div class="data-disclaimer">${icon("info", 15)} 이 페이지의 가격·재무 수치는 UI 테스트용 mock data이며, 투자 추천이나 매수·매도 판단을 제공하지 않습니다.</div>
  </main>`;
}

function renderConceptPage(id = "inflation") {
  const item = concepts[id] || concepts.inflation;
  const relatedNodes = item.relatedNodes.map((nodeId) => economicNodes[nodeId]).filter(Boolean);
  return `<main class="page content-width standard-page concept-page">
    <a class="page-back" href="javascript:history.back()">${icon("back", 16)} 이전 화면으로</a>
    <section class="concept-hero"><div><p class="section-kicker">30-SECOND CONCEPT</p><div class="concept-title-line"><h1>${item.name}</h1><span>30초 이해</span></div><p>${item.description}</p></div><div class="concept-hero-mark">${icon("spark", 28)}<strong>궁금한 순간,<br>흐름 안에서 이해하기</strong></div></section>
    <section class="concept-detail-grid">
      <article class="concept-detail-card concept-one-line"><span>한 줄 이해</span><h2>${item.shortDescription}</h2><p>하나의 원인으로 단정하기보다 여러 요인과 지표를 함께 살펴봐야 해요.</p></article>
      <article class="concept-detail-card"><span>왜 중요해요?</span><h2>경제 흐름에서 어떤 역할을 하나요?</h2><p>${item.whyItMatters}</p></article>
    </section>
    ${item.causes.length ? `<section class="concept-section"><div><p class="section-kicker">WHY</p><h2>왜 달라질까요?</h2><p>여러 요인이 함께 영향을 줄 수 있습니다.</p></div><div class="concept-causes">${item.causes.map(([title,text], index) => `<article><b>0${index+1}</b><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section>` : ""}
    <section class="concept-section"><div><p class="section-kicker">DATA</p><h2>어떻게 확인하나요?</h2><p>공식 지표와 발표 시점을 함께 확인하세요.</p></div><div class="concept-indicators">${item.relatedIndicators.map((indicator) => `<span>${icon("trend", 15)}<strong>${indicator}</strong><small>공식 데이터 · Mock 연결</small></span>`).join("")}</div></section>
    ${item.currentData ? `<section class="concept-section"><div><p class="section-kicker">CURRENT</p><h2>지금 데이터</h2><p>국가별 최근 Mock 데이터예요.</p></div><div class="concept-current-data">${item.currentData.map(([country,value]) => `<div>${regionMark(country)}<span>${country}</span><strong>${value}</strong></div>`).join("")}</div></section>` : ""}
    <section class="concept-section"><div><p class="section-kicker">CONNECTION</p><h2>무엇과 연결되나요?</h2><p>노드를 선택하면 경제지도에서 이어서 탐색할 수 있어요.</p></div><div class="concept-related-nodes">${relatedNodes.map((node) => `<button data-node="${node.id}"><span>${node.category}</span><strong>${node.name}</strong><small>${node.status}</small>${icon("arrow", 15)}</button>`).join("")}</div></section>
    <section class="concept-related"><div><h2>관련 개념</h2><p>다음 궁금증으로 자연스럽게 이어가세요.</p></div><div>${item.relatedConcepts.filter((relatedId) => concepts[relatedId]).map((relatedId) => `<a href="#/concept/${relatedId}"><span>${concepts[relatedId].name}</span><small>${concepts[relatedId].shortDescription}</small>${icon("chevron", 15)}</a>`).join("")}</div></section>
    <section class="concept-source-row"><div>${icon("source", 17)}<span><strong>근거와 출처</strong><small>${item.sources.join(" · ")} · ${APP_DATE} 확인 기준</small></span></div><button class="primary-button" data-node="${item.relatedNodes[0] || "inflation"}">경제지도에서 보기 ${icon("arrow", 15)}</button></section>
  </main>`;
}

function renderConceptPopover() {
  if (!state.conceptPopover) return "";
  const item = concepts[state.conceptPopover];
  if (!item) return "";
  return `<div class="concept-popover" data-action="concept-close"><article class="concept-popover-card" role="dialog" aria-modal="true" aria-label="${item.name} 개념 설명" data-modal-stop><button class="popover-close" data-action="concept-close" aria-label="개념 설명 닫기">${icon("close", 15)}</button><span class="section-kicker">ECONOMIC CONCEPT</span><h2>${item.name}, 무엇인가요?</h2><p>${item.shortDescription}</p><button class="primary-button" data-action="concept-detail" data-id="${item.id}">30초 만에 이해하기 ${icon("arrow", 14)}</button></article></div>`;
}

function renderInsightModal() {
  if (!state.insightModal) return "";
  const [mode, issueId] = state.insightModal.split(":");
  const issue = todayIssues.find((item) => item.id === issueId);
  const insight = issueInsights[issueId];
  if (!issue || !insight) return "";
  const isWhy = mode === "why";
  const rows = isWhy ? insight.factors : insight.impacts;
  return `<div class="modal-backdrop insight-backdrop" data-action="insight-close"><section class="insight-modal" role="dialog" aria-modal="true" aria-label="${issue.title} ${isWhy ? "관련 요인" : "영향 경로"}" data-modal-stop><button class="modal-close" data-action="insight-close" aria-label="상세 설명 닫기">${icon("close", 18)}</button><p class="section-kicker">${isWhy ? "WHY · RELATED FACTORS" : "IMPACT · TRANSMISSION PATHS"}</p><h2>${issue.title}</h2><p class="insight-lead">${isWhy ? "현재 함께 확인할 수 있는 주요 관련 요인이에요." : "이 변화가 영향을 전달할 수 있는 영역이에요. 미래 결과를 예측하지 않습니다."}</p><div class="insight-factor-list">${rows.map((row,index) => `<button data-node="${row[2] || row[1]}"><span>0${index+1}</span><div><strong>${row[0]}</strong><small>${isWhy ? row[1] : "선택하면 이 노드가 중심이 되어 경제지도가 다시 펼쳐져요."}</small></div>${icon("arrow", 15)}</button>`).join("")}</div><div class="insight-notice">${icon("info", 15)}<p>시장 움직임을 하나의 원인으로 설명하기는 어렵습니다. EconFlow는 현재 확인 가능한 주요 관련 요인과 전달 경로를 함께 보여드립니다.</p></div><button class="primary-button insight-map-button" data-node="${issue.nodeId}">경제지도에서 전체 흐름 보기 ${icon("arrow", 15)}</button></section></div>`;
}

function filterSearch(query) {
  const normalized = query.trim().toLowerCase().replace(/[?!.]/g, "");
  if (!normalized) return searchCatalog.slice(0, 4);
  const scored = searchCatalog.map((item) => ({
    item,
    score: item.terms.reduce((score, term) => {
      const t = term.toLowerCase();
      if (normalized === t) return Math.max(score, 10);
      if (normalized.includes(t) || t.includes(normalized)) return Math.max(score, 6);
      const words = normalized.split(/\s+/).filter((word) => t.includes(word));
      return Math.max(score, words.length);
    }, 0)
  })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).map(({ item }) => item);
  return scored.length ? scored : searchCatalog.slice(0, 3);
}

function renderSearchResults() {
  const results = filterSearch(state.searchQuery);
  return `<div class="search-result-head"><span>${state.searchQuery ? "관련 경제 흐름을 찾았어요" : "많이 찾는 흐름"}</span><b>${results.length}개</b></div>${results.map((item, index) => `<button class="search-result-card" data-search-result="${item.route || item.target}"><span class="result-index">0${index + 1}</span><span class="result-main"><i>${item.kind}</i><strong>${item.title}</strong><small>${item.subtitle}</small><span class="result-paths">${item.paths.map((path) => `<em>${path}</em>`).join("")}</span></span><span class="result-cta">흐름으로 보기 ${icon("arrow", 15)}</span></button>`).join("")}<p class="search-note">${icon("info", 14)} 긴 AI 답변 대신 확인 가능한 데이터와 경제지도 연결을 먼저 보여드려요.</p>`;
}

function renderSearchModal() {
  if (!state.searchOpen) return "";
  return `<div class="modal-backdrop search-backdrop" data-action="search-close"><section class="search-modal" role="dialog" aria-modal="true" aria-label="전역 검색" data-modal-stop><form class="search-form"><span>${icon("search", 22)}</span><input id="global-search-input" autocomplete="off" value="${state.searchQuery.replaceAll('"', "&quot;")}" placeholder="엔화는 왜 움직이는 거야?" aria-label="경제 검색"><kbd>ESC</kbd></form><div class="search-suggestions"><span>추천</span>${["엔화는 왜 움직이는 거야?", "미국 금리 오르면 한국은?", "인플레이션", "삼성전자"].map((query) => `<button data-search-query="${query}">${query}</button>`).join("")}</div><div class="search-results">${renderSearchResults()}</div></section></div>`;
}

function renderEventModal() {
  if (!state.modalEvent) return "";
  const event = economicEvents.find((item) => item.id === state.modalEvent);
  if (!event) return "";
  const watched = state.watchItems.includes(event.id);
  const released = ["RELEASED","UPDATED"].includes(event.releaseState);
  return `<div class="modal-backdrop event-backdrop" data-action="event-close"><aside class="event-modal" role="dialog" aria-modal="true" aria-label="${event.title} 일정 상세" data-modal-stop><button class="modal-close" data-action="event-close" aria-label="일정 상세 닫기">${icon("close", 19)}</button><div class="event-modal-top">${regionMark(event.region)}<span>${event.region} · ${event.type}</span><b class="event-status-pill is-${event.releaseState.toLowerCase()}">${event.releaseState}</b></div><p class="section-kicker">${event.dayLabel} · ${event.time}</p><div class="event-modal-title"><h2>${event.title}</h2>${event.conceptId ? conceptTrigger(event.conceptId) : ""}</div><div class="event-what-day"><span>뭐 하는 날이에요?</span><p>${event.explainer}</p></div>${released ? `<div class="event-release-panel"><span>${icon("check",16)} 결과가 발표됐어요</span><div><p>이전<strong>${event.previousValue || "-"}</strong></p><i>${icon("arrow",16)}</i><p>이번<strong>${event.currentValue || "-"}</strong></p><b>${event.resultLabel || "업데이트"}</b></div><small>${event.releasedAt} · ${event.updatedAt} 업데이트</small></div><div class="event-why"><span class="framework-label what">WHAT</span><h3>무엇이 발표됐나요?</h3><p>${event.whatReleased}</p></div><div class="event-why"><span class="framework-label why">WHY</span><h3>관련 배경</h3><p>${event.background}</p></div><div class="event-modal-flow"><span class="framework-label impact">IMPACT</span><h3>연결될 수 있는 영역</h3>${flowTrail(event.impact || event.flow)}</div>` : `<div class="event-preview-panel"><div><span>예정 시각</span><strong>${event.dayLabel} · ${event.time}</strong></div><div><span>이전 결과</span><strong>${event.previousValue || "-"}</strong></div><div><span>관련 경제지표</span><strong>${event.relatedIndicator || event.flow[0]}</strong></div></div><div class="event-why"><span class="framework-label why">WHY</span><h3>왜 중요한가요?</h3><p>${event.why}</p></div><div class="event-modal-flow"><span class="framework-label impact">FLOW</span><h3>관련 경제 흐름</h3>${flowTrail(event.flow)}</div><div class="event-watch-list"><span>발표에서 함께 확인할 것</span><ul><li>이전 결과와 달라진 수치</li><li>정책 설명과 전망의 변화</li><li>연결된 금리·환율 데이터</li></ul></div>`}<div class="event-modal-source">${icon("source", 16)}<span><strong>${event.source}</strong><small>공식 일정·발표 우선 · ${APP_DATE} 확인 기준</small></span></div><div class="event-modal-actions"><button class="secondary-button ${watched ? "is-watched" : ""}" data-action="watch-event" data-id="${event.id}">${icon(watched ? "check" : "bell", 16)} ${watched ? "지켜보는 중" : "일정 지켜보기"}</button><button class="primary-button" data-node="${event.nodeId}">경제 흐름 보기 ${icon("arrow", 15)}</button></div></aside></div>`;
}

function renderFooter() {
  return `<footer class="app-footer"><div class="content-width"><div class="brand muted"><span class="brand-mark"><span></span><span></span><span></span></span><span>EconFlow</span></div><p>복잡한 경제를 연결해서, 이해하기 쉽게.</p><span>Prototype · Mock data only</span></div></footer>`;
}

function focusSelectorFor(element) {
  if (!element || element === document.body || !element.matches) return "";
  if (element.id) return `#${CSS.escape(element.id)}`;
  const attributes = ["data-action", "data-id", "data-event", "data-concept", "data-insight", "data-edge", "data-node"];
  const selector = attributes
    .filter((attribute) => element.hasAttribute(attribute))
    .map((attribute) => `[${attribute}="${CSS.escape(element.getAttribute(attribute))}"]`)
    .join("");
  return selector ? `${element.tagName.toLowerCase()}${selector}` : "";
}

function render() {
  const activeSelector = focusSelectorFor(document.activeElement);
  const route = parseRoute();
  const validPages = ["today", "explore", "market", "calendar", "my", "company", "concept"];
  const page = validPages.includes(route.page) ? route.page : "today";
  if (page !== "explore") {
    state.selectedEdge = null;
    state.edgeExpanded = false;
    state.quickNode = null;
    state.detailNode = null;
  }
  const routeKey = `${page}/${route.id || ""}`;
  const routeChanged = render.lastRoute !== routeKey;
  let content = "";
  if (page === "today") content = renderToday();
  if (page === "explore") content = renderExplore(route.id || "usdkrw");
  if (page === "market") content = renderMarket();
  if (page === "calendar") content = renderCalendar();
  if (page === "my") content = renderMy();
  if (page === "company") content = renderCompany(route.id || "samsung");
  if (page === "concept") content = renderConceptPage(route.id || "inflation");
  const dialogKey = state.searchOpen
    ? "search"
    : state.modalEvent
      ? `event:${state.modalEvent}`
      : state.conceptPopover
        ? `concept:${state.conceptPopover}`
        : state.insightModal
          ? `insight:${state.insightModal}`
          : page === "explore" && state.selectedEdge
            ? `edge:${state.selectedEdge}`
            : page === "explore" && state.detailNode
              ? `detail:${state.detailNode}`
              : "";
  const dialogOpen = Boolean(dialogKey);
  const dialogOpened = dialogOpen && render.dialogKey !== dialogKey;
  const dialogClosed = !dialogOpen && Boolean(render.dialogKey);
  if (dialogOpened && activeSelector && !render.returnFocus) render.returnFocus = activeSelector;
  app.innerHTML = `${renderHeader(page)}${content}${page === "explore" ? "" : renderFooter()}${renderSearchModal()}${renderEventModal()}${renderConceptPopover()}${renderInsightModal()}${page === "explore" ? `${renderRelationshipPopup()}${renderNodeDetailModal()}` : ""}${state.toast ? `<div class="toast" role="status" aria-live="polite">${icon("check", 16)} ${state.toast}</div>` : ""}`;
  const main = app.querySelector("main");
  if (main) {
    main.id = "main-content";
    main.tabIndex = -1;
  }
  document.body.classList.toggle("has-modal", dialogOpen);
  if (dialogOpen) {
    app.querySelectorAll(".app-header, main, .app-footer").forEach((element) => { element.inert = true; });
  }
  requestAnimationFrame(() => {
    if (dialogOpened) {
      const dialog = app.querySelector('[role="dialog"][aria-modal="true"]');
      const firstControl = state.searchOpen
        ? app.querySelector("#global-search-input")
        : dialog?.querySelector("button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])");
      firstControl?.focus();
    } else if (dialogClosed) {
      const returnTarget = render.returnFocus ? app.querySelector(render.returnFocus) : null;
      returnTarget?.focus();
      render.returnFocus = "";
    } else if (!routeChanged && activeSelector) {
      app.querySelector(activeSelector)?.focus();
    }
  });
  if (routeChanged) window.scrollTo({ top: 0, behavior: "instant" });
  render.lastRoute = routeKey;
  render.dialogKey = dialogKey;
}

function toggleListItem(list, id) {
  const index = list.indexOf(id);
  if (index >= 0) list.splice(index, 1);
  else list.push(id);
  persist();
  return index < 0;
}

document.addEventListener("click", (event) => {
  const modalStop = event.target.closest("[data-modal-stop]");
  if (modalStop && event.target === modalStop) return;
  const conceptButton = event.target.closest("[data-concept]");
  if (conceptButton) {
    state.conceptPopover = conceptButton.dataset.concept;
    state.modalEvent = null;
    state.insightModal = null;
    state.selectedEdge = null;
    state.detailNode = null;
    render();
    return;
  }
  const insightButton = event.target.closest("[data-insight]");
  if (insightButton) {
    state.insightModal = insightButton.dataset.insight;
    render();
    return;
  }
  const routeLink = event.target.closest("[data-route]");
  if (routeLink) {
    go(routeLink.dataset.route);
    return;
  }
  const nodeButton = event.target.closest("[data-node]");
  if (nodeButton) {
    state.searchOpen = false;
    state.modalEvent = null;
    state.conceptPopover = null;
    state.insightModal = null;
    goToNode(nodeButton.dataset.node);
    return;
  }
  const edgeButton = event.target.closest("[data-edge]");
  if (edgeButton) {
    state.selectedEdge = edgeButton.dataset.edge;
    state.edgeExpanded = false;
    state.quickNode = null;
    render();
    return;
  }
  const eventButton = event.target.closest("[data-event]");
  if (eventButton) {
    state.modalEvent = eventButton.dataset.event;
    render();
    return;
  }
  const searchResult = event.target.closest("[data-search-result]");
  if (searchResult) {
    const target = searchResult.dataset.searchResult;
    state.searchOpen = false;
    state.searchQuery = "";
    if (target.startsWith("#/")) go(target);
    else goToNode(target);
    return;
  }
  const searchQuery = event.target.closest("[data-search-query]");
  if (searchQuery) {
    state.searchQuery = searchQuery.dataset.searchQuery;
    const input = document.querySelector("#global-search-input");
    if (input) input.value = state.searchQuery;
    const results = document.querySelector(".search-results");
    if (results) results.innerHTML = renderSearchResults();
    return;
  }
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  const id = actionButton.dataset.id;
  if (action === "search-open") {
    state.searchOpen = true;
    state.searchQuery = "";
    state.modalEvent = null;
    state.conceptPopover = null;
    state.insightModal = null;
    state.selectedEdge = null;
    state.detailNode = null;
    render();
  } else if (action === "search-close") {
    state.searchOpen = false;
    render();
  } else if (action === "event-close") {
    state.modalEvent = null;
    render();
  } else if (action === "concept-close") {
    state.conceptPopover = null;
    render();
  } else if (action === "concept-detail") {
    state.conceptPopover = null;
    go(`#/concept/${id}`);
  } else if (action === "insight-close") {
    state.insightModal = null;
    render();
  } else if (action === "interest-toggle") {
    const added = toggleListItem(state.interests, id);
    showToast(added ? `${getNode(id).name}을(를) 내 경제지도에 저장했어요.` : `${getNode(id).name} 관심 등록을 해제했어요.`);
  } else if (action === "watch-node") {
    const added = toggleListItem(state.watchItems, `node:${id}`);
    showToast(added ? `${getNode(id).name} 흐름을 지켜볼게요.` : "흐름 지켜보기를 해제했어요.");
  } else if (action === "watch-event") {
    const item = economicEvents.find((eventItem) => eventItem.id === id);
    const added = toggleListItem(state.watchItems, id);
    showToast(added ? `${item?.title || "일정"}을 지켜볼게요.` : "일정 지켜보기를 해제했어요.");
  } else if (action === "calendar-view") {
    state.calendarView = id;
    render();
  } else if (action === "calendar-region") {
    state.calendarRegion = id;
    render();
  } else if (action === "market-tab") {
    state.marketCategory = id;
    render();
  } else if (action === "bond-country") {
    state.bondCountry = id;
    render();
  } else if (action === "curve-country") {
    state.curveCountry = id;
    render();
  } else if (action === "curve-period") {
    state.curvePeriod = id;
    render();
  } else if (action === "company-tab") {
    state.companyTab = id;
    render();
  } else if (action === "explore-view") {
    state.exploreView = id === "detailed" ? "detailed" : "easy";
    state.expandedWhy = false;
    state.expandedImpact = false;
    state.selectedEdge = null;
    state.edgeExpanded = false;
    render();
  } else if (action === "focus-why" || action === "focus-impact") {
    const direction = action === "focus-why" ? "why" : "impact";
    state.flowFocus = state.flowFocus === direction ? null : direction;
    state.quickNode = null;
    render();
  } else if (action === "expand-why" || action === "collapse-why") {
    state.expandedWhy = action === "expand-why";
    render();
  } else if (action === "expand-impact" || action === "collapse-impact") {
    state.expandedImpact = action === "expand-impact";
    render();
  } else if (action === "quick-close") {
    state.quickNode = null;
    render();
  } else if (action === "current-explain") {
    state.quickNode = id;
    render();
  } else if (action === "quick-concept") {
    const conceptId = conceptIdForNode(getNode(id));
    state.quickNode = null;
    if (conceptId) state.conceptPopover = conceptId;
    else state.detailNode = id;
    render();
  } else if (action === "quick-why" || action === "quick-impact") {
    state.quickNode = null;
    state.flowFocus = action === "quick-why" ? "why" : "impact";
    render();
  } else if (action === "quick-detail") {
    state.quickNode = null;
    state.detailNode = id;
    render();
  } else if (action === "detail-close") {
    state.detailNode = null;
    render();
  } else if (action === "edge-learn") {
    state.edgeExpanded = true;
    render();
  } else if (action === "edge-collapse") {
    state.edgeExpanded = false;
    render();
  } else if (action === "explore-back") {
    if (state.exploreHistory.length > 1) {
      state.exploreHistory.pop();
      state.selectedEdge = null;
      state.edgeExpanded = false;
      state.quickNode = null;
      state.detailNode = null;
      state.expandedWhy = false;
      state.expandedImpact = false;
      state.flowFocus = null;
      go(`#/explore/${state.exploreHistory.at(-1)}`);
    }
  } else if (action === "explore-reset") {
    state.exploreHistory = ["usdkrw"];
    state.selectedEdge = null;
    state.edgeExpanded = false;
    state.quickNode = null;
    state.detailNode = null;
    state.expandedWhy = false;
    state.expandedImpact = false;
    state.flowFocus = null;
    go("#/explore/usdkrw");
  } else if (action === "edge-clear") {
    state.selectedEdge = null;
    state.edgeExpanded = false;
    render();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id !== "global-search-input") return;
  state.searchQuery = event.target.value;
  const results = document.querySelector(".search-results");
  if (results) results.innerHTML = renderSearchResults();
});

document.addEventListener("submit", (event) => {
  if (!event.target.matches(".search-form")) return;
  event.preventDefault();
  const first = filterSearch(state.searchQuery)[0];
  if (!first) return;
  state.searchOpen = false;
  if (first.route) go(first.route);
  else goToNode(first.target);
});

document.addEventListener("keydown", (event) => {
  const activeTab = event.target.closest?.('[role="tab"]');
  if (activeTab && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    const tabs = [...activeTab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault();
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
    return;
  }
  if (event.key === "Tab") {
    const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
    if (dialog) {
      const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hidden && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (first && last && (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    state.searchOpen = true;
    state.modalEvent = null;
    state.conceptPopover = null;
    state.insightModal = null;
    state.selectedEdge = null;
    state.detailNode = null;
    render();
  }
  if (event.key === "Escape") {
    if (state.searchOpen || state.modalEvent || state.conceptPopover || state.insightModal || state.quickNode || state.detailNode || state.selectedEdge) {
      state.searchOpen = false;
      state.modalEvent = null;
      state.conceptPopover = null;
      state.insightModal = null;
      state.quickNode = null;
      state.detailNode = null;
      state.selectedEdge = null;
      state.edgeExpanded = false;
      render();
    }
  }
});

window.addEventListener("hashchange", render);

if (!location.hash) location.hash = "#/today";
else render();
