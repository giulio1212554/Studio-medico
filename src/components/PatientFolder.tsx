import { useState, useRef, useEffect } from "react";
import {
  store,
  SERVICES,
  updatePatient,
  type MedicalDocument,
} from "@/lib/store";
import { generateInvoicePDF, generateRecipePDF } from "@/lib/pdf";
import { toast } from "sonner";
import {
  Calendar,
  Pill,
  Receipt,
  Eraser,
  Upload,
  FileText,
  Trash2,
  ArrowLeft,
  Plus,
} from "lucide-react";

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

type FolderTab = "documenti" | "ricette" | "fatture" | "visite";

function PatientFolder({
  patientId,
  onBack,
  refresh,
}: {
  patientId: string;
  onBack: () => void;
  refresh: () => void;
}) {
  const folder = store.getFolder(patientId);
  const [tab, setTab] = useState<FolderTab>("documenti");
  const [med, setMed] = useState("");
  const [notes, setNotes] = useState("");
  const [invDesc, setInvDesc] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [signingId, setSigningId] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [cf, setCf] = useState(folder?.patient.fiscalCode || "");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!folder) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Cartella non trovata.</p>
        <button onClick={onBack} className="mt-4 text-sm text-primary underline">
          Torna alle cartelle
        </button>
      </div>
    );
  }

  const { patient, documents, recipes, invoices, appointments } = folder;

  const onUpload = (file: File) => {
    if (file.size > 600_000) {
      toast.error("File troppo grande (max 600 KB in demo)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        store.addDocument({
          patientId: patient.id,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          dataUrl: String(reader.result || ""),
          uploadedBy: "admin",
          category: "altro",
        });
        toast.success("Documento caricato nella cartella");
        refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload non riuscito");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Tutte le cartelle
          </button>
          <h2 className="font-display text-2xl font-semibold">{patient.name}</h2>
          <p className="text-sm text-muted-foreground">
            {patient.email}
            {patient.phone ? ` · ${patient.phone}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            {documents.length} documenti
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            {recipes.length} ricette
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            {invoices.length} fatture
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <label className="text-xs font-medium text-muted-foreground">Codice fiscale</label>
        <div className="mt-1 flex gap-2">
          <input
            value={cf}
            onChange={(e) => setCf(e.target.value)}
            placeholder="RSSMRA80A01H501U"
            className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => {
              updatePatient(patient.id, { fiscalCode: cf.trim().toUpperCase() });
              toast.success("CF salvato");
              refresh();
            }}
            className="rounded-xl bg-secondary px-3 py-2 text-xs font-medium text-primary"
          >
            Salva
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border">
        {(
          [
            { id: "documenti" as const, label: "Documenti", icon: FileText },
            { id: "ricette" as const, label: "Ricette", icon: Pill },
            { id: "fatture" as const, label: "Fatture", icon: Receipt },
            { id: "visite" as const, label: "Visite", icon: Calendar },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            <t.icon className="size-4" strokeWidth={1.5} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "documenti" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,image/*,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
            >
              <Upload className="size-4" /> Carica documento
            </button>
            <p className="text-xs text-muted-foreground">PDF o immagini, max 600 KB (demo)</p>
          </div>
          {documents.length === 0 && (
            <p className="text-sm text-muted-foreground">Nessun documento in cartella.</p>
          )}
          {documents.map((d: MedicalDocument) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <FileText className="size-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(d.size / 1024).toFixed(0)} KB ·{" "}
                    {new Date(d.uploadedAt).toLocaleDateString("it-IT")}
                    {!d.dataUrl && " · (placeholder demo)"}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                {d.dataUrl && (
                  <a
                    href={d.dataUrl}
                    download={d.name}
                    className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium"
                  >
                    Scarica
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    store.removeDocument(d.id);
                    toast.success("Documento rimosso");
                    refresh();
                  }}
                  className="rounded-xl border border-border p-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "ricette" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold">Nuova ricetta da cartella</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Paziente già selezionato: {patient.name}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!med.trim()) {
                  toast.error("Inserisci il farmaco");
                  return;
                }
                store.addRecipe({
                  patientId: patient.id,
                  patientName: patient.name,
                  medication: med,
                  notes,
                });
                setMed("");
                setNotes("");
                toast.success("Richiesta creata – da firmare sotto");
                refresh();
              }}
              className="mt-4 space-y-3"
            >
              <input
                value={med}
                onChange={(e) => setMed(e.target.value)}
                placeholder="Farmaco *"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Note"
                rows={2}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <Plus className="size-4" /> Crea ricetta
              </button>
            </form>
          </div>
          <div className="space-y-3">
            {recipes.length === 0 && (
              <p className="text-sm text-muted-foreground">Nessuna ricetta.</p>
            )}
            {recipes.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{r.medication}</p>
                    {r.code && (
                      <p className="text-xs text-muted-foreground">NRE {r.code}</p>
                    )}
                  </div>
                  <span
                    className={`h-fit rounded-full px-2 py-0.5 text-xs ${
                      r.status === "approved"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/30"
                    }`}
                  >
                    {r.status === "approved"
                      ? "Approvata"
                      : r.status === "pending"
                        ? "In attesa"
                        : "Rifiutata"}
                  </span>
                </div>
                {r.status === "pending" && (
                  <div className="mt-3">
                    {signingId === r.id ? (
                      <div className="space-y-2">
                        <SignaturePad onChange={setSignature} />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (!signature) {
                                toast.error("Firma prima di approvare");
                                return;
                              }
                              store.updateRecipeStatus(r.id, "approved", {
                                signatureDataUrl: signature,
                                signedBy: "Dr.ssa Elena Martini",
                              });
                              toast.success("Firmata e approvata");
                              setSigningId(null);
                              setSignature(null);
                              refresh();
                            }}
                            className="rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                          >
                            Firma e approva
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSigningId(null);
                              setSignature(null);
                            }}
                            className="rounded-xl border border-border px-3 py-1.5 text-xs"
                          >
                            Annulla
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSigningId(r.id);
                          setSignature(null);
                        }}
                        className="rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                      >
                        Approva (firma)
                      </button>
                    )}
                  </div>
                )}
                {r.status === "approved" && (
                  <button
                    type="button"
                    onClick={() =>
                      void generateRecipePDF(r, patient.name, patient.fiscalCode)
                    }
                    className="mt-2 text-xs text-primary underline"
                  >
                    Scarica PDF
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "fatture" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold">Emetti fattura da cartella</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Intestata a {patient.name}
              {patient.fiscalCode ? ` · CF ${patient.fiscalCode}` : ""}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amount = parseFloat(invAmount);
                if (!invDesc || isNaN(amount)) {
                  toast.error("Descrizione e importo obbligatori");
                  return;
                }
                const all = store.getInvoices();
                store.addInvoice({
                  number: `FAT-2026-${String(all.length + 1).padStart(3, "0")}`,
                  patientId: patient.id,
                  patientName: patient.name,
                  fiscalCode: patient.fiscalCode,
                  description: invDesc,
                  amount,
                });
                setInvDesc("");
                setInvAmount("");
                toast.success("Fattura emessa in cartella");
                refresh();
              }}
              className="mt-4 space-y-3"
            >
              <input
                value={invDesc}
                onChange={(e) => setInvDesc(e.target.value)}
                placeholder="Descrizione *"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                value={invAmount}
                onChange={(e) => setInvAmount(e.target.value)}
                placeholder="Importo € *"
                type="number"
                step="0.01"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Emetti fattura
              </button>
            </form>
          </div>
          <div className="space-y-3">
            {invoices.length === 0 && (
              <p className="text-sm text-muted-foreground">Nessuna fattura.</p>
            )}
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
              >
                <div>
                  <p className="text-sm font-medium">{inv.number}</p>
                  <p className="text-xs text-muted-foreground">{inv.description}</p>
                  <p className="text-xs text-muted-foreground">Esente IVA</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">€ {inv.amount.toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => void generateInvoicePDF(inv, patient.fiscalCode)}
                    className="text-xs text-primary underline"
                  >
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "visite" && (
        <div className="space-y-3">
          {appointments.length === 0 && (
            <p className="text-sm text-muted-foreground">Nessuna visita registrata.</p>
          )}
          {appointments.map((a) => {
            const svc = SERVICES.find((s) => s.id === a.serviceId);
            return (
              <div
                key={a.id}
                className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
              >
                <p className="font-medium">{svc?.name || a.serviceId}</p>
                <p className="text-muted-foreground">
                  {a.date} alle {a.time} · {a.status}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { PatientFolder };
