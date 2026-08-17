import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
};

function response(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  }[character] || character));
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return response({ error: 'Method not allowed' }, 405);

  try {
    const authorization = request.headers.get('Authorization') || '';
    if (!authorization.startsWith('Bearer ')) return response({ error: 'Authentication required' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const resendKey = Deno.env.get('RESEND_API_KEY') || '';
    const fromAddress = Deno.env.get('LAB_INVITE_FROM') || 'Rhine Lab <invite@auth.rh1nelab.com>';
    const publicAppUrl = Deno.env.get('PUBLIC_APP_URL') || 'https://halleylab.github.io/Rhine_Lab/';

    if (!supabaseUrl || !anonKey || !serviceRoleKey) return response({ error: 'Supabase function secrets are incomplete' }, 500);
    if (!resendKey) return response({ error: 'RESEND_API_KEY is not configured' }, 503);

    const authenticated = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });
    const userResult = await authenticated.auth.getUser();
    const user = userResult.data.user;
    if (userResult.error || !user) return response({ error: 'Authentication required' }, 401);

    const body = await request.json();
    const labId = String(body.labId || '');
    const recipient = String(body.email || '').trim().toLowerCase();
    const invitationUrl = String(body.invitationUrl || '');

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(recipient)) return response({ error: 'Invalid email address' }, 400);

    const expectedApp = new URL(publicAppUrl);
    const invitation = new URL(invitationUrl);
    const validFragment = /^#lab-invite=[a-f0-9]{64}\.[A-Za-z0-9_-]{40,50}$/i.test(invitation.hash);
    if (invitation.origin !== expectedApp.origin || invitation.pathname !== expectedApp.pathname || !validFragment) {
      return response({ error: 'Invalid invitation URL' }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const membershipResult = await admin
      .from('lab_members')
      .select('role, labs(name)')
      .eq('lab_id', labId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (membershipResult.error) throw membershipResult.error;
    if (!membershipResult.data || membershipResult.data.role !== 'owner') {
      return response({ error: 'Only the LAB creator can send invitations' }, 403);
    }

    const labName = String(membershipResult.data.labs?.name || 'Rhine Lab');
    const safeLabName = escapeHtml(labName);
    const safeInvitationUrl = escapeHtml(invitationUrl);

    const mailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipient],
        subject: `Invitation to join ${labName} · Rhine Lab`,
        html: `<!doctype html><html><body style="font-family:Helvetica,Arial,sans-serif;background:#f2f4ed;color:#1d2923;padding:32px"><main style="max-width:560px;margin:auto;background:#fff;border:1px solid #dbe2d8;border-radius:20px;padding:32px"><p style="color:#7cae16;font-weight:700;letter-spacing:.12em">RHINE LAB INVITATION</p><h1 style="margin:8px 0 16px">Join ${safeLabName}</h1><p>The LAB creator invited this email address to the read-only shared workspace.</p><p style="margin:28px 0"><a href="${safeInvitationUrl}" style="display:inline-block;background:#b7e52b;color:#172016;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">Confirm joining LAB</a></p><p style="font-size:13px;color:#6d786f">Sign in with this email address after opening the button. This invitation expires automatically.</p></main></body></html>`,
        text: `You were invited to join ${labName} in Rhine Lab. Confirm the invitation: ${invitationUrl}`,
      }),
    });

    const mailBody = await mailResponse.json().catch(() => ({}));
    if (!mailResponse.ok) return response({ error: mailBody.message || 'Email delivery failed' }, 502);

    return response({ sent: true, id: mailBody.id || null });
  } catch (error) {
    console.error(error);
    return response({ error: error instanceof Error ? error.message : 'Unable to send invitation email' }, 500);
  }
});
