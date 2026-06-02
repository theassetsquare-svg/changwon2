#!/usr/bin/env node
// URL 검사 API: 각 페이지의 실제 구글 색인 상태/크롤 결과를 조회.
// 0 노출의 원인(미색인 / 크롤 차단 / noindex 등)을 권위 있게 진단한다.
import { getAccessToken } from "./lib/gsc.mjs";

const SITE = "https://changwon2.pages.dev/";
const PATHS = ["/", "/location/", "/booking/", "/rooms/", "/hours/", "/parking/", "/access/", "/vip/", "/reviews/", "/faq/"];

async function inspect(token, url) {
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE, languageCode: "ko" }),
  });
  const text = await res.text();
  if (!res.ok) return { url, error: `${res.status}: ${text}` };
  return { url, result: JSON.parse(text).inspectionResult };
}

const token = await getAccessToken();
for (const p of PATHS) {
  const { url, result, error } = await inspect(token, SITE.replace(/\/$/, "") + p);
  if (error) { console.log(`\n${p}\n  ✗ ${error}`); continue; }
  const idx = result.indexStatusResult || {};
  console.log(`\n${p}`);
  console.log(`  색인상태   : ${idx.coverageState || "-"}`);
  console.log(`  판정       : ${result.inspectionResultLink ? "" : ""}${idx.verdict || "-"}`);
  console.log(`  로봇접근   : ${idx.robotsTxtState || "-"}`);
  console.log(`  색인허용   : ${idx.indexingState || "-"}`);
  console.log(`  마지막크롤 : ${idx.lastCrawlTime || "(크롤된 적 없음)"}`);
  console.log(`  대표URL    : ${idx.googleCanonical || "-"}`);
  console.log(`  사용자canon: ${idx.userCanonical || "-"}`);
  console.log(`  크롤러     : ${idx.crawledAs || "-"}`);
  if (idx.pageFetchState) console.log(`  페치상태   : ${idx.pageFetchState}`);
}
