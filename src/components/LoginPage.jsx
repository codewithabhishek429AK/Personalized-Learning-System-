
import { useState } from "react";

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F1FF] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT BRANDING SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#010737] via-[#172A9B] to-[#3B0CA3] text-white flex flex-col items-center justify-center p-8 md:p-12">

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

          <div className="relative text-center mt-9">

            <h1 className="text-3xl md:text-4xl font-extrabold">
              Learn Smarter.
              <br />
              Grow Faster.
            </h1>

            <p className="text-blue-100 mt-5 max-w-sm leading-relaxed">
              Your personalized learning journey starts here.
              Learn at your own pace and achieve your goals.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">

              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
                Smart Learning
              </span>

              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
                Personalized Growth
              </span>

            </div>
          </div>
        </div>

        {/* RIGHT LOGIN SECTION */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">

          <button
            type="button"
            onClick={onBack}
            className="self-start text-sm font-semibold text-[#6840D9] hover:text-[#3B0CA3] mb-8"
          >
            ← Back to Home
          </button>

          <div className="mb-8">

            <p className="text-sm font-bold uppercase tracking-widest text-[#6840D9] mb-3">
              Welcome to LearnCraft
            </p>

            <h2 className="text-3xl md:text-4xl font-extrabold text-[#010737]">
              Welcome Back!
            </h2>

            <p className="text-[#333B69] mt-3">
              Sign in with your registered email address.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#010737] mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your registered email"
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

              <div className="flex justify-between items-center mb-2">

                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[#010737]"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm font-semibold text-[#6840D9] hover:text-[#3B0CA3]"
                >
                  Forgot Password?
                </button>

              </div>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            {/* REMEMBER ME */}
            <div className="flex items-center gap-2">

              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#6840D9] cursor-pointer"
              />

              <label
                htmlFor="remember"
                className="text-sm text-[#333B69] cursor-pointer"
              >
                Remember me
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

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-[#1237D5] to-[#6416C8] hover:opacity-90 hover:shadow-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In →"}
            </button>

          </form>

          {/* REGISTER LINK */}
          <div className="text-center mt-8">

            <p className="text-sm text-[#333B69]">
              Don't have an account?{" "}

              <button
                type="button"
                onClick={onRegister}
                className="font-bold text-[#6840D9] hover:text-[#3B0CA3]"
              >
                Create Account
              </button>
            </p>

          </div>

          <p className="text-center text-xs text-gray-400 mt-10">
            © 2026 LearnCraft. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  );
}
