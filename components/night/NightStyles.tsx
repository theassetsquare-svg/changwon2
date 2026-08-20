/**
 * /night/ 계열 전용 스타일.
 * 기존 styles/globals.css 와 _app.tsx 를 수정하지 않기 위해 styled-jsx global 로 주입한다.
 * 클래스는 night- 접두 또는 사양서에 지정된 이름(.callbar/.site-footer/.ad-inquiry/.answer-box)만 사용한다.
 */
export default function NightStyles() {
  return (
    <style jsx global>{`
      /* ── 사양서 지정 고정바 CSS (원문 유지) ── */
      .callbar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        height: 64px;
        box-sizing: content-box;
        padding-bottom: env(safe-area-inset-bottom, 0px);
        background: #111;
        color: #fff;
        font-weight: 800;
        font-size: 18px;
        box-shadow: 0 -2px 14px rgba(0, 0, 0, 0.35);
        transform: translateZ(0);
        backface-visibility: hidden;
      }
      .callbar a {
        color: #fff;
        text-decoration: none;
        display: flex;
        align-items: center;
        height: 100%;
      }
      body {
        padding-bottom: calc(84px + env(safe-area-inset-bottom, 0px));
      }
      @media (max-width: 480px) {
        .callbar {
          height: 60px;
          font-size: 16px;
        }
        body {
          padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
        }
      }
      /* Next.js 는 #__next 래퍼로 레이아웃을 잡으므로 래퍼에도 동일 여백을 준다.
         globals.css 의 body 규칙에 지지 않도록 명시도를 한 단계 올려 재선언한다. */
      html body {
        padding-bottom: calc(84px + env(safe-area-inset-bottom, 0px));
      }
      #__next {
        padding-bottom: 0;
      }
      @media (max-width: 480px) {
        html body {
          padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
        }
      }
      /* .callbar 의 조상에 containing block 을 만드는 속성이 생기지 않도록 방어 */
      #__next,
      .night-wrap,
      .night-top,
      .site-footer {
        transform: none;
        filter: none;
        perspective: none;
        backdrop-filter: none;
        will-change: auto;
        contain: none;
      }
      .callbar b {
        color: #ffd400;
        font-weight: 900;
      }

      /* ── 푸터 (사양서 지정) ── */
      .ad-inquiry {
        background: #ffd400;
        color: #111;
        font-weight: 900;
        font-size: 18px;
        padding: 16px;
        text-align: center;
        border-radius: 10px;
        margin: 24px auto;
        max-width: 720px;
      }
      .ad-inquiry strong {
        font-weight: 900;
      }
      .site-footer {
        border-top: 1px solid rgba(255, 255, 255, 0.14);
        margin-top: 32px;
        /* 하단 여백은 고정바(64~ px) 위로 .ad-inquiry 가 절대 걸리지 않도록 넉넉히 준다. G12 로 실측 검증. */
        padding: 8px 20px 88px;
      }
      .footer-note {
        max-width: 720px;
        margin: 0 auto;
        text-align: center;
        font-size: 14px;
        line-height: 1.7;
        color: #cfc3e4;
      }

      /* ── 페이지 본문 ── */
      .night-wrap {
        max-width: 860px;
        margin: 0 auto;
        padding: 20px 20px 40px;
      }
      .night-top {
        display: flex;
        align-items: center;
        gap: 14px;
        max-width: 860px;
        margin: 0 auto;
        padding: 16px 20px 0;
        font-size: 14px;
        font-weight: 700;
      }
      .night-top a {
        color: #ffd166;
        text-decoration: none;
      }
      .night-top a:hover {
        text-decoration: underline;
      }
      .night-crumb {
        font-size: 13px;
        color: #b9a8d3;
        margin: 14px 0 10px;
      }
      .night-crumb ol {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 0;
        margin: 0;
      }
      .night-crumb li + li::before {
        content: "›";
        margin-right: 8px;
        color: #8b7aa6;
      }
      .night-crumb a {
        color: #b9a8d3;
      }
      .night-wrap h1 {
        font-size: clamp(28px, 6vw, 42px);
        line-height: 1.25;
        margin: 6px 0 14px;
        letter-spacing: -0.02em;
      }
      .answer-box {
        background: rgba(255, 46, 166, 0.1);
        border: 1px solid rgba(255, 46, 166, 0.45);
        border-radius: 14px;
        padding: 18px 20px;
        margin: 0 0 22px;
      }
      .answer-box p {
        margin: 0;
        font-size: 17px;
        line-height: 1.75;
        color: #f7f3ff;
      }
      .answer-box strong {
        color: #ff7ac7;
      }
      .night-facts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        gap: 12px;
        margin: 0 0 28px;
        padding: 0;
        list-style: none;
      }
      .night-facts li {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 12px 14px;
      }
      .night-facts b {
        display: block;
        font-size: 12px;
        letter-spacing: 0.05em;
        color: #b9a8d3;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .night-facts span {
        font-size: 15px;
        font-weight: 800;
        color: #f7f3ff;
      }
      .night-age {
        border-color: rgba(255, 212, 0, 0.55) !important;
        background: rgba(255, 212, 0, 0.1) !important;
      }
      .night-age span {
        color: #ffd400;
      }
      .night-wrap h2 {
        font-size: clamp(19px, 3.6vw, 24px);
        line-height: 1.4;
        margin: 34px 0 10px;
        letter-spacing: -0.01em;
      }
      .night-wrap section p {
        margin: 0 0 12px;
        font-size: 16px;
        line-height: 1.85;
        color: #e7defc;
      }
      .night-related {
        margin-top: 40px;
      }
      .night-related h2 {
        margin-bottom: 12px;
      }
      .night-related ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 10px;
      }
      .night-related a {
        display: block;
        padding: 13px 15px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #f7f3ff;
        text-decoration: none;
        font-weight: 700;
        font-size: 15px;
      }
      .night-related a:hover {
        background: rgba(255, 46, 166, 0.14);
        border-color: rgba(255, 46, 166, 0.5);
      }
      .night-list {
        list-style: none;
        padding: 0;
        margin: 18px 0 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 12px;
      }
      .night-list a {
        display: block;
        padding: 16px 18px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #f7f3ff;
        text-decoration: none;
      }
      .night-list a:hover {
        border-color: rgba(255, 46, 166, 0.5);
        background: rgba(255, 46, 166, 0.12);
      }
      .night-list strong {
        display: block;
        font-size: 17px;
        margin-bottom: 4px;
      }
      .night-list span {
        font-size: 13px;
        color: #b9a8d3;
      }
      .night-note {
        font-size: 13px;
        color: #b9a8d3;
        line-height: 1.75;
        margin-top: 26px;
      }

      /* ── 본문 표 / 목록 / 요약 ── */
      .night-updated {
        font-size: 13px;
        color: #b9a8d3;
        margin: 0 0 14px;
      }
      .night-table-wrap {
        overflow-x: auto;
        margin: 6px 0 8px;
      }
      .night-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 15px;
        line-height: 1.6;
        color: #e7defc;
      }
      .night-table caption {
        text-align: left;
        font-size: 13px;
        color: #b9a8d3;
        padding-bottom: 8px;
      }
      .night-table th,
      .night-table td {
        border: 1px solid rgba(255, 255, 255, 0.16);
        padding: 10px 12px;
        text-align: left;
        vertical-align: top;
      }
      .night-table thead th {
        background: rgba(255, 255, 255, 0.07);
        color: #f7f3ff;
        font-weight: 800;
      }
      .night-table tbody th {
        font-weight: 700;
        color: #f7f3ff;
        white-space: nowrap;
      }
      .night-bullets {
        margin: 4px 0 12px;
        padding-left: 20px;
        color: #e7defc;
        font-size: 16px;
        line-height: 1.85;
      }
      .night-bullets li {
        margin-bottom: 4px;
      }
      .night-summary {
        margin: 34px 0 8px;
        padding: 16px 18px;
        border-radius: 14px;
        background: rgba(255, 212, 0, 0.08);
        border: 1px solid rgba(255, 212, 0, 0.4);
      }
      .night-summary p {
        margin: 0 0 6px;
        font-size: 15px;
        line-height: 1.75;
        color: #f7f3ff;
      }
      .night-summary p:last-child {
        margin-bottom: 0;
      }
      .night-summary b {
        color: #ffd400;
        font-size: 13px;
        letter-spacing: 0.04em;
      }
      .night-og {
        margin: 18px 0 6px;
      }
      .night-og img {
        display: block;
        width: 100%;
        max-width: 520px;
        margin: 0 auto;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.14);
      }
      .night-og figcaption {
        margin: 8px 0 0;
        text-align: center;
        font-size: 13px;
        color: #cfc2e0;
      }
      .night-kw {
        color: #f7f3ff;
        font-weight: 600;
        line-height: 1.8;
      }
    `}</style>
  );
}
