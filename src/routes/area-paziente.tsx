import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { store, MOCK_PATIENT } from "@/lib/store";
import { generateRecipePDF, generateInvoicePDF } from "@/lib/pdf";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import { FileText, Receipt, Pill, Download, RefreshCw, LogIn, CreditCard } from "lucide-react";

export const Route = createFileRoute("/area-paziente")({ component: AreaPazientePage });

function LoginForm() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 pt-16">
      <Reveal>
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-float">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary"><LogIn className="size-6" strokeWidth={1.5} /></div>
          <h1 className="mt-5 text-center font-display text-2xl font-semibold">Area paziente</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Accedi per gestire ricette, fatture e documenti.</p>
          <form onSubmit={(e) => { e.preventDefault(); login(email || "mario.rossi@email.it"); toast.success("Accesso effettuato"); }} className="mt-8 space-y-4">
            <div><label className="text-sm font-medium">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mario.rossi@email.it" className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
            <div><label className="text-sm font-medium">Password</label><input type="password" placeholder="••••••••" className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
            <button type="submit" className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Accedi</button>
            <p className="text-center text-xs text-muted-foreground">Demo: qualsiasi email. Usa admin@aurelia.it per l&apos;admin.</p>
          </form>
        </div>
      </Reveal>
    </div>
  );
}

function AreaPazientePage() {
  const { state } = useApp();
  const [tab, setTab] = useState<"ricette" | "fatture" | "documenti">("ricette");
  const [med, setMed] = useState("");
  const [notes, setNotes] = useState("");
  const [, force] = useState(0);
  const refresh = () => force((n) => n + 1);

  if (!state.user) return <LoginForm />;
  if (state.user.role === "admin") {
    return <div className="flex min-h-[50vh] items-center justify-center pt-24"><p className="text-muted-foreground">Sei admin. Vai alla <a href="/admin" className="text-primary underline">dashboard admin</a>.</p></div>;
  }

  const recipes = store.getRecipes(state.user.id);
  const invoices = store.getInvoices(state.user.id);

  return (
    <div className="pt-16">
      <section className="bg-teal-light py-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Ciao, {state.user.name.split(" ")[0]}</h1>
            <p className="mt-2 text-muted-foreground">Gestisci ricette, fatture e documenti.</p>
          </Reveal>
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex gap-2 border-b border-border">
            {([{ id: "ricette" as const, label: "Ricette", icon: Pill }, { id: "fatture" as const, label: "Fatture", icon: Receipt }, { id: "documenti" as const, label: "Documenti", icon: FileText }]).map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}><t.icon className="size-4" strokeWidth={1.5} />{t.label}</button>
            ))}
          </div>
          {tab === "ricette" && (
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <Reveal>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h2 className="font-display text-lg font-semibold">Nuova richiesta ricetta</h2>
                  <form onSubmit={(e) => { e.preventDefault(); if (!med.trim()) { toast.error("Inserisci il farmaco"); return; } store.addRecipe({ patientId: state.user!.id, patientName: state.user!.name, medication: med, notes }); setMed(""); setNotes(""); toast.success("Richiesta inviata"); refresh(); }} className="mt-4 space-y-4">
                    <div><label className="text-sm font-medium">Farmaco *</label><input value={med} onChange={(e) => setMed(e.target.value)} className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Es. Ramipril 5mg" /></div>
                    <div><label className="text-sm font-medium">Note</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
                    <button type="submit" className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Invia richiesta</button>
                  </form>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="space-y-4">
                  <h2 className="font-display text-lg font-semibold">Le tue ricette</h2>
                  {recipes.length === 0 && <p className="text-sm text-muted-foreground">Nessuna ricetta ancora.</p>}
                  {recipes.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                      <div className="flex items-start justify-between gap-3">
                        <div><p className="font-medium">{r.medication}</p>{r.notes && <p className="mt-1 text-sm text-muted-foreground">{r.notes}</p>}</div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${r.status === "approved" ? "bg-primary/10 text-primary" : "bg-accent/30 text-accent-foreground"}`}>{r.status === "approved" ? "Approvata" : "In attesa"}</span>
                      </div>
                      {r.status === "approved" && (
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => generateRecipePDF(r, state.user!.name, MOCK_PATIENT.fiscalCode)} className="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-1.5 text-xs font-medium text-primary"><Download className="size-3.5" /> Scarica PDF</button>
                          <button onClick={() => generateRecipePDF(r, state.user!.name, MOCK_PATIENT.fiscalCode)} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium"><RefreshCw className="size-3.5" /> Rigenera PDF</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          )}
          {tab === "fatture" && (
            <div className="mt-8 space-y-4">
              {invoices.map((inv) => (
                <Reveal key={inv.id}>
                  <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="font-medium">{inv.number}</p><p className="text-sm text-muted-foreground">{inv.description}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg font-semibold text-primary">€ {inv.amount.toFixed(2)}</span>
                      {inv.status === "pending" ? (
                        <button onClick={() => { store.payInvoice(inv.id); toast.success("Pagamento effettuato"); refresh(); }} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"><CreditCard className="size-3.5" /> Paga online</button>
                      ) : (
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Pagata</span>
                      )}
                      <button onClick={() => generateInvoicePDF(inv)} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium"><Download className="size-3.5" /> PDF</button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
          {tab === "documenti" && (
            <div className="mt-8"><Reveal><div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft"><FileText className="mx-auto size-12 text-muted-foreground" strokeWidth={1.5} /><p className="mt-4 text-muted-foreground">I documenti generati sono nelle sezioni Ricette e Fatture. Usa Rigenera PDF per ricostruire il documento.</p></div></Reveal></div>
          )}
        </div>
      </section>
    </div>
  );
}
