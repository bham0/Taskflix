"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { NotebookPen } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

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

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-zinc-900 via-slate-900 to-zinc-800 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Top branding */}
        <div className="bg-black px-8 py-8 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <NotebookPen size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Taskflix
          </h1>
          <p className="text-zinc-400 text-sm">Your tasks, organized.</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <h2 className="text-xl font-semibold text-black mb-1">
            Welcome back
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Sign in to continue to Taskflix
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="admin@mail.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-black placeholder:text-gray-300 focus:border-black transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-black placeholder:text-gray-300 focus:border-black transition"
              />
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-black text-white py-3 font-medium text-sm transition hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">
              Demo accounts
            </p>
            <p className="text-xs text-gray-400">admin@mail.com / 123456</p>
            <p className="text-xs text-gray-400">bham@gmail.com / bham1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
