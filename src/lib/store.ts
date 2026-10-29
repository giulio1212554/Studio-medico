export type ServiceId =
  | "medicina-generale"
  | "cardiologia"
  | "dermatologia"
  | "nutrizione"
  | "prelievi"
  | "certificati"
  | "ricette"
  | "video-visita";

export interface Service {
  id: ServiceId;
  name: string;
  description: string;
  price: number | string;
  priceNote?: string;
  icon: string;
  duration: number;
}

export const SERVICES: Service[] = [
  { id: "medicina-generale", name: "Medicina generale", description: "Visita completa con valutazione dello stato di salute e consigli personalizzati.", price: 80, icon: "Stethoscope", duration: 30 },
  { id: "cardiologia", name: "Cardiologia ed ECG", description: "Visita cardiologica specialistica con elettrocardiogramma.", price: 120, priceNote: "ECG separato € 50", icon: "HeartPulse", duration: 45 },
  { id: "dermatologia", name: "Dermatologia", description: "Controllo della cute e dei nevi, diagnosi e terapie dermatologiche.", price: 100, icon: "Scan", duration: 30 },
  { id: "nutrizione", name: "Nutrizione", description: "Consulenza nutrizionale personalizzata e piani alimentari.", price: 90, icon: "Apple", duration: 45 },
  { id: "prelievi", name: "Prelievi e analisi", description: "Prelievi ematici e consegna referti in tempi rapidi.", price: "da € 25", icon: "TestTube", duration: 15 },
  { id: "certificati", name: "Certificati medici", description: "Certificati per lavoro, sport, scuola e altri usi.", price: 40, icon: "FileCheck", duration: 15 },
  { id: "ricette", name: "Ricette e terapie croniche", description: "Rinnovo ricette e gestione terapie per pazienti seguiti.", price: "Gratis", priceNote: "per i pazienti seguiti", icon: "Pill", duration: 10 },
  { id: "video-visita", name: "Video visita", description: "Consulto medico a distanza in videochiamata sicura.", price: 60, icon: "Video", duration: 25 },
];

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image: string;
}

export const DOCTORS: Doctor[] = [
  { id: "1", name: "Dr.ssa Elena Martini", specialty: "Medicina Generale", bio: "Oltre 15 anni di esperienza nella medicina di famiglia e nella prevenzione.", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face" },
  { id: "2", name: "Dr. Marco Bianchi", specialty: "Cardiologia", bio: "Specialista in cardiologia clinica e diagnostica non invasiva.", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face" },
  { id: "3", name: "Dr.ssa Sofia Conti", specialty: "Dermatologia", bio: "Esperta in dermatologia clinica e chirurgia ambulatoriale della cute.", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face" },
  { id: "4", name: "Dr. Luca Ferri", specialty: "Nutrizione", bio: "Nutrizionista clinico con focus su diete personalizzate e sport.", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face" },
];

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export const REVIEWS: Review[] = [
  { id: "1", name: "Anna R.", rating: 5, text: "Ambiente curatissimo e personale gentilissimo. Ho prenotato online in due minuti e ricevuto la conferma subito.", date: "2026-09-12" },
  { id: "2", name: "Giuseppe M.", rating: 5, text: "Il Dr. Bianchi è estremamente preparato. L'ECG è stato eseguito in studio senza attese.", date: "2026-08-28" },
  { id: "3", name: "Francesca L.", rating: 5, text: "Area paziente fantastica: ricette e fatture sempre a portata di mano. Consigliatissimo.", date: "2026-10-05" },
];

export const HOURS = [
  { day: "Lunedì – Venerdì", time: "8:30 – 19:30" },
  { day: "Sabato", time: "9:00 – 13:00" },
  { day: "Domenica", time: "Chiuso" },
];

export const CONTACT = {
  address: "Via dei Cedri 12, Roma",
  phone: "000 000 0000",
  email: "segreteria@studioaurelia.it",
  whatsapp: "https://wa.me/390000000000",
};

export interface Appointment {
  id: string;
  serviceId: ServiceId;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

export interface RecipeRequest {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  notes: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  code?: string;
  signatureDataUrl?: string;
  signedBy?: string;
  signedAt?: string;
}

export interface Invoice {
  id: string;
  number: string;
  patientId: string;
  patientName: string;
  fiscalCode?: string;
  description: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  fiscalCode?: string;
}

const STORAGE_KEY = "aurelia-demo-store-v1";

const DEFAULT_PATIENTS: Patient[] = [
  { id: "p1", name: "Mario Rossi", email: "mario.rossi@email.it", phone: "333 1234567", fiscalCode: "RSSMRA80A01H501U" },
];

function defaultRecipes(): RecipeRequest[] {
  return [{
    id: "r1", patientId: "p1", patientName: "Mario Rossi",
    medication: "Ramipril 5mg – 1 compressa al giorno", notes: "Terapia cronica ipertensione",
    status: "pending", createdAt: new Date().toISOString(),
  }];
}

function defaultInvoices(): Invoice[] {
  return [{
    id: "i1", number: "FAT-2026-001", patientId: "p1", patientName: "Mario Rossi",
    fiscalCode: "RSSMRA80A01H501U",
    description: "Visita cardiologica + ECG", amount: 170, status: "pending",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  }];
}

interface PersistedState {
  appointments: Appointment[];
  recipes: RecipeRequest[];
  invoices: Invoice[];
  patients: Patient[];
}

function loadState(): PersistedState {
  if (typeof window === "undefined") {
    return { appointments: [], recipes: defaultRecipes(), invoices: defaultInvoices(), patients: DEFAULT_PATIENTS };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      return {
        appointments: parsed.appointments ?? [],
        recipes: parsed.recipes ?? defaultRecipes(),
        invoices: parsed.invoices ?? defaultInvoices(),
        patients: parsed.patients?.length ? parsed.patients : DEFAULT_PATIENTS,
      };
    }
  } catch { /* ignore */ }
  return { appointments: [], recipes: defaultRecipes(), invoices: defaultInvoices(), patients: DEFAULT_PATIENTS };
}

let state: PersistedState = loadState();

function save() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

function baseSlotsForDate(date: string): string[] {
  const d = new Date(date + "T12:00:00");
  const day = d.getDay();
  if (day === 0) return [];
  if (day === 6) return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"];
  return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
}

function isPastSlot(date: string, time: string): boolean {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (date < today) return true;
  if (date > today) return false;
  const [hh, mm] = time.split(":").map(Number);
  const slot = new Date(now);
  slot.setHours(hh, mm, 0, 0);
  return slot.getTime() <= now.getTime() + 15 * 60 * 1000;
}

export function getAvailableSlots(date: string): string[] {
  const base = baseSlotsForDate(date);
  const booked = new Set(
    state.appointments.filter((a) => a.date === date && a.status !== "cancelled").map((a) => a.time),
  );
  return base.filter((t) => !booked.has(t) && !isPastSlot(date, t));
}

export function patientIdFromEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  const found = state.patients.find((p) => p.email.toLowerCase() === normalized);
  if (found) return found.id;
  return `p_${normalized.replace(/[^a-z0-9]/g, "_").slice(0, 24)}`;
}

export function ensurePatient(input: { name: string; email: string; phone?: string }): Patient {
  const id = patientIdFromEmail(input.email);
  const existing = state.patients.find((p) => p.id === id);
  if (existing) {
    existing.name = input.name || existing.name;
    if (input.phone) existing.phone = input.phone;
    save();
    return existing;
  }
  const p: Patient = { id, name: input.name, email: input.email.trim().toLowerCase(), phone: input.phone };
  state.patients.push(p);
  save();
  return p;
}

export const store = {
  getAppointments: (patientId?: string) =>
    patientId
      ? state.appointments.filter((a) => a.patientId === patientId)
      : [...state.appointments],
  addAppointment: (a: Omit<Appointment, "id" | "createdAt" | "status">) => {
    const appt: Appointment = { ...a, id: `a${Date.now()}`, status: "confirmed", createdAt: new Date().toISOString() };
    state.appointments.push(appt);
    save();
    return appt;
  },
  getRecipes: (patientId?: string) =>
    patientId ? state.recipes.filter((r) => r.patientId === patientId) : [...state.recipes],
  addRecipe: (r: Omit<RecipeRequest, "id" | "createdAt" | "status" | "code">) => {
    const recipe: RecipeRequest = { ...r, id: `r${Date.now()}`, status: "pending", createdAt: new Date().toISOString() };
    state.recipes.push(recipe);
    save();
    return recipe;
  },
  updateRecipeStatus: (
    id: string,
    status: RecipeRequest["status"],
    opts?: { signatureDataUrl?: string; signedBy?: string },
  ) => {
    const r = state.recipes.find((x) => x.id === id);
    if (r) {
      r.status = status;
      if (status === "approved") {
        const n = Date.now().toString().slice(-12);
        r.code = `030A${n}`.slice(0, 15);
        if (opts?.signatureDataUrl) r.signatureDataUrl = opts.signatureDataUrl;
        if (opts?.signedBy) r.signedBy = opts.signedBy;
        r.signedAt = new Date().toISOString();
      }
      save();
    }
    return r;
  },
  getInvoices: (patientId?: string) =>
    patientId ? state.invoices.filter((i) => i.patientId === patientId) : [...state.invoices],
  addInvoice: (inv: Omit<Invoice, "id" | "createdAt" | "status">) => {
    const invoice: Invoice = { ...inv, id: `i${Date.now()}`, status: "pending", createdAt: new Date().toISOString() };
    state.invoices.push(invoice);
    save();
    return invoice;
  },
  payInvoice: (id: string) => {
    const inv = state.invoices.find((x) => x.id === id);
    if (inv) {
      inv.status = "paid";
      inv.paidAt = new Date().toISOString();
      save();
    }
    return inv;
  },
  getPatients: () => [...state.patients],
  stats: () => ({
    patients: Math.max(1247, state.patients.length + 1240),
    years: 12,
    doctors: DOCTORS.length,
    appointmentsToday: state.appointments.filter((a) => a.date === new Date().toISOString().slice(0, 10)).length,
    pendingRecipes: state.recipes.filter((r) => r.status === "pending").length,
    revenue: state.invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
  }),
  resetDemo: () => {
    state = { appointments: [], recipes: defaultRecipes(), invoices: defaultInvoices(), patients: [...DEFAULT_PATIENTS] };
    save();
  },
};

export const MOCK_PATIENT = DEFAULT_PATIENTS[0];
