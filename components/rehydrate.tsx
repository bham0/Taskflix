"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";

export default function Rehydrate() {
  const rehydrateAuth = useAuthStore((s) => s.rehydrate);
  const rehydrateProfile = useProfileStore((s) => s.rehydrate);

  useEffect(() => {
    rehydrateAuth();
    rehydrateProfile();
  }, [rehydrateAuth, rehydrateProfile]);

  return null;
}
