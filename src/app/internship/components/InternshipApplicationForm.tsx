'use client';

import React, { useRef, useEffect, useState } from 'react';

function FormGL() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let animationId: number;
    let renderer: import('three').WebGLRenderer;
    let scene: import('three').Scene;
    let camera: import('three').PerspectiveCamera;
    let THREE: typeof import('three');

    const init = async () => {
      THREE = await import('three');
      const w = container.clientWidth;
      const h = container.clientHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 500);
      camera.position.set(0, 0, 18);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // Grid
      const gridGroup = new THREE.Group();
      scene.add(gridGroup);
      for (let i = -8; i <= 8; i++) {
        const hGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-14, i * 1.2, 0), new THREE.Vector3(14, i * 1.2, 0)]);
        const vGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(i * 1.75, -10, 0), new THREE.Vector3(i * 1.75, 10, 0)]);
        const mat = new THREE.LineBasicMaterial({ color: 0x0e76ff, transparent: true, opacity: 0.035 });
        gridGroup.add(new THREE.Line(hGeo, mat));
        gridGroup.add(new THREE.Line(vGeo, mat));
      }

      // Particles
      const pCount = 700;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 38;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 28;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 5;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x0e76ff, size: 0.04, transparent: true, opacity: 0.15,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      scene.add(new THREE.Points(pGeo, pMat));

      scene.add(new THREE.AmbientLight(0x0a1a3a, 2));

      const handleResize = () => {
        const nw = container.clientWidth, nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', handleResize);

      let t = 0;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        t += 0.002;
        gridGroup.rotation.z = Math.sin(t * 0.15) * 0.015;
        renderer.render(scene, camera);
      };
      animate();

      return () => window.removeEventListener('resize', handleResize);
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

function FormField({
  label, name, type = 'text', placeholder, required = false, value, onChange, error, options,
}: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string; options?: string[];
}) {
  const baseStyle: React.CSSProperties = {
    background: 'rgba(14,118,255,0.03)',
    border: `1px solid ${error ? '#ef4444' : 'rgba(243,243,243,0.1)'}`,
    color: '#f3f3f3',
    padding: '12px 14px',
    width: '100%',
    fontFamily: 'inherit',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    borderRadius: '0',
  };

  return (
    <div>
      <label className="block font-narrow text-[10px] font-medium tracking-[0.12em] uppercase mb-2"
        style={{ color: error ? '#ef4444' : 'rgba(243,243,243,0.5)' }}>
        {label}{required && <span className="text-[#0e76ff] ml-1">*</span>}
      </label>
      {options ? (
        <select name={name} value={value} onChange={onChange} required={required}
          style={{ ...baseStyle, appearance: 'none', cursor: 'pointer' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#0e76ff'; }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'rgba(243,243,243,0.1)'; }}>
          <option value="" style={{ background: '#060d1a' }}>Select {label}</option>
          {options.map(opt => <option key={opt} value={opt} style={{ background: '#060d1a' }}>{opt}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={4}
          style={baseStyle}
          onFocus={e => { e.currentTarget.style.borderColor = '#0e76ff'; }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'rgba(243,243,243,0.1)'; }} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
          style={baseStyle}
          onFocus={e => { e.currentTarget.style.borderColor = '#0e76ff'; }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'rgba(243,243,243,0.1)'; }} />
      )}
      {error && <p className="font-archivo text-[11px] mt-1.5" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  );
}

interface FormData {
  fullName: string; email: string; phone: string; institution: string;
  designation: string; city: string; state: string; country: string;
  qualification: string; track: string; domain: string;
  motivation: string; availability: string; terms: boolean;
}

interface FormErrors { [key: string]: string; }

const qualifications = ['Undergraduate (UG)', 'Postgraduate (PG)', 'PhD / Doctoral', 'Post-Doctoral'];
const tracks = ['UG — Undergraduate Track', 'PG — Postgraduate Track', 'PhD — Doctoral Track'];
const domains = [
  'Quantum Computing', 'Quantum Communication & QKD', 'Quantum Sensing & Metrology',
  'Quantum Medical Imaging', 'Quantum AI & Machine Learning', 'Quantum Education & L&D',
  'Quantum Financial Systems', 'Quantum Cybersecurity', 'Quantum Photonics',
  'Deep-Tech Entrepreneurship', 'Quantum Policy & Governance', 'Other',
];
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Other',
];
const availabilityOptions = ['Immediate (within 2 weeks)', '1 Month', '2 Months', '3 Months', 'Next Academic Semester'];

const steps = ['Personal Details', 'Academic Background', 'Programme Selection', 'Motivation'];

export default function InternshipApplicationForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState<FormData>({
    fullName: '', email: '', phone: '', institution: '',
    designation: '', city: '', state: '', country: 'India',
    qualification: '', track: '', domain: '',
    motivation: '', availability: '', terms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^[+\d\s\-()]{8,15}$/.test(formData.phone)) newErrors.phone = 'Enter a valid phone number';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
    }

    if (step === 1) {
      if (!formData.institution.trim()) newErrors.institution = 'Institution name is required';
      if (!formData.qualification) newErrors.qualification = 'Qualification is required';
      if (!formData.designation.trim()) newErrors.designation = 'Current year / designation is required';
    }

    if (step === 2) {
      if (!formData.track) newErrors.track = 'Please select your internship track';
      if (!formData.domain) newErrors.domain = 'Please select your domain of interest';
      if (!formData.availability) newErrors.availability = 'Please indicate your availability';
    }

    if (step === 3) {
      if (!formData.motivation.trim()) newErrors.motivation = 'Please share your motivation';
      else if (formData.motivation.trim().length < 80) newErrors.motivation = 'Please provide at least 80 characters';
      if (!formData.terms) newErrors.terms = 'You must accept the terms to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setStatus('submitting');
    await new Promise(r => setTimeout(r, 2000));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <section id="apply" ref={ref} className="relative py-32 overflow-hidden" style={{ background: '#060d1a' }}>
        <div className="absolute inset-0 z-0">{mounted && <FormGL />}</div>
        <div className="relative z-10 max-w-[600px] mx-auto px-6 text-center">
          <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center"
            style={{ background: 'rgba(14,118,255,0.1)', border: '1px solid rgba(14,118,255,0.3)' }}>
            <svg className="w-10 h-10 text-[#0e76ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-archivo font-bold text-[#f3f3f3] mb-4" style={{ fontSize: '2rem' }}>Application Submitted</h3>
          <p className="font-archivo text-[rgba(243,243,243,0.6)] leading-relaxed mb-8">
            Thank you for applying to the QWV Internship Programme. Our team will review your application and reach out within 5–7 business days.
          </p>
          <div className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase px-6 py-3 inline-block"
            style={{ background: 'rgba(14,118,255,0.1)', border: '1px solid rgba(14,118,255,0.3)', color: '#0e76ff' }}>
            Application Reference: QWV-INT-{Date.now().toString().slice(-6)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" ref={ref} className="relative py-32 overflow-hidden" style={{ background: '#060d1a' }}>
      <div className="absolute inset-0 z-0">{mounted && <FormGL />}</div>
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, #060d1a 0%, rgba(6,13,26,0.5) 50%, #060d1a 100%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-16" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.25em] uppercase text-[#0e76ff]">
              06 / Apply Now
            </span>
          </div>
          <h2 className="font-archivo font-bold leading-[1.1] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f3f3f3' }}>
            Begin Your<br />
            <span style={{ background: 'linear-gradient(135deg, #0e76ff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Quantum Journey
            </span>
          </h2>
          <p className="font-archivo text-[rgba(243,243,243,0.55)] max-w-xl leading-relaxed" style={{ fontSize: '1.05rem' }}>
            Complete the application form below. All fields marked with <span className="text-[#0e76ff]">*</span> are required. Applications are reviewed on a rolling basis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.2s',
        }}>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Step indicator */}
            <div className="mb-8 p-6" style={{ background: 'rgba(14,118,255,0.04)', border: '1px solid rgba(14,118,255,0.12)' }}>
              <div className="font-narrow text-[10px] font-medium tracking-[0.2em] uppercase mb-5 text-[rgba(243,243,243,0.4)]">
                Application Progress
              </div>
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: i < currentStep ? '#0e76ff' : i === currentStep ? 'rgba(14,118,255,0.15)' : 'rgba(14,118,255,0.05)',
                        border: `1px solid ${i <= currentStep ? '#0e76ff' : 'rgba(14,118,255,0.2)'}`,
                      }}>
                      {i < currentStep ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <span className="font-narrow text-[10px] font-medium" style={{ color: i === currentStep ? '#0e76ff' : 'rgba(243,243,243,0.3)' }}>
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <span className="font-archivo text-[13px] transition-colors duration-300"
                      style={{ color: i === currentStep ? '#f3f3f3' : i < currentStep ? 'rgba(243,243,243,0.6)' : 'rgba(243,243,243,0.3)' }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6 h-[2px] rounded-full" style={{ background: 'rgba(14,118,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%`, background: 'linear-gradient(90deg, #0e76ff, #60a5fa)' }} />
              </div>
              <div className="mt-2 font-narrow text-[10px] tracking-[0.1em] text-[rgba(243,243,243,0.35)]">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>

            {/* Programme info */}
            <div className="p-6" style={{ background: 'rgba(14,118,255,0.03)', border: '1px solid rgba(14,118,255,0.1)' }}>
              <div className="font-narrow text-[10px] font-medium tracking-[0.2em] uppercase mb-4 text-[rgba(243,243,243,0.4)]">
                Programme Highlights
              </div>
              {[
                { label: 'Duration', value: '6 Months' },
                { label: 'Modules', value: '6 Core Modules' },
                { label: 'Mentorship', value: 'Personal Mentor' },
                { label: 'Outcome', value: 'Certificate + Alumni' },
                { label: 'Eligibility', value: 'UG / PG / PhD' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(14,118,255,0.08)' }}>
                  <span className="font-narrow text-[11px] tracking-[0.05em] text-[rgba(243,243,243,0.4)]">{item.label}</span>
                  <span className="font-archivo text-[13px] font-medium text-[rgba(243,243,243,0.75)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="p-8" style={{ background: 'rgba(14,118,255,0.03)', border: '1px solid rgba(14,118,255,0.12)' }}>
                <div className="font-archivo font-semibold text-[#f3f3f3] text-lg mb-6">
                  {steps[currentStep]}
                </div>

                {/* Step 0: Personal Details */}
                {currentStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <FormField label="Full Name" name="fullName" placeholder="Your full name" required value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                    </div>
                    <FormField label="Email Address" name="email" type="email" placeholder="your@email.com" required value={formData.email} onChange={handleChange} error={errors.email} />
                    <FormField label="Phone Number" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required value={formData.phone} onChange={handleChange} error={errors.phone} />
                    <FormField label="City" name="city" placeholder="Your city" required value={formData.city} onChange={handleChange} error={errors.city} />
                    <FormField label="State" name="state" required value={formData.state} onChange={handleChange} error={errors.state} options={indianStates} />
                    <FormField label="Country" name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
                  </div>
                )}

                {/* Step 1: Academic Background */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <FormField label="Institution / University" name="institution" placeholder="Name of your institution" required value={formData.institution} onChange={handleChange} error={errors.institution} />
                    </div>
                    <FormField label="Qualification" name="qualification" required value={formData.qualification} onChange={handleChange} error={errors.qualification} options={qualifications} />
                    <FormField label="Current Year / Designation" name="designation" placeholder="e.g. 3rd Year B.Tech, PhD Scholar" required value={formData.designation} onChange={handleChange} error={errors.designation} />
                  </div>
                )}

                {/* Step 2: Programme Selection */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <FormField label="Internship Track" name="track" required value={formData.track} onChange={handleChange} error={errors.track} options={tracks} />
                    </div>
                    <div className="md:col-span-2">
                      <FormField label="Domain of Interest" name="domain" required value={formData.domain} onChange={handleChange} error={errors.domain} options={domains} />
                    </div>
                    <div className="md:col-span-2">
                      <FormField label="Availability to Start" name="availability" required value={formData.availability} onChange={handleChange} error={errors.availability} options={availabilityOptions} />
                    </div>
                  </div>
                )}

                {/* Step 3: Motivation */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <FormField
                      label="Why do you want to join the QWV Internship Programme?"
                      name="motivation"
                      type="textarea"
                      placeholder="Share your motivation, goals, and what you hope to achieve through this programme (minimum 80 characters)..."
                      required
                      value={formData.motivation}
                      onChange={handleChange}
                      error={errors.motivation}
                    />
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                        className="mt-1 flex-shrink-0"
                        style={{ accentColor: '#0e76ff', width: '16px', height: '16px' }}
                      />
                      <label htmlFor="terms" className="font-archivo text-[rgba(243,243,243,0.55)] text-[13px] leading-relaxed cursor-pointer">
                        I confirm that all information provided is accurate and I agree to the{' '}
                        <span className="text-[#0e76ff]">Internship Terms & Conditions</span>{' '}
                        and{' '}
                        <span className="text-[#0e76ff]">Privacy Policy</span>{' '}
                        of Quantum World Ventures.
                      </label>
                    </div>
                    {errors.terms && <p className="font-archivo text-[11px]" style={{ color: '#ef4444' }}>{errors.terms}</p>}
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(14,118,255,0.1)' }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="font-narrow text-[11px] font-medium tracking-[0.12em] uppercase px-6 py-3 transition-all duration-300 flex items-center gap-2"
                    style={{
                      background: currentStep === 0 ? 'transparent' : 'rgba(14,118,255,0.08)',
                      border: `1px solid ${currentStep === 0 ? 'rgba(14,118,255,0.1)' : 'rgba(14,118,255,0.25)'}`,
                      color: currentStep === 0 ? 'rgba(243,243,243,0.2)' : 'rgba(243,243,243,0.6)',
                      cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary font-narrow text-[11px] flex items-center gap-2 px-8 py-3"
                    >
                      Continue
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="btn-primary font-narrow text-[11px] flex items-center gap-2 px-8 py-3"
                      style={{ opacity: status === 'submitting' ? 0.7 : 1 }}
                    >
                      {status === 'submitting' ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 12 0 12 0v4a8 8 0 00-8 8H4z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
