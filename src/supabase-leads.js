const SUPABASE_URL = "https://ykihlecdsodlrajbeeqx.supabase.co";
const SUPABASE_KEY = "sb_publishable_-dY8M1m3l6o3Uo7IKZxMgw_hJj1-Dus";
const LEADS_TABLE = "leads";

export async function saveLeadToSupabase(payload) {
  const lead = {
    source: payload.source || "website",
    name: normalize(payload.name),
    email: normalize(payload.email),
    phone: normalize(payload.phone),
    company: normalize(payload.company),
    budget: normalize(payload.budget),
    timeline: normalize(payload.timeline),
    message: normalize(payload.message),
    project: normalize(payload.project),
    page_url: window.location.href,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${LEADS_TABLE}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Supabase insert failed with ${res.status}`);
  }

  return true;
}

function normalize(value) {
  const text = String(value || "").trim();
  return text || null;
}
