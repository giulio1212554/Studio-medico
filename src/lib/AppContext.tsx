import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { MOCK_PATIENT } from "./store";

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

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    darkMode: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("aurelia-dark");
    if (saved === "true") {
      setState((s) => ({ ...s, darkMode: true }));
      document.documentElement.classList.add("dark");
    }
  }, []);

  const login = (email: string, asAdmin = false) => {
    if (asAdmin || email.includes("admin")) {
      setState((s) => ({
        ...s,
        user: { id: "admin", name: "Admin Aurelia", email, role: "admin" },
      }));
    } else {
      setState((s) => ({
        ...s,
        user: {
          id: MOCK_PATIENT.id,
          name: MOCK_PATIENT.name,
          email: email || MOCK_PATIENT.email,
          role: "patient",
        },
      }));
    }
  };

  const logout = () => setState((s) => ({ ...s, user: null }));

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
