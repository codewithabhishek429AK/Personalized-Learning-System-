
import { useState } from "react";

export default function RegistrationPage({
  onRegister,
  onLogin,
  onBack,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Full Name Validation
    if (name.trim().length < 3) {
      setError("Please enter your full name (minimum 3 characters).");
      return;
    }

    // Email Validation
    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password Validation
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Confirm Password Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Terms Validation
    if (!agreeTerms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    try {
      setIsLoading(true);

      if (onRegister) {
        await onRegister({
          name: name.trim(),
          email: email.trim(),
          password,
        });
      }
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F1FF] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT BRANDING SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#010737] via-[#172A9B] to-[#3B0CA3] text-white flex flex-col items-center justify-center p-8 md:p-12">

          {/* Background Decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-purple-500/30 blur-3xl" />

          {/* LEARNCRAFT LOGO */}
          <div className="relative w-full max-w-[380px] rounded-2xl bg-white p-4 shadow-2xl">

            <img
              src="/Images/LearnCraft-Logo.png"
              alt="LearnCraft Logo"
              className="block w-full h-auto object-contain"
            />

          </div>

          {/* BRAND CONTENT */}
          <div className="relative text-center mt-9">

            <h1 className="text-3xl md:text-4xl font-extrabold">
              Start Learning.
              <br />
              Start Growing.
            </h1>

            <p className="text-blue-100 mt-5 max-w-sm leading-relaxed">
              Create your LearnCraft account and begin
              your personalized learning journey today.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">

              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
                Smart Learning
              </span>

              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
                Learn at Your Pace
              </span>

            </div>

          </div>
        </div>

        {/* RIGHT REGISTRATION SECTION */}
        <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">

          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={onBack}
            className="self-start text-sm font-semibold text-[#6840D9] hover:text-[#3B0CA3] mb-6"
          >
            ← Back
          </button>

          {/* HEADING */}
          <div className="mb-7">

            <p className="text-sm font-bold uppercase tracking-widest text-[#6840D9] mb-3">
              Join LearnCraft
            </p>

            <h2 className="text-3xl md:text-4xl font-extrabold text-[#010737]">
              Create Account
            </h2>

            <p className="text-[#333B69] mt-3">
              Enter your details to get started.
            </p>

          </div>

          {/* REGISTRATION FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FULL NAME */}
            <div>

              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[#010737] mb-2"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#DCD8FF] outline-none focus:border-[#6840D9] focus:ring-2 focus:ring-[#6840D9]/20 transition"
                required
              />

            </div>

            {/* EMAIL */}
            <div>

              <label
                htmlFor="register-email"
                className="block text-sm font-semibold text-[#010737] mb-2"
              >
                Email Address
              </label>

              <input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#DCD8FF] outline-none focus:border-[#6840D9] focus:ring-2 focus:ring-[#6840D9]/20 transition"
                required
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label
                htmlFor="register-password"
                className="block text-sm font-semibold text-[#010737] mb-2"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (8+ characters)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 pr-20 rounded-xl border border-[#DCD8FF] outline-none focus:border-[#6840D9] focus:ring-2 focus:ring-[#6840D9]/20 transition"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6840D9]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div>

              <label
                htmlFor="confirm-password"
                className="block text-sm font-semibold text-[#010737] mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">

                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 pr-20 rounded-xl border border-[#DCD8FF] outline-none focus:border-[#6840D9] focus:ring-2 focus:ring-[#6840D9]/20 transition"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6840D9]"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* TERMS & CONDITIONS */}
            <div className="flex items-start gap-2 pt-1">

              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setError("");
                }}
                className="w-4 h-4 mt-1 accent-[#6840D9] cursor-pointer"
              />

              <label
                htmlFor="terms"
                className="text-sm text-[#333B69] cursor-pointer"
              >
                I agree to the Terms & Conditions and Privacy Policy.
              </label>

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

            {/* CREATE ACCOUNT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-[#1237D5] to-[#6416C8] hover:opacity-90 hover:shadow-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account →"}
            </button>

          </form>

          {/* LOGIN LINK */}
          <div className="text-center mt-6">

            <p className="text-sm text-[#333B69]">
              Already have an account?{" "}

              <button
                type="button"
                onClick={onLogin}
                className="font-bold text-[#6840D9] hover:text-[#3B0CA3]"
              >
                Sign In
              </button>

            </p>

          </div>

          {/* FOOTER */}
          <p className="text-center text-xs text-gray-400 mt-7">
            © 2026 LearnCraft. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  );
}
