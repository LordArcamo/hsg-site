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
  const name = ((data.get('name') as string) || '').trim();
  const email = ((data.get('email') as string) || '').trim();
  const phone = ((data.get('phone') as string) || '').trim();
  const company = ((data.get('company') as string) || '').trim();
  const interest = ((data.get('interest') as string) || '').trim();
  const message = ((data.get('message') as string) || '').trim();

  if (!name || !EMAIL_RE.test(email) || !interest) {
    return new Response(JSON.stringify({ error: 'Missing or invalid required fields' }), { status: 400 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: email,
    subject: `New lead: ${name} — ${interest}`,
    html: `
      <h2>New lead from the website</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
      ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''}
      <p><strong>Interested in:</strong> ${escapeHtml(interest)}</p>
      ${message ? `<p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>` : ''}
    `,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
