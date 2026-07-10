import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Newsletter signup — POSTs to /api/newsletter, which sends the notification via Resend. */
export default function NewsletterForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setInvalid(true);
      inputRef.current?.focus();
      return;
    }
    setInvalid(false);
    setSubmitError(false);
    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', body: new FormData(e.currentTarget) });
      if (!res.ok) throw new Error('Submit failed');
      setSubscribed(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (subscribed) {
    return (
      <div className="nl-success show">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
          <path d="M4 13l5 5L20 6" />
        </svg>
        Thanks — you're on the list.
      </div>
    );
  }

  return (
    <form className="nl-form" onSubmit={handleSubmit} noValidate>
      <input
        ref={inputRef}
        type="email"
        name="email"
        className={invalid ? 'invalid' : undefined}
        placeholder="Your work email"
        aria-label="Your work email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setInvalid(false);
        }}
      />
      <button type="submit" className="button button-primary" disabled={submitting}>
        {submitting ? 'Subscribing…' : 'Subscribe'}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      {submitError && <p className="nl-error">Something went wrong — please try again.</p>}
    </form>
  );
}
