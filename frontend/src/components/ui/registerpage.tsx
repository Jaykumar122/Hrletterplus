import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RegisterPageProps {
  onSwitchToSignIn: () => void;
  onRegister: (name: string, email: string, password: string) => void;
}
export function RegisterPage({ onSwitchToSignIn, onRegister }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: '',
  });

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  console.log('handleSubmit called')
  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match')
    return
  }
  onRegister(formData.fullName, formData.email, formData.password) // ← now works
}

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const inputStyle = (field: string) => ({
    background: focused === field ? '#f8f7ff' : '#f8fafc',
    border: focused === field ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
    color: '#0f172a',
    fontSize: '0.9rem',
  });

  const labelStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#374151',
    letterSpacing: '0.01em',
    textTransform: 'uppercase',
  };

  const features = [
    'Generate professional offer letters instantly',
    'Customizable templates for every role',
    'Legally reviewed and compliant formats',
    'Multi-organization support',
  ];

  return (
    <div className="min-h-screen w-full flex">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex lg:w-[46%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0a0a14 0%, #12122a 50%, #0d1a2e 100%)' }}
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating circles */}
        <div
          className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 right-[10%] w-[300px] h-[300px] rounded-full opacity-5"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, #a78bfa 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, #ec4899 0%, transparent 55%),
              radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 65%)
            `,
            filter: 'blur(40px)'
          }}
        />

        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
            >
              <span className="text-white text-sm" style={{ fontWeight: 700 }}>H+</span>
            </div>
            <span className="text-white tracking-wide" style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              HrLetterPlus
            </span>
          </div>
        </div>

        {/* Center: Headline */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs tracking-widest uppercase"
              style={{ background: 'rgba(99,102,241,0.18)', color: '#a5b4fc', letterSpacing: '0.15em' }}
            >
              Admin Portal
            </div>
            <h2
              className="text-white"
              style={{ fontSize: '2.6rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' }}
            >
              HR letters,<br />
              <span style={{ background: 'linear-gradient(90deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                done right.
              </span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Create, manage, and deliver offer letters with precision — built for modern HR teams.
            </p>
          </div>

          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: '#34d399' }} />
                <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{f}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="space-y-1">
              <div
                className="text-white"
                style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                50K+
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                Letters Generated
              </div>
            </div>
            <div className="space-y-1">
              <div
                className="text-white"
                style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                2.5K+
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                Companies
              </div>
            </div>
            <div className="space-y-1">
              <div
                className="text-white"
                style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                99.9%
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                Uptime
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
          >
            <span className="text-white text-sm" style={{ fontWeight: 700 }}>H+</span>
          </div>
          <span className="tracking-wide" style={{ fontSize: '1.1rem', fontWeight: 600 }}>HrLetterPlus</span>
        </div>

        <div
          className="w-full max-w-[420px] p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1
              className="mb-1.5"
              style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}
            >
              Create your account
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" style={labelStyle}>Full Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="Jane Smith"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                onFocus={() => setFocused('fullName')}
                onBlur={() => setFocused(null)}
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={inputStyle('fullName')}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" style={labelStyle}>Work Email</label>
              <input
                id="email"
                type="email"
                placeholder="jane@company.com"
                value={formData.email}
                onChange={handleChange('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={inputStyle('email')}
              />
            </div>

            {/* Organization */}
            <div className="space-y-1.5">
              <label htmlFor="organization" style={labelStyle}>Organization</label>
              <input
                id="organization"
                type="text"
                placeholder="Company Name"
                value={formData.organization}
                onChange={handleChange('organization')}
                onFocus={() => setFocused('organization')}
                onBlur={() => setFocused(null)}
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={inputStyle('organization')}
              />
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="password" style={labelStyle}>Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create"
                    value={formData.password}
                    onChange={handleChange('password')}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    required
                    className="w-full px-4 py-3 pr-10 rounded-xl outline-none transition-all"
                    style={inputStyle('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#94a3b8' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" style={labelStyle}>Confirm</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    onFocus={() => setFocused('confirmPassword')}
                    onBlur={() => setFocused(null)}
                    required
                    className="w-full px-4 py-3 pr-10 rounded-xl outline-none transition-all"
                    style={inputStyle('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#94a3b8' }}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
              By creating an account you agree to our{' '}
              <span style={{ color: '#6366f1', cursor: 'pointer' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: '#6366f1', cursor: 'pointer' }}>Privacy Policy</span>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.01em',
                boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
              }}
            >
              Create Account
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>or</span>
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          </div>

          {/* Switch */}
          <p className="text-center" style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToSignIn}
              style={{ color: '#6366f1', fontWeight: 600 }}
              className="hover:underline underline-offset-2"
            >
              Sign in
            </button>
          </p>

          {/* Footer */}
          <p className="text-center mt-8" style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
            © 2026 HrLetterPlus · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
