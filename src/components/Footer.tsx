import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { getBrand } from "@/lib/brand";

export function Footer() {
  const [brand, setBrand] = useState(getBrand);
  useEffect(() => {
    setBrand(getBrand());
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-display text-2xl font-semibold">{brand.studioName}</h3>
            <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
              La cura, senza attese. Medicina di qualità in un ambiente calmo e luminoso.
              {brand.doctor ? ` · ${brand.doctor}` : ""}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              Navigazione
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/chi-siamo" className="hover:underline">Chi siamo</Link></li>
              <li><Link to="/servizi" className="hover:underline">Servizi</Link></li>
              <li><Link to="/prenota" className="hover:underline">Prenota</Link></li>
              <li><Link to="/area-paziente" className="hover:underline">Area paziente</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              Contatti
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 opacity-70" />
                {brand.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 opacity-70" />
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="hover:underline">{brand.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 opacity-70" />
                <a href={`mailto:${brand.email}`} className="hover:underline">{brand.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/20 pt-8 text-xs text-primary-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {brand.studioName}. Tutti i diritti riservati.</p>
          <p className="text-[11px]">Demo personalizzabile · Ischia Digital</p>
        </div>
      </div>
    </footer>
  );
}
