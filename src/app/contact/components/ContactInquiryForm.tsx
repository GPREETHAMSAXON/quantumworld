'use client';

import React, { useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisation: string;
  role: string;
  inquiryType: string;
  subject: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const INQUIRY_TYPES = [
  'Fellowship Programme',
  'Internship Programme',
  'Courses & Training',
  'Institutional Partnership',
  'Research Collaboration',
  'R&D Consulting',
  'Media & Press',
  'General Inquiry',
];

export default function ContactInquiryForm() {
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organisation: '',
    role: '',
    inquiryType: '',
    subject: '',
    message: '',
    consent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!form.inquiryType) e.inquiryType = 'Please select an inquiry type';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) {
      e.message = 'Message is required';
    } else if (form.message.trim().length < 30) {
      e.message = 'Please provide at least 30 characters';
    }
    if (!form.consent) e.consent = 'You must agree to proceed';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  };

  const inputBase =
    'w-full bg-[rgba(14,118,255,0.04)] border border-[rgba(243,243,243,0.08)] rounded-[6px] px-4 py-3 font-archivo text-[14px] text-[#f3f3f3] placeholder-[rgba(243,243,243,0.3)] focus:outline-none focus:border-[#0e76ff] focus:bg-[rgba(14,118,255,0.08)] transition-all duration-200';
  const labelBase = 'block font-narrow text-[11px] font-medium tracking-[0.12em] uppercase text-[rgba(243,243,243,0.55)] mb-2';
  const errorBase = 'font-narrow text-[10px] tracking-wide text-[#ff4d6d] mt-1.5';

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#060d1a' }}>
      <CSSParticleField variant="section" count={35} color="#0e76ff" scanLines className="z-0 opacity-40" />

      {/* Subtle left glow */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse at left, rgba(14,118,255,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
          {/* Left — section label */}
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-6 h-[1px] bg-[#0e76ff]" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">
                Inquiry Form
              </span>
            </div>
            <h2
              className="font-archivo font-medium leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#f3f3f3' }}
            >
              Send Us a
              <span className="block" style={{ color: '#0e76ff' }}>
                Direct Message.
              </span>
            </h2>
            <p className="font-archivo text-[15px] leading-relaxed mb-8" style={{ color: 'rgba(243,243,243,0.5)' }}>
              Fill in the form and our team will respond within one business day. For urgent matters,
              reach us directly via the support channels below.
            </p>

            {/* Response time badge */}
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-[6px] border border-[rgba(14,118,255,0.2)] bg-[rgba(14,118,255,0.05)]">
              <div className="w-2 h-2 rounded-full bg-[#0e76ff] flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#0e76ff] animate-ping" />
              </div>
              <span className="font-narrow text-[11px] tracking-[0.1em] uppercase text-[rgba(243,243,243,0.6)]">
                Avg. response time: &lt; 24 hours
              </span>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center text-center py-20 px-8 rounded-[12px] border border-[rgba(14,118,255,0.2)] bg-[rgba(14,118,255,0.04)]"
                style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.23,1,0.32,1) forwards' }}
              >
                {/* Success icon */}
                <div className="w-16 h-16 rounded-full border border-[rgba(14,118,255,0.3)] bg-[rgba(14,118,255,0.08)] flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#0e76ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-archivo font-medium text-[24px] text-[#f3f3f3] mb-3">
                  Message Received
                </h3>
                <p className="font-archivo text-[15px] leading-relaxed max-w-sm" style={{ color: 'rgba(243,243,243,0.5)' }}>
                  Thank you for reaching out. A member of our team will respond to{' '}
                  <span className="text-[#0e76ff]">{form.email}</span> within one business day.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ firstName: '', lastName: '', email: '', phone: '', organisation: '', role: '', inquiryType: '', subject: '', message: '', consent: false }); }}
                  className="mt-8 btn-ghost font-narrow text-[11px]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Name row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase}>First Name *</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Arjun"
                      className={`${inputBase} ${errors.firstName ? 'border-[#ff4d6d]' : ''}`}
                    />
                    {errors.firstName && <p className={errorBase}>{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className={labelBase}>Last Name *</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Sharma"
                      className={`${inputBase} ${errors.lastName ? 'border-[#ff4d6d]' : ''}`}
                    />
                    {errors.lastName && <p className={errorBase}>{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase}>Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="arjun@institution.ac.in"
                      className={`${inputBase} ${errors.email ? 'border-[#ff4d6d]' : ''}`}
                    />
                    {errors.email && <p className={errorBase}>{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelBase}>Phone (Optional)</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* Organisation + Role */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase}>Organisation</label>
                    <input
                      name="organisation"
                      value={form.organisation}
                      onChange={handleChange}
                      placeholder="IIT Delhi / DRDO / Startup"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Your Role</label>
                    <input
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      placeholder="PhD Scholar / Faculty / Founder"
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* Inquiry type */}
                <div>
                  <label className={labelBase}>Inquiry Type *</label>
                  <select
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={handleChange}
                    className={`${inputBase} ${errors.inquiryType ? 'border-[#ff4d6d]' : ''}`}
                  >
                    <option value="" disabled>Select inquiry type…</option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#060d1a]">{t}</option>
                    ))}
                  </select>
                  {errors.inquiryType && <p className={errorBase}>{errors.inquiryType}</p>}
                </div>

                {/* Subject */}
                <div>
                  <label className={labelBase}>Subject *</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Brief subject of your inquiry"
                    className={`${inputBase} ${errors.subject ? 'border-[#ff4d6d]' : ''}`}
                  />
                  {errors.subject && <p className={errorBase}>{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className={labelBase}>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your inquiry in detail — the more context you provide, the better we can assist you."
                    className={`${inputBase} resize-none ${errors.message ? 'border-[#ff4d6d]' : ''}`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.message ? (
                      <p className={errorBase}>{errors.message}</p>
                    ) : (
                      <span />
                    )}
                    <span className="font-narrow text-[10px] tracking-wide" style={{ color: 'rgba(243,243,243,0.3)' }}>
                      {form.message.length} chars
                    </span>
                  </div>
                </div>

                {/* Consent */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={form.consent}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-[3px] border transition-all duration-200 flex items-center justify-center ${
                          form.consent
                            ? 'bg-[#0e76ff] border-[#0e76ff]'
                            : errors.consent
                            ? 'border-[#ff4d6d] bg-transparent'
                            : 'border-[rgba(243,243,243,0.2)] bg-transparent group-hover:border-[#0e76ff]'
                        }`}
                      >
                        {form.consent && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="font-archivo text-[13px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.5)' }}>
                      I agree to Quantum World Ventures processing my data to respond to this inquiry.
                      I understand my data will not be shared with third parties.
                    </span>
                  </label>
                  {errors.consent && <p className={`${errorBase} ml-7`}>{errors.consent}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center text-[13px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-3.5 h-3.5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
