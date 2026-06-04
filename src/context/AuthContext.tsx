import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "@/api/client";

export type User = { id: string; name: string; email: string; role: "admin" };
type Ctx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);
const KEY = "auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user); setToken(parsed.token);
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await api.auth.login(email, password);
    setUser(user); setToken(token);
    localStorage.setItem(KEY, JSON.stringify({ token, user }));
  };
  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem(KEY);
  };

  return <AuthContext.Provider value={{ user, token, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
