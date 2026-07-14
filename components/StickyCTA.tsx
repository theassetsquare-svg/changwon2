import { INSTA_1 } from "@/lib/site";

export default function StickyCTA() {
  return (
    <div className="sticky-cta" aria-label="광고문의 카톡 besta12">
      <a
        className="sticky-cta-call"
        href="https://open.kakao.com/me/besta12"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="sticky-cta-icon" aria-hidden>
          💬
        </span>
        <span className="sticky-cta-body">
          <strong>광고문의 카톡</strong>
          <span>besta12</span>
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
