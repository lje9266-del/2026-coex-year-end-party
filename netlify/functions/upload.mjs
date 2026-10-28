import { getStore } from "@netlify/blobs";

const MAX = 5 * 1024 * 1024; // 함수 요청 한도(6MB) 안쪽
const ALPHA = "abcdefghijkmnpqrstuvwxyz23456789";
const newId = () => [...crypto.getRandomValues(new Uint8Array(12))].map(n => ALPHA[n % ALPHA.length]).join("");

export default async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });
  const buf = new Uint8Array(await req.arrayBuffer());
  if (buf.length > MAX) return new Response("too large", { status: 413 });
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) return new Response("jpeg only", { status: 400 });
  const id = newId();
  await getStore("photos").set(id + ".jpg", buf, { metadata: { createdAt: Date.now() } });
  return Response.json({ id, url: `${new URL(req.url).origin}/p/${id}` });
};

export const config = { path: "/api/upload" };
