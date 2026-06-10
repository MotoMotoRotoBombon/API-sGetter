# CityPulse frontend

Next.js frontend for the CityPulse backend.

## Local development

Run the backend first. Serverless Offline listens on port `3000` and exposes
the API under `/dev`.

```powershell
# getter_apis_backend
pnpm run offline
```

Then run this frontend on port `3001`:

```powershell
# getter_apis_frontend
pnpm dev
```

Open `http://localhost:3001`.

The server-side API base URL is configured in `.env`:

```env
API_URL=http://localhost:3000/dev
```

For deployment, set `API_URL` to the complete API Gateway stage URL. It is a
server-only variable and is not exposed to the browser.
