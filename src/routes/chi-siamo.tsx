import { createFileRoute } from "@tanstack/react-router";
import { DOCTORS, HOURS, CONTACT } from "@/lib/store";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/chi-siamo")({ component: ChiSiamoPage });

function ChiSiamoPage() {
  return (
    <div className="pt-16">
      <section className="bg-teal-light py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Chi siamo</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Dal 2014 Studio Medico Aurelia offre medicina di qualità in un ambiente pensato per il comfort del paziente.</p>
          </Reveal>
        </div>
      </section>
      <section className="bg-teal-light py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal><h2 className="text-center font-display text-3xl font-semibold">Il team medico</h2></Reveal>
          <Stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {DOCTORS.map((d) => (
              <StaggerItem key={d.id}>
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
                  <img src={d.image} alt={d.name} className="aspect-square w-full object-cover" loading="lazy" />
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{d.name}</h3>
                    <p className="mt-0.5 text-sm font-medium text-primary">{d.specialty}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{d.bio}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">Orari e contatti</h2>
            <div className="mt-8 space-y-4">
              {HOURS.map((h) => (
                <div key={h.day} className="flex items-center gap-3 text-sm">
                  <Clock className="size-4 text-primary shrink-0" strokeWidth={1.5} />
                  <span className="w-40 font-medium">{h.day}</span>
                  <span className="text-muted-foreground">{h.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center gap-3"><MapPin className="size-4 text-primary" strokeWidth={1.5} />{CONTACT.address}</div>
              <div className="flex items-center gap-3"><Phone className="size-4 text-primary" strokeWidth={1.5} /><a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a></div>
              <div className="flex items-center gap-3"><Mail className="size-4 text-primary" strokeWidth={1.5} /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
