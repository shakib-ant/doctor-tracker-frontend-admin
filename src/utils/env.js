const site_url = process.env.NEXT_PUBLIC_SITE_URL;
const raw_backend = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

const backend_url = raw_backend.endsWith("/api")
  ? raw_backend
  : `${raw_backend}/api`;

const spaces_url = process.env.NEXT_PUBLIC_SPACES_URL;

export const Env = { site_url, backend_url, spaces_url };
