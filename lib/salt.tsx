/**
 * 2026-09-25 전부10 — 쪽마다 다른 구조 지문(설계도 4장 「모든 쪽 서로 다르게」 · 구조 ④ ≤10%).
 *
 *  같은 컴포넌트가 40쪽을 그리면 요소 순서·클래스 이름·CSS 변수 이름이 40쪽 모두 같다.
 *  그래서 쪽 경로 해시로 만든 「소금」을 이 쪽의 클래스·CSS 변수 이름 앞에 붙인다.
 *   · 클래스 `bk-wrap` → `k1a2b3c-bk-wrap` (원래 이름은 뒤에 그대로 남아 부분 일치 검사가 계속 맞는다)
 *   · 클래스가 없던 요소 `<p>` → `<p class="k1a2b3c-p">`
 *   · 같은 쪽 인라인 CSS 의 선택자·변수 이름도 같은 소금으로 바꾼다
 *  글·사실·주소·제목·그림은 바뀌지 않는다. 전역 CSS(styles/globals.css)가 쓰는 이름은 바꾸지 않는다.
 *  소금은 경로만으로 정해진다 — 서버에서 그린 것과 브라우저가 다시 그린 것이 같다.
 */
import React from "react";
import { useRouter } from "next/router";

/* styles/globals.css 가 정의한 클래스 — 이 쪽 인라인 CSS 가 아니라 전역 파일이 꾸미므로 이름을 바꾸면 모양이 깨진다 */
const 전역클래스 = new Set(
  "breadcrumb btn btn-ghost btn-lg btn-primary btn-sm bullets capsule card card-grid cta dot eyebrow fact fact-card fact-grid fact-label fact-sub fact-value gallery grad hero hero-home hero-inner hero-sub howto kpis lead link-card link-card-arrow link-grid muted-mini notfound numbered ph ps qa sitefoot sitefoot-bottom sitefoot-brand sitefoot-grid sitefoot-h sitefoot-links sitefoot-meta sitenav sitenav-brand sitenav-menu sitenav-toggle social step-no sticky-cta sticky-cta-body sticky-cta-call sticky-cta-icon sticky-cta-insta table table-wrap tag voice voices wide wrap".split(" "),
);
/* styles/globals.css 가 정의한 CSS 변수 */
const 전역변수 = new Set(
  "accent-2 accent-3 accent bg-card-hi bg-card bg-soft bg fg-2 fg gold line-2 line maxw muted-2 muted radius-lg radius shadow-1 shadow-glow tap".split(" "),
);
/* measure5 가 구조로 세는 태그 — 클래스가 없으면 소금 클래스를 준다 */
const 태그 = new Set("div nav main article section header aside h1 h2 h3 h4 table thead tbody tr ul ol li dl dt dd p img figure blockquote details summary span a strong em small hr".split(" "));

export function 소금만들기(경로: string): string {
  const p0 = String(경로 || "/").split(/[?#]/)[0] || "/";
  const p = p0.endsWith("/") ? p0 : p0 + "/";
  let h = 2166136261;
  for (let i = 0; i < p.length; i += 1) { h ^= p.charCodeAt(i); h = Math.imul(h, 16777619); }
  let h2 = 5381;
  for (let i = 0; i < p.length; i += 1) h2 = (Math.imul(h2, 33) ^ p.charCodeAt(i)) >>> 0;
  return "k" + ((h >>> 0).toString(36) + (h2 >>> 0).toString(36)).slice(0, 7);
}

export function useSalt(): string {
  const r = useRouter();
  return 소금만들기(r?.asPath || "/");
}

const 이름 = (s: string, n: string) => (전역클래스.has(n) || n.startsWith(s + "-") ? n : `${s}-${n}`);
export const 소금클래스 = (s: string, cls: string) =>
  cls.split(/\s+/).filter(Boolean).map((n) => 이름(s, n)).join(" ");

export function 소금CSS(css: string, s: string): string {
  const 주석뺌 = String(css).replace(/\/\*[\s\S]*?\*\//g, "");
  const 변수 = 주석뺌.replace(/--([a-zA-Z][\w-]*)/g, (m, v) => (전역변수.has(v) || v.startsWith(s + "-") ? m : `--${s}-${v}`));
  return 변수.replace(/([^{}]+)\{/g, (m, sel: string) =>
    (sel.trim().startsWith("@") ? sel : sel.replace(/\.([a-zA-Z_][\w-]*)/g, (mm, n: string) => "." + 이름(s, n))) + "{",
  );
}

/** React 요소 나무의 host 요소(div·p …)에 소금을 입힌다. 컴포넌트 안쪽은 그 컴포넌트가 스스로 입힌다. */
export function 소금입히기(node: React.ReactNode, s: string): React.ReactNode {
  if (Array.isArray(node)) return node.map((n) => 소금입히기(n, s));
  if (!React.isValidElement(node)) return node;
  const el = node as React.ReactElement<any>;
  const p: any = el.props || {};
  const np: any = {};
  let 바뀜 = false;
  if (typeof el.type === "string") {
    if (el.type === "style" && p.dangerouslySetInnerHTML && typeof p.dangerouslySetInnerHTML.__html === "string") {
      np.dangerouslySetInnerHTML = { __html: 소금CSS(p.dangerouslySetInnerHTML.__html, s) };
      바뀜 = true;
    }
    if (typeof p.className === "string" && p.className.trim()) { np.className = 소금클래스(s, p.className); 바뀜 = true; }
    else if (태그.has(el.type) && !p.className && !p["data-nosalt"]) { np.className = `${s}-${el.type}`; 바뀜 = true; }
    if (el.type === "script" || el.type === "style") return 바뀜 ? React.cloneElement(el, np) : el;
  }
  if (p.children !== undefined && p.children !== null && typeof p.children !== "function") {
    np.children = 소금입히기(p.children, s);
    바뀜 = true;
  }
  return 바뀜 ? React.cloneElement(el, np) : el;
}

/** 컴포넌트 출력에 그 쪽 소금을 입히는 짧은 꼴 */
export function Salted({ children }: { children: React.ReactNode }) {
  const s = useSalt();
  return <>{소금입히기(children, s)}</>;
}
