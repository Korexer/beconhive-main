const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

const getDisplayName = (email: string) => {
  const localPart = email.split('@')[0] || '';
  const firstChunk = localPart.split(/[._-]+/).find(Boolean) || '';
  if (!firstChunk || /\d/.test(firstChunk)) return 'there';
  return titleCase(firstChunk);
};

const buildEmailTemplate = (email: string) => {
  const name = getDisplayName(email);
  const siteUrl = Deno.env.get('PUBLIC_SITE_URL') || 'https://www.beconhive.com';
  const previewUrl = `${siteUrl.replace(/\/$/, '')}/ai-planner`;

  const subject = "You're on the Beconhive AI waitlist";

  const text = `Hi ${name},

Thanks for joining the Beconhive AI waitlist.

You now have an early spot for access to Beconhive AI, our upcoming platform for automated business planning and predictive financial modeling.

We are building Beconhive AI to help founders and business teams turn raw ideas, financial data, and planning notes into:
- Investor-ready business plans
- Smart financial forecasts
- Clear cash-flow projections
- Export-ready planning documents

As a waitlist member, you will be among the first to:
- Get product launch updates
- See early product previews
- Hear about beta access opportunities
- Receive important rollout announcements

You can revisit the product preview here:
${previewUrl}

Thanks again for joining us.

Warm regards,
The Beconhive Team`;

  const html = `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#10213a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(4,20,45,0.10);">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#04142d 0%,#0a58ca 100%);padding:36px 40px;color:#ffffff;">
                  <div style="font-size:12px;letter-spacing:0.10em;text-transform:uppercase;opacity:0.72;margin-bottom:14px;font-weight:600;">Beconhive AI &mdash; Early Access</div>
                  <h1 style="margin:0;font-size:30px;line-height:1.2;font-weight:700;">You&rsquo;re officially in, ${name}. 🎉</h1>
                  <p style="margin:16px 0 0;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.84);">
                    Thanks for joining the Beconhive AI waitlist. You now have an early spot for launch updates and beta access news.
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">

                  <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#334155;">
                    We are building <strong>Beconhive AI</strong> to help founders and business teams turn raw ideas, financial data, and planning notes into:
                  </p>

                  <!-- Features list -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
                    <tr>
                      <td style="background:#f0f6ff;border-radius:16px;padding:20px 24px;">
                        <div style="display:flex;align-items:center;margin-bottom:12px;">
                          <span style="color:#0a58ca;font-size:18px;margin-right:10px;">&#9679;</span>
                          <span style="font-size:15px;color:#10213a;font-weight:500;">Investor-ready business plans</span>
                        </div>
                        <div style="display:flex;align-items:center;margin-bottom:12px;">
                          <span style="color:#0a58ca;font-size:18px;margin-right:10px;">&#9679;</span>
                          <span style="font-size:15px;color:#10213a;font-weight:500;">Smart 3&ndash;5 year financial forecasts</span>
                        </div>
                        <div style="display:flex;align-items:center;margin-bottom:12px;">
                          <span style="color:#0a58ca;font-size:18px;margin-right:10px;">&#9679;</span>
                          <span style="font-size:15px;color:#10213a;font-weight:500;">Clear cash-flow &amp; break-even projections</span>
                        </div>
                        <div style="display:flex;align-items:center;">
                          <span style="color:#0a58ca;font-size:18px;margin-right:10px;">&#9679;</span>
                          <span style="font-size:15px;color:#10213a;font-weight:500;">Export-ready planning documents</span>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 28px;font-size:16px;line-height:1.8;color:#334155;">
                    As a waitlist member, you will be among the first to get product updates, early previews, and beta access opportunities.
                  </p>

                  <!-- CTA button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 36px;">
                    <tr>
                      <td>
                        <a href="${previewUrl}" style="display:inline-block;background:#ed4705;color:#ffffff;text-decoration:none;padding:15px 28px;border-radius:999px;font-weight:700;font-size:15px;letter-spacing:0.01em;">
                          View the product preview &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Sign-off -->
                  <p style="margin:0 0 4px;font-size:15px;line-height:1.7;color:#334155;">Warm regards,</p>
                  <p style="margin:0;font-size:15px;font-weight:700;color:#10213a;">The Beconhive Team</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px;border-top:1px solid #e8edf5;background:#f9fafb;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.6;">
                    You received this email because you joined the Beconhive AI waitlist at <a href="${siteUrl}" style="color:#0a58ca;text-decoration:none;">beconhive.com</a>.<br/>
                    &copy; ${new Date().getFullYear()} Beconhive. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  return { subject, text, html };
};

// ── Send via SMTP using Deno's native TCP + STARTTLS / SMTPS ─────────────────

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

async function sendViaSMTP(
  config: SmtpConfig,
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<void> {
  const { createTransport } = await import('npm:nodemailer@6.9.13');

  const transporter = createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465 (SMTPS), false for STARTTLS (587)
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false, // shared hosting certs often use self-signed SNI
    },
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    html,
    text,
  });
}

// ── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  // Validate required secrets
  const smtpHost = Deno.env.get('SMTP_HOST');
  const smtpPortStr = Deno.env.get('SMTP_PORT') || '465';
  const smtpUser = Deno.env.get('SMTP_USER');
  const smtpPass = Deno.env.get('SMTP_PASS');
  const fromEmail = Deno.env.get('WAITLIST_FROM_EMAIL') || 'Beconhive AI <hello@beconhive.com>';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('Missing SMTP secrets: SMTP_HOST, SMTP_USER, or SMTP_PASS not set');
    return jsonResponse({ error: 'Email provider is not configured' }, 500);
  }

  let payload: { email?: string; source?: string };

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const email = payload.email?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: 'A valid email address is required' }, 400);
  }

  const { subject, text, html } = buildEmailTemplate(email);

  try {
    await sendViaSMTP(
      {
        host: smtpHost,
        port: parseInt(smtpPortStr, 10),
        user: smtpUser,
        pass: smtpPass,
        from: fromEmail,
      },
      email,
      subject,
      html,
      text,
    );
  } catch (err) {
    console.error('SMTP send error:', err);
    return jsonResponse(
      { error: 'Failed to send waitlist email', detail: String(err) },
      502,
    );
  }

  return jsonResponse({
    success: true,
    source: payload.source || 'ai-planner',
  });
});
