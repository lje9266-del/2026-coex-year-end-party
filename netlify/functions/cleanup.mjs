import { getStore } from "@netlify/blobs";

// 1시간마다 오래된 사진 삭제
export default async () => {
  const ttl = Number(Netlify.env.get("TTL_HOURS") || 24) * 3600e3;
  const store = getStore("photos");
  const { blobs } = await store.list();
  for (const { key } of blobs) {
    const meta = await store.getMetadata(key);
    const created = meta?.metadata?.createdAt;
    if (!created || Date.now() - Number(created) > ttl) await store.delete(key);
  }
};

export const config = { schedule: "@hourly" };
