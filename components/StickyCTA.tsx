import { INSTA_1, BIZ_NICKNAME, BIZ_PHONE, BIZ_PHONE_TEL } from "@/lib/site";

export default function StickyCTA() {
  return (
    <div
      className="sticky-cta"
      aria-label={`창원룰루랄라나이트 예약문의 ${BIZ_NICKNAME} ${BIZ_PHONE}`}
    >
      <a className="sticky-cta-call" href={`tel:${BIZ_PHONE_TEL}`}>
        <span className="sticky-cta-icon" aria-hidden>
          📞
        </span>
        <span className="sticky-cta-body">
          <strong>창원룰루랄라나이트 {BIZ_NICKNAME}</strong>
          <span>{BIZ_PHONE}</span>
        </span>
      </a>
      <a
        className="sticky-cta-insta"
        href={INSTA_1}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="인스타그램 보기"
      >
        IG
      </a>
    </div>
  );
}
