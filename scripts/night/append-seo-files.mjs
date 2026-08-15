#!/usr/bin/env node
// sitemap.xml / robots.txt / llms.txt 에 /night/ 경로를 append 한다.
// 기존 항목은 한 글자도 건드리지 않는다. 재실행해도 중복 추가되지 않는다(멱등).
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SITE = "https://changwona.pages.dev";
const MARK = "<!-- night-13pages:begin -->";
const MARK_TXT = "# night-13pages:begin";

const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
const today = kst.toISOString().slice(0, 10);

const src = readFileSync(join(ROOT, "lib/night/venues.ts"), "utf8");
const blocks = src.split(/\n  \{\n    slug: "/).slice(1);
const venues = blocks.map((b) => {
  const pick = (k) => {
    const m = b.match(new RegExp(`${k}: "((?:[^"\\\\]|\\\\.)*)"`));
    return m ? m[1] : "";
  };
  return {
    slug: b.slice(0, b.indexOf('"')),
    name: pick("name"),
    region: pick("region"),
    badge: pick("ageBadge"),
    answer: (b.match(/answer:\s*\n?\s*"((?:[^"\\]|\\.)*)"/) ?? [, ""])[1],
  };
});
if (venues.length !== 13) throw new Error(`업소 13개가 아님: ${venues.length}`);

// ── sitemap.xml (정적 파일 · append) ──
{
  const p = join(ROOT, "public/sitemap.xml");
  let xml = readFileSync(p, "utf8");
  if (xml.includes(MARK)) {
    xml = xml.replace(new RegExp(`\\s*${MARK}[\\s\\S]*?<!-- night-13pages:end -->`), "");
  }
  const entries = [
    { loc: `${SITE}/night/`, pri: "0.8" },
    ...venues.map((v) => ({ loc: `${SITE}/night/${v.slug}/`, pri: "0.8" })),
  ]
    .map(
      (e) =>
        `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>weekly</changefreq>\n    <priority>${e.pri}</priority>\n  </url>`,
    )
    .join("\n");
  const add = `${MARK}\n${entries}\n  <!-- night-13pages:end -->\n`;
  if (!xml.includes("</urlset>")) throw new Error("sitemap 형식 예상과 다름");
  xml = xml.replace("</urlset>", `${add}</urlset>`);
  writeFileSync(p, xml);
  console.log(`✓ sitemap.xml +${venues.length + 1} URL (lastmod ${today})`);
}

// ── robots.txt (append) ──
{
  const p = join(ROOT, "public/robots.txt");
  let txt = readFileSync(p, "utf8");
  const idx = txt.indexOf(MARK_TXT);
  if (idx >= 0) txt = txt.slice(0, idx).replace(/\s+$/, "") + "\n";
  const add =
    `\n${MARK_TXT}\n` +
    `User-agent: Yeti\nAllow: /\n\n` +
    `User-agent: Googlebot\nAllow: /\n\n` +
    `Sitemap: ${SITE}/sitemap.xml\n`;
  writeFileSync(p, txt.replace(/\s+$/, "") + "\n" + add);
  console.log("✓ robots.txt append");
}

// ── llms.txt (append) ──
{
  const p = join(ROOT, "public/llms.txt");
  let txt = readFileSync(p, "utf8");
  const idx = txt.indexOf(MARK_TXT);
  if (idx >= 0) txt = txt.slice(0, idx).replace(/\s+$/, "") + "\n";
  const lines = venues
    .map((v) => {
      const one = v.answer.split(". ")[0].replace(/\.$/, "");
      const age = v.badge ? ` (${v.badge} 출입)` : "";
      return `- ${SITE}/night/${v.slug}/ — ${v.name} — ${v.region}${age} — ${one}.`;
    })
    .join("\n");
  const add =
    `\n${MARK_TXT}\n\n## /night/ 업소 안내 13페이지\n\n` +
    `> 각 페이지는 업소별로 다른 각도(문답·시간 흐름·비교·요약·인원별 등)로 작성한 이용 안내다. ` +
    `본문 대부분은 나이트클럽 이용 문화 일반론이며, 주소·영업시간·좌석 구성은 ` +
    `2곳 이상 교차 확인된 항목만 실었다. 가격 정보는 싣지 않는다.\n\n` +
    `- ${SITE}/night/ — 전국 나이트 업소 안내 목록 — 13곳 지역별 인덱스\n` +
    `${lines}\n\n` +
    `광고·제휴 입점 문의(업소 사장님 대상): 카카오톡 besta12 — 손님 예약 채널이 아님.\n`;
  writeFileSync(p, txt.replace(/\s+$/, "") + "\n" + add);
  console.log(`✓ llms.txt +${venues.length + 1}줄`);
}
