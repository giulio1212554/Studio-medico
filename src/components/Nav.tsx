import { Link } from "@tanstack/react-router";
import { Menu, X, Moon, Sun, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { getBrand } from "@/lib/brand";

const links = [
  { to: "/", label: "Home" },
  { to: "/chi-siamo", label: "Chi siamo" },
  { to: "/servizi", label: "Servizi" },
  { to: "/prenota", label: "Prenota" },
];

export function Nav() {
  const { state, toggleDark, logout } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [brand, setBrand] = useState(getBrand);

  useEffect(() => {
    setBrand(getBrand());
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="select-none font-display text-xl font-semibold tracking-tight text-primary">
          Studio <span className="text-foreground">{brand.shortName}</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted-foreground transition-colors hover:text-primary [&.active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
          {state.user ? (
            <Link
              to={state.user.role === "admin" ? "/admin" : "/area-paziente"}
              className="inline-flex items-center gap-1.5 text-primary"
            >
              <User className="size-4" />
              {state.user.role === "admin" ? "Admin" : "Area paziente"}
            </Link>
          ) : (
            <Link to="/area-paziente" className="text-muted-foreground transition-colors hover:text-primary">
              Area paziente
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={state.darkMode ? "Modalità chiara" : "Modalità scura"}
          >
            {state.darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {state.user && (
            <button
              onClick={logout}
              className="hidden rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary sm:inline-flex"
            >
              Esci
            </button>
          )}

          <button
            className="rounded-full p-2 text-foreground md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to={state.user?.role === "admin" ? "/admin" : "/area-paziente"}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-primary hover:bg-secondary"
              >
                {state.user?.role === "admin" ? "Admin" : "Area paziente"}
              </Link>
              {state.user && (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="rounded-xl px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-secondary"
                >
                  Esci
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
