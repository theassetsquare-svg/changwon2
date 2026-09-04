
/* ★ 2026-08-31 — 연령·관계 고지가 없었다(설계도 4장 · 점검표 #121·#122).
   이 푸터가 붙는 쪽에는 담당자 광고(연락처)가 실린다.
   광고를 실어 놓고 '제휴가 없다' 고 적으면 사실과 다른 고지가 된다. */
const 광고고지 = [
  "이 페이지에는 해당 업소 담당자의 광고가 실려 있습니다. 만 19세 이상 성인 대상입니다.",
  "아래 담당자 연락처는 광고로 실린 것입니다. 만 19세 이상만 이용할 수 있습니다.",
  "이 글에는 업소 담당자가 의뢰한 광고가 포함되어 있습니다. 만 19세 이상 대상이며 청소년 출입·고용은 금지입니다.",
  "담당자 연락처 안내는 광고입니다. 만 19세 이상 성인 업소를 다룹니다.",
  "이 쪽의 연락처는 광고로 게재된 것입니다. 만 19세 이상만 출입할 수 있습니다.",
  "업소 담당자의 요청으로 광고를 싣고 있습니다. 성인(만 19세 이상) 대상입니다.",
];
function 고지고르기(씨: unknown) {
  const s = String(씨 ?? '');
  let n = 0;
  for (let k = 0; k < s.length; k++) n = (n * 131 + s.charCodeAt(k)) % 1000003;
  return 광고고지[n % 광고고지.length];
}

/**
 * 13개 페이지 공통 푸터.
 * 광고·제휴 입점 문의(besta12)는 광고주 모집 채널이며 손님 예약 창구가 아니다.
 * 고정바(64px)에 가리지 않도록 body padding-bottom 으로 여백을 확보한다.
 */
export default function NightFooter({ 씨 }: { 씨?: string } = {}) {
  return (
    <footer className="site-footer">
      <div className="ad-inquiry">
        광고·제휴 입점 문의 &nbsp;|&nbsp; 카카오톡 ID <strong>besta12</strong>
      </div>
      <p className="footer-note">
        본 페이지는 업소 정보 제공 페이지입니다. 출입 연령 및 이용 규정은 각 업소 방침을 따릅니다.
      </p>
      <p className="footer-note">{고지고르기(씨)}</p>
      <p className="footer-note cafe-link" style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.7 }}><a href="https://nolcool.com/cafe/?utm_source=i&utm_medium=site_link&utm_campaign=cafe" rel="noopener">놀쿨 카페 안내 →</a></p>
    </footer>
  );
}
