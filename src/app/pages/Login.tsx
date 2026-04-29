import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap } from 'lucide-react';
import { detectSchool, nameFromEmail, setUser, getUser } from '../lib/auth';
import { getTheme } from '../lib/theme';

/* SchoolBadge — small banner at the top of the Login card.
 * Shown only when the email's domain matches a recognised school.
 * Format: "University of <mascot emoji>", colored with the school's
 * theme tokens. We dropped the image-based logo because cross-origin
 * image hotlinks proved unreliable. */
function SchoolBadge({
  mascot,
  primary,
  soft,
}: {
  mascot: string;
  primary: string;
  soft: string;
}) {
  return (
    <div
      className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 mb-4 transition-colors"
      style={{ backgroundColor: soft, border: `1px solid ${primary}22` }}
    >
      <span
        className="text-[15px] font-semibold tracking-tight"
        style={{ color: primary }}
      >
        University&nbsp;of
      </span>
      <span className="text-2xl leading-none" aria-hidden>
        {mascot}
      </span>
    </div>
  );
}

/* =========================================================================
 *  Login page
 *  Demo-only auth: any email + password is accepted. The email's domain
 *  determines which school theme the app uses afterwards:
 *      ...@nyu.edu       -> purple   + NYU bobcat
 *      ...@columbia.edu  -> blue     + Columbia lion
 *      ...@cornell.edu   -> red      + Cornell bear
 *      ...@fordham.edu   -> maroon   + Fordham ram
 *      anything else     -> default orange ("guest")
 *  When a recognised .edu domain is detected we also show the school's
 *  logo + mascot emoji in a small badge at the top of the form card.
 * ========================================================================= */

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If the user is already logged in, jump straight to home.
  useEffect(() => {
    if (getUser()) navigate('/', { replace: true });
  }, [navigate]);

  // Live-detected school based on what the user has typed so far.
  const previewSchool = useMemo(() => detectSchool(email), [email]);
  const previewTheme = getTheme(previewSchool);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setSubmitting(true);
    setError(null);

    // No real auth — just persist the user locally and route home.
    const school = detectSchool(email);
    setUser({
      email: email.trim(),
      name: nameFromEmail(email.trim()),
      school,
      loggedInAt: new Date().toISOString(),
    });

    // Tiny delay so the spinner is visible — feels less abrupt.
    setTimeout(() => navigate('/', { replace: true }), 250);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-5 py-10 transition-colors"
      style={{
        background: `linear-gradient(160deg, ${previewTheme.soft} 0%, #FDF6EE 100%)`,
      }}
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center size-14 sm:size-16 rounded-2xl shadow-lg mb-3 transition-colors"
            style={{ backgroundColor: previewTheme.primary }}
          >
            <GraduationCap className="size-7 sm:size-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1A0E] tracking-tight">
            Welcome to NumNum
          </h1>
          <p className="text-[13px] sm:text-sm text-[#8A8078] mt-1">
            For the Asian Community · Sign in to start
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-[#F0EBE3] p-5 sm:p-6"
        >
          {/* School badge — only shown when a recognised .edu domain is detected.
              Sits at the top of the card per Cynthia's spec. */}
          {previewSchool !== 'guest' && (
            <SchoolBadge
              mascot={previewTheme.mascot}
              primary={previewTheme.primary}
              soft={previewTheme.soft}
            />
          )}

          <h2 className="text-[15px] font-semibold text-[#2C1A0E] mb-4">
            Sign in with your school email
          </h2>

          {/* Email */}
          <label className="block text-[12px] font-medium text-[#8A8078] mb-1.5">
            Email
          </label>
          <div className="flex items-center gap-2 px-3 h-12 rounded-xl border border-[#E0D8D0] mb-3 focus-within:border-[var(--brand-primary,#E8603C)] transition-colors">
            <Mail className="size-4 text-[#8A8078] flex-shrink-0" />
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@columbia.edu"
              className="flex-1 bg-transparent outline-none text-sm text-[#2C1A0E] placeholder:text-[#B4B2A9] min-w-0"
            />
            {previewSchool !== 'guest' && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap flex-shrink-0"
                style={{ backgroundColor: previewTheme.primary }}
              >
                {previewTheme.label}
              </span>
            )}
          </div>

          {/* Password */}
          <label className="block text-[12px] font-medium text-[#8A8078] mb-1.5">
            Password
          </label>
          <div className="flex items-center gap-2 px-3 h-12 rounded-xl border border-[#E0D8D0] focus-within:border-[var(--brand-primary,#E8603C)] transition-colors">
            <Lock className="size-4 text-[#8A8078] flex-shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 4 characters"
              className="flex-1 bg-transparent outline-none text-sm text-[#2C1A0E] placeholder:text-[#B4B2A9] min-w-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-[#8A8078] hover:text-[#2C1A0E]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {error && (
            <div className="mt-3 text-[12px] text-[#993C1D] bg-[#FFF6F5] border border-[#F4CBC4] rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Hint */}
          <p className="text-[11px] text-[#8A8078] mt-3 leading-relaxed">
            <strong>Demo only.</strong> Any password works. The school theme is
            picked automatically from your email domain.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            style={{ backgroundColor: previewTheme.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = previewTheme.primaryDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = previewTheme.primary)}
          >
            {submitting ? 'Signing in…' : (
              <>
                Continue <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-[11px] text-[#B4B2A9] text-center mt-6">
          By continuing you agree to use this prototype for academic
          coursework only.
        </p>
      </div>
    </div>
  );
}
