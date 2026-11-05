const site_url =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const raw_backend = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shakib-ant-doctor-tracker-server-89.vercel.app/api"
).replace(/\/+$/, "");

const backend_url = raw_backend.endsWith("/api")
  ? raw_backend
  : `${raw_backend}/api`;

const spaces_url = process.env.NEXT_PUBLIC_SPACES_URL;

export const Env = { site_url, backend_url, spaces_url };
