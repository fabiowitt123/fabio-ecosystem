# Sprachwerk v26 – Pricing, Stripe und Coaching

## Enthalten
- `pricing.html`: Free / Pro / Pro + Fabio
- `teacher.html`: Lehrer-Dashboard
- `supabase-v26-subscriptions.sql`: Subscription-, Schüler- und Hausaufgabentabellen
- `stripe-config.js`: Platzhalter für öffentliche Stripe Payment Links

## Stripe live schalten
1. In Stripe Produkte für Pro monatlich und jährlich anlegen.
2. Stripe Checkout/Payment Links erzeugen.
3. Platzhalterlinks in `pricing.html` und `stripe-config.js` ersetzen.
4. Für echte automatische Pro-Freischaltung einen Stripe Webhook verwenden.
5. Webhook sollte serverseitig/über eine Supabase Edge Function `subscriptions.plan`, `status` und `current_period_end` aktualisieren.
6. Stripe Secret Key und Webhook Secret niemals in Browser-JavaScript speichern.

## Supabase
Nach dem bisherigen Schema zusätzlich `supabase-v26-subscriptions.sql` im SQL Editor ausführen.

## Coaching
`teacher.html` ist für Lehrer-/Schülerbeziehungen und Hausaufgaben vorbereitet. Die Demo-Schülerin ist ausdrücklich als Demo markiert.

## Preise
9,90 €/Monat, 79 €/Jahr und ab 59 €/Monat sind Produktvorschläge und sollten vor Livegang hinsichtlich Marge, Marktpositionierung, Steuern und Leistungsumfang geprüft werden.

## Rechtliches
Vor dem Verkauf insbesondere Impressum, Datenschutz, AGB/Widerruf, Preisangaben, Umsatzsteuer und Zahlungsanbietertexte prüfen.
