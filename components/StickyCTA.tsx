import { AD_KAKAO } from "@/lib/booking/types";
/* 2026-09-14 C0 — 해지 광고주 전화 CTA·업소 인스타그램(외부 링크) → 광고 입점 문의 바 */

export default function StickyCTA() {
  return (
    <div
      className="sticky-cta"
      aria-label="광고 제휴 문의"
    >
      <span className="sticky-cta-body">
        <strong>광고·제휴 입점 문의</strong>
        <span>카톡 {AD_KAKAO}</span>
      </span>
    </div>
  );
}
