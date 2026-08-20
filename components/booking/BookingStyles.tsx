/**
 * /booking/ 계열 전용 스타일.
 * 딥 퍼플 그라데이션 배경 + 핑크 포인트 + 라운드 카드.
 * styles/globals.css 와 _app.tsx 는 건드리지 않고 styled-jsx global 로만 주입한다.
 * 고정바(.callbar) 사양은 /night/ 와 동일하게 유지한다 — 스크롤해도 좌표가 변하지 않아야 한다.
 */
export default function BookingStyles() {
  return (
    <style jsx global>{`
      :root {
        --bk-bg: #12042a;
        --bk-bg2: #0a0212;
        --bk-card: rgba(255, 255, 255, 0.05);
        --bk-line: rgba(255, 46, 166, 0.26);
        --bk-pink: #ff2ea6;
        --bk-pink-soft: #ff8ecb;
        --bk-text: #f4ecff;
        --bk-muted: #c9b8e0;
      }

      /* ── 고정바 (스크롤 불변) ── */
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
        background: #150425;
        border-top: 1px solid var(--bk-line);
        color: #fff;
        font-weight: 800;
        font-size: 18px;
        box-shadow: 0 -2px 18px rgba(0, 0, 0, 0.45);
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
      .callbar b {
        color: #ffd400;
        font-weight: 900;
      }
      html body {
        padding-bottom: calc(84px + env(safe-area-inset-bottom, 0px));
        background: linear-gradient(170deg, var(--bk-bg) 0%, var(--bk-bg2) 68%) fixed;
        color: var(--bk-text);
      }
      #__next {
        padding-bottom: 0;
      }
      @media (max-width: 480px) {
        .callbar {
          height: 60px;
          font-size: 15px;
        }
        html body {
          padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
        }
      }
      /* .callbar 조상에 containing block 이 생기지 않도록 방어 */
      #__next,
      .bk-wrap,
      .bk-top,
      .site-footer {
        transform: none;
        filter: none;
        perspective: none;
        backdrop-filter: none;
        will-change: auto;
        contain: none;
      }

      /* ── 상단 바 ── */
      .bk-top {
        display: flex;
        gap: 14px;
        align-items: center;
        padding: 12px 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 14px;
      }
      .bk-top a {
        color: var(--bk-pink-soft);
        text-decoration: none;
        font-weight: 700;
      }

      /* ── 본문 래퍼 ── */
      .bk-wrap {
        max-width: 780px;
        margin: 0 auto;
        padding: 18px 18px 40px;
        line-height: 1.85;
        font-size: 17px;
        word-break: keep-all;
      }
      .bk-wrap h1 {
        font-size: 30px;
        line-height: 1.35;
        font-weight: 900;
        margin: 10px 0 6px;
        letter-spacing: -0.5px;
      }
      .bk-wrap h2 {
        font-size: 21px;
        line-height: 1.45;
        font-weight: 800;
        margin: 34px 0 10px;
        padding-left: 12px;
        border-left: 4px solid var(--bk-pink);
      }
      .bk-wrap p {
        margin: 0 0 14px;
        color: var(--bk-text);
      }
      .bk-crumb ol {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        list-style: none;
        padding: 0;
        margin: 0 0 6px;
        font-size: 13px;
        color: var(--bk-muted);
      }
      .bk-crumb li + li::before {
        content: "›";
        margin-right: 6px;
        opacity: 0.6;
      }
      .bk-crumb a {
        color: var(--bk-muted);
        text-decoration: none;
      }
      .bk-updated {
        font-size: 13px;
        color: var(--bk-muted);
        margin: 0 0 18px;
      }

      /* ── 라운드 카드 공통 ── */
      .bk-card {
        background: var(--bk-card);
        border: 1px solid var(--bk-line);
        border-radius: 22px;
        padding: 18px 20px;
        margin: 18px 0 22px;
      }
      .answer-box {
        background: linear-gradient(140deg, rgba(255, 46, 166, 0.16), rgba(120, 40, 220, 0.14));
        border: 1px solid var(--bk-line);
        border-radius: 22px;
        padding: 18px 20px;
        margin: 18px 0 22px;
      }
      .answer-box p {
        margin: 0 0 10px;
        font-weight: 700;
      }
      .answer-box p:last-child {
        margin-bottom: 0;
      }
      .answer-box .bk-anum {
        color: var(--bk-pink);
        font-weight: 900;
        margin-right: 6px;
      }

      /* ── 사실 표 ── */
      .bk-table-wrap {
        overflow-x: auto;
        margin: 18px 0 24px;
      }
      .bk-facts {
        width: 100%;
        border-collapse: collapse;
        background: var(--bk-card);
        border: 1px solid var(--bk-line);
        border-radius: 22px;
        overflow: hidden;
        font-size: 15.5px;
      }
      .bk-facts caption {
        text-align: left;
        font-size: 13px;
        color: var(--bk-muted);
        padding: 0 0 8px;
      }
      .bk-facts th,
      .bk-facts td {
        padding: 11px 14px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        text-align: left;
        vertical-align: top;
      }
      .bk-facts th {
        width: 34%;
        color: var(--bk-pink-soft);
        font-weight: 700;
      }
      .bk-facts tr:last-child th,
      .bk-facts tr:last-child td {
        border-bottom: 0;
      }

      /* ── 마무리 한 줄 ── */
      .bk-oneline {
        background: rgba(255, 46, 166, 0.12);
        border: 1px solid var(--bk-line);
        border-radius: 22px;
        padding: 16px 20px;
        margin: 26px 0 10px;
        font-weight: 800;
      }
      .bk-oneline b {
        display: block;
        color: var(--bk-pink);
        font-size: 13px;
        letter-spacing: 1px;
        margin-bottom: 6px;
      }

      /* ── FAQ ── */
      .bk-faq {
        margin: 26px 0 10px;
      }
      .bk-faq h3 {
        font-size: 16px;
        font-weight: 800;
        margin: 0 0 6px;
        color: var(--bk-pink-soft);
      }
      .bk-faq .bk-card {
        margin: 12px 0;
        padding: 14px 18px;
      }
      .bk-faq p {
        margin: 0;
        color: var(--bk-muted);
      }

      /* ── 관련 링크 ── */
      .bk-related {
        margin: 30px 0 8px;
      }
      .bk-related h2 {
        margin-top: 0;
      }
      .bk-related ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 10px;
      }
      .bk-related a {
        display: block;
        background: var(--bk-card);
        border: 1px solid var(--bk-line);
        border-radius: 18px;
        padding: 13px 16px;
        color: var(--bk-text);
        text-decoration: none;
        font-weight: 700;
      }
      .bk-related a span {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: var(--bk-muted);
        margin-top: 2px;
      }

      /* ── 허브 목록 ── */
      .bk-group {
        margin: 28px 0;
      }
      .bk-group h2 {
        margin-bottom: 12px;
      }
      .bk-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 10px;
      }
      @media (min-width: 640px) {
        .bk-list {
          grid-template-columns: 1fr 1fr;
        }
      }
      .bk-list a {
        display: block;
        background: var(--bk-card);
        border: 1px solid var(--bk-line);
        border-radius: 18px;
        padding: 13px 16px;
        color: var(--bk-text);
        text-decoration: none;
        height: 100%;
      }
      .bk-list strong {
        display: block;
        font-weight: 800;
        font-size: 16px;
      }
      .bk-list span {
        display: block;
        font-size: 13px;
        color: var(--bk-muted);
        margin-top: 3px;
      }
      .bk-badge {
        display: inline-block;
        margin-left: 6px;
        padding: 1px 9px 2px;
        border-radius: 999px;
        background: #ffd400;
        color: #171717;
        font-size: 12px;
        font-weight: 800;
        white-space: nowrap;
      }

      .bk-note {
        font-size: 13.5px;
        color: var(--bk-muted);
        margin-top: 26px;
        line-height: 1.7;
      }

      /* ── 푸터 ── */
      .site-footer {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 22px 18px 26px;
        text-align: center;
        background: #0a0212;
      }
      .site-footer .ad-inquiry {
        background: #ffffff;
        color: #101010;
        display: inline-block;
        padding: 9px 18px;
        border-radius: 999px;
        font-weight: 800;
        font-size: 15px;
      }
      .site-footer .ad-inquiry strong {
        color: #101010;
      }
      .site-footer .footer-note {
        color: #cfc2e0;
        font-size: 13px;
        margin: 12px 0 0;
        line-height: 1.7;
      }
      .bk-og {
        margin: 18px 0 6px;
      }
      .bk-og img {
        display: block;
        width: 100%;
        max-width: 520px;
        margin: 0 auto;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.14);
      }
      .bk-og figcaption {
        margin: 8px 0 0;
        text-align: center;
        font-size: 13px;
        color: #cfc2e0;
      }
      .bk-kw {
        color: #f0e7ff;
        font-weight: 600;
      }
    `}</style>
  );
}
