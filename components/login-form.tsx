"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { NotebookPen } from "lucide-react";

type Tab = "login" | "signup";

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);

  const [tab, setTab] = useState<Tab>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const switchToLogin = () => {
    setTab("login");
    setEmail(signupEmail);
    setPassword("");
  };

  const handleLogin = async () => {
    if (!email.trim()) return toast.error("Please enter your email");
    if (!password.trim()) return toast.error("Please enter your password");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = login(email.trim(), password);

    if (result === "success") {
      toast.success("Welcome back! Redirecting...");
      router.push("/dashboard");
    } else if (result === "no_email") {
      toast.error("No account found with this email");
    } else {
      toast.error("Incorrect password");
    }

    setLoading(false);
  };

  const handleSignup = async () => {
    if (!name.trim()) return toast.error("Please enter your name");
    if (!signupEmail.trim()) return toast.error("Please enter your email");
    if (!signupPassword.trim()) return toast.error("Please enter a password");
    if (signupPassword.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = signup(name.trim(), signupEmail.trim(), signupPassword);

    if (result === "success") {
      toast.success("Account created! Redirecting...");
      router.push("/dashboard");
    } else if (result === "already_exists") {
      toast.error(
        <span>
          Already signed up.{" "}
          <button
            onClick={switchToLogin}
            className="underline font-semibold hover:opacity-80 transition"
          >
            Log in instead
          </button>
        </span>,
        { duration: 5000 },
      );
    }

    setLoading(false);
  };

  const activeTabClass =
    "flex-1 py-3 text-sm font-semibold transition-all duration-200 " +
    "bg-teal-600 text-white rounded-t-xl " +
    "shadow-[0_6px_0_#0f766e,0_8px_12px_rgba(13,148,136,0.3)]";

  const inactiveTabClass =
    "flex-1 py-3 text-sm font-semibold transition-all duration-200 " +
    "bg-slate-100 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-t-xl " +
    "shadow-[0_4px_0_#cbd5e1] hover:shadow-[0_5px_0_#99f6e4]";

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Branding header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-8 py-8 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
            <NotebookPen size={26} className="text-emerald-300" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Taskflix
          </h1>
          <p className="text-slate-400 text-sm">Your tasks, organized.</p>
        </div>

        {/* 3D Tabs */}
        <div className="flex bg-slate-50 px-5 pt-5 pb-0 gap-3">
          <button
            onClick={() => setTab("login")}
            className={tab === "login" ? activeTabClass : inactiveTabClass}
            data-testid="tab-login"
          >
            Login
          </button>
          <button
            onClick={() => setTab("signup")}
            className={tab === "signup" ? activeTabClass : inactiveTabClass}
            data-testid="tab-signup"
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          {tab === "login" ? (
            <>
              <h2 className="text-xl font-semibold text-slate-800 mb-1">
                Welcome back
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Sign in to continue to Taskflix
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="admin@mail.com"
                    data-testid="login-email"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-800 placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="••••••••"
                    data-testid="login-password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-800 placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                data-testid="login-submit"
                className="mt-6 w-full rounded-xl bg-emerald-600 text-white py-3 font-semibold text-sm transition
                  hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]
                  active:bg-emerald-700
                  disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wide">
                  Demo accounts
                </p>
                <p className="text-xs text-slate-500">
                  admin@mail.com / 123456
                </p>
                <p className="text-xs text-slate-500">
                  jane@mail.com / jane123
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-slate-800 mb-1">
                Create an account
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Sign up to get started with Taskflix
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    placeholder="John Doe"
                    data-testid="signup-name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-800 placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    placeholder="you@example.com"
                    data-testid="signup-email"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-800 placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    placeholder="••••••••"
                    data-testid="signup-password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-800 placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
              </div>

              <button
                onClick={handleSignup}
                disabled={loading}
                data-testid="signup-submit"
                className="mt-6 w-full rounded-xl bg-emerald-600 text-white py-3 font-semibold text-sm transition
                  hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]
                  active:bg-emerald-700
                  disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
