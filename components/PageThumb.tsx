/**
 * 페이지 썸네일 — og:image 와 본문에 같은 그림을 쓴다.
 *
 *  왜 있나 (2026-08-31)
 *    /vip/ /faq/ /rooms/ 같은 안내 페이지 8쪽이 og:image 로
 *    사이트 공용 그림 하나(/images/og-square.png)를 나눠 쓰고,
 *    본문에는 그림이 아예 없었다.
 *    네이버는 본문에 그림이 있는 문서를 더 잘 집어 가고,
 *    쪽마다 다른 그림이라야 광고문의 안내도 제 몫을 한다.
 *
 *  ★ 원칙: og:image 와 본문 <img> 는 반드시 같은 파일 (thumbPath 하나로 계산)
 *  ★ 첫 그림이므로 loading="lazy" 를 붙이지 않는다 (수집기가 못 보는 일이 없게)
 */
export const thumbPath = (path: string) => {
  const p = String(path).replace(/\/+$/, '').replace(/^\//, '');
  return '/og/auto-' + (p ? p.replace(/\//g, '-') + '-index' : 'index') + '.png';
};

export default function PageThumb({ path, alt }: { path: string; alt: string }) {
  return (
    <figure className="page-thumb" style={{ margin: '0 0 18px' }}>
      <img
        src={thumbPath(path)}
        alt={alt}
        width={1200}
        height={1200}
        decoding="async"
        style={{ width: '100%', maxWidth: 420, height: 'auto', borderRadius: 12, display: 'block' }}
      />
    </figure>
  );
}
