"use client";

import AppSidebar from "@/components/app-sidebar";
import AppHeader from "@/components/app-header";
import ProfileForm from "@/components/profile-form";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex bg-[var(--bg)] transition-colors">
      <AppSidebar />

      <main className="flex-1 md:ml-[72px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-6 sm:py-8">
        <AppHeader />

        <section className="max-w-4xl mx-auto mt-8">
          <ProfileForm />
        </section>
      </main>
    </div>
  );
}
