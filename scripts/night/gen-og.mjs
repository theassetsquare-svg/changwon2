#!/usr/bin/env node
// /night/ 13개 업소 + 목록 페이지의 OG 썸네일(1200x1200 정사각 PNG)을 생성한다.
// 실내/인물 사진은 만들지 않고 텍스트 기반 브랜드 카드만 렌더한다.
//
// A그룹(광고주 있음): 하단 60~100% 에 불투명 검은 띠 → 담당 닉네임(1줄) + 전화번호(2줄).
//   · 전화번호 글자 높이 ≥ 100px, 좌우 잘림 없음 — PNG 픽셀에서 실측하고 미달이면 재렌더.
// B그룹: 업소명 + 지역 + 사이트 브랜드명. 전화번호/besta12 문자열 없음.
// 연령 배지(창원·대전원)는 "만 27세 이상" / "만 38세 이상" 완전문만 사용한다.
//
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
const BRAND = "i.nolcool.com";
const SIZE = 1200;
const MAX_KB = 300;
const BAND_TOP = Math.round(SIZE * 0.6); // 720
const SAFE_L = 40;
const SAFE_R = SIZE - 40;
const MIN_PHONE_H = 100;

// ── 명도대비 (WCAG) ──
const srgb = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lumRGB = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const lumHex = (hex) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return lumRGB(r, g, b);
};
const ratio = (l1, l2) => {
  const [x, y] = [l1, l2].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// venues.ts 를 직접 import 할 수 없으므로(TS) 필요한 필드만 파싱한다.
const src = readFileSync(join(ROOT, "lib/night/venues.ts"), "utf8");
const blocks = src.split(/\n  \{\n    slug: "/).slice(1);
const cards = blocks.map((b) => {
  const pick = (k) => {
    const m = b.match(new RegExp(`\\n    ${k}: "((?:[^"\\\\]|\\\\.)*)"`));
    return m ? m[1] : "";
  };
  const og = b.match(/og: \{ bg: "([^"]+)", bg2: "([^"]+)", fg: "([^"]+)", accent: "([^"]+)" \}/);
  if (!og) throw new Error("og 색상 파싱 실패");
  const c = b.match(/contact: \{ nick: "([^"]+)", phone: "([^"]+)"/);
  return {
    slug: b.slice(0, b.indexOf('"')),
    name: pick("name"),
    region: pick("region"),
    badge: pick("ageBadge"),
    group: pick("group"),
    nick: c ? c[1] : "",
    phone: c ? c[2] : "",
    bg: og[1],
    bg2: og[2],
    accent: og[4],
  };
});
if (cards.length !== 13) throw new Error(`업소 13개가 아님: ${cards.length}`);

// 연령 축약 표기가 배지에 섞이지 않았는지 (G33)
for (const c of cards) {
  if (c.badge && !/^만 \d\d세 이상$/.test(c.badge)) throw new Error(`연령 배지 형식 위반: ${c.slug} "${c.badge}"`);
}
// 배경색 13개 상이 + 흰 글자 대비 4.5:1 이상
const bgSet = new Set(cards.map((c) => c.bg));
if (bgSet.size !== 13) throw new Error(`배경색 중복: 고유 ${bgSet.size}종`);
for (const c of cards) {
  for (const bg of [c.bg, c.bg2]) {
    const r = ratio(lumHex("#ffffff"), lumHex(bg));
    if (r < 4.5) throw new Error(`${c.slug} 대비 부족: ${bg} vs #fff = ${r.toFixed(2)}:1`);
  }
}

const listCard = {
  slug: "index",
  name: "전국 나이트 안내",
  region: "서울 · 경기 · 충청 · 영남 13곳",
  badge: "",
  group: "B",
  nick: "",
  phone: "",
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

function html(c, phoneSize) {
  const isA = c.group === "A";
  const n = Math.max(c.name.length, 1);
  // A그룹은 상단 55% 안에서만 제목을 쓰므로 조금 작게 잡는다.
  const base = n <= 6 ? 176 : n <= 8 ? 148 : n <= 9 ? 132 : 118;
  const titleSize = isA ? Math.round(base * 0.88) : base;
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
${c.badge ? `.badge{position:absolute;top:80px;right:80px;background:#ffd400;color:#111;
 font-family:'NotoK';font-weight:900;font-size:38px;letter-spacing:0px;
 padding:12px 30px 17px;border-radius:999px;white-space:nowrap;}` : ""}
.title{position:absolute;left:100px;right:100px;top:${isA ? "27%" : "34%"};transform:translateY(-50%);
 font-family:'BHS';font-size:${titleSize}px;line-height:1.12;color:#fff;text-align:center;
 word-break:keep-all;text-shadow:0 0 46px ${c.accent}bb, 0 6px 0 rgba(0,0,0,.3);}
.region{position:absolute;left:100px;right:100px;top:${isA ? "50%" : "68%"};text-align:center;
 font-family:'NotoK';font-weight:900;font-size:${isA ? 44 : 46}px;letter-spacing:3px;color:#fff;}
${isA ? `.band{position:absolute;left:0;right:0;top:${BAND_TOP}px;height:${SIZE - BAND_TOP}px;background:#000;}
.nick{position:absolute;left:0;right:0;top:${BAND_TOP + 52}px;text-align:center;
 font-family:'NotoK';font-weight:900;font-size:96px;line-height:1;color:#fff;}
.phone{position:absolute;left:${SAFE_L}px;right:${SAFE_L}px;top:${BAND_TOP + 210}px;text-align:center;
 font-family:'NotoK';font-weight:900;font-size:${phoneSize}px;line-height:1;color:#fff;
 white-space:nowrap;letter-spacing:-2px;}`
      : `.brand{position:absolute;left:0;right:0;bottom:92px;text-align:center;
 font-family:'NotoK';font-weight:900;font-size:32px;letter-spacing:3px;color:#ffffffcc;}`}
</style></head><body><div class="card">
<div class="frame"></div>
${c.badge ? `<div class="badge">${esc(c.badge)}</div>` : ""}
<div class="title">${esc(c.name)}</div>
<div class="region">${esc(c.region)}</div>
${isA
      ? `<div class="band"></div><div class="nick">${esc(c.nick)}</div><div class="phone">${esc(c.phone)}</div>`
      : `<div class="brand">${BRAND}</div>`}
</div></body></html>`;
}

function shot(c, phoneSize) {
  const page = join(WORK, `${c.slug}.html`);
  const raw = join(WORK, `${c.slug}.raw.png`);
  writeFileSync(page, html(c, phoneSize));
  execFileSync(
    /* ★ 윈도우에는 PATH 에 chromium 이 없다. 환경변수로 받을 수 있게 한다.
       리눅스에서는 예전과 똑같이 "chromium" 을 쓴다(2026-08-24). */
    process.env.CHROMIUM_BIN || "chromium",
    [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--window-size=${SIZE},${SIZE + 200}`,
      `--screenshot=${raw}`,
      page,
    ],
    { stdio: "ignore" },
  );
  return raw;
}

/** 검은 띠 안의 흰 글자 클러스터를 행 단위로 찾아 bbox 를 반환한다. */
function measureBand(data, info) {
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const rows = [];
  for (let y = BAND_TOP; y < SIZE; y++) {
    let cnt = 0, min = SIZE, max = -1;
    for (let x = 0; x < SIZE; x++) {
      const [r, g, b] = px(x, y);
      if (r > 200 && g > 200 && b > 200) {
        cnt++;
        if (x < min) min = x;
        if (x > max) max = x;
      }
    }
    rows.push({ y, cnt, min, max });
  }
  // 연속된 글자 행 묶음을 클러스터로
  const clusters = [];
  let cur = null;
  for (const r of rows) {
    if (r.cnt > 0) {
      if (!cur) cur = { top: r.y, bottom: r.y, min: r.min, max: r.max, px: r.cnt };
      else {
        cur.bottom = r.y;
        cur.min = Math.min(cur.min, r.min);
        cur.max = Math.max(cur.max, r.max);
        cur.px += r.cnt;
      }
    } else if (cur) {
      clusters.push(cur);
      cur = null;
    }
  }
  if (cur) clusters.push(cur);
  return { clusters, px };
}

let maxKb = 0;
const report = [];

for (const c of [...cards, listCard]) {
  const isA = c.group === "A";
  let phoneSize = 152;
  let out = join(OUT_DIR, `${c.slug}-og.png`);
  let meas = null;

  for (let attempt = 1; attempt <= 6; attempt++) {
    const raw = shot(c, phoneSize);
    const rawMeta = await sharp(raw).metadata();
    if ((rawMeta.width ?? 0) < SIZE || (rawMeta.height ?? 0) < SIZE) {
      throw new Error(`${c.slug} 원본이 작음: ${rawMeta.width}x${rawMeta.height}`);
    }
    await sharp(raw)
      .extract({ left: 0, top: 0, width: SIZE, height: SIZE })
      .png({ compressionLevel: 9, palette: true, colors: 128, dither: 0.6 })
      .toFile(out);

    if (!isA) break;

    const { data, info } = await sharp(out).raw().toBuffer({ resolveWithObject: true });
    const { clusters, px } = measureBand(data, info);
    if (clusters.length < 2) throw new Error(`${c.slug} 검은 띠 글자 클러스터 ${clusters.length}개`);
    const nick = clusters[0];
    const phone = clusters[clusters.length - 1];
    const h = phone.bottom - phone.top + 1;
    const w = phone.max - phone.min + 1;
    const clipped = phone.min <= SAFE_L - 20 || phone.max >= SAFE_R + 20;

    // 띠 배경(글자 없는 지점) vs 흰 글자 대비 실측
    const bandBg = px(8, SIZE - 8);
    let glyph = [0, 0, 0], best = -1;
    for (let y = phone.top; y <= phone.bottom; y++) {
      for (let x = phone.min; x <= phone.max; x++) {
        const [r, g, b] = px(x, y);
        const l = lumRGB(r, g, b);
        if (l > best) { best = l; glyph = [r, g, b]; }
      }
    }
    const contrast = ratio(lumRGB(...glyph), lumRGB(...bandBg));

    meas = { h, w, clipped, contrast, nickH: nick.bottom - nick.top + 1, phoneSize };

    if (h >= MIN_PHONE_H && !clipped && w <= SAFE_R - SAFE_L) break;
    // 너무 작으면 키우고, 넘치면 줄인다.
    if (w > SAFE_R - SAFE_L || clipped) phoneSize = Math.round(phoneSize * ((SAFE_R - SAFE_L) / w) * 0.97);
    else phoneSize = Math.round(phoneSize * (MIN_PHONE_H / h) * 1.06);
    if (attempt === 6) throw new Error(`${c.slug} 전화번호 렌더 조건 미달: ${JSON.stringify(meas)}`);
  }

  const meta = await sharp(out).metadata();
  if (meta.width !== SIZE || meta.height !== SIZE) throw new Error(`${c.slug} 해상도 오류`);
  const kb = readFileSync(out).length / 1024;
  maxKb = Math.max(maxKb, kb);
  if (kb > MAX_KB) throw new Error(`${c.slug} 용량 초과 ${kb.toFixed(0)}KB`);

  const { data, info } = await sharp(out).raw().toBuffer({ resolveWithObject: true });
  let bright = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i] > 210 && data[i + 1] > 210 && data[i + 2] > 210) bright++;
  }
  const brightRatio = bright / (info.width * info.height);
  if (brightRatio < 0.012) throw new Error(`${c.slug} 글자 렌더 실패 의심 (밝은 픽셀 ${(brightRatio * 100).toFixed(2)}%)`);

  // B그룹 카드에 전화번호/besta12 가 절대 들어가지 않도록 소스 단에서 재확인
  if (!isA) {
    const h = html(c, 0);
    if (/besta12/i.test(h) || /01[016-9][- ]?\d{3,4}[- ]?\d{4}/.test(h)) {
      throw new Error(`${c.slug} B그룹 카드에 금지 문자열`);
    }
  }

  report.push({
    slug: c.slug,
    group: c.group,
    kb: kb.toFixed(0),
    bg: c.bg,
    nick: c.nick || "-",
    phone: c.phone || "-",
    phoneH: meas ? meas.h : "-",
    phoneW: meas ? meas.w : "-",
    contrast: meas ? meas.contrast.toFixed(1) : "-",
    clipped: meas ? (meas.clipped ? "잘림" : "없음") : "-",
    badge: c.badge || "-",
    bright: (brightRatio * 100).toFixed(1),
  });
  console.log(
    `✓ ${(c.slug + "-og.png").padEnd(32)} ${meta.width}x${meta.height} ${String(kb.toFixed(0)).padStart(3)}KB  ` +
      (meas
        ? `번호높이 ${String(meas.h).padStart(3)}px 폭 ${String(meas.w).padStart(4)}px 대비 ${meas.contrast.toFixed(1)}:1 ${meas.clipped ? "잘림!" : "잘림없음"}`
        : `B그룹`),
  );
}

rmSync(WORK, { recursive: true, force: true });
writeFileSync(join(ROOT, "scripts/night/.og-report.json"), JSON.stringify(report, null, 2));
console.log(`\n생성 완료 · 배경색 고유 ${bgSet.size}/13종 · 최대 ${maxKb.toFixed(0)}KB (상한 ${MAX_KB}KB)`);
