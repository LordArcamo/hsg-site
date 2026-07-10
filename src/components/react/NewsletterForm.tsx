import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Newsletter signup (front-end demo — wire the submit handler to your email provider). */
export default function NewsletterForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setInvalid(true);
      inputRef.current?.focus();
      return;
    }
    setSubscribed(true);
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
      <button type="submit" className="button button-primary">
        Subscribe
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}
