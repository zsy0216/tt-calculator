// tt-calc-api: 做T计算器的数据同步接口
// 数据存 KV 的单个键 "data"（整份快照 JSON，与原 tt_records.json 同结构）。
// 鉴权：请求头 X-Key 必须等于 Worker 密钥 ACCESS_KEY。
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Key",
  "Access-Control-Max-Age": "86400",
};

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    if (url.pathname !== "/data") return json({ error: "not found" }, 404);
    if (request.headers.get("X-Key") !== env.ACCESS_KEY) return json({ error: "unauthorized" }, 401);

    if (request.method === "GET") {
      const v = await env.TTDATA.get("data");
      if (v === null) return json({ error: "empty" }, 404);
      return new Response(v, { headers: { "Content-Type": "application/json", ...CORS } });
    }
    if (request.method === "PUT") {
      const body = await request.text();
      try { JSON.parse(body); } catch (e) { return json({ error: "invalid json" }, 400); }
      if (body.length > 900000) return json({ error: "too large" }, 413);
      await env.TTDATA.put("data", body);
      return json({ ok: true, ts: Date.now() });
    }
    return json({ error: "method not allowed" }, 405);
  },
};
