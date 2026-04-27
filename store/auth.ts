import { create } from "zustand";

type User = { name: string; email: string };

type AuthState = {
  user: User | null;
  login: (
    email: string,
    password: string,
  ) => "success" | "no_email" | "wrong_password";
  logout: () => void;
  rehydrate: () => void;
};

const MOCK_USERS: { name: string; email: string; password: string }[] = [
  { name: "Shubham", email: "admin@mail.com", password: "123456" },
  { name: "Jane Doe", email: "jane@mail.com", password: "jane123" },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (email, password) => {
    const found = MOCK_USERS.find((u) => u.email === email);
    if (!found) return "no_email";
    if (found.password !== password) return "wrong_password";
    const user = { name: found.name, email: found.email };
    localStorage.setItem("user", JSON.stringify(user));
    document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=86400`;
    set({ user });
    return "success";
  },

  logout: () => {
    localStorage.removeItem("user");
    document.cookie = "user=; path=/; max-age=0";
    set({ user: null });
  },

  rehydrate: () => {
    const stored = localStorage.getItem("user");
    if (stored) set({ user: JSON.parse(stored) });
  },
}));
