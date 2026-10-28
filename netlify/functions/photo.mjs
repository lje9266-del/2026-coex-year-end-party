import { getStore } from "@netlify/blobs";

const TTL_H = Number(Netlify.env.get("TTL_HOURS") || 24);
const ID = /^[a-z2-9]{12}$/;

const page = (id) => `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>2026 코엑스 송년회 네컷사진</title><style>body{margin:0;background:#4a0a10;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;display:flex;flex-direction:column;align-items:center;gap:14px;padding:20px;min-height:100vh;box-sizing:border-box}
img{max-width:92vw;max-height:72vh;border-radius:12px}a{background:#c8161d;color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:17px}small{opacity:.7}</style></head>
<body><h3>2026 코엑스 송년회 네컷사진 🎄</h3><img src="/uploads/${id}.jpg" alt="네컷사진"><a href="/uploads/${id}.jpg" download="coex-songnyeonhoe-4cut.jpg">사진 저장</a><small>저장이 안 되면 사진을 길게 눌러 저장하세요 · ${TTL_H}시간 후 삭제돼요</small></body></html>`;

export default async (req) => {
  const path = new URL(req.url).pathname;
  const store = getStore("photos");
  let m;
  if ((m = path.match(/^\/p\/([a-z2-9]{12})$/)) && ID.test(m[1])) {
    const meta = await store.getMetadata(m[1] + ".jpg");
    if (!meta) return new Response("사진이 없거나 기간이 지나 삭제됐어요.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    return new Response(page(m[1]), { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
  if ((m = path.match(/^\/uploads\/([a-z2-9]{12})\.jpg$/))) {
    const data = await store.get(m[1] + ".jpg", { type: "arrayBuffer" });
    if (!data) return new Response("not found", { status: 404 });
    return new Response(data, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, max-age=3600" } });
  }
  return new Response("not found", { status: 404 });
};

export const config = { path: ["/p/*", "/uploads/*"] };
