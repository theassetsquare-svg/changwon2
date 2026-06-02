#!/usr/bin/env node
// GSC 실데이터 리포트: 권한 확인 → 쿼리/페이지 순위 → 카니발리제이션 탐지.
// 사용: GOOGLE_APPLICATION_CREDENTIALS=/path/key.json node scripts/gsc-report.mjs
import fs from "node:fs";
import {
  getAccessToken,
  listSites,
  searchAnalytics,
  dateNDaysAgo,
} from "./lib/gsc.mjs";

const SITE_HOST = "changwon2.pages.dev";

function pickProperty(sites) {
  // 우선순위: url-prefix(https://changwon2.pages.dev/) > sc-domain:changwon2.pages.dev
  const cands = sites.filter((s) => s.siteUrl.includes(SITE_HOST));
  const urlPrefix = cands.find((s) => s.siteUrl.startsWith("https://"));
  return (urlPrefix || cands[0])?.siteUrl || null;
}

function fmt(rows, keyName) {
  return rows.map((r) => ({
    [keyName]: r.keys.join(" │ "),
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: +(r.ctr * 100).toFixed(2),
    position: +r.position.toFixed(1),
  }));
}

async function main() {
  const token = await getAccessToken();
  const sites = await listSites(token);
  console.log("\n=== 등록된 GSC 속성 ===");
  if (!sites.length) {
    console.log("(없음) — 서비스계정에 권한이 부여된 속성이 없습니다.");
  }
  for (const s of sites) {
    console.log(`  ${s.permissionLevel.padEnd(20)} ${s.siteUrl}`);
  }

  const property = pickProperty(sites);
  if (!property) {
    console.log(
      `\n⚠ changwon2.pages.dev 속성에 대한 권한이 없습니다.\n` +
        `  Search Console에서 gsc-mcp@theasset-gsc.iam.gserviceaccount.com 을\n` +
        `  소유자/사용자로 추가해야 데이터가 읽힙니다.`,
    );
    process.exit(2);
  }
  console.log(`\n▶ 분석 대상 속성: ${property}`);

  const startDate = dateNDaysAgo(28);
  const endDate = dateNDaysAgo(2); // GSC 데이터 지연 보정
  const range = { startDate, endDate };
  console.log(`▶ 기간: ${startDate} ~ ${endDate} (최근 28일)\n`);

  const [queries, pages, qp, queriesMobile] = await Promise.all([
    searchAnalytics(token, property, { ...range, dimensions: ["query"] }),
    searchAnalytics(token, property, { ...range, dimensions: ["page"] }),
    searchAnalytics(token, property, { ...range, dimensions: ["query", "page"] }),
    searchAnalytics(token, property, {
      ...range,
      dimensions: ["query"],
      // 모바일만
      dimensionFilterGroups: undefined,
    }),
  ]);

  const totals = queries.reduce(
    (a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions }),
    { clicks: 0, impressions: 0 },
  );
  console.log(`총 클릭 ${totals.clicks} · 총 노출 ${totals.impressions} · 쿼리수 ${queries.length}`);

  console.log("\n=== 상위 쿼리 (클릭순 Top 25) ===");
  console.table(fmt([...queries].sort((a, b) => b.clicks - a.clicks).slice(0, 25), "query"));

  console.log("\n=== 노출은 많은데 순위가 낮은 쿼리 (개선 기회 Top 25) ===");
  const opportunity = [...queries]
    .filter((r) => r.impressions >= 5 && r.position > 8)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25);
  console.table(fmt(opportunity, "query"));

  console.log("\n=== 페이지별 성과 ===");
  console.table(fmt([...pages].sort((a, b) => b.clicks - a.clicks), "page"));

  // 카니발리제이션: 같은 쿼리에 페이지 2개 이상이 노출되는 경우
  const byQuery = new Map();
  for (const r of qp) {
    const q = r.keys[0];
    if (!byQuery.has(q)) byQuery.set(q, []);
    byQuery.get(q).push({ page: r.keys[1], impressions: r.impressions, position: r.position, clicks: r.clicks });
  }
  const cannib = [];
  for (const [q, arr] of byQuery) {
    if (arr.length > 1) {
      const totalImp = arr.reduce((s, x) => s + x.impressions, 0);
      if (totalImp >= 5) cannib.push({ query: q, pages: arr.length, totalImp, detail: arr.sort((a, b) => b.impressions - a.impressions) });
    }
  }
  cannib.sort((a, b) => b.totalImp - a.totalImp);
  console.log(`\n=== 카니발리제이션 의심 (한 쿼리에 2+ 페이지) : ${cannib.length}건 ===`);
  for (const c of cannib.slice(0, 20)) {
    console.log(`\n  "${c.query}"  (${c.pages}페이지, 노출 ${c.totalImp})`);
    for (const d of c.detail) {
      console.log(`     ${d.position.toFixed(1).padStart(5)}위  노출${String(d.impressions).padStart(4)}  클릭${d.clicks}  ${d.page.replace("https://" + SITE_HOST, "")}`);
    }
  }

  const out = {
    generatedAt: new Date().toISOString(),
    property,
    range,
    totals,
    queries: fmt(queries, "query"),
    pages: fmt(pages, "page"),
    opportunity: fmt(opportunity, "query"),
    cannibalization: cannib,
  };
  fs.mkdirSync("scripts/.gsc-data", { recursive: true });
  fs.writeFileSync("scripts/.gsc-data/latest.json", JSON.stringify(out, null, 2));
  console.log("\n💾 scripts/.gsc-data/latest.json 저장 완료");
}

main().catch((e) => {
  console.error("\n✗ 실패:", e.message);
  process.exit(1);
});
