/** Branding dinamico da query string o localStorage */
export type StudioBrand = {
  studioName: string;
  shortName: string;
  doctor: string;
  city: string;
  phone: string;
  email: string;
  address: string;
};

const DEFAULT: StudioBrand = {
  studioName: "Studio Medico Aurelia",
  shortName: "Aurelia",
  doctor: "",
  city: "Roma",
  phone: "000 000 0000",
  email: "segreteria@studioaurelia.it",
  address: "Via dei Cedri 12, Roma",
};

const KEY = "studio-medico-brand-v1";

function fromParams(): StudioBrand | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const raw =
    p.get("studio") ||
    p.get("nome") ||
    p.get("name") ||
    "";
  if (!raw.trim()) return null;

  const studio = raw.trim();
  const short = studio.replace(/^Studio\s+(Medico\s+)?/i, "").trim() || studio;
  const city = (p.get("citta") || p.get("city") || "Ischia").trim();
  const doctor = (p.get("doc") || p.get("medico") || p.get("cognome") || "").trim();
  const phone = (p.get("tel") || p.get("telefono") || DEFAULT.phone).trim();
  const email = (p.get("email") || DEFAULT.email).trim();
  const address = (p.get("indirizzo") || p.get("address") || city).trim();

  const studioName = /^studio\b/i.test(studio) ? studio : `Studio ${studio}`;

  return {
    studioName,
    shortName: short,
    doctor,
    city,
    phone,
    email,
    address: address.includes(city) ? address : `${address}, ${city}`,
  };
}

export function getBrand(): StudioBrand {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const fromUrl = fromParams();
    if (fromUrl) {
      localStorage.setItem(KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) } as StudioBrand;
  } catch {
    /* ignore */
  }
  return DEFAULT;
}

export function clearBrand() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
