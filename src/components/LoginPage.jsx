import { useState } from "react";

import Logo from "./Logo";

const inputClass =
  "w-full rounded-xl border border-[#E6E2FA] bg-white px-4 py-3 text-[#181E56] outline-none transition placeholder:text-[#615F75]/60 focus:border-[#8060F5] focus:ring-2 focus:ring-[#8060F5]/20";

export default function LoginPage({
  onLogin,
  onRegister,
  onForgotPassword,
  onBack,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);

      if (onLogin) {
        await onLogin({
          email: email.trim(),
          password,
          rememberMe,
        });
      }
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-[#F3F1FF] px-4 py-8">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-sm font-semibold text-[#6C55F5] transition hover:text-[#8060F5]"
        >
          ← Back
        </button>

        <div className="rounded-2xl border border-[#E6E2FA] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex justify-center">
            <Logo size={56} />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-2xl font-extrabold text-[#181E56]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[#615F75]">
              Sign in to continue learning.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#181E56]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                aria-invalid={Boolean(error)}
                className={inputClass}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#181E56]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  aria-invalid={Boolean(error)}
                  className={`${inputClass} pr-16`}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-1 text-sm font-semibold text-[#6C55F5] hover:text-[#8060F5]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* REMEMBER ME + FORGOT PASSWORD */}
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="remember"
                className="flex cursor-pointer items-center gap-2 text-sm text-[#615F75]"
              >
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-[#8060F5]"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-semibold text-[#6C55F5] hover:text-[#8060F5]"
              >
                Forgot password?
              </button>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8060F5] py-3 text-base font-bold text-white transition hover:bg-[#6C55F5] focus:outline-none focus:ring-2 focus:ring-[#8060F5]/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#615F75]">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onRegister}
              className="font-bold text-[#6C55F5] hover:text-[#8060F5]"
            >
              Create account
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#615F75]/70">
          © 2026 LearnCraft
        </p>
      </div>
    </div>
  );
}
