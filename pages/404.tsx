import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { PAGES } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <SeoHead
        title="페이지를 찾을 수 없습니다 | 창원 룰루랄라 나이트"
        description="요청하신 페이지가 이동되었거나 존재하지 않습니다. 메인 안내·예약·찾아가는 길로 바로 이동하세요."
        path="/404/"
        noindex
      />
      <SiteNav current="" />
      <main className="wrap">
        <div className="notfound">
          <h1>404</h1>
          <p>요청하신 페이지가 이동되었거나 존재하지 않습니다.</p>
          <div className="cta">
            <a className="btn btn-primary btn-lg" href="/">메인으로</a>
          </div>
          <div className="link-grid" style={{ marginTop: 24, width: "100%", maxWidth: 720 }}>
            {PAGES.filter((p) => p.path !== "/").map((p) => (
              <a key={p.path} className="link-card" href={p.path}>
                <span className="link-card-label">{p.label}</span>
                <span className="link-card-arrow" aria-hidden>→</span>
              </a>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
      <StickyCTA />
    </>
  );
}
