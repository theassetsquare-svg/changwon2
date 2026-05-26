#!/usr/bin/env node
// 모든 페이지에서 핵심 키워드 밀도를 측정하고 임계 초과시 경고.
// 빌드된 out/ 디렉토리 기반.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const OUT = resolve(process.cwd(), "out");
if (!existsSync(OUT)) {
  console.error("out/ 폴더가 없습니다. 먼저 `next build`를 실행하세요.");
  process.exit(1);
}

const KEYWORDS = [
  "창원 룰루랄라 나이트",
  "창원 룰루랄라",
  "룰루랄라 나이트",
  "짱구",
  "상남동 나이트",
  "창원 나이트",
];

const THRESHOLD = 0.03; // 3% 초과시 스터핑 경고

function walk(dir, list = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, list);
    else if (f.endsWith(".html")) list.push(p);
  }
  return list;
}

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ");
}

let warn = 0;
const files = walk(OUT);
for (const f of files) {
  const html = readFileSync(f, "utf8");
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) {
    console.log(`SKIP (noindex) ${f.replace(OUT, "")}`);
    continue;
  }
  const text = strip(html);
  const tokens = text.match(/[가-힯]+|[A-Za-z0-9]+/g) || [];
  const total = tokens.length;
  if (total < 50) continue;
  const rel = f.replace(OUT, "");
  console.log(`\n${rel}  (${total} tokens)`);
  for (const kw of KEYWORDS) {
    const re = new RegExp(kw.replace(/\s+/g, "\\s+"), "g");
    const hits = (text.match(re) || []).length;
    const kwTokens = kw.split(/\s+/).length;
    const density = (hits * kwTokens) / total;
    const flag = density > THRESHOLD ? " ⚠️ 스터핑 의심" : "";
    console.log(`  "${kw}": ${hits}회 · 밀도 ${(density * 100).toFixed(2)}%${flag}`);
    if (density > THRESHOLD) warn++;
  }
}

if (warn > 0) {
  console.error(`\n경고: ${warn}건 임계(${THRESHOLD * 100}%) 초과`);
  process.exit(2);
}
console.log("\n키워드 밀도 정상 범위");
