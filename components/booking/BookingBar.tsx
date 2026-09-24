import { useSalt, 소금입히기 } from "@/lib/salt";
import { AD_KAKAO } from "@/lib/booking/types";
import type { BookingVenue } from "@/lib/booking/types";

/**
 * 하단 고정 전화바.
 * - 홈·허브(mode="home"): 광고·제휴 입점 문의 카톡 (2026-09-13 창원룰루랄라 광고 해지)
 * - A그룹 상세: 담당 닉네임 + 전화번호만. "besta12" 문자열이 들어가면 안 된다.
 * - B그룹 상세: 광고·제휴 입점 문의 카톡 ID.
 */
function BookingHomeBar안쪽() {
  return (
    <div className="callbar" role="complementary" aria-label="광고 제휴 문의">
      <span>
        광고·제휴 입점 문의 카톡 <b>{AD_KAKAO}</b>
      </span>
    </div>
  );
}

function BookingBar안쪽({ venue }: { venue: BookingVenue }) {
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

/* 2026-09-25 — 이 컴포넌트 출력에도 쪽 소금(lib/salt.tsx) */
export default function BookingBar(props: any) {
  const s = useSalt();
  return <>{소금입히기((BookingBar안쪽 as any)(props), s)}</>;
}

export function BookingHomeBar() {
  const s = useSalt();
  return <>{소금입히기(BookingHomeBar안쪽(), s)}</>;
}
