import type { Venue } from "@/lib/night/venues";
import { AD_KAKAO } from "@/lib/night/venues";

/**
 * 하단 고정 전화바.
 * - position:fixed 만 사용. sticky·JS 스크롤 이벤트 없음 → 스크롤해도 좌표가 변하지 않는다.
 * - A그룹(광고주 있음): 전화번호만. "besta12" 문자열이 들어가면 안 된다.
 * - B그룹(광고주 없음): 광고·제휴 입점 문의 카톡 ID.
 */
export default function CallBar({ venue }: { venue: Venue }) {
  if (venue.contact) {
    return (
      <div className="callbar" role="complementary" aria-label="전화 연결">
        <a href={`tel:${venue.contact.tel}`}>
          📞 {venue.contact.nick} {venue.contact.phone}
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
