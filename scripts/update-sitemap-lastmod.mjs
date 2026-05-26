#!/usr/bin/env node
// 매일 sitemap.xml의 lastmod를 오늘 날짜(KST)로 갱신.
// node scripts/update-sitemap-lastmod.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const FILE = resolve(process.cwd(), "public/sitemap.xml");
const FEED = resolve(process.cwd(), "public/feed.xml");

const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
const today = kst.toISOString().slice(0, 10); // YYYY-MM-DD (KST)
const rfc = kst.toUTCString().replace("GMT", "+0900");

let xml = readFileSync(FILE, "utf8");
const before = xml;
xml = xml.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
if (xml !== before) {
  writeFileSync(FILE, xml);
  console.log(`[sitemap] lastmod -> ${today}`);
} else {
  console.log("[sitemap] no change");
}

let feed = readFileSync(FEED, "utf8");
const fbefore = feed;
feed = feed
  .replace(/<pubDate>[^<]*<\/pubDate>/g, `<pubDate>${rfc}</pubDate>`)
  .replace(/<lastBuildDate>[^<]*<\/lastBuildDate>/g, `<lastBuildDate>${rfc}</lastBuildDate>`);
if (feed !== fbefore) {
  writeFileSync(FEED, feed);
  console.log(`[feed] dates -> ${rfc}`);
}
