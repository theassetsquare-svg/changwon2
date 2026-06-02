#!/usr/bin/env node
// 사이트맵 상태 확인 + (재)제출. 서브페이지가 크롤되지 않는 핵심 원인 대응.
import { getAccessToken } from "./lib/gsc.mjs";

const SITE = "https://changwon2.pages.dev/";
const SITEMAPS = [
  "https://changwon2.pages.dev/sitemap.xml",
  "https://changwon2.pages.dev/feed.xml",
];

async function listSitemaps(token) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) return { error: `${res.status}: ${await res.text()}` };
  return await res.json();
}

async function submit(token, feedpath) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps/${encodeURIComponent(feedpath)}`,
    { method: "PUT", headers: { Authorization: `Bearer ${token}` } },
  );
  return res.ok ? "제출 OK" : `실패 ${res.status}: ${await res.text()}`;
}

const token = await getAccessToken();

console.log("=== 제출 전 사이트맵 상태 ===");
let before = await listSitemaps(token);
console.log(JSON.stringify(before, null, 2));

console.log("\n=== 사이트맵 제출 ===");
for (const sm of SITEMAPS) {
  console.log(`  ${sm} -> ${await submit(token, sm)}`);
}

console.log("\n=== 제출 후 사이트맵 상태 ===");
let after = await listSitemaps(token);
for (const s of after.sitemap || []) {
  console.log(`\n  ${s.path}`);
  console.log(`    최종제출   : ${s.lastSubmitted || "-"}`);
  console.log(`    처리됨     : ${s.lastDownloaded || "(아직 처리 안 됨)"}`);
  console.log(`    경고/오류  : warnings ${s.warnings || 0} / errors ${s.errors || 0}`);
  console.log(`    보류중     : ${s.isPending}`);
  for (const c of s.contents || []) {
    console.log(`    유형 ${c.type}: 제출 ${c.submitted} / 색인 ${c.indexed || 0}`);
  }
}
