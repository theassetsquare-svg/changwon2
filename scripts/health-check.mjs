#!/usr/bin/env node
// 라이브 사이트 모든 페이지 200 응답 + 핵심 메타 존재 여부 확인.
// 실패 시 exit code 1 → GitHub Actions fail.
const HOST = process.env.HOST || "https://changwon2.pages.dev";
const PATHS = [
  "/",
  "/location/",
  "/booking/",
  "/rooms/",
  "/hours/",
  "/parking/",
  "/access/",
  "/vip/",
  "/reviews/",
  "/faq/",
  "/robots.txt",
  "/sitemap.xml",
  "/feed.xml",
  "/llms.txt",
];

const REQUIRE_META = ["<title>", "name=\"description\"", "rel=\"canonical\""];

let failures = 0;

for (const p of PATHS) {
  const url = HOST + p;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "changwon-healthcheck/1.0" },
    });
    if (!res.ok) {
      console.error(`✗ ${p} -> ${res.status}`);
      failures++;
      continue;
    }
    if (p.endsWith("/")) {
      const html = await res.text();
      const missing = REQUIRE_META.filter((m) => !html.includes(m));
      if (missing.length) {
        console.error(`✗ ${p} -> missing ${missing.join(", ")}`);
        failures++;
        continue;
      }
    }
    console.log(`✓ ${p} -> ${res.status}`);
  } catch (e) {
    console.error(`✗ ${p} -> ERROR ${e.message}`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\n${failures}건 실패 — 점검 필요`);
  process.exit(1);
}
console.log("\n모든 페이지 정상");
