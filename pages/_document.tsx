import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta charSet="utf-8" />
        {/* 신규 등록(changwonc.pages.dev) — 2026-08-18 */}
        <meta name="naver-site-verification" content="3bb98ddc2b6fee3ffb0f267744f3689f8f3a7ca6" />
        {/* 구 등록(changwona.pages.dev) 유지 */}
        <meta name="naver-site-verification" content="fb77bafd6276354f9e3aae2754d325d44526e700" />
        <meta name="google-site-verification" content="HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88" />
        <meta name="color-scheme" content="dark" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
