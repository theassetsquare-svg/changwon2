import Head from "next/head";
import {
  SITE_URL,
  SITE_NAME,
  GEO_LAT,
  GEO_LNG,
} from "@/lib/site";

type Props = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  jsonLd?: object;
  noindex?: boolean;
};

export default function SeoHead({
  title,
  description,
  path,
  ogImage,
  ogImageAlt,
  jsonLd,
  noindex,
}: Props) {
  const url = SITE_URL + path;
  const image = ogImage ?? SITE_URL + "/images/og-cover.svg";
  const imageAlt = ogImageAlt ?? title;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, follow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="rating" content="adult" />
      <meta name="theme-color" content="#0b0410" />
      <meta name="format-detection" content="telephone=yes" />

      <meta name="geo.region" content="KR-48" />
      <meta name="geo.placename" content="경상남도 창원시 성산구 상남동" />
      <meta name="geo.position" content={`${GEO_LAT};${GEO_LNG}`} />
      <meta name="ICBM" content={`${GEO_LAT}, ${GEO_LNG}`} />

      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="ko" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} RSS`} href={SITE_URL + "/feed.xml"} />
      <link rel="icon" href="/favicon.ico" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/svg+xml" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      <meta name="GPTBot" content="index, follow" />
      <meta name="ClaudeBot" content="index, follow" />
      <meta name="PerplexityBot" content="index, follow" />
      <meta name="Google-Extended" content="index, follow" />
      <meta name="Yeti" content="index, follow" />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
