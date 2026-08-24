#!/usr/bin/env node
// /booking/ 40개 업소 + 허브 + 홈 썸네일 OG 카드(1200x1200 PNG)를 생성한다.
// 텍스트 기반 브랜드 카드만 만든다. 실내/인물 사진은 생성하지 않는다.
//
//  · 배경: 딥 퍼플 그라데이션 + 핑크 포인트, 라운드 프레임
//  · A그룹(광고주 있음): 하단 검은 띠에 담당 닉네임 + 전화번호
//  · B그룹: 업소명 + 지역 + 브랜드 도메인. 전화번호/besta12 문자열 없음
//  · 홈(og-square.png): 배경 단색 딥 퍼플, "로또 010-7528-4936" 최대 크기
//
// 사용: node scripts/booking/gen-og.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, copyFileSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT_DIR = join(ROOT, "public/og");
const WORK = join(tmpdir(), "booking-og-build");
const FONT_DIR = join(process.env.HOME ?? "/home/user", ".fonts");
const BRAND = "i.nolcool.com";
const SIZE = 1200;

// venues-*.ts 에서 카드에 필요한 필드만 파싱한다(TS 직접 import 불가).
const cards = [];
for (const f of ["venues-1.ts", "venues-2.ts", "venues-3.ts", "venues-4.ts"]) {
  const src = readFileSync(join(ROOT, "lib/booking", f), "utf8");
  for (const b of src.split(/\n  \{\n    slug: "/).slice(1)) {
    const pick = (k) => {
      const m = b.match(new RegExp(`\\n    ${k}: "((?:[^"\\\\]|\\\\.)*)"`));
      return m ? m[1] : "";
    };
    const og = b.match(/og: \{ bg: "([^"]+)", bg2: "([^"]+)" \}/);
    const c = b.match(/contact: \{ nick: "([^"]+)", phone: "([^"]+)"/);
    cards.push({
      slug: b.slice(0, b.indexOf('"')),
      name: pick("name"),
      region: pick("region"),
      badge: pick("ageBadge"),
      group: pick("group"),
      nick: c ? c[1] : "",
      phone: c ? c[2] : "",
      bg: og ? og[1] : "#2a0a4a",
      bg2: og ? og[2] : "#0b0410",
    });
  }
}
if (cards.length !== 40) throw new Error(`업소 40개가 아님: ${cards.length}`);
for (const c of cards) {
  if (c.badge && !/^만 \d\d세 이상$/.test(c.badge))
    throw new Error(`연령 배지 형식 위반: ${c.slug} "${c.badge}"`);
}
if (new Set(cards.map((c) => c.bg)).size < 30)
  throw new Error(`배경색 다양성 부족: 고유 ${new Set(cards.map((c) => c.bg)).size}종`);

cards.push({
  slug: "index",
  name: "전국 나이트 부킹 안내",
  region: "부킹 흐름과 매너 · 40곳",
  badge: "",
  group: "B",
  nick: "",
  phone: "",
  bg: "#3a0b5e",
  bg2: "#0b0410",
});

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
const PINK = "#ff2ea6";

const FONTS = `
@font-face{font-family:'BHS';src:url(bhs.ttf) format('truetype');}
@font-face{font-family:'NotoK';src:url(noto900.ttf) format('truetype');font-weight:900;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${SIZE}px;height:${SIZE}px;overflow:hidden;}`;

function venueHtml(c) {
  const isA = c.group === "A";
  const titleSize = Math.max(78, Math.min(150, Math.floor(1020 / Math.max(c.name.length, 1))));
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${FONTS}
.card{position:absolute;inset:0;overflow:hidden;color:#fff;font-family:'NotoK',sans-serif;
 background:${c.bg};}
.deco{position:absolute;left:0;right:0;bottom:0;height:190px;background:${c.bg2};}
.frame{position:absolute;inset:38px;border:4px solid ${PINK};border-radius:46px;}
.kicker{position:absolute;left:0;right:0;top:${isA ? 132 : 176}px;text-align:center;
 font-family:'NotoK';font-weight:900;font-size:38px;letter-spacing:8px;color:${PINK};}
.title{position:absolute;left:90px;right:90px;top:${isA ? "31%" : "40%"};transform:translateY(-50%);
 font-family:'BHS';font-size:${titleSize}px;line-height:1.14;text-align:center;word-break:keep-all;
 text-shadow:0 5px 0 rgba(0,0,0,.35);}
.region{position:absolute;left:90px;right:90px;top:${isA ? "50%" : "63%"};text-align:center;
 font-family:'NotoK';font-weight:900;font-size:42px;letter-spacing:2px;color:#ffffffdd;}
${c.badge ? `.badge{position:absolute;top:78px;right:78px;background:#ffd400;color:#111;
 font-family:'NotoK';font-weight:900;font-size:36px;padding:11px 28px 16px;border-radius:999px;white-space:nowrap;}` : ""}
${isA
      ? `.band{position:absolute;left:0;right:0;top:720px;height:480px;background:#000;}
.nick{position:absolute;left:0;right:0;top:772px;text-align:center;font-family:'NotoK';font-weight:900;
 font-size:92px;line-height:1;color:#fff;}
.phone{position:absolute;left:40px;right:40px;top:930px;text-align:center;font-family:'NotoK';font-weight:900;
 font-size:132px;line-height:1;color:#fff;white-space:nowrap;letter-spacing:-3px;}`
      : `.brand{position:absolute;left:0;right:0;bottom:96px;text-align:center;font-family:'NotoK';
 font-weight:900;font-size:32px;letter-spacing:3px;color:#ffffffbb;}`}
</style></head><body><div class="card">
<div class="deco"></div><div class="frame"></div>
${c.badge ? `<div class="badge">${esc(c.badge)}</div>` : ""}
<div class="kicker">BOOKING</div>
<div class="title">${esc(c.name)}</div>
<div class="region">${esc(c.region)}</div>
${isA
      ? `<div class="band"></div><div class="nick">${esc(c.nick)}</div><div class="phone">${esc(c.phone)}</div>`
      : `<div class="brand">${BRAND}</div>`}
</div></body></html>`;
}

/** 홈 썸네일: 배경 단색 딥 퍼플, 전화번호 최대 크기 */
function homeHtml() {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${FONTS}
.card{position:absolute;inset:0;background:#2b0a52;color:#fff;font-family:'NotoK',sans-serif;}
.frame{position:absolute;inset:40px;border:5px solid ${PINK};border-radius:48px;}
.brandname{position:absolute;left:70px;right:70px;top:150px;text-align:center;font-family:'BHS';
 font-size:96px;line-height:1.1;color:#fff;text-shadow:0 0 40px ${PINK}aa;}
.sub{position:absolute;left:70px;right:70px;top:300px;text-align:center;font-family:'NotoK';
 font-weight:900;font-size:40px;letter-spacing:4px;color:#ffb9e0;}
.nick{position:absolute;left:0;right:0;top:430px;text-align:center;font-family:'BHS';
 font-size:220px;line-height:1;color:#ffd400;}
.phone{position:absolute;left:24px;right:24px;top:700px;text-align:center;font-family:'NotoK';
 font-weight:900;font-size:186px;line-height:1;color:#fff;white-space:nowrap;letter-spacing:-6px;}
.age{position:absolute;left:0;right:0;bottom:110px;text-align:center;font-family:'NotoK';
 font-weight:900;font-size:38px;color:#ffffffcc;}
</style></head><body><div class="card">
<div class="frame"></div>
<div class="brandname">창원룰루랄라나이트</div>
<div class="sub">예약 · 부킹 · 룸 문의</div>
<div class="nick">로또</div>
<div class="phone">010-7528-4936</div>
<div class="age">만 27세 이상 입장 · 매일 19:00 ~ 05:00</div>
</div></body></html>`;
}

function shot(name, html, outPath) {
  const page = join(WORK, `${name}.html`);
  writeFileSync(page, html);
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
      `--window-size=${SIZE},${SIZE}`,
      `--screenshot=${outPath}`,
      page,
    ],
    { stdio: "ignore" },
  );
  if (!existsSync(outPath)) throw new Error(`렌더 실패: ${outPath}`);
  return statSync(outPath).size;
}

let total = 0;
for (const c of cards) {
  const out = join(OUT_DIR, `booking-${c.slug}-og.png`);
  const kb = Math.round(shot(`booking-${c.slug}`, venueHtml(c), out) / 1024);
  total += kb;
  console.log(`${String(kb).padStart(4)}KB  ${out.replace(ROOT + "/", "")}`);
}
const homeOut = join(ROOT, "public/images/og-square.png");
const homeKb = Math.round(shot("home-square", homeHtml(), homeOut) / 1024);
console.log(`${String(homeKb).padStart(4)}KB  public/images/og-square.png (홈 썸네일)`);
console.log(`\n총 ${cards.length + 1}장 / 평균 ${Math.round(total / cards.length)}KB`);
