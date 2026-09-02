# Rhine Lab Cloudflare backend

Rhine Lab keeps its local-first, end-to-end encrypted data model while replacing Supabase with Cloudflare.

- **D1** stores accounts, password hashes, sessions, LAB membership and encrypted-object metadata.
- **R2** stores encrypted personal snapshots, encrypted LAB publications and encrypted attachments.
- **Workers** exposes the only public API and enforces account, LAB and attachment access.
- **Brevo** sends the existing eight-digit registration and sign-in codes.
- **Groq** runs Kristen on the open-weight `openai/gpt-oss-20b`; only messages explicitly submitted in the assistant are sent for inference.

Cloudflare receives ciphertext for workspace snapshots and LAB publications. The account password and LAB password are never stored as plaintext; password verification uses PBKDF2-SHA256 with an individual random salt.

## Deploy

Prerequisites: Node.js 22 or newer, an authenticated Wrangler session, and R2 enabled once in the Cloudflare Dashboard.

1. Create or confirm D1 and R2 resources:

```powershell
pnpm exec wrangler d1 create rhine-lab
pnpm exec wrangler r2 bucket create rhine-lab-attachments
```

2. Set the D1 `database_id` in `wrangler.toml`, then initialize the schema:

```powershell
pnpm exec wrangler d1 execute rhine-lab --remote --config cloudflare/wrangler.toml --file cloudflare/schema.sql
```

3. Deploy once, then add secrets interactively so they never enter Git history:

```powershell
pnpm exec wrangler deploy --config cloudflare/wrangler.toml
pnpm exec wrangler secret put AUTH_PEPPER --config cloudflare/wrangler.toml
pnpm exec wrangler secret put BREVO_API_KEY --config cloudflare/wrangler.toml
pnpm exec wrangler secret put GROQ_API_KEY --config cloudflare/wrangler.toml
```

`AUTH_PEPPER` should be at least 32 random bytes. `BREVO_API_KEY` must be authorized to send from `noreply@rh1nelab.com`. Keep `GROQ_API_KEY` in Worker secrets only; never place it in browser configuration or Git.

4. After the Worker succeeds on `workers.dev`, enable the commented `api.rh1nelab.com` custom-domain route in `wrangler.toml` and deploy again.

Existing Supabase passwords cannot be exported. Each user registers once on the Cloudflare backend; existing local records remain on the device and upload after the first successful Cloudflare sign-in.
