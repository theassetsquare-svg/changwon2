import { BIZ_PHONE, BIZ_TEL_HREF, INSTA_1 } from "@/lib/site";

export default function StickyCTA() {
  return (
    <div className="sticky-cta" aria-label="짱구 직통 전화">
      <a className="sticky-cta-call" href={BIZ_TEL_HREF}>
        <span className="sticky-cta-icon" aria-hidden>
          📞
        </span>
        <span className="sticky-cta-body">
          <strong>짱구 직통</strong>
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
