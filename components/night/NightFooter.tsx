/**
 * 13개 페이지 공통 푸터.
 * 광고·제휴 입점 문의(besta12)는 광고주 모집 채널이며 손님 예약 창구가 아니다.
 * 고정바(64px)에 가리지 않도록 body padding-bottom 으로 여백을 확보한다.
 */
export default function NightFooter() {
  return (
    <footer className="site-footer">
      <div className="ad-inquiry">
        광고·제휴 입점 문의 &nbsp;|&nbsp; 카카오톡 ID <strong>besta12</strong>
      </div>
      <p className="footer-note">
        본 페이지는 업소 정보 제공 페이지입니다. 출입 연령 및 이용 규정은 각 업소 방침을 따릅니다.
      </p>
    </footer>
  );
}
