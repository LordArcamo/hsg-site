import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { escapeHtml } from '../../lib/email';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.RESEND_TO_EMAIL;
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500 });
  }

  const data = await request.formData();
  const email = ((data.get('email') as string) || '').trim();

  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: email,
    subject: `New newsletter signup: ${email}`,
    html: `<p><strong>New subscriber:</strong> ${escapeHtml(email)}</p>`,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
