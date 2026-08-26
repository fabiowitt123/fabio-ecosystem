# Sprachwerk v27 – Monetarisierung: Livegang-Checkliste

## Bereits technisch vorbereitet
- Free / Pro / Pro + Fabio
- monatliche und jährliche Darstellung
- 7-Tage-Trial-Architektur
- serverseitige Stripe Checkout Session
- Stripe Customer Portal
- signierter Stripe Webhook
- Supabase Subscription-Status
- Free/Pro Feature Gates
- Lehrer-/Hausaufgabenmodell
- Pricing/FAQ/Upgrade-CTAs

## 1. Stripe
Erstelle in Stripe ein Produkt `Sprachwerk Pro` und zwei wiederkehrende Preise:
- monatlich
- jährlich

Setze in Supabase Edge Function Secrets:
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_PRO_MONTHLY
- STRIPE_PRICE_PRO_ANNUAL
- STRIPE_TRIAL_DAYS=7
- SITE_URL=https://deine-domain.de

Keine Secret Keys in Browserdateien.

## 2. Supabase
- bestehendes Schema ausführen
- `supabase-v26-subscriptions.sql` ausführen
- Edge Functions deployen:
  - create-checkout
  - customer-portal
  - stripe-webhook
- `stripe-webhook` ohne JWT-Plattformprüfung deployen; die Stripe-Signatur wird im Handler verifiziert.
- RLS prüfen.

## 3. Stripe Webhook Events
Mindestens Subscription Created/Updated/Deleted an die Edge Function senden.
Testzahlungen zuerst im Stripe Test Mode durchführen.

## 4. Customer Portal
In Stripe konfigurieren:
- Zahlungsmethode aktualisieren
- Rechnungen anzeigen
- Kündigung / Subscription Management entsprechend deinem Geschäftsmodell
- Rückkehr-URL

## 5. Steuer / Rechnungen
Vor Livegang mit Steuerberatung klären:
- deutsche Umsatzsteuer
- grenzüberschreitende B2C-Digitalleistungen in der EU
- OSS-Relevanz
- Coaching vs. digitale Leistung
- Rechnungsanforderungen

## 6. Verbraucherrecht
Vor Livegang anwaltlich prüfen:
- AGB
- Widerrufsbelehrung
- sofortiger Beginn digitaler Leistung
- Preis-/Laufzeitangaben unmittelbar vor Bestellung
- Kündigungsprozess / ggf. Kündigungsbutton
- Testphase und automatische Verlängerung
- Coaching-Stornobedingungen

## 7. Datenschutz
Datenschutzerklärung konkret um Supabase + Stripe ergänzen.

## 8. Conversion
Nach Livegang messen:
- Pricing Page → Checkout
- Checkout Completion
- Trial → Paid
- Monthly churn
- Annual share
- Free → Pro
- Coaching Leads
- Aktivierung: erste Lektion innerhalb 24h
- D7/D30 Retention

## Wichtig
Diese Dateien implementieren die technische Architektur, können aber ohne deine echten Stripe-/Supabase-Zugangsdaten keine echten Zahlungen annehmen. Rechtstexte und steuerliche Behandlung müssen anhand deines realen Unternehmens geprüft werden.
