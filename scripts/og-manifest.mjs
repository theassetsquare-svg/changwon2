#!/usr/bin/env node
// /og/manifest.json 생성 — 썸네일 이미지에 "그려진 텍스트"를 기록해 둔다.
// 이미지는 나중에 글자를 읽을 수 없으므로 이 기록표가 오염 검사(G14)의 근거다.
// 텍스트 목록은 scripts/booking/gen-og.mjs · scripts/night/gen-og.mjs 의
// 렌더 템플릿과 1:1로 대응한다. 템플릿을 바꾸면 여기도 같이 고친다.
import { readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const BRAND = "changwonc.pages.dev";

function parse(file, sep) {
  const src = readFileSync(join(ROOT, file), "utf8");
  return src.split(sep).slice(1).map((b) => {
    const pick = (k) => {
      const m = b.match(new RegExp(`\\n    ${k}: "((?:[^"\\\\]|\\\\.)*)"`));
      return m ? m[1] : "";
    };
    const c = b.match(/contact: \{ nick: "([^"]+)", phone: "([^"]+)"/);
    return {
      slug: b.slice(0, b.indexOf('"')),
      name: pick("name"),
      region: pick("region"),
      badge: pick("ageBadge"),
      group: pick("group"),
      nick: c ? c[1] : "",
      phone: c ? c[2] : "",
    };
  });
}

const booking = ["venues-1.ts", "venues-2.ts", "venues-3.ts", "venues-4.ts"]
  .flatMap((f) => parse(`lib/booking/${f}`, /\n  \{\n    slug: "/));
const night = parse("lib/night/venues.ts", /\n  \{\n    slug: "/);

const items = [];
const push = (file, page, venue, text) => {
  const abs = join(ROOT, "public/og", file);
  items.push({
    file: `/og/${file}`,
    page: `https://changwonc.pages.dev${page}`,
    venue,
    text,
    bytes: existsSync(abs) ? statSync(abs).size : null,
    width: 1200,
    height: 1200,
  });
};

for (const c of booking) {
  const t = ["BOOKING", c.name, c.region];
  if (c.badge) t.push(c.badge);
  if (c.group === "A") t.push(c.nick, c.phone); else t.push(BRAND);
  push(`booking-${c.slug}-og.png`, `/booking/${c.slug}/`, c.name, t);
}
for (const c of night) {
  const t = [c.name, c.region];
  if (c.badge) t.push(c.badge);
  if (c.group === "A") t.push(c.nick, c.phone); else t.push(BRAND);
  push(`${c.slug}-og.png`, `/night/${c.slug}/`, c.name, t);
}
// 허브 카드 — 여러 업소를 다루는 목록이라 중립 문구만 그려져 있다.
push("booking-index-og.png", "/booking-guide/", null, ["BOOKING", "전국 나이트 부킹 안내", "부킹 흐름과 매너 · 40곳", BRAND]);
push("index-og.png", "/night-guide/", null, ["전국 나이트 안내", "지역별 목록", BRAND]);

// G14: 자기 이름 외 다른 업소명이 그려져 있으면 실패
const names = [...booking, ...night].map((c) => c.name);
const bad = [];
for (const it of items) {
  const joined = it.text.join(" ");
  for (const n of names) {
    if (n === it.venue) continue;
    if (it.venue === null) continue; // 허브 예외
    if (it.venue?.startsWith("인천아라비") && n.startsWith("인천아라비")) continue;
    if (joined.includes(n)) bad.push(`${it.file} <- ${n}`);
  }
}
writeFileSync(join(ROOT, "public/og/manifest.json"), JSON.stringify({ generated: "static", count: items.length, items }, null, 2) + "\n");
console.log(`manifest ${items.length}장 기록 · G14 오염 ${bad.length}건`);
bad.forEach((b) => console.log(" -", b));
