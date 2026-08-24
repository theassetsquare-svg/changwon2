#!/usr/bin/env node
// sitemap.xml / robots.txt / llms.txt 에 /booking/ 40페이지 경로를 append 한다.
// 기존 항목은 건드리지 않는다. 재실행해도 중복 추가되지 않는다(멱등).
// robots/llms 는 night 블록보다 앞에 넣는다 — night 스크립트가 자기 마커 이후를 잘라내기 때문.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SITE = "https://i.nolcool.com";
const MARK = "<!-- booking-40pages:begin -->";
const END = "<!-- booking-40pages:end -->";
const MARK_TXT = "# booking-40pages:begin";
const END_TXT = "# booking-40pages:end";
const NIGHT_TXT = "# night-13pages:begin";

const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
const today = kst.toISOString().slice(0, 10);

const order = readFileSync(join(ROOT, "lib/booking/venues.ts"), "utf8")
  .match(/const ORDER = \[([\s\S]*?)\];/)[1]
  .match(/"([a-z0-9-]+)"/g)
  .map((s) => s.replace(/"/g, ""));

const META = new Map();
for (const f of ["venues-1.ts", "venues-2.ts", "venues-3.ts", "venues-4.ts"]) {
  const src = readFileSync(join(ROOT, "lib/booking", f), "utf8");
  for (const b of src.split(/\n  \{\n    slug: "/).slice(1)) {
    const pick = (k) => {
      const m = b.match(new RegExp(`\\n    ${k}: "((?:[^"\\\\]|\\\\.)*)"`));
      return m ? m[1] : "";
    };
    const slug = b.slice(0, b.indexOf('"'));
    META.set(slug, {
      slug,
      name: pick("name"),
      region: pick("region"),
      badge: pick("ageBadge"),
      title: pick("title"),
      oneline: (b.match(/oneline:\s*\n?\s*"((?:[^"\\]|\\.)*)"/) ?? [, ""])[1],
    });
  }
}
const venues = order.map((s) => {
  const v = META.get(s);
  if (!v) throw new Error(`메타 누락: ${s}`);
  return v;
});
if (venues.length !== 40) throw new Error(`업소 40개가 아님: ${venues.length}`);

// ── sitemap.xml ──
{
  const p = join(ROOT, "public/sitemap.xml");
  let xml = readFileSync(p, "utf8");
  xml = xml.replace(new RegExp(`\\s*${MARK}[\\s\\S]*?${END}`), "");
  // 허브 /booking/ 는 기존 본문 블록에 이미 있으므로 중복 추가하지 않는다.
  const entries = venues.map((v) => ({ loc: `${SITE}/booking/${v.slug}/`, pri: "0.8" }))
    .map(
      (e) =>
        `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>weekly</changefreq>\n    <priority>${e.pri}</priority>\n  </url>`,
    )
    .join("\n");
  if (!xml.includes("</urlset>")) throw new Error("sitemap 형식 예상과 다름");
  xml = xml.replace("</urlset>", `${MARK}\n${entries}\n  ${END}\n</urlset>`);
  writeFileSync(p, xml);
  console.log(`✓ sitemap.xml +${venues.length} URL (lastmod ${today})`);
}

/** night 블록 앞에 삽입한다. */
function insertBefore(txt, block) {
  const s = txt.indexOf(MARK_TXT);
  if (s >= 0) {
    const e = txt.indexOf(END_TXT);
    txt = txt.slice(0, s) + txt.slice(e >= 0 ? e + END_TXT.length : s);
  }
  const n = txt.indexOf(NIGHT_TXT);
  if (n >= 0) return txt.slice(0, n) + block + "\n" + txt.slice(n);
  return txt.replace(/\s+$/, "") + "\n" + block;
}

// ── robots.txt ──
{
  const p = join(ROOT, "public/robots.txt");
  const block =
    `${MARK_TXT}\n` +
    `# /booking/ 부킹 안내 41페이지(허브 1 + 업소 40) 전체 허용\n` +
    `User-agent: Yeti\nAllow: /booking/\n\n` +
    `User-agent: Googlebot\nAllow: /booking/\n\n` +
    `Sitemap: ${SITE}/sitemap.xml\n${END_TXT}\n`;
  writeFileSync(p, insertBefore(readFileSync(p, "utf8"), block));
  console.log("✓ robots.txt append");
}

// ── llms.txt ──
{
  const p = join(ROOT, "public/llms.txt");
  const lines = venues
    .map((v) => {
      const age = v.badge ? ` (${v.badge} 출입)` : "";
      return `- ${SITE}/booking/${v.slug}/ — ${v.name} — ${v.region}${age} — ${v.oneline}`;
    })
    .join("\n");
  const block =
    `${MARK_TXT}\n\n## /booking/ 부킹 문화 안내서 40페이지\n\n` +
    `> 각 페이지는 한 업소를 기준으로 부킹이 도는 순서(입장 → 자리 → 부킹 시작 → 이어가기·거절)와 ` +
    `매너를 다른 각도로 정리한 안내다. 주소·층·가까운 역·영업시간은 공개 자료에서 확인된 것만 싣고, ` +
    `미확인 항목은 "확인 불가"로 표기한다. 가격 정보는 싣지 않는다.\n\n` +
    `- ${SITE}/booking/ — 전국 나이트 부킹 안내 40 — 지역별 허브\n` +
    `${lines}\n\n` +
    `광고·제휴 입점 문의(업소 사장님 대상): 카카오톡 besta12 — 손님 예약 채널이 아님.\n` +
    `${END_TXT}\n`;
  writeFileSync(p, insertBefore(readFileSync(p, "utf8"), block));
  console.log(`✓ llms.txt +${venues.length + 1}줄`);
}
