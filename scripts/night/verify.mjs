#!/usr/bin/env node
// /night/ 13페이지 배포 전·후 게이트 실측.
// 사용: node scripts/night/verify.mjs <BASE_URL>
//   예) node scripts/night/verify.mjs http://127.0.0.1:4321
//       node scripts/night/verify.mjs https://changwonc.pages.dev
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire("/tmp/claude-1000/-home-user-changwon2/a781cf4c-1113-46b1-9974-170b64a03aff/scratchpad/");
const { chromium } = require("playwright-core");

const BASE = (process.argv[2] || "http://127.0.0.1:4321").replace(/\/$/, "");
const CB = process.argv[3] === "--cachebust";
const ROOT = resolve(import.meta.dirname, "../..");

const src = readFileSync(join(ROOT, "lib/night/venues.ts"), "utf8");
const blocks = src.split(/\n  \{\n    slug: "/).slice(1);
const VENUES = blocks.map((b) => {
  const pick = (k) => {
    const m = b.match(new RegExp(`${k}: "((?:[^"\\\\]|\\\\.)*)"`));
    return m ? m[1] : "";
  };
  return {
    slug: b.slice(0, b.indexOf('"')),
    name: pick("name"),
    group: pick("group"),
    contactPhone: (b.match(/contact: \{ nick: "([^"]+)", phone: "([^"]+)"/) ?? [])[2] ?? "",
    badge: pick("ageBadge"),
  };
});
if (VENUES.length !== 13) throw new Error(`업소 13개가 아님: ${VENUES.length}`);

const VIEWPORTS = [
  { key: "모바일", width: 390, height: 844 },
  { key: "PC", width: 1920, height: 1080 },
];

// WCAG 명도대비
const srgb = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lumRGB = (s) => {
  const m = s.match(/\d+(\.\d+)?/g).map(Number);
  return 0.2126 * srgb(m[0]) + 0.7152 * srgb(m[1]) + 0.0722 * srgb(m[2]);
};
const ratio = (a, b) => {
  const [x, y] = [lumRGB(a), lumRGB(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const results = {
  coords: [], // G05
  ancestors: [], // [4]필수2
  g03: [],
  g06: [],
  g07: [],
  g08: [],
  g09: [],
  g10: [],
  g12: [],
  body: [],
  http: [],
};

const browser = await chromium.launch({
  executablePath: "/nix/store/lpdrfl6n16q5zdf8acp4bni7yczzcx3h-idx-builtins/bin/chromium",
  args: ["--no-sandbox", "--disable-gpu"],
});

for (const v of VENUES) {
  const url = `${BASE}/night/${v.slug}/${CB ? `?cb=${process.env.CB_TS || "1"}` : ""}`;

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const resp = await page.goto(url, { waitUntil: "load" });
    const status = resp?.status() ?? 0;

    // ── 본문 검증 (업소명 + callbar 존재) ──
    const html = await page.content();
    if (vp.key === "PC") {
      results.http.push({
        slug: v.slug,
        status,
        hasName: html.includes(v.name),
        hasCallbar: html.includes("callbar"),
      });
    }

    // ── 스크롤 가능 여부 ──
    const scrollable = await page.evaluate(
      () => document.body.scrollHeight > window.innerHeight,
    );

    // ── G05: 스크롤 전/후 .callbar top ──
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(120);
    const before = await page.evaluate(
      () => document.querySelector(".callbar").getBoundingClientRect().top,
    );
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    const { after, scrollY } = await page.evaluate(() => ({
      after: document.querySelector(".callbar").getBoundingClientRect().top,
      scrollY: Math.round(window.scrollY),
    }));
    results.coords.push({
      slug: v.slug,
      vp: vp.key,
      before: Number(before.toFixed(2)),
      after: Number(after.toFixed(2)),
      diff: Number(Math.abs(after - before).toFixed(2)),
      scrollable,
      scrollY, // 실제로 스크롤됐는지 — 0이면 테스트가 무의미하므로 FAIL 처리
    });

    if (vp.key === "PC") {
      // ── [4]필수2: 조상 체인 containing-block 속성 검사 ──
      const anc = await page.evaluate(() => {
        const bad = [];
        let el = document.querySelector(".callbar").parentElement;
        const chain = [];
        while (el) {
          const cs = getComputedStyle(el);
          const tag =
            el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "") +
            (el.className && typeof el.className === "string" && el.className.trim()
              ? `.${el.className.trim().split(/\s+/)[0]}`
              : "");
          chain.push(tag);
          const hits = [];
          if (cs.transform && cs.transform !== "none") hits.push("transform");
          if (cs.filter && cs.filter !== "none") hits.push("filter");
          if (cs.perspective && cs.perspective !== "none") hits.push("perspective");
          if (cs.backdropFilter && cs.backdropFilter !== "none") hits.push("backdrop-filter");
          if (cs.willChange && /transform/.test(cs.willChange)) hits.push("will-change:transform");
          if (cs.contain && /paint|strict|content/.test(cs.contain)) hits.push("contain:paint");
          if (hits.length) bad.push({ tag, hits });
          el = el.parentElement;
        }
        return { chain, bad, parent: document.querySelector(".callbar").parentElement.tagName.toLowerCase() };
      });
      results.ancestors.push({ slug: v.slug, ...anc });

      // ── G03: h1 개수 ──
      const h1 = await page.evaluate(() => document.querySelectorAll("h1").length);
      results.g03.push({ slug: v.slug, h1 });

      // ── G06/G07: 고정바 내 besta12 ──
      const barText = await page.evaluate(
        () => document.querySelector(".callbar").innerText.replace(/\s+/g, " ").trim(),
      );
      const hasBesta = /besta12/i.test(barText);
      if (v.group === "A") {
        results.g06.push({ slug: v.slug, barText, hasBesta, hasPhone: barText.includes(v.contactPhone) });
      } else {
        results.g07.push({ slug: v.slug, barText, hasBesta });
      }

      // ── G08: 푸터 besta12 + 대비 ──
      const foot = await page.evaluate(() => {
        const el = document.querySelector(".site-footer .ad-inquiry");
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { text: el.innerText.replace(/\s+/g, " ").trim(), bg: cs.backgroundColor, fg: cs.color };
      });
      results.g08.push({
        slug: v.slug,
        has: !!foot && /besta12/.test(foot.text),
        contrast: foot ? Number(ratio(foot.fg, foot.bg).toFixed(2)) : 0,
      });

      // ── G09: JSON-LD 파싱 ──
      const ld = await page.evaluate(() =>
        [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
      );
      let types = [];
      let err = null;
      try {
        types = ld.map((t) => JSON.parse(t)["@type"]);
      } catch (e) {
        err = e.message;
      }
      results.g09.push({ slug: v.slug, count: ld.length, types, err });

      // ── G10: 링크 검사 (내부 경로 수집 + 외부 아웃바운드 0) ──
      const links = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
      );
      results.g10.push({ slug: v.slug, links });

      // ── G12: 고정바가 .ad-inquiry 를 가리는지 (문서 최하단 스크롤 상태에서 실측) ──
      // 레이아웃이 늦게 확정되는 경우가 있어 바닥에 실제로 닿을 때까지 반복한다.
      for (let i = 0; i < 8; i++) {
        const done = await page.evaluate(() => {
          window.scrollTo(0, document.documentElement.scrollHeight);
          const max = document.documentElement.scrollHeight - window.innerHeight;
          return Math.abs(window.scrollY - max) <= 1;
        });
        await page.waitForTimeout(150);
        if (done) break;
      }
      const overlap = await page.evaluate(() => {
        const bar = document.querySelector(".callbar").getBoundingClientRect();
        const ad = document.querySelector(".ad-inquiry").getBoundingClientRect();
        return {
          adBottom: Number(ad.bottom.toFixed(1)),
          barTop: Number(bar.top.toFixed(1)),
          // 가로는 둘 다 전폭이므로 세로 겹침만 보면 된다
          overlapped: ad.bottom > bar.top && ad.top < bar.bottom,
        };
      });
      results.g12.push({ slug: v.slug, ...overlap });
      results.body.push({ slug: v.slug, scrollable });
    }

    await ctx.close();
  }
}

await browser.close();

// ───────────────────── 판정 ─────────────────────
const line = (s) => console.log(s);
line(`\n══ 대상: ${BASE} ══\n`);

line("── ④ 고정바 좌표 실측 (26행) ──");
line("업소".padEnd(28) + "뷰포트".padEnd(8) + "스크롤전".padStart(9) + "스크롤후".padStart(9) + "차이".padStart(7) + "scrollY".padStart(9));
for (const r of results.coords) {
  line(
    r.slug.padEnd(28) +
      r.vp.padEnd(8) +
      String(r.before).padStart(9) +
      String(r.after).padStart(9) +
      String(r.diff).padStart(7) +
      String(r.scrollY).padStart(9),
  );
}

const g05fail = results.coords.filter((r) => r.diff !== 0 || !r.scrollable || r.scrollY <= 0);
const ancBad = results.ancestors.filter((r) => r.bad.length);
const g03fail = results.g03.filter((r) => r.h1 !== 1);
const g06fail = results.g06.filter((r) => r.hasBesta || !r.hasPhone);
const g07fail = results.g07.filter((r) => !r.hasBesta);
const g08fail = results.g08.filter((r) => !r.has || r.contrast < 4.5);
const g09fail = results.g09.filter((r) => r.err || r.count !== 3);
const external = results.g10.flatMap((r) =>
  r.links.filter((h) => /^https?:\/\//i.test(h)).map((h) => `${r.slug}: ${h}`),
);
const internal = [...new Set(results.g10.flatMap((r) => r.links.filter((h) => h.startsWith("/"))))];
const g12fail = results.g12.filter((r) => r.overlapped);
const httpFail = results.http.filter((r) => r.status !== 200 || !r.hasName || !r.hasCallbar);

line("\n── 게이트 요약 ──");
line(`G03 h1 1개          : ${g03fail.length === 0 ? "PASS" : "FAIL " + JSON.stringify(g03fail)}  (측정 ${results.g03.length}p)`);
line(`G05 고정바 좌표 차이 : ${g05fail.length === 0 ? "PASS" : "FAIL"}  최대차 ${Math.max(...results.coords.map((r) => r.diff))}px / 26행`);
line(`G06 A그룹 besta12 0  : ${g06fail.length === 0 ? "PASS" : "FAIL " + JSON.stringify(g06fail)}  (${results.g06.length}p)`);
line(`G07 B그룹 besta12 노출: ${g07fail.length === 0 ? "PASS" : "FAIL " + JSON.stringify(g07fail)}  (${results.g07.length}p)`);
line(`G08 푸터 besta12+대비 : ${g08fail.length === 0 ? "PASS" : "FAIL"}  최소대비 ${Math.min(...results.g08.map((r) => r.contrast))}:1`);
line(`G09 JSON-LD 3종      : ${g09fail.length === 0 ? "PASS" : "FAIL " + JSON.stringify(g09fail)}  타입 ${JSON.stringify(results.g09[0]?.types)}`);
line(`G10 외부 아웃바운드   : ${external.length === 0 ? "PASS (0건)" : "FAIL " + JSON.stringify(external)}`);
line(`G12 고정바 가림       : ${g12fail.length === 0 ? "PASS" : "FAIL " + JSON.stringify(g12fail)}`);
line(`본문검증(200+업소명+callbar): ${httpFail.length === 0 ? "PASS" : "FAIL " + JSON.stringify(httpFail)}`);
line(`조상 containing-block: ${ancBad.length === 0 ? "PASS (0건)" : "FAIL " + JSON.stringify(ancBad)}`);
line(`  .callbar 부모 = ${results.ancestors[0]?.parent} / 체인 ${JSON.stringify(results.ancestors[0]?.chain)}`);
line(`내부 링크 경로: ${JSON.stringify(internal)}`);

const fails =
  g05fail.length + ancBad.length + g03fail.length + g06fail.length + g07fail.length +
  g08fail.length + g09fail.length + external.length + g12fail.length + httpFail.length;
line(`\n${fails === 0 ? "ALL PASS" : `FAIL ${fails}건`}`);
process.exit(fails === 0 ? 0 : 1);
