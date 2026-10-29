import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SERVICES, getAvailableSlots, store, type ServiceId } from "@/lib/store";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfToday, isBefore, isWeekend } from "date-fns";
import { it } from "date-fns/locale";

export const Route = createFileRoute("/prenota")({
  validateSearch: (search: Record<string, unknown>) => ({ servizio: (search.servizio as string) || undefined }),
  component: PrenotaPage,
});

function PrenotaPage() {
  const { servizio: initialService } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<ServiceId | "">((initialService as ServiceId) || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const service = SERVICES.find((s) => s.id === serviceId);
  const slots = useMemo(() => (date ? getAvailableSlots(date) : []), [date]);
  const days = useMemo(() => {
    const today = startOfToday();
    const start = addDays(today, weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(start, i);
      const iso = format(d, "yyyy-MM-dd");
      return { date: d, iso, disabled: isBefore(d, today) || isWeekend(d), label: format(d, "EEE d", { locale: it }) };
    });
  }, [weekOffset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId || !date || !time || !name || !email) { toast.error("Compila tutti i campi"); return; }
    store.addAppointment({ serviceId: serviceId as ServiceId, date, time, patientName: name, patientEmail: email, patientPhone: phone });
    toast.success("Prenotazione confermata!");
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 pt-16">
        <div className="max-w-md rounded-3xl border border-border bg-card p-10 text-center shadow-float">
          <CheckCircle2 className="mx-auto size-16 text-primary" strokeWidth={1.5} />
          <h1 className="mt-6 font-display text-2xl font-semibold">Prenotazione confermata</h1>
          <p className="mt-3 text-muted-foreground">{service?.name} · {format(new Date(date), "d MMMM yyyy", { locale: it })} alle {time}</p>
          <button onClick={() => navigate({ to: "/" })} className="mt-8 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Torna alla home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="bg-teal-light py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal><h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Prenota una visita</h1></Reveal>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <Reveal>
                <h2 className="font-display text-xl font-semibold">Scegli il servizio</h2>
                <div className="mt-4 grid gap-3">
                  {SERVICES.map((s) => (
                    <button key={s.id} type="button" onClick={() => setServiceId(s.id)} className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left ${serviceId === s.id ? "border-primary bg-secondary" : "border-border bg-card"}`}>
                      <div><p className="font-medium">{s.name}</p><p className="text-sm text-muted-foreground">{typeof s.price === "number" ? `€ ${s.price}` : s.price}</p></div>
                      {serviceId === s.id && <CheckCircle2 className="size-5 text-primary" />}
                    </button>
                  ))}
                </div>
                <button type="button" disabled={!serviceId} onClick={() => setStep(2)} className="mt-6 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40">Continua</button>
              </Reveal>
            )}
            {step === 2 && (
              <Reveal>
                <button type="button" onClick={() => setStep(1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground"><ChevronLeft className="size-4" /> Indietro</button>
                <h2 className="font-display text-xl font-semibold">Data e orario</h2>
                <div className="mt-6 flex items-center justify-between">
                  <button type="button" onClick={() => setWeekOffset((w) => Math.max(0, w - 1))} disabled={weekOffset === 0} className="rounded-full p-2 hover:bg-secondary disabled:opacity-30"><ChevronLeft className="size-5" /></button>
                  <span className="text-sm font-medium">{format(days[0].date, "d MMM", { locale: it })} – {format(days[6].date, "d MMM yyyy", { locale: it })}</span>
                  <button type="button" onClick={() => setWeekOffset((w) => w + 1)} className="rounded-full p-2 hover:bg-secondary"><ChevronRight className="size-5" /></button>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {days.map((d) => (
                    <button key={d.iso} type="button" disabled={d.disabled} onClick={() => { setDate(d.iso); setTime(""); }} className={`rounded-xl py-3 text-center text-xs font-medium ${d.disabled ? "text-muted-foreground/40" : date === d.iso ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{d.label}</button>
                  ))}
                </div>
                {date && (
                  <div className="mt-6">
                    <p className="text-sm font-medium">Orari disponibili</p>
                    <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {slots.map((t) => (
                        <button key={t} type="button" onClick={() => setTime(t)} className={`rounded-xl py-2.5 text-sm font-medium ${time === t ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                )}
                <button type="button" disabled={!date || !time} onClick={() => setStep(3)} className="mt-6 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40">Continua</button>
              </Reveal>
            )}
            {step === 3 && (
              <Reveal>
                <button type="button" onClick={() => setStep(2)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground"><ChevronLeft className="size-4" /> Indietro</button>
                <h2 className="font-display text-xl font-semibold">I tuoi dati</h2>
                <div className="mt-6 space-y-4">
                  <div><label className="text-sm font-medium">Nome e cognome *</label><input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Mario Rossi" /></div>
                  <div><label className="text-sm font-medium">Email *</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="mario@email.it" /></div>
                  <div><label className="text-sm font-medium">Telefono</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="333 1234567" /></div>
                </div>
                <button type="submit" className="mt-8 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Conferma prenotazione</button>
              </Reveal>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
