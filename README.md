# EconFlow UX prototype

경제 뉴스와 데이터를 `WHAT → WHY → IMPACT → WATCH` 흐름으로 연결해 보여주는 PC 우선 반응형 프로토타입입니다. 모든 수치와 이벤트는 UI 검증을 위한 mock data이며 투자 판단의 근거가 아닙니다.

## 실행

```bash
npm run dev
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다. 별도 패키지 설치는 필요하지 않습니다.

## 구조

- `src/mock-data.js`: 경제 노드·관계, 오늘의 변화, 시장, 캘린더, 기업, 검색 mock data
- `src/app.js`: 해시 라우팅, 화면 컴포넌트, 검색, 그래프 탐색, 관심/WATCH 상태
- `src/styles.css`: 디자인 토큰, 화면/컴포넌트, 반응형 레이아웃
- `tests/smoke.mjs`: 핵심 사용자 시나리오에 필요한 데이터 연결성 검사
- `serve.mjs`: 의존성 없는 로컬 정적 서버

관심 등록과 WATCH 상태는 브라우저 `localStorage`에 저장됩니다. 실제 API를 붙일 때는 `mock-data.js`의 export를 동일한 형태의 repository/service 결과로 교체하면 됩니다.
