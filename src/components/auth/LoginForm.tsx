"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/account" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(email, password);
      showToast("Welcome back!", "success");
      router.push(redirectTo);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setErrors({ general: message });
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm">
          {errors.general}
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-optimist-cream mb-2"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`w-full px-4 py-3 rounded-lg bg-optimist-dark border text-optimist-cream placeholder-optimist-cream-muted/50 focus:outline-none focus:ring-2 focus:ring-optimist-blue-light/50 transition-colors ${
            errors.email
              ? "border-red-500"
              : "border-optimist-border hover:border-optimist-border-light"
          }`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-optimist-cream"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-optimist-blue-light hover:text-optimist-blue-glow transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={`w-full px-4 py-3 pr-12 rounded-lg bg-optimist-dark border text-optimist-cream placeholder-optimist-cream-muted/50 focus:outline-none focus:ring-2 focus:ring-optimist-blue-light/50 transition-colors ${
              errors.password
                ? "border-red-500"
                : "border-optimist-border hover:border-optimist-border-light"
            }`}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-optimist-cream-muted hover:text-optimist-cream transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary px-6 py-3 rounded-full text-[#FFFCDC] font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-optimist-cream-muted">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="text-optimist-blue-light hover:text-optimist-blue-glow transition-colors font-medium"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
