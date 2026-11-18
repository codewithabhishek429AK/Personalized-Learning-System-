
import { useState } from "react";

import Logo from "./Logo";

export default function ForgotPasswordPage({
  onBack,
  onLogin,
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Demo success message
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F3F1FF]">

      {/* MAIN CONTAINER */}
      <div className="flex min-h-screen flex-col lg:flex-row">

        {/* LEFT BRANDING SECTION */}
        <div className="relative flex w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1237D5] via-[#2928C7] to-[#6416C8] p-8 text-white lg:w-1/2 lg:p-14">

          {/* Background Decoration */}
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#AFA0FF]/20 blur-3xl" />

          {/* Logo */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl">
              <Logo size={40} to={null} />
            </div>
          </div>

          {/* Branding Content */}
          <div className="relative z-10 my-12 max-w-lg">

            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-4xl backdrop-blur-md">
              🔐
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Don't Worry!
              <br />
              We've Got You.
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/80">
              Forgetting a password happens. Reset it and get
              back to your personalized learning journey.
            </p>

            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  ✓
                </span>
                <span className="text-white/90">
                  Simple password recovery
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  ✓
                </span>
                <span className="text-white/90">
                  Secure account access
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  ✓
                </span>
                <span className="text-white/90">
                  Continue learning without interruption
                </span>
              </div>

            </div>
          </div>

          {/* Footer */}
          <p className="relative z-10 text-sm text-white/60">
            © 2026 LearnCraft | Personalized Learning System
          </p>

        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex w-full items-center justify-center px-5 py-12 lg:w-1/2 lg:px-12">

          <div className="w-full max-w-md">

            {/* Back Button */}
            <button
              onClick={onBack}
              className="mb-10 flex items-center gap-2 font-semibold text-[#333B69] transition hover:text-[#3B0CA3]"
            >
              <span className="text-xl">←</span>
              Back
            </button>

            {/* Form Heading */}
            <div className="mb-8">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#AFA0FF]/25 text-2xl">
                ✉️
              </div>

              <h2 className="text-3xl font-extrabold text-[#010737] md:text-4xl">
                Forgot Password?
              </h2>

              <p className="mt-4 leading-7 text-[#333B69]">
                Enter your registered email address. We'll help
                you recover access to your account.
              </p>

            </div>

            {/* Success Message */}
            {success ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
                  ✓
                </div>

                <h3 className="text-xl font-bold text-green-800">
                  Request Submitted!
                </h3>

                <p className="mt-3 leading-7 text-green-700">
                  Demo request received for{" "}
                  <strong>{email}</strong>.
                  <br />
                  Actual password reset emails will work after
                  backend integration.
                </p>

                <button
                  onClick={onLogin}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#1237D5] to-[#6416C8] py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  Back to Login
                </button>

              </div>
            ) : (

              /* Forgot Password Form */
              <form onSubmit={handleSubmit}>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-[#010737]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your registered email"
                  className="w-full rounded-xl border border-[#DCD8FF] bg-white px-4 py-4 text-[#010737] outline-none transition placeholder:text-gray-400 focus:border-[#6840D9] focus:ring-4 focus:ring-[#6840D9]/10"
                />

                {/* Error Message */}
                {error && (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#1237D5] to-[#6416C8] py-4 font-bold text-white shadow-lg shadow-[#6840D9]/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Send Reset Link →
                </button>

              </form>
            )}

            {/* Login Link */}
            <div className="mt-8 text-center">

              <p className="text-sm text-[#333B69]">
                Remember your password?{" "}
                <button
                  onClick={onLogin}
                  className="font-bold text-[#3B0CA3] hover:underline"
                >
                  Sign In
                </button>
              </p>

            </div>

            {/* Security Note */}
            <div className="mt-10 rounded-xl border border-[#DCD8FF] bg-white p-4">

              <p className="text-center text-xs leading-6 text-[#333B69]">
                🔒 Your account security matters to us.
                <br />
                Password recovery will be securely handled
                after backend integration.
              </p>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
