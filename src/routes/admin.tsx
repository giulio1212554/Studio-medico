import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { store, SERVICES } from "@/lib/store";
import { generateInvoicePDF } from "@/lib/pdf";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import { Users, Calendar, Pill, Receipt, Euro, Check, X, MessageCircle, LogIn } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function LoginForm() {
  const { login } = useApp();
  const [email, setEmail] = useState("admin@aurelia.it");
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 pt-16">
      <Reveal>
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-float">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary"><LogIn className="size-6" strokeWidth={1.5} /></div>
          <h1 className="mt-5 text-center font-display text-2xl font-semibold">Admin</h1>
          <form onSubmit={(e) => { e.preventDefault(); login(email, true); toast.success("Accesso admin"); }} className="mt-8 space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <button type="submit" className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Accedi come admin</button>
          </form>
        </div>
      </Reveal>
    </div>
  );
}

const FAQ = [
  { q: "Come prenoto una visita?", a: "Vai su Prenota, scegli servizio, data e orario." },
  { q: "Come richiedo una ricetta?", a: "Accedi all'Area paziente e invia la richiesta." },
  { q: "Posso pagare online?", a: "Sì, nell'Area paziente trovi le fatture e il pulsante Paga online." },
];

function AdminPage() {
  const { state } = useApp();
  const [, force] = useState(0);
  const refresh = () => force((n) => n + 1);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [invDesc, setInvDesc] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invPatient, setInvPatient] = useState("Mario Rossi");

  if (!state.user || state.user.role !== "admin") return <LoginForm />;

  const stats = store.stats();
  const recipes = store.getRecipes();
  const appointments = store.getAppointments();
  const invoices = store.getInvoices();
  const pendingRecipes = recipes.filter((r) => r.status === "pending");

  return (
    <div className="pt-16">
      <section className="bg-teal-light py-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal><h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard Admin</h1></Reveal>
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto max-w-[1200px] space-y-10 px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[{
              icon: Users, label: "Pazienti", value: stats.patients
            }, {
              icon: Calendar, label: "Appuntamenti oggi", value: stats.appointmentsToday
            }, {
              icon: Pill, label: "Ricette in attesa", value: stats.pendingRecipes
            }, {
              icon: Euro, label: "Incassi €", value: stats.revenue
            }].map((item) => (
              <Reveal key={item.label}>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary"><item.icon className="size-5" strokeWidth={1.5} /></div>
                    <div><p className="text-xs text-muted-foreground">{item.label}</p><p className="font-display text-2xl font-semibold">{item.value}</p></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2"><Calendar className="size-5 text-primary" strokeWidth={1.5} /><h2 className="font-display text-lg font-semibold">Agenda</h2></div>
                <div className="mt-4 space-y-3">
                  {appointments.length === 0 && <p className="text-sm text-muted-foreground">Nessuna prenotazione recente.</p>}
                  {appointments.slice(-8).reverse().map((a) => {
                    const svc = SERVICES.find((s) => s.id === a.serviceId);
                    return (
                      <div key={a.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3 text-sm">
                        <div><p className="font-medium">{a.patientName}</p><p className="text-muted-foreground">{svc?.name} · {a.date} {a.time}</p></div>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{a.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2"><Pill className="size-5 text-primary" strokeWidth={1.5} /><h2 className="font-display text-lg font-semibold">Ricette da approvare ({pendingRecipes.length})</h2></div>
                <div className="mt-4 space-y-3">
                  {pendingRecipes.length === 0 && <p className="text-sm text-muted-foreground">Nessuna richiesta in attesa.</p>}
                  {pendingRecipes.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border px-4 py-3">
                      <p className="font-medium text-sm">{r.patientName}</p>
                      <p className="text-sm text-muted-foreground">{r.medication}</p>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => { store.updateRecipeStatus(r.id, "approved"); toast.success("Approvata"); refresh(); }} className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"><Check className="size-3.5" /> Approva</button>
                        <button onClick={() => { store.updateRecipeStatus(r.id, "rejected"); toast.success("Rifiutata"); refresh(); }} className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-medium"><X className="size-3.5" /> Rifiuta</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2"><Receipt className="size-5 text-primary" strokeWidth={1.5} /><h2 className="font-display text-lg font-semibold">Emetti fattura</h2></div>
                <form onSubmit={(e) => { e.preventDefault(); const amount = parseFloat(invAmount); if (!invDesc || isNaN(amount)) { toast.error("Compila i campi"); return; } store.addInvoice({ number: `FAT-2026-${String(invoices.length + 1).padStart(3, "0")}`, patientId: "p1", patientName: invPatient, description: invDesc, amount }); toast.success("Fattura emessa"); setInvDesc(""); setInvAmount(""); refresh(); }} className="mt-4 space-y-3">
                  <input value={invPatient} onChange={(e) => setInvPatient(e.target.value)} placeholder="Paziente" className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  <input value={invDesc} onChange={(e) => setInvDesc(e.target.value)} placeholder="Descrizione" className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  <input value={invAmount} onChange={(e) => setInvAmount(e.target.value)} placeholder="Importo €" type="number" step="0.01" className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  <button type="submit" className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Emetti</button>
                </form>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2"><Euro className="size-5 text-primary" strokeWidth={1.5} /><h2 className="font-display text-lg font-semibold">Incassi</h2></div>
                <p className="mt-2 font-display text-2xl font-semibold text-primary">€ {stats.revenue.toFixed(2)}</p>
                <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2 text-sm">
                      <div><p className="font-medium">{inv.number}</p><p className="text-xs text-muted-foreground">{inv.patientName}</p></div>
                      <div className="flex items-center gap-2"><span>€ {inv.amount.toFixed(2)}</span><button onClick={() => generateInvoicePDF(inv)} className="text-xs text-primary underline">PDF</button></div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2"><MessageCircle className="size-5 text-primary" strokeWidth={1.5} /><h2 className="font-display text-lg font-semibold">Assistente FAQ</h2></div>
              <div className="mt-4 space-y-2">
                {FAQ.map((f, i) => (
                  <div key={i} className="rounded-xl border border-border">
                    <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium">{f.q}<span className="text-muted-foreground">{faqOpen === i ? "−" : "+"}</span></button>
                    {faqOpen === i && <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{f.a}</p>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
