import { PAGES, BIZ_TEL_HREF, BIZ_PHONE } from "@/lib/site";

type Props = { current: string };

export default function SiteNav({ current }: Props) {
  return (
    <nav className="sitenav" aria-label="Primary">
      <a className="sitenav-brand" href="/">
        <span className="dot" aria-hidden />
        룰루랄라 · 짱구라인
      </a>
      <button
        className="sitenav-toggle"
        type="button"
        aria-label="메뉴 열기"
        aria-controls="sitenav-menu"
      >
        <span /><span /><span />
      </button>
      <ul id="sitenav-menu" className="sitenav-menu">
        {PAGES.map((p) => (
          <li key={p.path}>
            <a
              href={p.path}
              aria-current={p.path === current ? "page" : undefined}
            >
              {p.label}
            </a>
          </li>
        ))}
        <li className="sitenav-cta">
          <a className="btn btn-primary btn-sm" href={BIZ_TEL_HREF}>
            📞 {BIZ_PHONE}
          </a>
        </li>
      </ul>
    </nav>
  );
}
