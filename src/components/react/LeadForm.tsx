import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

const INTERESTS = [
  'Business Strategy',
  'Executive Recruiting',
  'Leadership Development',
  'HR Consulting',
  'Executive Career Guidance',
  "Not sure yet — let's talk",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Errors {
  name?: boolean;
  email?: boolean;
  interest?: boolean;
}

/** Lead-capture form (front-end demo — wire the submit handler to your CRM/inbox). */
export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const clearError = (field: keyof Errors) => () =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = ((data.get('name') as string) || '').trim();
    const email = ((data.get('email') as string) || '').trim();
    const interest = ((data.get('interest') as string) || '').trim();

    const nextErrors: Errors = {
      name: !name,
      email: !EMAIL_RE.test(email),
      interest: !interest,
    };
    if (nextErrors.name || nextErrors.email || nextErrors.interest) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="lead-success">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M4 13l5 5L20 6" />
        </svg>
        <h3>Thanks — we've got it.</h3>
        <p>Michael will personally review your note and follow up within one business day.</p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <div className="lf-row">
        <label>
          <span>Full name*</span>
          <input
            type="text"
            name="name"
            placeholder="Jane Smith"
            className={errors.name ? 'invalid' : undefined}
            onChange={clearError('name')}
          />
        </label>
        <label>
          <span>Email*</span>
          <input
            type="email"
            name="email"
            placeholder="jane@company.com"
            className={errors.email ? 'invalid' : undefined}
            onChange={clearError('email')}
          />
        </label>
      </div>
      <div className="lf-row">
        <label>
          <span>Phone</span>
          <input type="tel" name="phone" placeholder="(201) 555-0100" />
        </label>
        <label>
          <span>Company <i>(if applicable)</i></span>
          <input type="text" name="company" placeholder="Acme Inc." />
        </label>
      </div>
      <label>
        <span>What can we help with?*</span>
        <select
          name="interest"
          defaultValue=""
          className={errors.interest ? 'invalid' : undefined}
          onChange={clearError('interest') as unknown as (e: ChangeEvent<HTMLSelectElement>) => void}
        >
          <option value="" disabled>Select one</option>
          {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </label>
      <label>
        <span>Tell us a bit about your situation</span>
        <textarea name="message" rows={3} placeholder="A few sentences on what's going on and what you're hoping to achieve." />
      </label>
      <button type="submit" className="button button-primary">
        Send My Details
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
      <p className="lf-note">We'll never share your information. We typically respond within one business day.</p>
    </form>
  );
}
