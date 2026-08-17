import { AD_KAKAO, HOME_BAR } from "@/lib/booking/types";
import type { BookingVenue } from "@/lib/booking/types";

/**
 * 하단 고정 전화바.
 * - 홈·허브(mode="home"): 📞 창원룰루랄라나이트 로또 010-7528-4936
 * - A그룹 상세: 담당 닉네임 + 전화번호만. "besta12" 문자열이 들어가면 안 된다.
 * - B그룹 상세: 광고·제휴 입점 문의 카톡 ID.
 */
export function BookingHomeBar() {
  return (
    <div className="callbar" role="complementary" aria-label="전화 연결">
      <a href={`tel:${HOME_BAR.tel}`}>
        📞 {HOME_BAR.name} {HOME_BAR.nick} {HOME_BAR.phone}
      </a>
    </div>
  );
}

export default function BookingBar({ venue }: { venue: BookingVenue }) {
  if (venue.contact) {
    return (
      <div className="callbar" role="complementary" aria-label="전화 연결">
        <a href={`tel:${venue.contact.tel}`}>
          📞 {venue.name} {venue.contact.nick} {venue.contact.phone}
        </a>
      </div>
    );
  }
  return (
    <div className="callbar" role="complementary" aria-label="광고 제휴 문의">
      <span>
        광고·제휴 입점 문의 카톡 <b>{AD_KAKAO}</b>
      </span>
    </div>
  );
}
