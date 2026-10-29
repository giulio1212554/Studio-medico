import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Stethoscope,
  HeartPulse,
  Scan,
  Apple,
  TestTube,
  FileCheck,
  Pill,
  Video,
} from "lucide-react";
import { SERVICES } from "@/lib/store";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export const Route = createFileRoute("/servizi")({
  component: ServiziPage,
});

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Stethoscope,
  HeartPulse,
  Scan,
  Apple,
  TestTube,
  FileCheck,
  Pill,
  Video,
};

function ServiziPage() {
  return (
    <div className="pt-16">
      <section className="bg-teal-light py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Servizi
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Prestazioni specialistiche con prezzi trasparenti. Prenota online e ricevi conferma
              immediata.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => {
              const Icon = iconMap[s.icon] || Stethoscope;
              return (
                <StaggerItem key={s.id}>
                  <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-float">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <Icon className="size-6" strokeWidth={1.5} />
                    </div>
                    <h2 className="mt-5 font-display text-xl font-semibold">{s.name}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="font-display text-2xl font-semibold text-primary">
                          {typeof s.price === "number" ? `€ ${s.price}` : s.price}
                        </p>
                        {s.priceNote && (
                          <p className="text-xs text-muted-foreground">{s.priceNote}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          Durata circa {s.duration} min
                        </p>
                      </div>
                      <Link
                        to="/prenota"
                        search={{ servizio: s.id }}
                        className="shrink-0 rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Prenota
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
