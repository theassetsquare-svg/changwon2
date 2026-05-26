#!/usr/bin/env node
// IndexNow 일괄 핑 (Bing/Yandex/IndexNow 통합 엔드포인트).
// 사용법: node scripts/ping-indexnow.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const HOST = "changwon2.pages.dev";
const KEY_TXT = readdirSync(resolve(process.cwd(), "public"))
  .find((f) => f.endsWith(".txt") && /^[0-9a-f]{32}\.txt$/i.test(f));

if (!KEY_TXT) {
  console.error("IndexNow 키 파일(public/{32hex}.txt)을 찾을 수 없습니다.");
  process.exit(1);
}
const KEY = KEY_TXT.replace(".txt", "");
const KEY_LOC = `https://${HOST}/${KEY_TXT}`;

const SITEMAP = readFileSync(resolve(process.cwd(), "public/sitemap.xml"), "utf8");
const URLS = Array.from(SITEMAP.matchAll(/<loc>([^<]+)<\/loc>/g))
  .map((m) => m[1])
  .filter((u) => /^https?:\/\/changwon2\.pages\.dev\//.test(u));

if (URLS.length === 0) {
  console.error("URL을 찾지 못했습니다.");
  process.exit(1);
}

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOC,
  urlList: URLS,
};

const endpoints = [
  "https://api.indexnow.org/IndexNow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

for (const url of endpoints) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    console.log(`[indexnow] ${url} -> ${res.status}`);
  } catch (e) {
    console.error(`[indexnow] ${url} -> ERROR ${e.message}`);
  }
}

// Google sitemap ping (legacy but harmless)
try {
  const r = await fetch(
    "https://www.google.com/ping?sitemap=" +
      encodeURIComponent(`https://${HOST}/sitemap.xml`),
  );
  console.log(`[google ping] ${r.status}`);
} catch (e) {
  console.error(`[google ping] ERROR ${e.message}`);
}

console.log(`[indexnow] total ${URLS.length} URLs submitted`);
