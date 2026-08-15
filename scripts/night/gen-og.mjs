#!/usr/bin/env node
// /night/ 13개 업소 + 목록 페이지의 OG 썸네일(1200x1200 정사각 PNG)을 생성한다.
// 실내/인물 사진은 만들지 않고 텍스트 기반 브랜드 카드만 렌더한다.
// 렌더: 시스템 chromium 헤드리스 스크린샷 → sharp 로 정확히 1200x1200 크롭 + 300KB 이하 압축.
// 사용: node scripts/night/gen-og.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT_DIR = join(ROOT, "public/og");
const WORK = join(tmpdir(), "night-og-build");
const FONT_DIR = join(process.env.HOME ?? "/home/user", ".fonts");
const BRAND = "changwona.pages.dev"; // 실제 사이트 식별자. 타 업소 카드에 창원 상호를 쓰면 제휴 오인 소지가 있어 도메인을 브랜드로 쓴다.
const SIZE = 1200;
const MAX_KB = 300;

// ── 명도대비 계산 (WCAG) ──
const srgb = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = (hex) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// venues.ts 를 직접 import 할 수 없으므로(TS) 필요한 필드만 파싱한다.
const src = readFileSync(join(ROOT, "lib/night/venues.ts"), "utf8");
const blocks = src.split(/\n  \{\n    slug: "/).slice(1);
const cards = blocks.map((b) => {
  const pick = (k) => {
    const m = b.match(new RegExp(`${k}: "((?:[^"\\\\]|\\\\.)*)"`));
    return m ? m[1] : "";
  };
  const og = b.match(/og: \{ bg: "([^"]+)", bg2: "([^"]+)", fg: "([^"]+)", accent: "([^"]+)" \}/);
  if (!og) throw new Error("og 색상 파싱 실패");
  return {
    slug: b.slice(0, b.indexOf('"')),
    name: pick("name"),
    region: pick("region"),
    badge: pick("ageBadge"),
    bg: og[1],
    bg2: og[2],
    accent: og[4],
  };
});
if (cards.length !== 13) throw new Error(`업소 13개가 아님: ${cards.length}`);

// 13개 배경색이 전부 다른지 + 흰 글자와 대비 4.5:1 이상인지 검증
const bgSet = new Set(cards.map((c) => c.bg));
if (bgSet.size !== 13) throw new Error(`배경색 중복: 고유 ${bgSet.size}종`);
for (const c of cards) {
  for (const bg of [c.bg, c.bg2]) {
    const r = contrast("#ffffff", bg);
    if (r < 4.5) throw new Error(`${c.slug} 대비 부족: ${bg} vs #fff = ${r.toFixed(2)}:1`);
  }
}

const listCard = {
  slug: "index",
  name: "전국 나이트 안내",
  region: "서울 · 경기 · 충청 · 영남 13곳",
  badge: "",
  bg: "#1b0630",
  bg2: "#0b0410",
  accent: "#ff2ea6",
};

rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });
for (const [dst, srcName] of [
  ["bhs.ttf", "BlackHanSans.ttf"],
  ["noto900.ttf", "NotoSansKR900.ttf"],
]) {
  const p = join(FONT_DIR, srcName);
  if (!existsSync(p)) throw new Error(`한글 폰트 없음: ${p}`);
  copyFileSync(p, join(WORK, dst));
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function html(c) {
  // 좌우 여백 100px 이상 확보(=본문 폭 1000px). 2줄까지 자동 줄바꿈.
  const n = Math.max(c.name.length, 1);
  const titleSize = n <= 6 ? 176 : n <= 8 ? 148 : n <= 9 ? 132 : 118;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
@font-face{font-family:'BHS';src:url(bhs.ttf) format('truetype');}
@font-face{font-family:'NotoK';src:url(noto900.ttf) format('truetype');font-weight:900;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${SIZE}px;height:${SIZE + 200}px;overflow:hidden;background:${c.bg2};}
.card{position:absolute;top:0;left:0;width:${SIZE}px;height:${SIZE}px;overflow:hidden;
 background:radial-gradient(circle at 14% 6%, ${c.accent}55, transparent 46%),
   radial-gradient(circle at 88% 97%, ${c.accent}38, transparent 50%),
   linear-gradient(150deg, ${c.bg} 0%, ${c.bg2} 100%);
 color:#fff;font-family:'NotoK',sans-serif;}
.frame{position:absolute;inset:36px;border:4px solid ${c.accent}88;border-radius:44px;}
${c.badge ? `.badge{position:absolute;top:86px;right:86px;background:#ffd400;color:#111;
 font-family:'NotoK';font-weight:900;font-size:40px;letter-spacing:1px;
 padding:12px 34px 17px;border-radius:999px;}` : ""}
.title{position:absolute;left:100px;right:100px;top:34%;transform:translateY(-50%);
 font-family:'BHS';font-size:${titleSize}px;line-height:1.12;color:#fff;text-align:center;
 word-break:keep-all;text-shadow:0 0 46px ${c.accent}bb, 0 6px 0 rgba(0,0,0,.3);}
.region{position:absolute;left:100px;right:100px;top:68%;text-align:center;
 font-family:'NotoK';font-weight:900;font-size:46px;letter-spacing:3px;color:#fff;}
.brand{position:absolute;left:0;right:0;bottom:92px;text-align:center;
 font-family:'NotoK';font-weight:900;font-size:32px;letter-spacing:3px;color:#ffffffcc;}
</style></head><body><div class="card">
<div class="frame"></div>
${c.badge ? `<div class="badge">${esc(c.badge)}</div>` : ""}
<div class="title">${esc(c.name)}</div>
<div class="region">${esc(c.region)}</div>
<div class="brand">${BRAND}</div>
</div></body></html>`;
}

let maxKb = 0;
for (const c of [...cards, listCard]) {
  const page = join(WORK, `${c.slug}.html`);
  const raw = join(WORK, `${c.slug}.raw.png`);
  writeFileSync(page, html(c));
  execFileSync(
    "chromium",
    [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      // 뷰포트가 요청보다 작게 잡히는 환경이 있어 여유를 두고 찍은 뒤 좌상단 1200x1200 을 정확히 잘라낸다.
      `--window-size=${SIZE},${SIZE + 200}`,
      `--screenshot=${raw}`,
      page,
    ],
    { stdio: "ignore" },
  );
  const rawMeta = await sharp(raw).metadata();
  if ((rawMeta.width ?? 0) < SIZE || (rawMeta.height ?? 0) < SIZE) {
    throw new Error(`${c.slug} 원본이 작음: ${rawMeta.width}x${rawMeta.height}`);
  }
  const out = join(OUT_DIR, `${c.slug}-og.png`);
  await sharp(raw)
    .extract({ left: 0, top: 0, width: SIZE, height: SIZE })
    .png({ compressionLevel: 9, palette: true, colors: 128, dither: 0.6 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  if (meta.width !== SIZE || meta.height !== SIZE) throw new Error(`${c.slug} 해상도 오류`);
  const kb = readFileSync(out).length / 1024;
  maxKb = Math.max(maxKb, kb);
  if (kb > MAX_KB) throw new Error(`${c.slug} 용량 초과 ${kb.toFixed(0)}KB`);

  // 하단 여백이 흰색으로 남지 않았는지(뷰포트 어긋남) 검사
  const { data, info } = await sharp(out).raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const [r, g, b] = px(Math.floor(SIZE / 2), SIZE - 3);
  if (r > 200 && g > 200 && b > 200) throw new Error(`${c.slug} 하단 흰 여백 감지`);
  // 글자가 실제로 그려졌는지(=폰트 깨짐/미로딩 아님) 밝은 픽셀 비율로 확인
  let bright = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i] > 210 && data[i + 1] > 210 && data[i + 2] > 210) bright++;
  }
  const ratio = bright / (info.width * info.height);
  if (ratio < 0.012) throw new Error(`${c.slug} 글자 렌더 실패 의심 (밝은 픽셀 ${(ratio * 100).toFixed(2)}%)`);

  console.log(`✓ ${(c.slug + "-og.png").padEnd(32)} ${meta.width}x${meta.height}  ${kb.toFixed(0).padStart(3)}KB  bg ${c.bg}  글자 ${(ratio * 100).toFixed(1)}%`);
}
rmSync(WORK, { recursive: true, force: true });
console.log(`\n생성 완료 · 배경색 고유 ${bgSet.size}/13종 · 최대 ${maxKb.toFixed(0)}KB (상한 ${MAX_KB}KB)`);
