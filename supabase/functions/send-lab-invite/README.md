# LAB invitation email function

This function sends LAB confirmation links through Resend using the already verified `auth.rh1nelab.com` domain.

Deploy after applying `005_lab_password_and_email_invites.sql`:

```powershell
supabase functions deploy send-lab-invite --project-ref tyjaprmkrjxgccsnqwog --use-api
supabase secrets set RESEND_API_KEY=... LAB_INVITE_FROM="Rhine Lab <invite@auth.rh1nelab.com>" PUBLIC_APP_URL=https://halleylab.github.io/Rhine_Lab/
```

The Resend API key is separate from the SMTP password already configured in Supabase Auth. Never place either secret in browser configuration or GitHub source files.
