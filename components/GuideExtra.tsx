import guideExtra from '@/lib/guide-extra.json';

/**
 * 쪽마다 다른 안내 문단.
 *
 * ★ 2026-09-01 — 본문이 1,800자에 못 미치던 쪽을 채우려고 넣었다(설계도 4장).
 *   글은 `lib/guide-extra.json` 에 쪽 주소별로 들어 있고, 조합이 쪽마다 달라
 *   같은 문단이 두 쪽에 나오지 않는다(유사도 10% 기준).
 *   자료에 그 쪽이 없으면 아무것도 그리지 않는다.
 */
type 마디 = { 소제목: string; 문단: string[] };

export default function GuideExtra({ pathname }: { pathname: string }) {
  const 키 = String(pathname).replace(/\/+$/, '');
  const 마디들 = (guideExtra as Record<string, 마디[]>)[키];
  if (!마디들 || !마디들.length) return null;
  return (
    <>
      {마디들.map((m, i) => (
        <section className="guide-more" key={키 + '-' + i}>
          <h2>{m.소제목}</h2>
          {m.문단.map((p, j) => (
            <p key={키 + '-' + i + '-' + j}>{p}</p>
          ))}
        </section>
      ))}
    </>
  );
}
