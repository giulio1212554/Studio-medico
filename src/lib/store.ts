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

export function getAvailableSlots(date: string): string[] {
  const base = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
  const dayHash = date.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
  return base.filter((_, i) => (i + dayHash) % 3 !== 0);
}

export interface Appointment {
  id: string;
  serviceId: ServiceId;
  date: string;
  time: string;
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
}

export interface Invoice {
  id: string;
  number: string;
  patientId: string;
  patientName: string;
  description: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
}

let appointments: Appointment[] = [];
let recipes: RecipeRequest[] = [
  { id: "r1", patientId: "p1", patientName: "Mario Rossi", medication: "Ramipril 5mg – 1 compressa al giorno", notes: "Terapia cronica ipertensione", status: "pending", createdAt: new Date().toISOString() },
];
let invoices: Invoice[] = [
  { id: "i1", number: "FAT-2026-001", patientId: "p1", patientName: "Mario Rossi", description: "Visita cardiologica + ECG", amount: 170, status: "pending", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
];

export const store = {
  getAppointments: () => [...appointments],
  addAppointment: (a: Omit<Appointment, "id" | "createdAt" | "status">) => {
    const appt: Appointment = { ...a, id: `a${Date.now()}`, status: "confirmed", createdAt: new Date().toISOString() };
    appointments.push(appt);
    return appt;
  },
  getRecipes: (patientId?: string) => patientId ? recipes.filter((r) => r.patientId === patientId) : [...recipes],
  addRecipe: (r: Omit<RecipeRequest, "id" | "createdAt" | "status" | "code">) => {
    const recipe: RecipeRequest = { ...r, id: `r${Date.now()}`, status: "pending", createdAt: new Date().toISOString() };
    recipes.push(recipe);
    return recipe;
  },
  updateRecipeStatus: (id: string, status: RecipeRequest["status"]) => {
    const r = recipes.find((x) => x.id === id);
    if (r) {
      r.status = status;
      if (status === "approved") r.code = `RIC-${Date.now().toString(36).toUpperCase()}`;
    }
    return r;
  },
  getInvoices: (patientId?: string) => patientId ? invoices.filter((i) => i.patientId === patientId) : [...invoices],
  addInvoice: (inv: Omit<Invoice, "id" | "createdAt" | "status">) => {
    const invoice: Invoice = { ...inv, id: `i${Date.now()}`, status: "pending", createdAt: new Date().toISOString() };
    invoices.push(invoice);
    return invoice;
  },
  payInvoice: (id: string) => {
    const inv = invoices.find((x) => x.id === id);
    if (inv) {
      inv.status = "paid";
      inv.paidAt = new Date().toISOString();
    }
    return inv;
  },
  stats: () => ({
    patients: 1247,
    years: 12,
    doctors: DOCTORS.length,
    appointmentsToday: appointments.filter((a) => a.date === new Date().toISOString().slice(0, 10)).length,
    pendingRecipes: recipes.filter((r) => r.status === "pending").length,
    revenue: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
  }),
};

export const MOCK_PATIENT = {
  id: "p1",
  name: "Mario Rossi",
  email: "mario.rossi@email.it",
  phone: "333 1234567",
  fiscalCode: "RSSMRA80A01H501U",
};
