#!/usr/bin/env node
// H2 규격(페이지당 5~7개)에 맞춰 sections를 병합·재배열한다.
// 흡수되는 섹션의 본문 문단은 모두 대상 섹션 body 뒤에 붙어 유실되지 않는다.
// 한 번만 실행되도록 설계(재실행 시 이미 7개 이하라 no-op).
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../../lib/night/venues.ts", import.meta.url);
let src = readFileSync(FILE, "utf8");

// slug: { merge: {흡수될index: 대상index}, order: [최종 표시 순서(병합 후 남은 원본 index)] }
const PLAN = {
  "bulgwang-hobak-night": { merge: { 7: 1, 6: 4 }, order: [0, 1, 2, 3, 4, 5] },
  "changwon-lululala-night": { merge: { 6: 0, 7: 2 }, order: [0, 1, 2, 3, 4, 8, 5] },
  "ulsan-champion-night": { merge: { 6: 0, 7: 1 }, order: [0, 1, 2, 3, 4, 8, 5] },
  "cheongdam-night": { merge: { 7: 2, 9: 2, 5: 1 }, order: [0, 1, 2, 3, 4, 8, 6] },
  "daejeon-one-night": { merge: { 7: 1, 6: 3 }, order: [0, 1, 2, 3, 4, 8, 5] },
  "sillim-grandprix-night": { merge: { 6: 0, 7: 1 }, order: [0, 1, 2, 3, 4, 8, 5] },
  "sangbong-hangukgwan-night": { merge: { 6: 0, 7: 3, 9: 1 }, order: [0, 1, 2, 3, 4, 8, 5] },
  "suyu-shampoo-night": { merge: { 7: 2, 9: 2, 8: 3, 5: 1 }, order: [0, 1, 2, 3, 4, 10, 6] },
  "busan-asiad-night": { merge: { 6: 0, 8: 1, 9: 4 }, order: [0, 1, 2, 3, 4, 7, 5] },
  "suwon-chance-dome-night": { merge: { 6: 0, 7: 0, 8: 1 }, order: [0, 1, 2, 3, 4, 9, 5] },
  "ansan-hit-night": { merge: { 6: 0, 7: 3, 9: 1 }, order: [0, 1, 2, 3, 4, 8, 5] },
  "daejeon-seven-night": { merge: { 6: 0, 8: 2 }, order: [0, 1, 2, 3, 4, 7, 5] },
  "ilsan-shampoo-night": { merge: { 6: 2, 8: 0, 9: 1 }, order: [0, 1, 2, 3, 4, 7, 5] },
};

const SEC_RE = /\{\s*\n\s*h2: "((?:[^"\\]|\\.)*)",\s*\n\s*body: \[([\s\S]*?)\n\s*\],\s*\n\s*\},/g;

let changed = 0;
for (const [slug, plan] of Object.entries(PLAN)) {
  const slugAt = src.indexOf(`slug: "${slug}"`);
  if (slugAt < 0) throw new Error(`slug 없음: ${slug}`);
  const secAt = src.indexOf("sections: [", slugAt);
  const faqAt = src.indexOf("\n    faq: [", slugAt);
  if (secAt < 0 || faqAt < 0 || secAt > faqAt) throw new Error(`구간 파싱 실패: ${slug}`);

  const head = src.slice(0, secAt);
  const region = src.slice(secAt, faqAt);
  const tail = src.slice(faqAt);

  const secs = [];
  SEC_RE.lastIndex = 0;
  let m;
  while ((m = SEC_RE.exec(region)) !== null) {
    const paras = [...m[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]);
    secs.push({ h2: m[1], body: paras });
  }
  if (secs.length <= 7) {
    console.log(`- ${slug}: ${secs.length}개 → 변경 없음`);
    continue;
  }

  // 병합: 흡수될 섹션의 문단을 대상 섹션 body 뒤에 붙인다.
  for (const [fromStr, to] of Object.entries(plan.merge)) {
    const from = Number(fromStr);
    if (!secs[from] || !secs[to]) throw new Error(`병합 인덱스 오류: ${slug} ${from}->${to}`);
    secs[to].body.push(...secs[from].body);
    secs[from].dropped = true;
  }

  const final = plan.order.map((i) => {
    if (!secs[i]) throw new Error(`order 인덱스 오류: ${slug} ${i}`);
    if (secs[i].dropped) throw new Error(`order에 흡수된 섹션 포함: ${slug} ${i}`);
    return secs[i];
  });
  const kept = secs.filter((s) => !s.dropped).length;
  if (kept !== final.length) {
    throw new Error(`${slug}: 남은 섹션 ${kept} ≠ order ${final.length} (문단 유실 위험)`);
  }
  if (final.length < 5 || final.length > 7) {
    throw new Error(`${slug}: H2 ${final.length}개 — 5~7 규격 위반`);
  }

  const esc = (s) => s;
  const rendered =
    "sections: [\n" +
    final
      .map(
        (s) =>
          `      {\n        h2: "${esc(s.h2)}",\n        body: [\n` +
          s.body.map((p) => `          "${esc(p)}",`).join("\n") +
          `\n        ],\n      },`,
      )
      .join("\n") +
    "\n    ],";

  src = head + rendered + tail;
  changed++;
  console.log(`✓ ${slug}: ${secs.length}개 → ${final.length}개 (문단 ${final.reduce((a, s) => a + s.body.length, 0)}개 보존)`);
}

writeFileSync(FILE, src);
console.log(`\n${changed}개 업소 재구성 완료`);
