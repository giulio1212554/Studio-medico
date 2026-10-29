# Servizi esterni — come collegare le chiavi

Tutti i file generici sono già nel progetto sotto `src/lib/`.

Quando hai le chiavi:

1. Copia `.env.example` → `.env`
2. Incolla le chiavi
3. (Opzionale) installa i pacchetti:  
   `npm i @supabase/supabase-js stripe @stripe/stripe-js @stripe/react-stripe-js pdf-lib resend`
4. Riavvia `npm run dev`

Il codice passa automaticamente da **mock** a **produzione** quando trova le chiavi.

---

## File preparati

| File | Scopo |
|------|--------|
| `.env.example` | Elenco di tutte le variabili |
| `src/lib/env.ts` | Lettura sicura delle env |
| `src/lib/stripe.ts` | PaymentIntent + cauzione (`capture_method: manual`) |
| `src/lib/supabase.ts` | Client, upload documenti, bookings, disponibilità |
| `src/lib/email.ts` | Email conferma/promemoria IT-EN-DE + SMS Twilio |
| `src/lib/pdf-contract.ts` | Generazione contratto PDF + firma |
| `src/lib/google-places.ts` | Recensioni live Google |

---

## Cosa darmi quando sei pronto

Incolla pure (in chat privata o qui) le chiavi così:

```
STRIPE_PUBLISHABLE=pk_test_...
STRIPE_SECRET=sk_test_...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON=eyJ...
RESEND_API_KEY=re_...
```

Io le metto nel `.env` e, se serve, collego i componenti UI (PaymentElement, SignaturePad, ecc.).

---

## Schema SQL Supabase (da eseguire una volta)

Vai in Supabase → SQL Editor e incolla:

```sql
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  vehicle_id text not null,
  customer_name text,
  customer_email text,
  customer_phone text,
  pickup timestamptz,
  return timestamptz,
  extras jsonb default '[]',
  total numeric,
  deposit numeric,
  status text default 'pending',
  lang text default 'it',
  documents_path text,
  contract_path text,
  stripe_payment_intent text,
  stripe_deposit_intent text,
  created_at timestamptz default now()
);

-- Storage: crea bucket privato "documents" da UI Storage
```

---

## Ordine consigliato per le chiavi

1. **Stripe** (test mode) → pagamenti
2. **Supabase** → documenti + DB
3. **Resend** → email
4. **pdf-lib** (solo npm, no chiave) → contratti
5. Twilio / Google Places → opzionali
