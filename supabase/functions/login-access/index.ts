// @ts-nocheck -- This file is type-checked by the Supabase Deno runtime at deploy time.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.116.0";

const allowedOrigins = new Set([
  "https://www.invoicemakertool.online",
  "https://invoicemakertool.online",
  "http://www.invoicemakertool.online",
  "http://invoicemakertool.online",
  "https://uneebahmadrazzaq-pixel.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && allowedOrigins.has(origin) ? origin : "https://www.invoicemakertool.online";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
}

function json(status: number, body: Record<string, unknown>, origin: string | null) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });
}

function jwtSessionId(token: string) {
  const payload = token.split(".")[1];
  if (!payload) return "";
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "=");
    return String(JSON.parse(atob(normalized)).session_id || "");
  } catch {
    return "";
  }
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== "POST") return json(405, { allowed: false, reason: "Method not allowed." }, origin);
  if (origin && !allowedOrigins.has(origin)) return json(403, { allowed: false, reason: "This website origin is not authorized." }, origin);

  const authorization = req.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "");
  const sessionId = jwtSessionId(token);
  if (!token || !sessionId) return json(401, { allowed: false, reason: "A valid Supabase session is required." }, origin);

  let browserId = "";
  try {
    browserId = String((await req.json())?.browserId || "").trim();
  } catch {
    return json(400, { allowed: false, reason: "Invalid request body." }, origin);
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(browserId)) {
    return json(400, { allowed: false, reason: "A valid browser identifier is required." }, origin);
  }

  const projectUrl = Deno.env.get("SUPABASE_URL")!;
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const authClient = createClient(projectUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) return json(401, { allowed: false, reason: "Your login session is invalid or expired." }, origin);

  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || forwardedFor;
  if (!clientIp) return json(503, { allowed: false, reason: "The secure login service could not determine this connection's IP address." }, origin);

  const adminClient = createClient(projectUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await adminClient.rpc("claim_login_access", {
    p_user_id: userData.user.id,
    p_browser_id: browserId,
    p_ip: clientIp,
    p_session_id: sessionId,
  });
  if (error) {
    console.error("claim_login_access failed", error.code, error.message);
    return json(500, { allowed: false, reason: "The secure login check could not be completed." }, origin);
  }

  const result = Array.isArray(data) ? data[0] : data;
  return json(200, {
    allowed: Boolean(result?.allowed),
    reason: result?.reason || "Access denied.",
    loginPolicy: result?.login_policy || "single_browser_ip",
    authorizedIp: result?.authorized_ip || null,
    browserLocked: Boolean(result?.browser_locked),
  }, origin);
});
