import {
  PAGES,
  BIZ_HOURS,
  BIZ_ADDRESS_ROAD,
  BIZ_FLOOR,
  BIZ_LICENSE,
  BIZ_NICKNAME,
  BIZ_PHONE,
  BIZ_PHONE_TEL,
  BIZ_MIN_AGE,
  INSTA_1,
  INSTA_2,
} from "@/lib/site";

/* ★ 2026-08-31 — 연령·관계 고지가 없어 신고에 취약했다(점검표 #121 · #122).
   문구는 쪽마다 다르게 고른다. 같은 줄을 여러 쪽에 박으면 유사문서로 잡힌다. */
const 고지문구 = [
  "만 19세 이상 이용 가능한 성인 업소 안내입니다. 업소와 제휴 관계가 없는 정보 페이지입니다.",
  "성인(만 19세 이상)만 이용할 수 있는 곳을 다룹니다. 업소와 광고·제휴 관계가 없습니다.",
  "이 글은 만 19세 이상 성인 대상 업소 안내이며, 업소와 아무런 관계가 없습니다.",
  "만 19세 미만은 출입할 수 없습니다. 공개 자료만 정리한 제3자 안내 페이지입니다.",
  "성인 전용 업소를 다루는 안내입니다. 업소로부터 대가를 받지 않았습니다.",
  "만 19세 이상만 들어갈 수 있는 곳입니다. 업소와 제휴하지 않은 정보 페이지입니다.",
  "성인 대상 업소 안내이며 청소년 출입·고용은 금지입니다. 공개 자료 기준입니다.",
  "만 19세 이상 성인만 이용하는 업소를 안내합니다. 업소의 공식 채널이 아닙니다.",
];
function 고지고르기(씨: unknown) {
  const s = String(씨 ?? "");
  let n = 0;
  for (let k = 0; k < s.length; k++) n = (n * 131 + s.charCodeAt(k)) % 1000003;
  return 고지문구[n % 고지문구.length];
}

type Props = { dateModified?: string };

export default function SiteFooter({ dateModified }: Props) {
  return (
    <footer className="sitefoot">
      <div className="sitefoot-grid">
        <div>
          <div className="sitefoot-brand">창원 룰루랄라 나이트클럽</div>
          <p className="sitefoot-meta">
            예약문의 {BIZ_NICKNAME}{" "}
            <a href={`tel:${BIZ_PHONE_TEL}`}>{BIZ_PHONE}</a>
            <br />
            {BIZ_ADDRESS_ROAD}, {BIZ_FLOOR}
            <br />
            영업: {BIZ_HOURS} · {BIZ_MIN_AGE} 입장
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
          <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.7, color: "#9aa0a6" }}>{고지고르기(dateModified)}</p>
</footer>
  );
}
