"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight, Lock, Mail, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!email || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await login({ email: email.trim(), password });

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/products");
      }, 700);
    } else {
      setError(result.error || "Invalid credentials. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-5 text-center sm:text-left">
        <h1 className="text-3xl font-black tracking-tight text-neutral-950 mb-1.5">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-neutral-600">
          Sign in to access your digital NFC card dashboard and analytics.
        </p>
      </div>

      {/* Error Alert Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            className="mb-4 p-3.5 rounded-xl bg-rose-50 border-2 border-rose-200 flex items-start gap-2.5 text-rose-900 text-xs shadow-2xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-black block text-rose-950 text-xs">Authentication Failed</span>
              <span className="font-semibold text-rose-800">{error}</span>
            </div>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-200 flex items-center gap-2.5 text-emerald-900 text-xs shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="font-black text-emerald-950">Login successful! Redirecting...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-wider text-neutral-800 mb-1.5">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-rose-600 transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              disabled={isSubmitting || isSuccess}
              className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-white border-2 border-neutral-200 hover:border-neutral-300 text-neutral-950 placeholder-neutral-400 text-xs font-bold shadow-2xs focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-wider text-neutral-800">
              Password
            </label>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Please contact support@tagit.cards to reset your password or use the mobile app.");
              }}
              className="text-[11px] text-rose-600 hover:text-rose-700 transition-colors font-extrabold"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-rose-600 transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={isSubmitting || isSuccess}
              className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border-2 border-neutral-200 hover:border-neutral-300 text-neutral-950 placeholder-neutral-400 text-xs font-bold shadow-2xs focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting || isSuccess}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-800 transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-700 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-neutral-300 bg-white text-rose-600 focus:ring-rose-500/20 focus:ring-offset-0 transition-colors cursor-pointer"
            />
            Remember me on this device
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none mt-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing you in...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Redirecting...
            </>
          ) : (
            <>
              Sign In to TAGIT <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase font-black">
          <span className="bg-white lg:bg-[#FCFCFD] px-3 text-neutral-400 tracking-wider">Or continue with</span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => alert("Social SSO integration coming soon! Please sign in with email/password.")}
          className="py-3 px-4 rounded-xl bg-white border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-extrabold text-neutral-800 transition-all flex items-center justify-center gap-2 shadow-2xs"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#4285F4"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={() => alert("Social SSO integration coming soon! Please sign in with email/password.")}
          className="py-3 px-4 rounded-xl bg-white border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-extrabold text-neutral-800 transition-all flex items-center justify-center gap-2 shadow-2xs"
        >
          <svg className="w-3.5 h-3.5 fill-current text-neutral-950" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.64-.78 1.08-1.86.96-2.94-.92.04-2.03.62-2.68 1.39-.58.68-1.1 1.78-.96 2.85 1.03.08 2.04-.52 2.68-1.3" />
          </svg>
          Apple
        </button>
      </div>

      {/* Footer Register Switch */}
      <div className="mt-5 pt-4 border-t border-neutral-200 text-center">
        <p className="text-xs font-semibold text-neutral-600">
          Don&apos;t have a TAGIT card account yet?{" "}
          <Link
            href="/register"
            className="text-neutral-950 font-black hover:text-rose-600 transition-colors inline-flex items-center gap-1"
          >
            Create an Account <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
