# 창원 룰루랄라 — SEO/색인 자동화 시스템

"내가 신경 쓰지 않아도 되게" 를 위한 무인 감시·알림·대응 구조.

## 1. 무엇이 자동으로 도는가 (GitHub Actions — 사람 개입 0)

| 워크플로 | 주기 | 하는 일 |
|---|---|---|
| `build.yml` | push/PR | Next 정적 빌드 + 키워드 밀도 감사 |
| `health.yml` | 6시간 | 라이브 전 페이지 200 + 메타 존재 점검 |
| `seo-daily.yml` | 매일 02:00 KST | 사이트맵/피드 lastmod 갱신 + IndexNow 핑 |
| `lighthouse.yml` | — | Lighthouse 성능/SEO 점수 |
| **`gsc-monitor.yml`** | **매일 09:00 KST** | **GSC 사이트맵 재제출 + 전 페이지 색인검사 + 순위/카니발리제이션 + 라이브 점검 → 문제 시 이메일** |

### gsc-monitor 가 감지하는 것
- **하드 장애**(메일 발송 + CI 실패): 라이브 비정상 응답, 메타 누락, 사이트맵 제출 실패,
  서비스계정 소유권 상실, 카니발리제이션(동일 쿼리 복수 페이지 경쟁).
- **추적 항목**(정상 범위, 다이제스트에만 표기): 신생 페이지 색인 대기(미크롤).

## 2. 필요한 GitHub Secrets (한 번만 등록)

Repo → Settings → Secrets and variables → Actions:

- `GSC_SA_KEY` — **서비스계정 JSON 파일 내용 전체**(theasset-gsc). GSC 읽기/사이트맵 제출에 사용.
- `RESEND_API_KEY` — (선택) 있으면 문제 발생 시 `theassetsquare@gmail.com` 으로 이메일.
  없으면 리포트만 저장(메일 생략).

> 키는 절대 레포에 커밋하지 않는다. 로컬 실행 시엔
> `GOOGLE_APPLICATION_CREDENTIALS=/path/key.json node scripts/gsc-monitor.mjs`.

## 3. 로컬에서 수동 실행

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/home/user/.secrets/theasset-gsc.json
node scripts/gsc-report.mjs     # 쿼리/순위/카니발리제이션 상세 리포트
node scripts/gsc-inspect.mjs    # 페이지별 색인 상태 진단
node scripts/gsc-sitemap.mjs    # 사이트맵 상태 확인 + 재제출
node scripts/gsc-monitor.mjs    # 위 전체 통합 + 문제 탐지(+이메일)
```

## 4. Gmail 문제 메일 → 자동 대응 → 메일 삭제 (Claude 트리아지 루틴)

자동 발송 이메일은 Resend로 나가지만, **받은 메일을 읽고/고치고/삭제**하는 작업은
Gmail 접근 권한을 가진 Claude(이 세션의 MCP 커넥터)가 수행한다. GitHub Actions는
개인 Gmail 을 읽을 수 없으므로 이 부분은 Claude 가 주기 실행한다(`/schedule` 또는 `/loop`).

**트리아지 절차** (Claude 가 호출될 때마다):
1. Gmail 검색: `subject:"[창원 룰루랄라]" is:unread newer_than:2d`
2. 본문의 문제 목록을 읽는다.
3. 각 문제를 코드/설정에서 수정한다 (예: 메타 누락 → 컴포넌트 수정, 라이브 5xx → 원인 점검).
4. 빌드/검증 후 커밋(사용자 푸시) → Cloudflare 재배포.
5. `node scripts/gsc-monitor.mjs` 재실행해 해당 문제가 사라졌는지 확인.
6. 해결되면 해당 메일을 **휴지통으로 이동(삭제)**.
   미해결이면 메일 유지 + 사용자에게 보고.

> 이 루틴을 무인으로 돌리려면: `/schedule` 로 매일 1회 트리아지 에이전트를 예약하거나,
> `/loop` 로 주기 실행. (사용자 동의 후 활성화)

## 5. 색인/순위 현황 (2026-06-02 기준)

- 서비스계정 `gsc-mcp@theasset-gsc.iam.gserviceaccount.com` = `changwon2.pages.dev` **소유자** 확인.
- 홈 `/` : **색인 완료(PASS)**, 6/1 모바일 크롤 성공.
- 서브페이지 9개 : 크롤 대기(사이트맵이 2주간 `isPending` 상태였음 → **재제출 완료**).
- 노출/클릭 0 : 신생 사이트 색인 적체. 사이트맵 재제출·내부링크로 발견 유도, 이후는 구글 크롤 시간 문제.
- ⚠ 발견·수정한 버그: `health-check.mjs` 가 Next 의 `<title data-next-head>` 를 못 잡아
  **매 실행 오탐 실패**하던 것을 정규식으로 수정.
