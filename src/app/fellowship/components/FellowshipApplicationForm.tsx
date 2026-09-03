'use client';

import React, { useRef, useEffect, useState } from 'react';

// ===== GPU FORM BACKGROUND =====
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

      // Scanning grid
      const gridGroup = new THREE.Group();
      scene.add(gridGroup);
      for (let i = -8; i <= 8; i++) {
        const hGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-12, i * 1.2, 0),
          new THREE.Vector3(12, i * 1.2, 0),
        ]);
        const vGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i * 1.5, -10, 0),
          new THREE.Vector3(i * 1.5, 10, 0),
        ]);
        const mat = new THREE.LineBasicMaterial({ color: 0x0e76ff, transparent: true, opacity: 0.04 });
        gridGroup.add(new THREE.Line(hGeo, mat));
        gridGroup.add(new THREE.Line(vGeo, mat));
      }

      // Particle field
      const pCount = 600;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 35;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 25;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x0e76ff, size: 0.04, transparent: true, opacity: 0.18,
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
        gridGroup.rotation.z = Math.sin(t * 0.2) * 0.02;
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

// ===== FORM FIELD =====
function FormField({
  label, name, type = 'text', placeholder, required = false, value, onChange, error,
  options,
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
  };

  return (
    <div>
      <label className="block font-narrow text-[10px] font-medium tracking-[0.12em] uppercase mb-2"
        style={{ color: error ? '#ef4444' : 'rgba(243,243,243,0.5)' }}>
        {label}{required && <span className="text-[#0e76ff] ml-1">*</span>}
      </label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          style={{ ...baseStyle, appearance: 'none', cursor: 'pointer' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0e76ff'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'rgba(243,243,243,0.1)'; }}
        >
          <option value="" style={{ background: '#060d1a' }}>Select {label}</option>
          {options.map(opt => (
            <option key={opt} value={opt} style={{ background: '#060d1a' }}>{opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          style={baseStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0e76ff'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'rgba(243,243,243,0.1)'; }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={baseStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0e76ff'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'rgba(243,243,243,0.1)'; }}
        />
      )}
      {error && (
        <p className="font-archivo text-[11px] mt-1.5" style={{ color: '#ef4444' }}>{error}</p>
      )}
    </div>
  );
}

interface FormData {
  fullName: string; email: string; phone: string; institution: string;
  designation: string; city: string; state: string; country: string;
  qualification: string; specialization: string; tier: string;
  researchInterest: string; motivation: string; terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const specializations = [
  'Quantum Computing Research', 'Quantum Communication & QKD', 'Quantum Sensing & Metrology',
  'Quantum Medical Imaging', 'Quantum AI & Machine Learning', 'Quantum Education & L&D',
  'Quantum Financial Systems', 'Quantum Cybersecurity', 'Quantum Photonics & Optics',
  'Quantum Materials & Devices', 'Quantum Policy & Governance', 'Deep-Tech Entrepreneurship',
  'Quantum Health Informatics', 'Quantum AgriTech & Climate', 'Quantum Defence & National Security',
  'Quantum Energy Systems', 'Quantum Smart Infrastructure', 'Fundamental Quantum Research',
  'Quantum Workforce Development', 'Translational Quantum Research', 'Global Quantum Collaboration',
];

const tiers = [
  'T1 — Campus Ambassador', 'T2 — Student Fellow', 'T3 — Faculty Fellow',
  'T4 — Senior Fellow', 'T5 — Fellow of Fellows',
];

const qualifications = ['Undergraduate (UG)', 'Postgraduate (PG)', 'PhD / Doctoral', 'Post-Doctoral', 'Faculty / Academic', 'Industry Professional', 'Researcher', 'Entrepreneur'];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Other',
];

export default function FellowshipApplicationForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState<FormData>({
    fullName: '', email: '', phone: '', institution: '',
    designation: '', city: '', state: '', country: 'India',
    qualification: '', specialization: '', tier: '',
    researchInterest: '', motivation: '', terms: false,
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[+\d\s\-()]{8,15}$/.test(formData.phone)) newErrors.phone = 'Enter a valid phone number';
    if (!formData.institution.trim()) newErrors.institution = 'Institution / Organisation is required';
    if (!formData.qualification) newErrors.qualification = 'Please select your qualification';
    if (!formData.specialization) newErrors.specialization = 'Please select a specialization';
    if (!formData.tier) newErrors.tier = 'Please select a fellowship tier';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'Please select your state';
    if (!formData.motivation.trim()) newErrors.motivation = 'Please share your motivation';
    else if (formData.motivation.trim().length < 50) newErrors.motivation = 'Please write at least 50 characters';
    if (!formData.terms) newErrors.terms = 'You must accept the terms to proceed';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus('success');
  };

  return (
    <section
      ref={ref}
      id="apply"
      className="relative overflow-hidden border-t border-white/5"
      style={{ background: '#060d1a' }}
    >
      {/* GPU background */}
      <div className="absolute inset-0 z-0 opacity-30">
        {mounted && <FormGL />}
      </div>

      <div className="absolute inset-0 z-[1]" style={{
        background: 'radial-gradient(ellipse 50% 60% at 50% 30%, rgba(14,118,255,0.06) 0%, transparent 60%)',
      }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-6 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">
              06 / FELLOWSHIP APPLICATION
            </span>
            <div className="w-6 h-[1px] bg-[#0e76ff]" />
          </div>
          <h2 className="section-headline text-[#f3f3f3] mb-6">
            Apply for the
            <span className="block" style={{ color: '#0e76ff' }}>Fellowship Program</span>
          </h2>
          <p className="font-archivo text-[15px] leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(243,243,243,0.55)' }}>
            Begin your quantum research journey. Complete the application below and our fellowship 
            team will review your submission and reach out within 5–7 business days.
          </p>
        </div>

        {/* Form */}
        <div
          className="max-w-4xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
          }}
        >
          {status === 'success' ? (
            <div
              className="text-center py-20 border border-white/8"
              style={{ background: 'rgba(14,118,255,0.03)' }}
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#0e76ff]/30"
                style={{ background: 'rgba(14,118,255,0.08)' }}>
                <svg className="w-8 h-8 text-[#0e76ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-archivo font-medium text-[24px] text-[#f3f3f3] mb-4">
                Application Submitted
              </h3>
              <p className="font-archivo text-[15px] mb-8 max-w-md mx-auto" style={{ color: 'rgba(243,243,243,0.55)' }}>
                Thank you for applying to the Quantum World Ventures Fellowship Program. 
                Our team will review your application and contact you within 5–7 business days.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="btn-ghost font-narrow text-[11px]"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="border border-white/8 p-8 md:p-12" style={{ background: 'rgba(14,118,255,0.01)' }}>
                {/* Section: Personal Information */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/6">
                    <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff]">
                      01 / Personal Information
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Full Name" name="fullName" placeholder="Your full name" required
                      value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                    <FormField label="Email Address" name="email" type="email" placeholder="your@email.com" required
                      value={formData.email} onChange={handleChange} error={errors.email} />
                    <FormField label="Phone Number" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required
                      value={formData.phone} onChange={handleChange} error={errors.phone} />
                    <FormField label="City" name="city" placeholder="Your city" required
                      value={formData.city} onChange={handleChange} error={errors.city} />
                    <FormField label="State" name="state" required
                      value={formData.state} onChange={handleChange} error={errors.state}
                      options={indianStates} />
                    <FormField label="Country" name="country" placeholder="India"
                      value={formData.country} onChange={handleChange} />
                  </div>
                </div>

                {/* Section: Academic / Professional */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/6">
                    <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff]">
                      02 / Academic & Professional Background
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Institution / Organisation" name="institution" placeholder="University, company, or institution" required
                      value={formData.institution} onChange={handleChange} error={errors.institution} />
                    <FormField label="Designation / Role" name="designation" placeholder="Student, Researcher, Faculty, etc."
                      value={formData.designation} onChange={handleChange} />
                    <FormField label="Highest Qualification" name="qualification" required
                      value={formData.qualification} onChange={handleChange} error={errors.qualification}
                      options={qualifications} />
                    <FormField label="Research Interest / Domain" name="researchInterest" placeholder="e.g. Quantum Computing, AI, MedTech"
                      value={formData.researchInterest} onChange={handleChange} />
                  </div>
                </div>

                {/* Section: Fellowship Selection */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/6">
                    <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff]">
                      03 / Fellowship Selection
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Specialization Track" name="specialization" required
                      value={formData.specialization} onChange={handleChange} error={errors.specialization}
                      options={specializations} />
                    <FormField label="Fellowship Tier" name="tier" required
                      value={formData.tier} onChange={handleChange} error={errors.tier}
                      options={tiers} />
                  </div>
                </div>

                {/* Section: Motivation */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/6">
                    <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff]">
                      04 / Statement of Motivation
                    </span>
                  </div>
                  <FormField
                    label="Why do you want to join the Fellowship Program?"
                    name="motivation"
                    type="textarea"
                    placeholder="Describe your motivation, research goals, and what you hope to achieve through this fellowship (minimum 50 characters)..."
                    required
                    value={formData.motivation}
                    onChange={handleChange}
                    error={errors.motivation}
                  />
                  <div className="mt-2 text-right">
                    <span className="font-narrow text-[10px]" style={{ color: 'rgba(243,243,243,0.3)' }}>
                      {formData.motivation.length} characters
                    </span>
                  </div>
                </div>

                {/* Terms */}
                <div className="mb-8">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className="w-4 h-4 border transition-all duration-200"
                        style={{
                          borderColor: errors.terms ? '#ef4444' : formData.terms ? '#0e76ff' : 'rgba(243,243,243,0.2)',
                          background: formData.terms ? '#0e76ff' : 'transparent',
                        }}
                      >
                        {formData.terms && (
                          <svg className="w-3 h-3 text-white m-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="font-archivo text-[13px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.55)' }}>
                      I agree to the{' '}
                      <span className="text-[#0e76ff] cursor-pointer hover:underline">Fellowship Terms & Conditions</span>
                      {' '}and consent to Quantum World Ventures processing my application data for fellowship evaluation purposes.
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="font-archivo text-[11px] mt-2 ml-7" style={{ color: '#ef4444' }}>{errors.terms}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-primary flex items-center gap-2 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ minWidth: '200px', justifyContent: 'center' }}
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting Application...
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
                  <p className="font-narrow text-[10px] font-medium tracking-[0.08em] uppercase" style={{ color: 'rgba(243,243,243,0.3)' }}>
                    Response within 5–7 business days
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
