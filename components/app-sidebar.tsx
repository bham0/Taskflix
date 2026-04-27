"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, Settings, X, ListTodo, Images } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useProfileStore } from "@/store/profile";

export default function AppSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const { profile } = useProfileStore();

  const isActive = (href: string) => pathname === href;

  const navLinkStyle = (href: string) => ({
    backgroundColor: isActive(href) ? "var(--nav-active-bg)" : "transparent",
    color: isActive(href)
      ? "var(--nav-active-text)"
      : "var(--nav-inactive-text)",
  });

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-5 left-4 z-50"
        style={{ color: "var(--text)" }}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 z-50 min-h-screen border-r transition-all duration-300 ${
          open
            ? "translate-x-0 w-[255px]"
            : "-translate-x-full md:translate-x-0 md:w-[72px]"
        }`}
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderColor: "var(--border)",
        }}
      >
        {/* Top Buttons */}
        <div className="px-5 py-5 flex items-center justify-between">
          <button
            onClick={() => setOpen(!open)}
            className="hidden md:block"
            style={{ color: "var(--text)" }}
          >
            <Menu size={24} />
          </button>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden"
            style={{ color: "var(--text)" }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Section */}
        {open && (
          <div className="px-5 py-6">
            <div className="relative w-[92px] h-[92px] rounded-full overflow-hidden border">
              <Image
                src={
                  profile.avatar ||
                  "https://ui-avatars.com/api/?name=User&background=random"
                }
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <h3
              className="mt-4 text-[18px] font-semibold truncate"
              style={{ color: "var(--text)" }}
            >
              {profile.name ? `${profile.name} ${profile.fullName}` : "User"}
            </h3>

            <p
              className="text-sm mt-1 break-all"
              style={{ color: "var(--muted)" }}
            >
              {profile.email || "admin@mail.com"}
            </p>
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: "1px solid #6A7282" }} />

        {/* Navigation */}
        <nav className="mt-3 px-3 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-3 rounded-xl transition"
            style={navLinkStyle("/dashboard")}
          >
            <ListTodo size={20} />
            {open && <span>My Tasks</span>}
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-3 rounded-xl transition"
            style={navLinkStyle("/settings")}
          >
            <Settings size={20} />
            {open && <span>Settings</span>}
          </Link>

          <Link
            href="/images"
            className="flex items-center gap-3 px-3 py-3 rounded-xl transition"
            style={navLinkStyle("/images")}
          >
            <Images size={20} />
            {open && <span>Gallery</span>}
          </Link>
        </nav>
      </aside>
    </>
  );
}
