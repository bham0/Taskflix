import { create } from "zustand";

export type Profile = {
  name: string;
  fullName: string;
  address: string;
  pincode: string;
  email: string;
  avatar: string;
};

type Store = {
  profile: Profile;
  updateProfile: (data: Profile) => void;
  rehydrate: () => void;
};

const DEFAULT: Profile = {
  name: "",
  fullName: "",
  address: "",
  pincode: "",
  email: "admin@mail.com",
  avatar: "",
};

export const useProfileStore = create<Store>((set) => ({
  profile: DEFAULT,

  updateProfile: (data) => {
    localStorage.setItem("profile", JSON.stringify(data));
    set({ profile: data });
  },

  rehydrate: () => {
    const stored = localStorage.getItem("profile");

    if (stored) {
      set({ profile: JSON.parse(stored) });
    }
  },
}));
