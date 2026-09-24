/**
 * 2026-09-24 대표님 지시 「썸네일 19곳 모든 쪽」 — 쪽마다 고유 카드(전 네트워크 중복 0).
 * lib/thumb-map.json(쪽 경로 → 카드 파일·alt)에 있으면 그 카드를 og·본문 첫 그림·JSON-LD image 에 같이 쓴다.
 * 표는 naver-watch/scripts/thumb/apply-thumbs.mjs 가 만든다. 없는 쪽은 옛 그림 그대로.
 * 경로는 next/router 의 asPath(정적 내보내기에서도 그 쪽 경로) — 서버·브라우저가 같은 값을 본다.
 */
import { useRouter } from 'next/router';
import 카드표 from './thumb-map.json';

export type 쪽카드 = { file: string; alt: string; ogOnly?: boolean };
export function 카드찾기(pathname: string): 쪽카드 | undefined {
  const p0 = pathname.split(/[?#]/)[0] || '/';
  const p = p0.endsWith('/') ? p0 : p0 + '/';
  return (카드표 as { 쪽: Record<string, 쪽카드> }).쪽[p];
}
export function useThumb(): 쪽카드 | undefined {
  const r = useRouter();
  return 카드찾기(r?.asPath || '/');
}
/** JSON-LD 의 대표 객체(가게·글·쪽) image 를 이 쪽 카드로 — 목록·질문·경로 같은 객체는 건드리지 않는다 */
const 대표형 = ['NightClub', 'LocalBusiness', 'Article', 'BlogPosting', 'WebPage', 'CollectionPage', 'ItemList', 'Place', 'Organization', 'Residence', 'Product'];
export function 이미지바꾸기<T>(ld: T, url: string): T {
  const 손 = (o: any): any => {
    if (Array.isArray(o)) return o.map(손);
    if (!o || typeof o !== 'object') return o;
    const ty = ([] as string[]).concat(o['@type'] || []);
    const n: any = { ...o };
    if (ty.some((t) => 대표형.includes(t)) && !(ty.includes('Organization') && !('image' in o))) n.image = url;
    if (Array.isArray(o['@graph'])) n['@graph'] = o['@graph'].map(손);
    return n;
  };
  return 손(ld);
}
