/**
 * 검문 — booking 이 가리키는 night 가게가 실제로 있는지 본다.
 *
 * 왜 필요한가
 *   주소교체(슬러그 회전)로 night 슬러그가 바뀌면 booking 쪽 nightSlug 는 낡은 채로 남는다.
 *   렌더 단계에서 막아 두긴 했지만, 그러면 링크가 **조용히 사라진다**.
 *   사라진 것도 문제이므로 여기서 큰 소리로 알린다.
 *
 * 쓰는 법:  node scripts/check-cross-links.mjs
 */
import fs from 'node:fs';

const read = (f) => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');

const nightSlugs = new Set(
  [...read('lib/night/venues.ts').matchAll(/slug: "([^"]+)"/g)].map((m) => m[1])
);

const bad = [];
let total = 0;
for (const f of ['lib/booking/venues-1.ts', 'lib/booking/venues-2.ts']) {
  const src = read(f);
  for (const m of src.matchAll(/nightSlug: "([^"]+)"/g)) {
    total++;
    if (!nightSlugs.has(m[1])) bad.push({ file: f, slug: m[1] });
  }
}

if (bad.length) {
  console.error('✗ booking 이 가리키는 night 가게가 없습니다. 링크가 사라집니다:');
  for (const b of bad) console.error('    ' + b.slug + '   (' + b.file + ')');
  console.error('  지금 있는 night 슬러그: ' + [...nightSlugs].join(', '));
  process.exit(1);
}
console.log('✓ booking → night 연결 ' + total + '개 전부 실제 페이지를 가리킵니다.');
