const BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const KEY = "waybill.session";

// ---- Session (tokens + user) saved in localStorage ----
export const session = {
  get() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  },
  set(value) { localStorage.setItem(KEY, JSON.stringify(value)); },
  clear() { localStorage.removeItem(KEY); },
};

// ---- Turn any DRF error body into a readable message ----
function flatten(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).filter(Boolean)[0] || "";
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) {
      const msg = flatten(v);
      if (msg) return msg;
    }
  }
  return "";
}

export class ApiError extends Error {
  constructor(status, data) {
    super(ApiError.message(data));
    this.status = status;
    this.data = data;
    // { email: "user with this email already exists." } -> used to show errors under fields
    this.fields = {};
    if (data && typeof data === "object" && !Array.isArray(data) && !data.detail) {
      for (const [key, value] of Object.entries(data)) this.fields[key] = flatten(value);
    }
  }
  static message(data) {
    if (!data) return "Something went wrong. Please try again.";
    if (typeof data.detail === "string") return data.detail;
    const first = flatten(data);
    return first || "Something went wrong. Please try again.";
  }
}

// ---- Refresh the access token when it expires (only one refresh at a time) ----
let refreshing = null;
function refreshAccess() {
  const s = session.get();
  if (!s?.refresh) return Promise.reject(new Error("No refresh token"));
  if (!refreshing) {
    refreshing = fetch(`${BASE}/auth/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: s.refresh }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Refresh failed");
        const data = await res.json();
        session.set({ ...session.get(), access: data.access, ...(data.refresh ? { refresh: data.refresh } : {}) });
        return data.access;
      })
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

function forceLogout() {
  session.clear();
  window.dispatchEvent(new Event("waybill:logout"));
}

// ---- The one function every API call goes through ----
export async function request(path, { method = "GET", body, auth = true } = {}, canRetry = true) {
  const headers = { "Content-Type": "application/json" };
  const s = session.get();
  if (auth && s?.access) headers.Authorization = `Bearer ${s.access}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(0, { detail: "Can't reach the server. Check that the backend is running." });
  }

  if (res.status === 401 && auth && canRetry && s?.refresh) {
    try {
      await refreshAccess();
      return request(path, { method, body, auth }, false);
    } catch {
      forceLogout();
      throw new ApiError(401, { detail: "Your session has expired. Please log in again." });
    }
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = { detail: "Unexpected response from the server." }; }
  }
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}
