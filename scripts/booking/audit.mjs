#!/usr/bin/env node
// /booking/ 40페이지 게이트 실측. 빌드 산출물(out/)을 직접 읽는다.
// 사용: node scripts/booking/audit.mjs
import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT = join(ROOT, "out/booking");
const NIGHT_OUT = join(ROOT, "out/night");
const SITE = "https://changwonc.pages.dev";

// ── 업소 메타 파싱 ──
const META = [];
for (const f of ["venues-1.ts", "venues-2.ts", "venues-3.ts", "venues-4.ts"]) {
  const src = readFileSync(join(ROOT, "lib/booking", f), "utf8");
  for (const b of src.split(/\n  \{\n    slug: "/).slice(1)) {
    const pick = (k) => {
      const m = b.match(new RegExp(`\\n    ${k}: "((?:[^"\\\\]|\\\\.)*)"`));
      return m ? m[1] : "";
    };
    const c = b.match(/contact: \{ nick: "([^"]+)", phone: "([^"]+)"/);
    META.push({
      slug: b.slice(0, b.indexOf('"')),
      name: pick("name"),
      group: pick("group"),
      region: pick("region"),
      title: pick("title"),
      address: pick("address"),
      badge: pick("ageBadge"),
      nightSlug: pick("nightSlug"),
      phone: c ? c[2] : "",
      nick: c ? c[1] : "",
    });
  }
}
if (META.length !== 40) throw new Error(`업소 40개가 아님: ${META.length}`);

const strip = (h) =>
  h
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const pages = META.map((m) => {
  const f = join(OUT, m.slug, "index.html");
  if (!existsSync(f)) throw new Error(`빌드 산출물 없음: ${f}`);
  const html = readFileSync(f, "utf8");
  const article = (html.match(/<article[\s\S]*?<\/article>/) || [""])[0];
  const h2 = [...article.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((x) => strip(x[1]));
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [, ""])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ""])[1];
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [, ""])[1];
  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
    (x) => x[1],
  );
  const bar = (html.match(/<div class="callbar"[\s\S]*?<\/div>/) || [""])[0];
  const body = (html.match(/<body[\s\S]*<\/body>/) || [""])[0];
  const links = [...body.matchAll(/<a [^>]*href="([^"]*)"/g)].map((x) => x[1]);
  const facts = (html.match(/<table class="bk-facts">[\s\S]*?<\/table>/) || [""])[0];
  return { ...m, html, article, h2, title, desc, canon, ld, bar, links, facts, text: strip(article) };
});

const out = [];
const L = (s) => out.push(s);
let FAIL = 0;
const gate = (id, ok, detail) => {
  if (!ok) FAIL++;
  L(`${ok ? "PASS" : "FAIL"}  ${id}  ${detail}`);
};

// ── G1 생성·본문 검증 ──
const g1 = pages.filter(
  (p) => !p.html.includes(p.name) || !p.article || !p.bar || p.text.length < 900,
);
gate(
  "G1 페이지 생성",
  g1.length === 0 && pages.length === 40,
  `40/40 생성, 본문 최소 ${Math.min(...pages.map((p) => p.text.length))}자 / 최대 ${Math.max(...pages.map((p) => p.text.length))}자, 결함 ${g1.length}p`,
);

// ── G2 title 20~30자 + 업소명 선두 + 고유 ──
const t2 = pages.filter((p) => !p.title.startsWith(p.name) || p.title.length < 20 || p.title.length > 30);
gate(
  "G2 제목 규격",
  t2.length === 0 && new Set(pages.map((p) => p.title)).size === 40,
  `고유 ${new Set(pages.map((p) => p.title)).size}/40, 길이 ${Math.min(...pages.map((p) => p.title.length))}~${Math.max(...pages.map((p) => p.title.length))}자, 위반 ${t2.length}p${t2.length ? " " + t2.map((p) => `${p.slug}(${p.title.length}자)`).join(", ") : ""}`,
);

// ── G3 description 고유 + 유사도 ──
const jac = (a, b, n = 3) => {
  const g = (s) => {
    const set = new Set();
    const t = s.replace(/\s+/g, "");
    for (let i = 0; i + n <= t.length; i++) set.add(t.slice(i, i + n));
    return set;
  };
  const A = g(a), B = g(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter || 1);
};
let maxD = 0, maxDPair = "";
for (let i = 0; i < 40; i++)
  for (let j = i + 1; j < 40; j++) {
    const v = jac(pages[i].desc, pages[j].desc);
    if (v > maxD) { maxD = v; maxDPair = `${pages[i].slug}↔${pages[j].slug}`; }
  }
gate(
  "G3 설명문",
  new Set(pages.map((p) => p.desc)).size === 40 && maxD < 0.2 && pages.every((p) => p.desc.length >= 60),
  `고유 ${new Set(pages.map((p) => p.desc)).size}/40, 최대유사도 ${(maxD * 100).toFixed(1)}% (${maxDPair})`,
);

// ── G4 본문 5-gram 유사도 (780쌍) + /night/ 대응 페이지 대비 ──
const gram5 = (s) => {
  const t = s.replace(/\s+/g, "");
  const set = new Set();
  for (let i = 0; i + 5 <= t.length; i++) set.add(t.slice(i, i + 5));
  return set;
};
const G = pages.map((p) => gram5(p.text));
const pairs = [];
for (let i = 0; i < 40; i++)
  for (let j = i + 1; j < 40; j++) {
    let inter = 0;
    for (const x of G[i]) if (G[j].has(x)) inter++;
    pairs.push({ a: pages[i].slug, b: pages[j].slug, v: inter / (G[i].size + G[j].size - inter) });
  }
pairs.sort((x, y) => y.v - x.v);
const avg = pairs.reduce((s, p) => s + p.v, 0) / pairs.length;

const crossPairs = [];
for (const p of pages) {
  if (!p.nightSlug) continue;
  const f = join(NIGHT_OUT, p.nightSlug, "index.html");
  if (!existsSync(f)) continue;
  const nt = strip((readFileSync(f, "utf8").match(/<article[\s\S]*?<\/article>/) || [""])[0]);
  const A = gram5(p.text), B = gram5(nt);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  crossPairs.push({ slug: p.slug, v: inter / (A.size + B.size - inter) });
}
crossPairs.sort((a, b) => b.v - a.v);
gate(
  "G4 본문 유사도",
  pairs[0].v < 0.15 && (crossPairs[0]?.v ?? 0) < 0.15,
  `780쌍 최대 ${(pairs[0].v * 100).toFixed(2)}% / 평균 ${(avg * 100).toFixed(2)}% · /night/ 대비 최대 ${((crossPairs[0]?.v ?? 0) * 100).toFixed(2)}% (${crossPairs[0]?.slug ?? "-"})`,
);
L(`      상위3쌍: ${pairs.slice(0, 3).map((p) => `${p.a}↔${p.b} ${(p.v * 100).toFixed(2)}%`).join(" | ")}`);

// ── G5 구조 (도입→직답→표→흐름→답→FAQ→한줄) ──
const sem = ["header", "nav", "main", "article", "section", "aside", "footer"];
const g5 = pages.filter((p) => {
  const h1 = (p.article.match(/<h1[ >]/g) || []).length;
  const semOk = sem.every((t) => new RegExp(`<${t}[ >]`).test(p.html));
  const ans3 = (p.article.match(/class="bk-anum"/g) || []).length;
  const hasFacts = /<table class="bk-facts">/.test(p.html);
  const flowH2 = p.h2.length - 2; // FAQ h2 + 마지막 답 h2 제외
  const qH2 = p.h2.filter((h) => h.endsWith("?")).length;
  const oneline = /class="bk-oneline"/.test(p.article);
  const faqN = (p.article.match(/<h3>Q\./g) || []).length;
  return !(
    h1 === 1 && semOk && ans3 === 3 && hasFacts &&
    flowH2 >= 4 && flowH2 <= 6 && qH2 >= 2 && oneline && faqN === 3
  );
});
gate(
  "G5 페이지 구조",
  g5.length === 0,
  `h1·시맨틱·3줄직답·사실표·흐름H2 4~6·질문형H2 2+·FAQ3·한줄정리 — 위반 ${g5.length}p${g5.length ? " " + g5.map((p) => p.slug).join(", ") : ""}`,
);

// ── G6 JSON-LD ──
let g6ok = true;
const faqBad = [];
for (const p of pages) {
  if (p.ld.length !== 3) { g6ok = false; continue; }
  let objs;
  try { objs = p.ld.map((t) => JSON.parse(t)); } catch { g6ok = false; continue; }
  const types = objs.map((o) => o["@type"]);
  if (!["NightClub", "FAQPage", "BreadcrumbList"].every((t) => types.includes(t))) g6ok = false;
  const faq = objs.find((o) => o["@type"] === "FAQPage");
  if (!faq || faq.mainEntity.length !== 3) g6ok = false;
  for (const q of faq?.mainEntity ?? []) {
    const n = q.acceptedAnswer.text.length;
    if (n < 40 || n > 90) faqBad.push(`${p.slug}:${n}자`);
  }
  const club = objs.find((o) => o["@type"] === "NightClub");
  // 확인 불가 항목은 스키마에도 넣지 않는다
  if (!p.address && club.address.streetAddress) g6ok = false;
}
gate("G6 JSON-LD 3종", g6ok && faqBad.length === 0, `NightClub·FAQPage·BreadcrumbList 40/40, FAQ 답변 길이 위반 ${faqBad.length}건 ${faqBad.slice(0, 4).join(", ")}`);

// ── G7 canonical ──
const canonOk = pages.every((p) => p.canon === `${SITE}/booking/${p.slug}/`);
gate("G7 canonical", canonOk && new Set(pages.map((p) => p.canon)).size === 40, `자기참조 ${pages.filter((p) => p.canon === `${SITE}/booking/${p.slug}/`).length}/40`);

// ── G8 고정바 ──
const barA = pages.filter((p) => p.group === "A");
const barB = pages.filter((p) => p.group === "B");
const g8a = barA.filter((p) => /besta12/i.test(p.bar) || !p.bar.includes(p.phone) || !p.bar.includes(p.name));
const g8b = barB.filter((p) => !/besta12/i.test(p.bar) || /01[0-9]-\d{3,4}-\d{4}/.test(p.bar));
const hubHtml = readFileSync(join(OUT, "index.html"), "utf8");
const hubBar = (hubHtml.match(/<div class="callbar"[\s\S]*?<\/div>/) || [""])[0];
const hubOk = hubBar.includes("창원룰루랄라나이트") && hubBar.includes("로또") && hubBar.includes("010-7528-4936");
gate(
  "G8 고정바",
  g8a.length === 0 && g8b.length === 0 && hubOk,
  `A그룹 ${barA.length}p 전화노출·besta12 0건 / B그룹 ${barB.length}p besta12 노출 / 허브 창원 라인 ${hubOk ? "OK" : "누락"}`,
);

// ── G9 확인 불가 정합성 ──
const g9 = pages.filter((p) => {
  const needUnknown = !p.address;
  const hasUnknown = /확인 불가/.test(p.facts);
  const addrOk = p.address ? p.facts.includes(p.address) : hasUnknown;
  // 주소 미확인 업소 본문에 도로명/지번이 등장하면 추측 표기로 본다
  const guessed = needUnknown && /\d+번?길 \d+|로 \d{2,4}|\d{2,4}-\d{1,3}(?!\d)/.test(p.text);
  return !addrOk || guessed;
});
const unknownCount = pages.filter((p) => !p.address).length;
gate("G9 확인 불가 표기", g9.length === 0, `주소 미확인 ${unknownCount}p 전부 "확인 불가" 표기, 추측 표기 ${g9.length}건`);

// ── G10 링크 허용표 ──
const allow = (h) =>
  h === "/" ||
  h === "/booking/" ||
  h === "/night/" ||
  /^\/booking\/[a-z0-9-]+\/$/.test(h) ||
  /^\/night\/[a-z0-9-]+\/$/.test(h) ||
  /^tel:0\d{9,10}$/.test(h) ||
  h.startsWith("#");
const badLinks = pages.flatMap((p) => p.links.filter((h) => !allow(h)).map((h) => `${p.slug}: ${h}`));
const external = pages.flatMap((p) => p.links.filter((h) => /^https?:\/\//i.test(h)).map((h) => `${p.slug}: ${h}`));
gate(
  "G10 링크",
  badLinks.length === 0 && external.length === 0,
  `외부 아웃바운드 ${external.length}건 / 허용표 밖 ${badLinks.length}건 ${badLinks.slice(0, 3).join(", ")}`,
);

// ── G11 연령 표기 ──
const BAD_AGE = [/27\+/, /38\+/, /만27세/, /27세이상/, /27이상/, /38세이상/, /만38세/];
const ageHits = [];
for (const p of [...pages, { slug: "index", html: hubHtml }]) {
  for (const re of BAD_AGE) if (re.test(p.html)) ageHits.push(`${p.slug}:${re}`);
  for (const n of [27, 38]) {
    for (const m of p.html.matchAll(new RegExp(`${n}세`, "g"))) {
      const ctx = p.html.slice(Math.max(0, m.index - 3), m.index + 6);
      if (!/만 \d\d세 이상/.test(ctx)) ageHits.push(`${p.slug}:단독 ${n}세 "${ctx}"`);
    }
  }
}
gate("G11 연령 완전문", ageHits.length === 0, `축약·단독 표기 ${ageHits.length}건 ${ageHits.slice(0, 3).join(", ")}`);

// ── 참고 표 ──
L("\n── title 길이 / 전문 ──");
for (const p of pages) L(`${String(p.title.length).padStart(2)}자  ${p.title}`);

L("\n── 확인 불가 항목 ──");
for (const p of pages) {
  const unknowns = [...p.facts.matchAll(/<th scope="row">([^<]+)<\/th><td>확인 불가<\/td>/g)].map((x) => x[1]);
  if (unknowns.length) L(`${p.slug.padEnd(30)} ${unknowns.join(", ")}`);
}

console.log(out.join("\n"));
console.log(`\n${FAIL === 0 ? "게이트 ALL PASS (G1~G11)" : `게이트 FAIL ${FAIL}건`}`);
process.exit(FAIL === 0 ? 0 : 1);
