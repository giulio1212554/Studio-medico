# Checklist di verifica — Ischia Rent (versione modificata)

Usa questa checklist per controllare cosa è **già funzionante** e cosa resta da collegare in produzione.

---

## ✅ GIÀ IMPLEMENTATO (funzionante in demo)

### Struttura pagine
- [x] Homepage `/` con widget prenotazione e contenuti modificabili
- [x] Pagina flotta separata `/flotta` (filtri per categoria)
- [x] Pagina prenotazione `/prenota` (flusso a 4 step)
- [x] Dashboard admin professionale `/admin` (sidebar dark, KPI, CRUD)

### 1. Booking Engine
- [x] Selezione mezzo + date/orari (datetime-local)
- [x] Selezione luogo di ritiro (porto / hotel)
- [x] Calcolo giorni automatico
- [x] Extra selezionabili durante la prenotazione
- [x] Pacchetti sconto applicati automaticamente
- [x] Riepilogo totale + cauzione
- [x] UI gateway Stripe / PayPal (mock — nessun addebito reale)
- [x] Pre-autorizzazione cauzione (mostrata in UI)
- [x] Conferma prenotazione salvata in store (visibile in admin)

### 2. Documenti digitali
- [x] Form upload patente / CI (UI)
- [x] Firma digitale contratto (UI mock e-Signature)
- [x] Check-in digitale con checklist + foto (componente `CheckInOut`)
- [x] Check-out digitale (stesso componente, mode="checkout")

### 3. Up-selling / Cross-selling
- [x] Extra: casco, carburante, consegna hotel, skipper, tour
- [x] Pacchetti combinati con sconto % e giorni minimi
- [x] Gestione completa extra e pacchetti da admin

### 4. Multilingua
- [x] Switch IT / EN / DE in header
- [x] Dizionario base per label principali (fleet, book, total, ecc.)
- [ ] Email / SMS automatici multilingua → **da collegare** (vedi sotto)

### 5. Marketing & SEO
- [x] Meta title / description ottimizzati
- [x] Keyword SEO modificabili da admin
- [x] Link Google Maps e WhatsApp configurabili da admin
- [x] Widget recensioni dinamico (Google / TripAdvisor style)
- [ ] Sincronizzazione Google My Business → **configurazione esterna**
- [ ] Feed live recensioni Google API → **da collegare**

### Admin — tutto modificabile
- [x] Flotta (CRUD, prezzi, disponibilità, alta/bassa stagione ±20%)
- [x] Extra (prezzo, attivo/off)
- [x] Pacchetti sconto
- [x] Prenotazioni (lista + cambio stato)
- [x] Contenuti sito (hero, WhatsApp, Maps, keyword)
- [x] PIN admin modificabile
- [x] Persistenza localStorage

**PIN admin di default: `1234`**

---

## ⚠️ MOCK / DA COLLEGARE IN PRODUZIONE

| Funzione | Stato attuale | Cosa serve |
|----------|---------------|------------|
| Pagamenti Stripe / PayPal | Solo UI | Chiavi API Stripe o PayPal + webhook |
| Pre-autorizzazione cauzione | Solo testo | Stripe PaymentIntent con capture_method=manual |
| Firma digitale PDF | Solo toggle UI | DocuSign / HelloSign / firma canvas + generazione PDF |
| Upload documenti sicuro | File locale browser | Storage (Supabase / S3) + antivirus |
| Email conferma multilingua | Messaggio a schermo | Resend / SendGrid + template IT/EN/DE |
| SMS promemoria | Non presente | Twilio / MessageBird |
| Disponibilità real-time per mezzo | Flag `available` | Calendario occupazione + backend |
| Google My Business | Solo link Maps | Configurazione GMB + eventuale API |
| Recensioni live Google | Widget statico (modificabile) | Google Places API |

---

## 🔍 Cosa controllare subito (demo locale)

1. `npm i && npm run dev`
2. Apri `/` → cambia lingua IT/EN/DE
3. Vai a `/flotta` → filtra Scooter / Auto / Gommoni
4. Clicca **Prenota** su un mezzo → completa i 4 step
5. Alla conferma vedi il **Check-in digitale**
6. Vai a `/admin` → PIN `1234`
7. Nella dashboard:
   - Overview con KPI
   - Flotta → modifica prezzo / disponibilità / +20% alta stagione
   - Extra e Pacchetti → aggiungi / disattiva
   - Prenotazioni → vedi la prenotazione appena fatta
   - Contenuti → cambia titolo hero (si riflette sulla home)
8. Homepage → scorri fino al **widget recensioni**

---

## Note tecniche

- Stack: TanStack Start + React 19 + Tailwind 4 + Framer Motion
- Dati in `localStorage` (chiave `ischia-rent-state-v2`)
- Per produzione: collegare backend (Supabase consigliato) e sostituire i mock
- Il vecchio overlay admin (AdminPanel.tsx) è ancora nel repo ma non più usato; la dashboard ufficiale è `/admin`
EOF
echo "CHECKLIST.md created"
