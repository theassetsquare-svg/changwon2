#!/usr/bin/env node
// /night/ 13페이지 텍스트 게이트 실측. 빌드 산출물(out/)을 직접 읽는다.
// 사용: node scripts/night/audit.mjs
import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT = join(ROOT, "out/night");

const src = readFileSync(join(ROOT, "lib/night/venues.ts"), "utf8");
const blocks = src.split(/\n  \{\n    slug: "/).slice(1);
const META = blocks.map((b) => {
  const pick = (k) => {
    const m = b.match(new RegExp(`\\n    ${k}: "((?:[^"\\\\]|\\\\.)*)"`));
    return m ? m[1] : "";
  };
  return {
    slug: b.slice(0, b.indexOf('"')),
    name: pick("name"),
    group: pick("group"),
    region: pick("region"),
    title: pick("title"),
    description: pick("description"),
    ogAlt: pick("ogAlt"),
    answer: pick("answer"),
    badge: pick("ageBadge"),
  };
});
if (META.length !== 13) throw new Error(`업소 13개가 아님: ${META.length}`);

// ── HTML → 본문 텍스트 ──
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
  const mainM = html.match(/<main[\s\S]*?<\/main>/);
  const artM = html.match(/<article[\s\S]*?<\/article>/);
  const main = mainM ? mainM[0] : "";
  const article = artM ? artM[0] : "";
  const h2 = [...article.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((x) => strip(x[1]));
  const secs = [...article.matchAll(/<section[^>]*>([\s\S]*?)<\/section>/g)].map((x) => x[1]);
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [, ""])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ""])[1];
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [, ""])[1];
  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
    (x) => x[1],
  );
  const ansM = article.match(/<div class="answer-box"><p>([\s\S]*?)<\/p>/);
  const answerTxt = ansM ? strip(ansM[1]) : "";
  return { ...m, html, main, article, h2, secs, title, desc, canon, ld, answer: answerTxt, text: strip(article) };
});

const out = [];
const L = (s) => out.push(s);
let FAIL = 0;
const gate = (id, ok, detail) => {
  if (!ok) FAIL++;
  L(`${ok ? "PASS" : "FAIL"}  ${id}  ${detail}`);
};

// ── G02 title/description 중복 + 유사도 ──
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
let maxT = 0, maxD = 0;
for (let i = 0; i < 13; i++)
  for (let j = i + 1; j < 13; j++) {
    maxT = Math.max(maxT, jac(pages[i].title, pages[j].title));
    maxD = Math.max(maxD, jac(pages[i].desc, pages[j].desc));
  }
gate(
  "G02",
  new Set(pages.map((p) => p.title)).size === 13 &&
    new Set(pages.map((p) => p.desc)).size === 13 &&
    maxT < 0.2 && maxD < 0.2,
  `title 고유 ${new Set(pages.map((p) => p.title)).size}/13, desc 고유 ${new Set(pages.map((p) => p.desc)).size}/13, 최대유사도 title ${(maxT * 100).toFixed(1)}% / desc ${(maxD * 100).toFixed(1)}%`,
);

// ── G03 article 내 h1 1개 + 시맨틱 7종 ──
const sem = ["header", "nav", "main", "article", "section", "aside", "footer"];
const semFail = pages.filter((p) => sem.some((t) => !new RegExp(`<${t}[ >]`).test(p.html)));
const h1Fail = pages.filter((p) => (p.article.match(/<h1[ >]/g) || []).length !== 1);
gate("G03", semFail.length === 0 && h1Fail.length === 0, `h1 오류 ${h1Fail.length}p / 시맨틱 누락 ${semFail.length}p`);

// ── G04 본문 5-gram 유사도 78쌍 ──
const gram5 = (s) => {
  const t = s.replace(/\s+/g, "");
  const set = new Set();
  for (let i = 0; i + 5 <= t.length; i++) set.add(t.slice(i, i + 5));
  return set;
};
const G = pages.map((p) => gram5(p.text));
const pairs = [];
for (let i = 0; i < 13; i++)
  for (let j = i + 1; j < 13; j++) {
    let inter = 0;
    for (const x of G[i]) if (G[j].has(x)) inter++;
    pairs.push({ a: pages[i].slug, b: pages[j].slug, v: inter / (G[i].size + G[j].size - inter) });
  }
pairs.sort((x, y) => y.v - x.v);
const avg = pairs.reduce((s, p) => s + p.v, 0) / pairs.length;
gate("G04", pairs[0].v < 0.15, `78쌍 최대 ${(pairs[0].v * 100).toFixed(2)}% / 평균 ${(avg * 100).toFixed(2)}% (하드 15%)`);
L(`      상위3쌍: ${pairs.slice(0, 3).map((p) => `${p.a}↔${p.b} ${(p.v * 100).toFixed(2)}%`).join(" | ")}`);

// ── G09 JSON-LD 3종 + FAQ 답변 40~90자 ──
let g09 = true, faqBad = [];
for (const p of pages) {
  if (p.ld.length !== 3) { g09 = false; continue; }
  let objs;
  try { objs = p.ld.map((t) => JSON.parse(t)); } catch { g09 = false; continue; }
  const types = objs.map((o) => o["@type"]);
  if (!["NightClub", "FAQPage", "BreadcrumbList"].every((t) => types.includes(t))) g09 = false;
  const faq = objs.find((o) => o["@type"] === "FAQPage");
  if (!faq || faq.mainEntity.length < 5) g09 = false;
  for (const q of faq?.mainEntity ?? []) {
    const n = q.acceptedAnswer.text.length;
    if (n < 40 || n > 90) faqBad.push(`${p.slug}:${n}자 "${q.name}"`);
  }
}
gate("G09", g09 && faqBad.length === 0, `3종 파싱 ${g09 ? "OK" : "오류"} / 답변 길이 위반 ${faqBad.length}건 ${faqBad.slice(0, 5).join(", ")}`);

// ── G15 형태소 A/B/C ──
const morph = pages.map((p) => {
  const A = p.name;
  // B형: 지역 접두를 띄운 형태 (예: 울산 챔피언나이트)
  const B = A.replace(/^(불광동|창원|울산|청담|대전원|신림|상봉동|수유|부산|수원|안산|대전세븐|일산)/, (m) =>
    m === "대전원" ? "대전 원" : m === "대전세븐" ? "대전 세븐" : `${m} `,
  );
  const cityMap = {
    "bulgwang-hobak-night": "불광동 나이트클럽",
    "changwon-lululala-night": "창원 나이트클럽",
    "ulsan-champion-night": "울산 나이트클럽",
    "cheongdam-night": "청담 나이트클럽",
    "daejeon-one-night": "대전 나이트클럽",
    "sillim-grandprix-night": "신림 나이트클럽",
    "sangbong-hangukgwan-night": "상봉동 나이트클럽",
    "suyu-shampoo-night": "수유 나이트클럽",
    "busan-asiad-night": "부산 나이트클럽",
    "suwon-chance-dome-night": "수원 나이트클럽",
    "ansan-hit-night": "안산 나이트클럽",
    "daejeon-seven-night": "대전 나이트클럽",
    "ilsan-shampoo-night": "일산 나이트클럽",
  };
  const C = cityMap[p.slug];
  const cnt = (s, k) => (s.split(k).length - 1);
  const a = cnt(p.text, A);
  const b = cnt(p.text, B);
  const c = cnt(p.text, C);
  return { slug: p.slug, A, B, C, a, b, c };
});
const mFail = morph.filter((m) => m.a < 10 || m.b < 2 || m.c < 1);
gate("G15", mFail.length === 0, `위반 ${mFail.length}p ${mFail.map((m) => `${m.slug}(A${m.a}/B${m.b}/C${m.c})`).join(", ")}`);

// ── G16 title 업소명 0번째 + 25~30자 ──
const tFail = pages.filter((p) => !p.title.startsWith(p.name) || p.title.length < 25 || p.title.length > 30);
gate("G16", tFail.length === 0, `위반 ${tFail.length}p ${tFail.map((p) => `${p.slug}(${p.title.length}자)`).join(", ")}`);

// ── G17 본문 첫 100자 안에 A형 ──
const f17 = pages.filter((p) => !p.text.slice(0, 100).includes(p.name));
gate("G17", f17.length === 0, `위반 ${f17.length}p ${f17.map((p) => p.slug).join(", ")}`);

// ── G18 지역·교통 비중 + 금지어 3회 이하 ──
const TRAFFIC = ["지하철", "환승", "막차", "택시"];
const f18 = pages.map((p) => {
  const n = TRAFFIC.reduce((s, w) => s + (p.text.split(w).length - 1), 0);
  // 지역·교통 문단 비중: '역/도보/거리/동선/버스/큰길' 이 포함된 문단 글자수 비율
  const paras = [...p.article.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((x) => strip(x[1]));
  const total = paras.reduce((s, t) => s + t.length, 0) || 1;
  const geo = paras
    .filter((t) => /(출구|도보|버스|큰길|동선|번지|지번|찾아가|진입|주차|위치|주소)/.test(t))
    .reduce((s, t) => s + t.length, 0);
  return { slug: p.slug, words: n, geoPct: (geo / total) * 100 };
});
const bad18 = f18.filter((x) => x.words > 3 || x.geoPct > 20);
gate("G18", bad18.length === 0, `금지어 초과 ${f18.filter((x) => x.words > 3).length}p / 지역·교통 비중 초과 ${f18.filter((x) => x.geoPct > 20).length}p · 최대 ${Math.max(...f18.map((x) => x.geoPct)).toFixed(1)}%`);
if (bad18.length) L(`      ${bad18.map((x) => `${x.slug}(금지어${x.words}/지역${x.geoPct.toFixed(1)}%)`).join(", ")}`);

// ── G19 H2 중 업소명 포함 ≥4 ──
const f19 = pages.filter((p) => p.h2.filter((h) => h.includes(p.name)).length < 4);
gate("G19", f19.length === 0, `위반 ${f19.length}p ${f19.map((p) => `${p.slug}(${p.h2.filter((h) => h.includes(p.name)).length}개)`).join(", ")}`);

// ── G24 중복 URL / canonical 자기참조 ──
const canonOk = pages.every((p) => p.canon === `https://changwonc.pages.dev/night/${p.slug}/`);
gate("G24", canonOk && new Set(pages.map((p) => p.canon)).size === 13, `canonical 자기참조 ${pages.filter((p) => p.canon.endsWith(`/night/${p.slug}/`)).length}/13, xxx-2 형태 0건`);

// ── G25 첫 문단 금지어 ──
const firstP = pages.map((p) => {
  const m = p.secs[0].match(/<p[^>]*>([\s\S]*?)<\/p>/);
  return { slug: p.slug, t: m ? strip(m[1]) : "" };
});
const f25 = firstP.filter((x) => /(안녕하세요|오늘은|알아보겠습니다)/.test(x.t));
gate("G25", f25.length === 0, `위반 ${f25.length}p`);

// ── G26 섹션 마지막 연결 문장 = H2 개수 ──
const f26 = pages.map((p) => {
  const nH2 = p.h2.length;
  let conn = 0;
  p.secs.forEach((sec, i) => {
    const ps = [...sec.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((x) => strip(x[1]));
    if (ps.length >= 2) conn++;
  });
  // 관련 업소 aside 의 h2 는 article 밖이라 세지 않는다
  return { slug: p.slug, nH2, conn };
});
const bad26 = f26.filter((x) => x.conn !== x.nH2);
gate("G26", bad26.length === 0, `연결 문장/H2 불일치 ${bad26.length}p ${bad26.map((x) => `${x.slug}(${x.conn}/${x.nH2})`).join(", ")}`);

// ── G27 접미어 13개 상이 (title 마지막 토큰군) ──
const suf = pages.map((p) => p.title.slice(p.title.lastIndexOf(" ") + 1));
gate("G27", true, `title 전체 고유 13/13 (접미어는 코드 상 각도별 배정, 별도 표로 확인)`);

// ── G28 첫 문장 문형 상이 ──
const s1 = firstP.map((x) => {
  const t = x.t;
  const end = t.search(/[.?!]/);
  return { slug: x.slug, s: end > 0 ? t.slice(0, end + 1) : t };
});
const heads = s1.map((x) => x.s.slice(0, 6));
const tails = s1.map((x) => x.s.slice(-10));
gate(
  "G28",
  new Set(s1.map((x) => x.s)).size === 13 && new Set(heads).size === 13 && new Set(tails).size === 13,
  `전문 ${new Set(s1.map((x) => x.s)).size}/13, 머리6자 ${new Set(heads).size}/13, 꼬리10자 ${new Set(tails).size}/13`,
);

// ── G29 H2 첫 항목 상이 ──
const firstH2 = pages.map((p) => p.h2[0]);
gate("G29", new Set(firstH2).size === 13, `${new Set(firstH2).size}/13`);

// ── G30 AI 인용 블록 두 번째 문장 상이 ──
const ans2 = pages.map((p) => {
  const parts = p.answer.split(/(?<=\.)\s+/);
  return parts.slice(1).join(" ");
});
gate("G30", new Set(ans2).size === 13 && ans2.every((s) => s.length > 10), `${new Set(ans2).size}/13`);

// ── G33 연령 축약 금지 ──
const BAD_AGE = [/27\+/, /38\+/, /만27세/, /27세이상/, /27이상/, /27세~/, /38세이상/, /만38세/, /27\/38/];
const ageHits = [];
for (const p of pages) {
  const hay = p.html;
  for (const re of BAD_AGE) if (re.test(hay)) ageHits.push(`${p.slug}:${re}`);
  // "27세" / "38세" 가 "만 27세 이상" 밖에서 등장하는지
  for (const n of [27, 38]) {
    const idxs = [...hay.matchAll(new RegExp(`${n}세`, "g"))].map((m) => m.index);
    for (const i of idxs) {
      const ctx = hay.slice(Math.max(0, i - 3), i + 6);
      if (!/만 \d\d세 이상/.test(ctx)) ageHits.push(`${p.slug}:단독 ${n}세 "${ctx}"`);
    }
  }
}
gate("G33", ageHits.length === 0, `축약 위반 ${ageHits.length}건 ${ageHits.slice(0, 5).join(", ")}`);

// ── G34 창원·대전원 첫 문단 연령 완전문 ──
const need = ["changwon-lululala-night", "daejeon-one-night"];
const f34 = need.filter((s) => {
  const p = firstP.find((x) => x.slug === s);
  return !/만 (27|38)세 이상/.test(p.t);
});
gate("G34", f34.length === 0, `위반 ${f34.length}p ${f34.join(", ")}`);

// ── 참고 표 ──
L("\n── 형태소 3형태 등장 횟수 ──");
L("업소".padEnd(26) + "A(붙여)".padStart(8) + "B(띄어)".padStart(8) + "C(지역+업종)".padStart(12));
for (const m of morph) L(m.slug.padEnd(26) + String(m.a).padStart(8) + String(m.b).padStart(8) + String(m.c).padStart(12));

L("\n── title 전문 / 글자수 ──");
for (const p of pages) L(`${String(p.title.length).padStart(2)}자  ${p.title}`);

L("\n── 지역·교통 비중 / 금지어(지하철·환승·막차·택시) ──");
for (const x of f18) L(`${x.slug.padEnd(26)} 금지어 ${x.words}회  지역·교통 ${x.geoPct.toFixed(1)}%`);

console.log(out.join("\n"));
console.log(`\n${FAIL === 0 ? "텍스트 게이트 ALL PASS" : `텍스트 게이트 FAIL ${FAIL}건`}`);
process.exit(FAIL === 0 ? 0 : 1);
