import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { MOCK_PATIENT, ensurePatient } from "./store";

interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "admin";
}

interface AppState {
  user: User | null;
  darkMode: boolean;
}

interface AppContextValue {
  state: AppState;
  login: (email: string, asAdmin?: boolean) => void;
  logout: () => void;
  toggleDark: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const USER_KEY = "aurelia-user";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    darkMode: false,
  });

  useEffect(() => {
    const savedDark = localStorage.getItem("aurelia-dark");
    if (savedDark === "true") {
      setState((s) => ({ ...s, darkMode: true }));
      document.documentElement.classList.add("dark");
    }
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) {
        const user = JSON.parse(raw) as User;
        setState((s) => ({ ...s, user }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const login = (email: string, asAdmin = false) => {
    let user: User;
    if (asAdmin || email.toLowerCase().includes("admin")) {
      user = { id: "admin", name: "Admin Aurelia", email, role: "admin" };
    } else {
      const p = ensurePatient({
        name: email.toLowerCase().includes("mario")
          ? MOCK_PATIENT.name
          : email.split("@")[0] || "Paziente",
        email: email || MOCK_PATIENT.email,
      });
      user = {
        id: p.id,
        name: p.name,
        email: p.email,
        role: "patient",
      };
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState((s) => ({ ...s, user }));
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setState((s) => ({ ...s, user: null }));
  };

  const toggleDark = () => {
    setState((s) => {
      const next = !s.darkMode;
      localStorage.setItem("aurelia-dark", String(next));
      document.documentElement.classList.toggle("dark", next);
      return { ...s, darkMode: next };
    });
  };

  return (
    <AppContext.Provider value={{ state, login, logout, toggleDark }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
