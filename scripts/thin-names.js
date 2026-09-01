/**
 * [빌드 뒤 이름 덜어내기] 만들어진 쪽에서 가게이름을 본문 3~5회로 맞춘다.
 *
 *  왜 — 화면을 React 가 그리므로 자료를 잘라내면 다른 쪽까지 망가진다.
 *       그래서 **빌드가 끝난 뒤** 결과 파일에서만 덜어낸다.
 *       `postbuild` 로 걸어 두었으므로 빌드할 때마다 저절로 다시 적용된다.
 *       (out/ 을 손으로 고치는 것과 다르다 — 매 빌드에 다시 실행된다)
 *
 *  ★ 세지 않는 곳: <head> · 머리말 · 꼬리말 · 메뉴 · <script> (게이트와 같은 기준)
 *  ★ 제목·h1·첫 문장은 그대로 두고, 그 뒤로 넘치는 것만 「이곳」으로 바꾼다.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'out');
const NAMES_FILE = path.join(process.cwd(), 'scripts', 'venue-names.json');
const 몫 = 4;

if (!fs.existsSync(OUT)) { console.log('  out/ 이 없어 건너뜁니다'); process.exit(0); }

let 이름들 = [];
try {
  이름들 = JSON.parse(fs.readFileSync(NAMES_FILE, 'utf8'));
} catch {
  console.log('  scripts/venue-names.json 이 없어 건너뜁니다');
  process.exit(0);
}
이름들.sort((a, b) => b.length - a.length);

function 가림(html) {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, (m) => ' '.repeat(m.length))
    .replace(/<header[\s\S]*?<\/header>/gi, (m) => ' '.repeat(m.length))
    .replace(/<footer[\s\S]*?<\/footer>/gi, (m) => ' '.repeat(m.length))
    .replace(/<nav[\s\S]*?<\/nav>/gi, (m) => ' '.repeat(m.length))
    .replace(/<script[\s\S]*?<\/script>/gi, (m) => ' '.repeat(m.length))
    .replace(/<[^>]+>/g, (m) => ' '.repeat(m.length));
}

/** 그 쪽이 다루는 가게 하나만 고른다 — 본문에 가장 많이 나온 이름 */
function 이쪽가게(본문) {
  let 최고 = null, 최다 = 0;
  for (const nm of 이름들) {
    let n = 0, at = 본문.indexOf(nm);
    while (at >= 0) { n += 1; at = 본문.indexOf(nm, at + nm.length); }
    if (n > 최다) { 최다 = n; 최고 = nm; }
  }
  return 최다 > 몫 ? 최고 : null;
}

let 손댐 = 0, 바꾼곳 = 0;
function 훑기(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== '_next') 훑기(p); continue; }
    if (e.name !== 'index.html') continue;
    let h;
    try { h = fs.readFileSync(p, 'utf8'); } catch { continue; }
    const 본문 = 가림(h);
    const 이름 = 이쪽가게(본문);
    if (!이름) continue;
    const 자리 = [];
    let n = 0, at = 본문.indexOf(이름);
    while (at >= 0) { n += 1; if (n > 몫) 자리.push(at); at = 본문.indexOf(이름, at + 이름.length); }
    if (!자리.length) continue;
    let 결과 = h;
    for (let i = 자리.length - 1; i >= 0; i -= 1) {
      결과 = 결과.slice(0, 자리[i]) + '이곳' + 결과.slice(자리[i] + 이름.length);
    }
    fs.writeFileSync(p, 결과, 'utf8');
    손댐 += 1; 바꾼곳 += 자리.length;
  }
}
훑기(OUT);
console.log('  이름 덜어내기 — 쪽 ' + 손댐 + '개 · 바꾼 자리 ' + 바꾼곳 + '곳');
