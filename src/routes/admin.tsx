import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { store, SERVICES, ensurePatient } from "@/lib/store";
import { generateInvoicePDF, generateRecipePDF } from "@/lib/pdf";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import {
  Users, Calendar, Pill, Receipt, Euro, Check, X, MessageCircle, LogIn, RotateCcw, Eraser,
} from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function LoginForm() {
  const { login } = useApp();
  const [email, setEmail] = useState("admin@aurelia.it");
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 pt-16">
      <Reveal>
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-float">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            <LogIn className="size-6" strokeWidth={1.5} />
          </div>
          <h1 className="mt-5 text-center font-display text-2xl font-semibold">Admin</h1>
          <form onSubmit={(e) => { e.preventDefault(); login(email, true); toast.success("Accesso admin"); }} className="mt-8 space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
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

function SignaturePad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e293b";
  }, []);

  const pos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const start = (e: React.PointerEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const end = () => {
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange(null);
  };

  return (
    <div>
      <canvas ref={canvasRef} className="h-28 w-full touch-none rounded-xl border border-border bg-white"
        onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} />
      <button type="button" onClick={clear} className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <Eraser className="size-3.5" /> Cancella firma
      </button>
    </div>
  );
}

function AdminPage() {
  const { state } = useApp();
  const [, force] = useState(0);
  const refresh = () => force((n) => n + 1);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [invDesc, setInvDesc] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invPatientName, setInvPatientName] = useState("");
  const [invPatientEmail, setInvPatientEmail] = useState("");
  const [signingId, setSigningId] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  if (!state.user || state.user.role !== "admin") return <LoginForm />;

  const stats = store.stats();
  const recipes = store.getRecipes();
  const appointments = store.getAppointments();
  const invoices = store.getInvoices();
  const patients = store.getPatients();
  const pendingRecipes = recipes.filter((r) => r.status === "pending");

  const approveWithSignature = (id: string) => {
    if (!signature) {
      toast.error("Firma nello spazio dedicato prima di approvare");
      return;
    }
    store.updateRecipeStatus(id, "approved", {
      signatureDataUrl: signature,
      signedBy: "Dr.ssa Elena Martini",
    });
    toast.success("Ricetta firmata e approvata");
    setSigningId(null);
    setSignature(null);
    refresh();
  };

  return (
    <div className="pt-16">
      <section className="bg-teal-light py-12">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <Reveal>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard Admin</h1>
          </Reveal>
          <button
            onClick={() => {
              if (confirm("Ripristinare i dati demo iniziali?")) {
                store.resetDemo();
                toast.success("Demo ripristinata");
                refresh();
              }
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft"
          >
            <RotateCcw className="size-4" /> Ripristina demo
          </button>
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
                    <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      <item.icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-display text-2xl font-semibold">{item.value}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-primary" strokeWidth={1.5} />
                  <h2 className="font-display text-lg font-semibold">Agenda</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {appointments.length === 0 && <p className="text-sm text-muted-foreground">Nessuna prenotazione recente.</p>}
                  {appointments.slice(-8).reverse().map((a) => {
                    const svc = SERVICES.find((s) => s.id === a.serviceId);
                    return (
                      <div key={a.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium">{a.patientName}</p>
                          <p className="text-muted-foreground">{svc?.name} · {a.date} {a.time}</p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{a.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2">
                  <Pill className="size-5 text-primary" strokeWidth={1.5} />
                  <h2 className="font-display text-lg font-semibold">Ricette da approvare ({pendingRecipes.length})</h2>
                </div>
                <div className="mt-4 space-y-4">
                  {pendingRecipes.length === 0 && <p className="text-sm text-muted-foreground">Nessuna richiesta in attesa.</p>}
                  {pendingRecipes.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border px-4 py-3">
                      <p className="font-medium text-sm">{r.patientName}</p>
                      <p className="text-sm text-muted-foreground">{r.medication}</p>
                      {signingId === r.id ? (
                        <div className="mt-3 space-y-3">
                          <p className="text-xs font-medium text-muted-foreground">Firma nello spazio sotto, poi conferma</p>
                          <SignaturePad onChange={setSignature} />
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => approveWithSignature(r.id)}
                              className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                              <Check className="size-3.5" /> Firma e approva
                            </button>
                            <button onClick={() => { setSigningId(null); setSignature(null); }}
                              className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium">Annulla</button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => { setSigningId(r.id); setSignature(null); }}
                            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                            <Check className="size-3.5" /> Approva (firma)
                          </button>
                          <button onClick={() => { store.updateRecipeStatus(r.id, "rejected"); toast.success("Rifiutata"); refresh(); }}
                            className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-medium">
                            <X className="size-3.5" /> Rifiuta
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {recipes.filter((r) => r.status === "approved").length > 0 && (
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="text-xs font-medium text-muted-foreground">Approvate di recente</p>
                    {recipes.filter((r) => r.status === "approved").slice(-3).map((r) => (
                      <div key={r.id} className="mt-2 flex items-center justify-between text-sm">
                        <span>{r.patientName} – {r.code}</span>
                        <button onClick={() => generateRecipePDF(r, r.patientName)} className="text-xs text-primary underline">PDF</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2">
                  <Receipt className="size-5 text-primary" strokeWidth={1.5} />
                  <h2 className="font-display text-lg font-semibold">Emetti fattura</h2>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const amount = parseFloat(invAmount);
                  if (!invDesc || isNaN(amount) || !invPatientName || !invPatientEmail) {
                    toast.error("Compila nome, email, descrizione e importo");
                    return;
                  }
                  const patient = ensurePatient({ name: invPatientName, email: invPatientEmail });
                  store.addInvoice({
                    number: `FAT-2026-${String(invoices.length + 1).padStart(3, "0")}`,
                    patientId: patient.id,
                    patientName: patient.name,
                    description: invDesc,
                    amount,
                  });
                  toast.success(`Fattura emessa per ${patient.name}`);
                  setInvDesc(""); setInvAmount(""); setInvPatientName(""); setInvPatientEmail("");
                  refresh();
                }} className="mt-4 space-y-3">
                  <input value={invPatientName} onChange={(e) => setInvPatientName(e.target.value)} placeholder="Nome paziente"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  <input value={invPatientEmail} onChange={(e) => setInvPatientEmail(e.target.value)} placeholder="Email paziente (collega all'area paziente)" type="email"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  {patients.length > 0 && (
                    <p className="text-xs text-muted-foreground">Pazienti noti: {patients.map((p) => p.email).join(", ")}</p>
                  )}
                  <input value={invDesc} onChange={(e) => setInvDesc(e.target.value)} placeholder="Descrizione"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  <input value={invAmount} onChange={(e) => setInvAmount(e.target.value)} placeholder="Importo €" type="number" step="0.01"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  <button type="submit" className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Emetti</button>
                </form>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2">
                  <Euro className="size-5 text-primary" strokeWidth={1.5} />
                  <h2 className="font-display text-lg font-semibold">Incassi</h2>
                </div>
                <p className="mt-2 font-display text-2xl font-semibold text-primary">€ {stats.revenue.toFixed(2)}</p>
                <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2 text-sm">
                      <div>
                        <p className="font-medium">{inv.number}</p>
                        <p className="text-xs text-muted-foreground">{inv.patientName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>€ {inv.amount.toFixed(2)}</span>
                        <button onClick={() => generateInvoicePDF(inv)} className="text-xs text-primary underline">PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-5 text-primary" strokeWidth={1.5} />
                <h2 className="font-display text-lg font-semibold">Assistente FAQ</h2>
              </div>
              <div className="mt-4 space-y-2">
                {FAQ.map((f, i) => (
                  <div key={i} className="rounded-xl border border-border">
                    <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium">
                      {f.q}<span className="text-muted-foreground">{faqOpen === i ? "−" : "+"}</span>
                    </button>
                    {faqOpen === i && (
                      <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{f.a}</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Area paziente: <Link to="/area-paziente" className="text-primary underline">/area-paziente</Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
