import Head from "next/head";
import { SITE_URL } from "@/lib/site";

type Props = {
  title: string;
  description: string;
  path: string;
  image: string;
  /** ★ 2026-09-01 — 썸네일은 나이트(가게) 쪽에만. 허브·목록은 true 로 넘긴다. */
  그림없음?: boolean;
  imageAlt: string;
  jsonLd?: object[];
};

/**
 * /night/ 계열 전용 head.
 * 기존 components/SeoHead.tsx 는 창원 본편 전용 geo 메타가 하드코딩되어 있고
 * 규칙상 수정이 금지되어 있어 별도 컴포넌트로 분리했다.
 * naver/google-site-verification 은 pages/_document.tsx 에서 전 페이지에 자동 상속된다.
 */
export default function NightHead({
  title,
  description,
  path,
  image,
  imageAlt,
  그림없음 = false,
  jsonLd,
}: Props) {
  const url = SITE_URL + path;
  const img = SITE_URL + image;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1"
      />
      {/* rating=adult 는 넣지 않는다. 세이프서치 필터에 걸려 검색 노출이 막히므로
          본편에서도 82e1c6f 로 제거된 태그다. */}
      <meta name="theme-color" content="#0b0410" />
      <meta name="format-detection" content="telephone=yes" />

      {/* ★ 2026-09-01 — key 를 달아야 바깥 쪽에서 덮어쓸 수 있다.
         색인된 주소(/hours/ 등)에 이 컴포넌트를 다시 쓸 때
         canonical 이 두 개 나와 네이버가 엉뚱한 쪽을 고르는 일을 막는다. */}
      <link key="canonical" rel="canonical" href={url} />
      <link rel="alternate" hrefLang="ko" href={url} />
      <link rel="icon" href="https://i.nolcool.com/favicon.ico" />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta key="og:url" property="og:url" content={url} />
      <meta property="og:locale" content="ko_KR" />
      {그림없음 ? null : (
        <>
          <meta property="og:image" content={img} />
          <meta property="og:image:secure_url" content={img} />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="1200" />
          <meta property="og:image:alt" content={imageAlt} />
          {/* 네이버 썸네일 수집용 */}
          <meta name="thumbnail" content={img} />
        </>
      )}

      {/* 1:1 이미지이므로 summary. summary_large_image 는 좌우가 잘린다. */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {그림없음 ? null : (
        <>
          <meta name="twitter:image" content={img} />
          <meta name="twitter:image:alt" content={imageAlt} />
        </>
      )}

      {/* 검색·AI 크롤러 허용 (robots.txt 와 동일 정책) */}
      <meta name="Yeti" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-image-preview:large" />
      <meta name="GPTBot" content="index, follow" />
      <meta name="ClaudeBot" content="index, follow" />
      <meta name="PerplexityBot" content="index, follow" />
      <meta name="Google-Extended" content="index, follow" />

      {jsonLd?.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </Head>
  );
}
