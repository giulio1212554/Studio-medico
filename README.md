# Studio Medico Aurelia

Sito web completo per studio medico fittizio – prenotazioni, ricette digitali, fatture e area paziente.

## Stack

- **TanStack Start** + React 19
- **Tailwind CSS 4** + design system oklch
- **shadcn/ui**
- **Framer Motion** (reveal, parallax, contatori)
- **jsPDF** (ricette e fatture generate al volo)
- Dark mode, mobile-first, accessibile

## Pagine

| Route | Descrizione |
|-------|-------------|
| `/` | Home: hero, 3 passi, servizi, gallery, stats, recensioni, CTA |
| `/chi-siamo` | Storia, team, valori, galleria, orari, mappa, contatti |
| `/servizi` | Card servizi con prezzi e CTA Prenota |
| `/prenota` | Wizard: servizio → data/orario → dati → conferma email |
| `/area-paziente` | Login, ricette (stato + PDF), fatture (paga online + PDF), documenti |
| `/admin` | Contatori, agenda, approvazione ricette, emissione fatture, FAQ |

## Avvio

```bash
npm install
npm run dev
```

## Design

- **Primario**: teal profondo (`oklch(0.42 0.09 195)`)
- **Sfondo**: bianco latte
- **Accento**: sabbia calda
- **Font**: Fraunces (titoli) + Inter (testo)
- Nav fissa trasparente → vetro allo scroll
- Reveal on scroll, reduced-motion rispettato

## PDF

Ricette e fatture non sono file statici: vengono generate con jsPDF dai dati in memoria (intestazione Aurelia, paziente, codice/numero, QR placeholder). "Rigenera PDF" ricostruisce lo stesso layout. Footer: "Documento generato da Tecoloii".

## Demo login

- **Paziente**: qualsiasi email (es. `mario.rossi@email.it`)
- **Admin**: `admin@aurelia.it` (o flag admin)

## Indirizzo fittizio

Via dei Cedri 12 · Tel. 000 000 0000

Realizzato da Tecoloii
