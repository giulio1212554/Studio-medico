import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import {
  store,
  SERVICES,
  ensurePatient,
  type Patient,
} from "@/lib/store";
import { generateInvoicePDF, generateRecipePDF } from "@/lib/pdf";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import { PatientFolder } from "@/components/PatientFolder";
import {
  Users,
  Calendar,
  Pill,
  Euro,
  Check,
  X,
  MessageCircle,
  LogIn,
  RotateCcw,
  Eraser,
  FolderOpen,
  Plus,
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(email, true);
              toast.success("Accesso admin");
            }}
            className="mt-8 space-y-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
            >
              Accedi come admin
            </button>
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
      <canvas
        ref={canvasRef}
        className="h-28 w-full touch-none rounded-xl border border-border bg-white"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
      />
      <button
        type="button"
        onClick={clear}
        className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
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
  const [folderId, setFolderId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [signingId, setSigningId] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  if (!state.user || state.user.role !== "admin") return <LoginForm />;

  const stats = store.stats();
  const recipes = store.getRecipes();
  const appointments = store.getAppointments();
  const invoices = store.getInvoices();
  const patients = store.getPatients();
  const pendingRecipes = recipes.filter((r) => r.status === "pending");

  if (folderId) {
    return (
      <div className="pt-16">
        <section className="bg-teal-light py-10">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Cartella paziente
            </h1>
          </div>
        </section>
        <section className="py-8">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <PatientFolder
              patientId={folderId}
              onBack={() => setFolderId(null)}
              refresh={refresh}
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="bg-teal-light py-12">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <Reveal>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Dashboard Admin
            </h1>
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
            {[
              { icon: Users, label: "Pazienti / cartelle", value: patients.length },
              { icon: Calendar, label: "Appuntamenti oggi", value: stats.appointmentsToday },
              { icon: Pill, label: "Ricette in attesa", value: stats.pendingRecipes },
              { icon: Euro, label: "Incassi €", value: stats.revenue },
            ].map((item) => (
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

          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="size-5 text-primary" strokeWidth={1.5} />
                  <h2 className="font-display text-lg font-semibold">Cartelle pazienti</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Apri una cartella per documenti, ricette e fatture
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newName.trim() || !newEmail.trim()) {
                    toast.error("Nome e email obbligatori");
                    return;
                  }
                  const p = ensurePatient({ name: newName.trim(), email: newEmail.trim() });
                  setNewName("");
                  setNewEmail("");
                  toast.success(`Cartella creata: ${p.name}`);
                  refresh();
                  setFolderId(p.id);
                }}
                className="mt-4 flex flex-wrap gap-2"
              >
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome paziente"
                  className="min-w-[140px] flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="min-w-[160px] flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  <Plus className="size-4" /> Nuova cartella
                </button>
              </form>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {patients.map((p: Patient) => {
                  const f = store.getFolder(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFolderId(p.id)}
                      className="rounded-2xl border border-border bg-background p-4 text-left transition hover:border-primary hover:shadow-soft"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                          <FolderOpen className="size-5" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{p.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{p.email}</p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {f?.documents.length ?? 0} doc · {f?.recipes.length ?? 0} ricette ·{" "}
                            {f?.invoices.length ?? 0} fatture
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-primary" strokeWidth={1.5} />
                  <h2 className="font-display text-lg font-semibold">Agenda</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {appointments.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nessuna prenotazione recente.</p>
                  )}
                  {appointments
                    .slice(-8)
                    .reverse()
                    .map((a) => {
                      const svc = SERVICES.find((s) => s.id === a.serviceId);
                      return (
                        <div
                          key={a.id}
                          className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3 text-sm"
                        >
                          <div>
                            <p className="font-medium">{a.patientName}</p>
                            <p className="text-muted-foreground">
                              {svc?.name} · {a.date} {a.time}
                            </p>
                          </div>
                          {a.patientId && (
                            <button
                              type="button"
                              onClick={() => setFolderId(a.patientId)}
                              className="text-xs text-primary underline"
                            >
                              Cartella
                            </button>
                          )}
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
                  <h2 className="font-display text-lg font-semibold">
                    Ricette da approvare ({pendingRecipes.length})
                  </h2>
                </div>
                <div className="mt-4 space-y-4">
                  {pendingRecipes.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nessuna richiesta in attesa.</p>
                  )}
                  {pendingRecipes.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setFolderId(r.patientId)}
                        className="text-left text-sm font-medium text-primary hover:underline"
                      >
                        {r.patientName}
                      </button>
                      <p className="text-sm text-muted-foreground">{r.medication}</p>
                      {signingId === r.id ? (
                        <div className="mt-3 space-y-3">
                          <SignaturePad onChange={setSignature} />
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                if (!signature) {
                                  toast.error("Firma nello spazio dedicato");
                                  return;
                                }
                                store.updateRecipeStatus(r.id, "approved", {
                                  signatureDataUrl: signature,
                                  signedBy: "Dr.ssa Elena Martini",
                                });
                                toast.success("Ricetta firmata e approvata");
                                setSigningId(null);
                                setSignature(null);
                                refresh();
                              }}
                              className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                            >
                              <Check className="size-3.5" /> Firma e approva
                            </button>
                            <button
                              onClick={() => {
                                setSigningId(null);
                                setSignature(null);
                              }}
                              className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium"
                            >
                              Annulla
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => {
                              setSigningId(r.id);
                              setSignature(null);
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                          >
                            <Check className="size-3.5" /> Approva (firma)
                          </button>
                          <button
                            onClick={() => {
                              store.updateRecipeStatus(r.id, "rejected");
                              toast.success("Rifiutata");
                              refresh();
                            }}
                            className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-medium"
                          >
                            <X className="size-3.5" /> Rifiuta
                          </button>
                        </div>
                      )}
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
                    <button
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
                    >
                      {f.q}
                      <span className="text-muted-foreground">{faqOpen === i ? "−" : "+"}</span>
                    </button>
                    {faqOpen === i && (
                      <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                        {f.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Area paziente:{" "}
                <Link to="/area-paziente" className="text-primary underline">
                  /area-paziente
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
