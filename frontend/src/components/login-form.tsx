import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, CheckCircle2, X, Mail } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export function SignInPage({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', email, password);
    onLogin(email, password);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password for:', resetEmail);
    setShowForgotPassword(false);
    setResetEmail('');
  };

  const features = [
    'Generate professional offer letters instantly',
    'Customizable templates for every role',
    'Legally reviewed and compliant formats',
    'Multi-organization support',
  ];

  return (
    <>
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowForgotPassword(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-md relative"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 p-2 rounded-lg"
              style={{ color: '#94a3b8' }}
            >
              <X size={20} />
            </button>
            <div className="mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
              >
                <Mail size={24} style={{ color: '#fff' }} />
              </div>
              <h2
                className="mb-2"
                style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}
              >
                Reset Password
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Enter your email and we'll send a reset link.
              </p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="reset-email"
                  style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase' }}
                >
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  placeholder="admin@company.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a', fontSize: '0.9rem' }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 py-3 rounded-xl"
                  style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="min-h-screen w-full flex">
        {/* Left brand panel */}
        <div
          className="hidden lg:flex lg:w-[46%] flex-col justify-between p-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #0a0a14 0%, #12122a 50%, #0d1a2e 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div
            className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
              >
                <span className="text-white text-sm" style={{ fontWeight: 700 }}>H+</span>
              </div>
              <span className="text-white" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                HrLetterPlus
              </span>
            </div>
          </div>

          {/* Center */}
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs uppercase"
                style={{ background: 'rgba(99,102,241,0.18)', color: '#a5b4fc' }}
              >
                Admin Portal
              </div>
              <h2
                className="text-white"
                style={{ fontSize: '2.6rem', fontWeight: 700, lineHeight: 1.15 }}
              >
                HR letters,<br />
                <span style={{ background: 'linear-gradient(90deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  done right.
                </span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Create, manage, and deliver offer letters with precision.
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
              {[
                { value: '50K+', label: 'Letters Generated' },
                { value: '2.5K+', label: 'Companies' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-white" style={{ fontSize: '2rem', fontWeight: 700 }}>
                    {stat.value}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
            >
              <span className="text-white text-sm" style={{ fontWeight: 700 }}>H+</span>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>HrLetterPlus</span>
          </div>

          <div
            className="w-full max-w-[400px] p-8 rounded-2xl"
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
          >
            <div className="mb-10">
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
                Welcome back
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Sign in to your admin account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase' }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    background: focused === 'email' ? '#f8f7ff' : '#f8fafc',
                    border: focused === 'email' ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase' }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 500 }}
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all"
                    style={{
                      background: focused === 'password' ? '#f8f7ff' : '#f8fafc',
                      border: focused === 'password' ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
                      color: '#0f172a',
                      fontSize: '0.9rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#94a3b8' }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl transition-all mt-2"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
                }}
              >
                Sign In
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>or</span>
              <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            </div>

            {/* Switch */}
            <p className="text-center" style={{ fontSize: '0.875rem', color: '#64748b' }}>
              New to HrLetterPlus?{' '}
              <button
                onClick={onSwitchToRegister}
                style={{ color: '#6366f1', fontWeight: 600 }}
                className="hover:underline underline-offset-2"
              >
                Create an account
              </button>
            </p>

            <p className="text-center mt-10" style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
              © 2026 HrLetterPlus · All rights reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
}