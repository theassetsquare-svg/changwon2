import {
  PAGES,
  BIZ_HOURS,
  BIZ_ADDRESS_ROAD,
  BIZ_FLOOR,
  BIZ_LICENSE,
  INSTA_1,
  INSTA_2,
} from "@/lib/site";

type Props = { dateModified?: string };

export default function SiteFooter({ dateModified }: Props) {
  return (
    <footer className="sitefoot">
      <div className="sitefoot-grid">
        <div>
          <div className="sitefoot-brand">창원 룰루랄라 나이트클럽</div>
          <p className="sitefoot-meta">
            {BIZ_ADDRESS_ROAD}, {BIZ_FLOOR}
            <br />
            영업: {BIZ_HOURS} · 만 19세 이상
            <br />
            영업허가 {BIZ_LICENSE} (행정안전부)
          </p>
        </div>
        <div>
          <div className="sitefoot-h">바로가기</div>
          <ul className="sitefoot-links">
            {PAGES.map((p) => (
              <li key={p.path}>
                <a href={p.path}>{p.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="sitefoot-h">연결</div>
          <ul className="sitefoot-links">
            <li>
              <a href={INSTA_1} target="_blank" rel="noopener noreferrer">
                인스타 @rulruralra_nightclub_
              </a>
            </li>
            <li>
              <a href={INSTA_2} target="_blank" rel="noopener noreferrer">
                인스타 @lulu__lala._.cw
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="sitefoot-bottom">
        <span>© 창원 룰루랄라 나이트클럽 · 합법 유흥주점 안내</span>
        {dateModified && <span>업데이트 {dateModified}</span>}
      </div>
    </footer>
  );
}
