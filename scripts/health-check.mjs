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

// Next.js 는 <title data-next-head=""> 형태로 렌더링하므로 정규식으로 검사.
const REQUIRE_META = [
  { name: "<title>", re: /<title[^>]*>[^<]+<\/title>/i },
  { name: 'name="description"', re: /name="description"/i },
  { name: 'rel="canonical"', re: /rel="canonical"/i },
];

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
      const missing = REQUIRE_META.filter((m) => !m.re.test(html)).map((m) => m.name);
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
