export function getApiBaseUrl() {
    const raw = (import.meta.env.VITE_API_URL || "http://localhost:3000").trim();
    if (!raw) return "http://localhost:3000";

    // If the user provides only a hostname (e.g. backend-production-xxx.up.railway.app)
    // ensure the browser treats it as an absolute URL.
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    // Remove trailing slashes to avoid accidental double slashes when concatenating.
    return withProtocol.replace(/\/+$/, "");
}

export function buildApiUrl(path = "") {
    const base = getApiBaseUrl();
    if (!path) return base;
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

