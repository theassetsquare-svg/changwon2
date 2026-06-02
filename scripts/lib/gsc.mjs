// Google Search Console API 클라이언트 — 의존성 0, node:crypto 로 JWT(RS256) 서명.
// 키 주입 방법(우선순위):
//   1) 환경변수 GSC_SA_KEY            = 서비스계정 JSON "내용" (GitHub Actions secret 권장)
//   2) 환경변수 GOOGLE_APPLICATION_CREDENTIALS = 서비스계정 JSON "파일 경로"
// 키는 절대 레포에 커밋하지 않는다.
import crypto from "node:crypto";
import fs from "node:fs";

// 전체 webmasters 스코프(읽기+쓰기) — 사이트맵 제출/색인검사/데이터조회 모두 커버.
const SCOPE = "https://www.googleapis.com/auth/webmasters";

export function loadKey() {
  if (process.env.GSC_SA_KEY) {
    return JSON.parse(process.env.GSC_SA_KEY);
  }
  const p = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (p && fs.existsSync(p)) {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  }
  throw new Error(
    "GSC 키 없음: GSC_SA_KEY(내용) 또는 GOOGLE_APPLICATION_CREDENTIALS(경로) 환경변수를 설정하세요.",
  );
}

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function getAccessToken(key = loadKey()) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: SCOPE,
      aud: key.token_uri,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = signer
    .sign(key.private_key)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const assertion = `${header}.${claim}.${signature}`;

  const res = await fetch(key.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`토큰 발급 실패 ${res.status}: ${await res.text()}`);
  }
  return (await res.json()).access_token;
}

async function api(token, path, init = {}) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`GSC API ${res.status} ${path}: ${text}`);
    err.status = res.status;
    throw err;
  }
  return body;
}

export async function listSites(token) {
  const { siteEntry = [] } = await api(token, "/sites");
  return siteEntry;
}

// dimensions 예: ["query"], ["page"], ["query","page"]
export async function searchAnalytics(token, siteUrl, opts = {}) {
  const {
    startDate,
    endDate,
    dimensions = ["query"],
    rowLimit = 1000,
    type = "web",
  } = opts;
  const body = await api(
    token,
    `/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit, type }),
    },
  );
  return body.rows || [];
}

export function dateNDaysAgo(n) {
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString().slice(0, 10);
}
