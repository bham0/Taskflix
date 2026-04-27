"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile";

export default function ProfileForm() {
  const { profile, updateProfile } = useProfileStore();

  const [form, setForm] = useState(profile);

  const update = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        avatar: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  const save = () => {
    updateProfile(form);
    toast.success("Profile saved");
  };

  return (
    <div>
      {/* Profile Photo */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border">
          <Image
            src={
              form.avatar ||
              "https://ui-avatars.com/api/?name=User&background=random"
            }
            alt="Profile"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <label className="mt-4 cursor-pointer px-5 h-[42px] rounded-xl flex items-center justify-center bg-black dark:bg-[#364153] text-white text-sm">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </label>
      </div>

      <h1
        className="text-3xl font-semibold mb-8"
        style={{ color: "var(--text)" }}
      >
        Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { key: "name", placeholder: "First Name" },
          { key: "fullName", placeholder: "Last Name" },
          { key: "email", placeholder: "Email Address" },
          { key: "address", placeholder: "Address" },
          { key: "pincode", placeholder: "Pincode" },
        ].map(({ key, placeholder }) => (
          <input
            key={key}
            type={key === "email" ? "email" : "text"}
            placeholder={placeholder}
            value={form[key as keyof typeof form]}
            onChange={(e) => update(key, e.target.value)}
            className="w-full h-[56px] px-4 rounded-2xl border outline-none"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        ))}
      </div>

      <button
        onClick={save}
        className="mt-6 w-full sm:w-fit px-6 h-[52px] rounded-2xl bg-black dark:bg-[#364153] text-white font-medium"
      >
        Save Profile
      </button>
    </div>
  );
}
