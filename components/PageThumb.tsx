import { useSalt, 소금입히기 } from "@/lib/salt";
/**
 * 페이지 썸네일 — og:image 와 본문에 같은 그림을 쓴다.
 *
 *  왜 있나 (2026-08-31)
 *    /vip/ /faq/ /rooms/ 같은 안내 페이지 8쪽이 og:image 로
 *    사이트 공용 그림 하나(2026-09-14 지운 로또 카드 og-square)를 나눠 쓰고,
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

function PageThumb안쪽({ path, alt: alt0 }: { path: string; alt: string }) {
  const 표 = useThumb();   /* 2026-09-24 쪽마다 고유 카드 — og 와 같은 파일 */
  if (표 && 표.ogOnly) return null;
  const alt = 표 ? 표.alt : alt0;
  return (
    <figure className="page-thumb" style={{ margin: '0 0 18px' }}>
      <img
        src={표 ? 표.file : thumbPath(path)}
        alt={alt}
        width={1200}
        height={1200}
        decoding="async"
        style={{ width: '100%', maxWidth: 420, height: 'auto', borderRadius: 12, display: 'block' }}
      />
    </figure>
  );
}import { useThumb } from '@/lib/thumb';


/* 2026-09-25 — 이 컴포넌트 출력에도 쪽 소금(lib/salt.tsx) */
export default function PageThumb(props: any) {
  const s = useSalt();
  return <>{소금입히기((PageThumb안쪽 as any)(props), s)}</>;
}
