#!/usr/bin/env node
// 13개 업소 페이지 본문의 한글 순수 글자수 + 78쌍 5-gram 자카드 유사도 측정.
// 도어웨이 판정 회피 검증용. node scripts/night/similarity.mjs
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../../lib/night/venues.ts", import.meta.url), "utf8");

// TS를 파싱하지 않고 문자열 리터럴 단위로 각 업소 블록을 잘라낸다.
const blocks = src.split(/\n  \{\n    slug: "/).slice(1);
if (blocks.length !== 13) {
  console.error(`업소 블록 파싱 실패: ${blocks.length}개`);
  process.exit(1);
}

const docs = blocks.map((b) => {
  const slug = b.slice(0, b.indexOf('"'));
  // answer / body / h2 / faq 의 한글 문장만 수집 (본문에 해당하는 텍스트)
  const texts = [];
  const answer = b.match(/answer:\s*\n?\s*"((?:[^"\\]|\\.)*)"/);
  if (answer) texts.push(answer[1]);
  for (const m of b.matchAll(/h2: "((?:[^"\\]|\\.)*)"/g)) texts.push(m[1]);
  const sectionsPart = b.slice(b.indexOf("sections:"), b.indexOf("faq:"));
  for (const m of sectionsPart.matchAll(/"((?:[^"\\]|\\.)*)"/g)) texts.push(m[1]);
  const body = texts.join(" ");
  const hangulOnly = body.replace(/[^가-힣]/g, "");
  return { slug, body, hangul: hangulOnly.length };
});

// 5-gram: 한글/숫자/영문만 남긴 뒤 문자 5-gram 집합
function grams(s) {
  const t = s.replace(/[^가-힣0-9a-zA-Z]/g, "");
  const set = new Set();
  for (let i = 0; i + 5 <= t.length; i++) set.add(t.slice(i, i + 5));
  return set;
}

const G = docs.map((d) => grams(d.body));

console.log("── 본문 한글 순수 글자수 ──");
let under = 0;
for (const d of docs) {
  const ok = d.hangul >= 1500;
  if (!ok) under++;
  console.log(`${ok ? "✓" : "✗"} ${d.slug.padEnd(28)} ${d.hangul}자`);
}

let max = 0;
let sum = 0;
let cnt = 0;
let worst = "";
const over = [];
for (let i = 0; i < 13; i++) {
  for (let j = i + 1; j < 13; j++) {
    const a = G[i];
    const b = G[j];
    let inter = 0;
    for (const g of a) if (b.has(g)) inter++;
    const uni = a.size + b.size - inter;
    const jac = uni ? inter / uni : 0;
    sum += jac;
    cnt++;
    if (jac > max) {
      max = jac;
      worst = `${docs[i].slug} ↔ ${docs[j].slug}`;
    }
    if (jac >= 0.1) over.push(`${docs[i].slug} ↔ ${docs[j].slug} = ${(jac * 100).toFixed(2)}%`);
  }
}

console.log(`\n── 5-gram 자카드 유사도 (${cnt}쌍) ──`);
console.log(`최대값: ${(max * 100).toFixed(2)}%  (${worst})`);
console.log(`평균값: ${((sum / cnt) * 100).toFixed(2)}%`);
console.log(`10% 이상 쌍: ${over.length}건`);
over.forEach((o) => console.log("  ✗ " + o));

const fail = under > 0 || over.length > 0;
console.log(`\n${fail ? "FAIL" : "PASS"} — 1500자 미만 ${under}건 / 유사도 초과 ${over.length}건`);
process.exit(fail ? 1 : 0);
