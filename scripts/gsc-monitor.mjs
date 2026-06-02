#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────────────
// 통합 GSC 자동 감시기 — "내가 신경 안 써도 되게" 의 핵심.
// 매일(또는 호출 시) 1) 사이트맵 재제출 2) 전 페이지 색인 상태 검사
//   3) 쿼리/순위/카니발리제이션 4) 라이브 200 점검 → 문제 발견 시 이메일.
//
// 환경변수:
//   GSC_SA_KEY 또는 GOOGLE_APPLICATION_CREDENTIALS  (필수)
//   RESEND_API_KEY      (선택) 있으면 문제 발생 시 이메일 발송
//   ALERT_TO            (선택) 수신자, 기본 theassetsquare@gmail.com
//   ALERT_ALWAYS=1      (선택) 문제 없어도 매번 다이제스트 발송
// 종료코드: 0 정상 / 1 문제 감지 (CI 실패 트리거용)
// ───────────────────────────────────────────────────────────────────────────
import fs from "node:fs";
import {
  getAccessToken,
  listSites,
  searchAnalytics,
  dateNDaysAgo,
} from "./lib/gsc.mjs";

const SITE = "https://changwon2.pages.dev/";
const HOST = "https://changwon2.pages.dev";
const PATHS = ["/", "/location/", "/booking/", "/rooms/", "/hours/", "/parking/", "/access/", "/vip/", "/reviews/", "/faq/"];
const SITEMAPS = [`${HOST}/sitemap.xml`, `${HOST}/feed.xml`];
const ALERT_TO = process.env.ALERT_TO || "theassetsquare@gmail.com";

const problems = []; // 하드 장애 → exit 1 + 즉시 이메일
const watch = [];     // 추적 항목(신생 색인 대기 등) → 정상, 다이제스트에만 포함
const info = [];
const add = (arr, msg) => {
  arr.push(msg);
  console.log((arr === problems ? "⚠ " : arr === watch ? "◷ " : "· ") + msg);
};

async function gscFetch(token, url, init = {}) {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) } });
  const text = await res.text();
  return { ok: res.ok, status: res.status, json: text ? JSON.parse(text) : {}, text };
}

async function resubmitSitemaps(token) {
  for (const sm of SITEMAPS) {
    const r = await gscFetch(
      token,
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps/${encodeURIComponent(sm)}`,
      { method: "PUT" },
    );
    add(info, `사이트맵 재제출 ${sm} → ${r.ok ? "OK" : "실패 " + r.status}`);
    if (!r.ok) add(problems, `사이트맵 제출 실패: ${sm} (${r.status})`);
  }
}

async function inspectAll(token) {
  const rows = [];
  for (const p of PATHS) {
    const r = await gscFetch(token, "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inspectionUrl: HOST + p, siteUrl: SITE, languageCode: "ko" }),
    });
    if (!r.ok) { add(problems, `색인검사 실패 ${p} (${r.status})`); continue; }
    const idx = r.json.inspectionResult?.indexStatusResult || {};
    const verdict = idx.verdict || "?";
    const state = idx.coverageState || "?";
    rows.push({ path: p, verdict, state, lastCrawl: idx.lastCrawlTime || null });
    const indexed = verdict === "PASS";
    // 미색인은 신생 사이트의 크롤 대기 — 하드 장애가 아니라 '추적' 항목.
    if (!indexed) add(watch, `미색인(크롤 대기): ${p} → ${state}`);
  }
  return rows;
}

async function rankings(token) {
  const sites = await listSites(token);
  if (!sites.some((s) => s.siteUrl === SITE)) {
    add(problems, "서비스계정이 속성 소유자가 아님 — 권한 확인 필요");
    return { queries: [], pages: [], cannibalization: [] };
  }
  const range = { startDate: dateNDaysAgo(28), endDate: dateNDaysAgo(2) };
  const [queries, qp] = await Promise.all([
    searchAnalytics(token, SITE, { ...range, dimensions: ["query"] }),
    searchAnalytics(token, SITE, { ...range, dimensions: ["query", "page"] }),
  ]);
  const clicks = queries.reduce((s, r) => s + r.clicks, 0);
  const impr = queries.reduce((s, r) => s + r.impressions, 0);
  add(info, `최근 28일: 클릭 ${clicks} · 노출 ${impr} · 쿼리 ${queries.length}`);
  if (impr === 0) add(info, "노출 0 — 신생 사이트 색인 대기 중(크롤 적체). 문제는 아니나 추적 필요.");

  // 카니발리제이션
  const byQ = new Map();
  for (const r of qp) {
    const q = r.keys[0];
    (byQ.get(q) || byQ.set(q, []).get(q)).push({ page: r.keys[1], impressions: r.impressions, position: r.position });
  }
  const cannibalization = [];
  for (const [q, arr] of byQ) {
    if (arr.length > 1 && arr.reduce((s, x) => s + x.impressions, 0) >= 10) {
      cannibalization.push({ query: q, pages: arr.length, detail: arr.sort((a, b) => b.impressions - a.impressions) });
    }
  }
  if (cannibalization.length) add(problems, `카니발리제이션 ${cannibalization.length}건 — 동일 쿼리 복수 페이지 경쟁`);
  return {
    queries: queries.map((r) => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: +(r.ctr * 100).toFixed(2), position: +r.position.toFixed(1) })),
    cannibalization,
  };
}

async function liveCheck() {
  // Next.js 는 <title data-next-head=""> 형태로 렌더링하므로 정규식으로 검사.
  const REQUIRE = [
    { name: "title", re: /<title[^>]*>[^<]+<\/title>/i },
    { name: "description", re: /name="description"/i },
    { name: "canonical", re: /rel="canonical"/i },
  ];
  for (const p of PATHS) {
    try {
      const res = await fetch(HOST + p, { redirect: "follow", headers: { "User-Agent": "changwon-monitor/1.0" } });
      if (!res.ok) { add(problems, `라이브 ${p} → HTTP ${res.status}`); continue; }
      const html = await res.text();
      const missing = REQUIRE.filter((m) => !m.re.test(html)).map((m) => m.name);
      if (missing.length) add(problems, `라이브 ${p} → 메타 누락: ${missing.join(", ")}`);
    } catch (e) { add(problems, `라이브 ${p} → 접속실패 ${e.message}`); }
  }
}

async function sendEmail(subject, body) {
  if (!process.env.RESEND_API_KEY) { add(info, "RESEND_API_KEY 없음 — 이메일 생략(리포트만 저장)"); return; }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "창원 룰루랄라 감시 <onboarding@resend.dev>", to: [ALERT_TO], subject, text: body }),
  });
  add(info, `이메일 발송 → ${res.ok ? "OK (" + ALERT_TO + ")" : "실패 " + res.status}`);
}

async function main() {
  const token = await getAccessToken();
  console.log("=== 1) 사이트맵 재제출 ===");
  await resubmitSitemaps(token);
  console.log("\n=== 2) 전 페이지 색인 상태 ===");
  const idx = await inspectAll(token);
  console.table(idx);
  console.log("\n=== 3) 순위/쿼리/카니발리제이션 ===");
  const rank = await rankings(token);
  console.log("\n=== 4) 라이브 200 + 메타 점검 ===");
  await liveCheck();

  const stamp = new Date().toISOString();
  const report = { generatedAt: stamp, problems, watch, info, index: idx, rankings: rank };
  fs.mkdirSync("scripts/.gsc-data", { recursive: true });
  fs.writeFileSync("scripts/.gsc-data/monitor-latest.json", JSON.stringify(report, null, 2));

  const indexedCount = idx.filter((r) => r.verdict === "PASS").length;
  const summary =
    `창원 룰루랄라 GSC 감시 리포트 (${stamp})\n\n` +
    `색인 완료 ${indexedCount}/${idx.length} 페이지\n\n` +
    `■ 장애 ${problems.length}건:\n` +
    (problems.length ? problems.map((p) => "  - " + p).join("\n") : "  (없음 — 정상)") +
    `\n\n■ 추적 ${watch.length}건(정상 범위):\n` +
    (watch.length ? watch.map((w) => "  - " + w).join("\n") : "  (없음)") +
    `\n\n■ 정보:\n` + info.map((i) => "  - " + i).join("\n") +
    `\n\n전체 리포트: scripts/.gsc-data/monitor-latest.json`;

  console.log("\n" + "=".repeat(60) + "\n" + summary);

  // 이메일: 하드 장애가 있거나, ALERT_ALWAYS=1(매일 다이제스트)일 때만.
  if (problems.length || process.env.ALERT_ALWAYS === "1") {
    await sendEmail(`[창원 룰루랄라][${problems.length ? "⚠ 장애 " + problems.length + "건" : "정상"}] GSC 감시 리포트`, summary);
  }
  process.exit(problems.length ? 1 : 0); // 추적 항목만으로는 실패시키지 않음
}

main().catch((e) => { console.error("✗ 감시기 실패:", e.message); process.exit(1); });
