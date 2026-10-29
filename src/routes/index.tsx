import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Mail, FileDown, Stethoscope, ArrowRight, Star } from "lucide-react";
import { SERVICES, REVIEWS, store } from "@/lib/store";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const stats = store.stats();
  return (
    <>
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/50 to-primary/80" />
        <div className="relative mx-auto flex min-h-[90vh] max-w-[1200px] flex-col justify-center px-4 pb-24 pt-28 sm:px-6">
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">La cura, senza attese.</h1>
          <p className="mt-6 max-w-xl text-lg text-white/90 sm:text-xl">Prenota online, ricevi conferma immediata e scarica ricette e fatture dalla tua area paziente.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/prenota" className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-float">Prenota una visita <ArrowRight className="size-4" /></Link>
            <Link to="/area-paziente" className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/80 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm">Richiedi una ricetta</Link>
          </div>
          <div className="absolute bottom-8 right-4 hidden rounded-2xl border border-white/30 bg-white/15 px-5 py-4 backdrop-blur-md md:block">
            <p className="text-xs font-medium text-white/70">Primo orario libero oggi</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white">16:30</p>
          </div>
        </div>
      </section>

      <section className="bg-teal-light py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">Come funziona</h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-8 sm:grid-cols-3">
            {[{
              icon: CalendarCheck, title: "Prenoti", desc: "Scegli servizio, data e orario libero in pochi click."
            }, {
              icon: Mail, title: "Ricevi conferma", desc: "Conferma automatica via email con tutti i dettagli."
            }, {
              icon: FileDown, title: "Scarichi i documenti", desc: "Ricette, fatture e referti sempre disponibili in area paziente."
            }].map((s) => (
              <StaggerItem key={s.title}>
                <div className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-soft">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><s.icon className="size-7" strokeWidth={1.5} /></div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">I nostri servizi</h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.slice(0, 8).map((s) => (
              <StaggerItem key={s.id}>
                <div className="group flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-float">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary"><Stethoscope className="size-5" strokeWidth={1.5} /></div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{s.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-primary">{typeof s.price === "number" ? `€ ${s.price}` : s.price}</span>
                    <Link to="/prenota" search={{ servizio: s.id }} className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">Prenota →</Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10 text-center">
            <Link to="/servizi" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-soft">Vedi tutti i servizi <ArrowRight className="size-4" /></Link>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Stagger className="grid gap-8 sm:grid-cols-3">
            {[{
              value: stats.patients + "+", label: "Pazienti seguiti"
            }, {
              value: String(stats.years), label: "Anni di esperienza"
            }, {
              value: String(stats.doctors), label: "Medici specialisti"
            }].map((s) => (
              <StaggerItem key={s.label}>
                <div className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-soft">
                  <p className="font-display text-4xl font-semibold text-primary sm:text-5xl">{s.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-teal-light py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal><h2 className="text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">Cosa dicono i pazienti</h2></Reveal>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-3">
            {REVIEWS.map((r) => (
              <StaggerItem key={r.id}>
                <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
                  <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-4 fill-accent text-accent" />)}</div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <p className="mt-4 text-sm font-medium">{r.name}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal>
            <div className="rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Pronto a prenotare?</h2>
              <p className="mx-auto mt-4 max-w-md text-primary-foreground/85">Nessuna chiamata, nessuna attesa. Scegli il servizio e l&apos;orario che preferisci.</p>
              <Link to="/prenota" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-float">Prenota ora <ArrowRight className="size-4" /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
