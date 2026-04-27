"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";
import ThemeToggle from "./theme-toggle";
import { LogOut } from "lucide-react";

export default function AppHeader() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const profile = useProfileStore((s) => s.profile);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const initials =
    profile.name?.slice(0, 2).toUpperCase() ||
    user?.name?.slice(0, 2).toUpperCase() ||
    "U";

  const avatar = profile.avatar;

  return (
    <header className="flex justify-end items-center gap-3">
      <ThemeToggle />

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((p) => !p)}
          className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-sm font-semibold border-2 transition"
          style={{
            borderColor: "var(--border)",
            backgroundColor: avatar ? "transparent" : "var(--btn-bg)",
            color: "var(--btn-text)",
          }}
        >
          {avatar ? (
            <Image
              src={avatar}
              alt="avatar"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            initials
          )}
        </button>

        {open && (
          <div
            className="absolute right-0 mt-2 w-52 rounded-2xl shadow-lg border py-2 z-50"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="profile"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-sm font-semibold"
                      style={{
                        backgroundColor: "var(--btn-bg)",
                        color: "var(--btn-text)",
                      }}
                    >
                      {initials}
                    </div>
                  )}
                </div>

                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {profile.name || user?.name || "User"}
                  </p>

                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {profile.email || user?.email}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition hover:opacity-70"
              style={{ color: "var(--text)" }}
            >
              <LogOut size={15} />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
