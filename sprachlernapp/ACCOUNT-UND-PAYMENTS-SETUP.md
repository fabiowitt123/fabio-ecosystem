# HINWEIS

Der lokale Account-Teil dieses Dokuments ist seit v19 durch Supabase ersetzt. Siehe `SUPABASE-SETUP.md`.

# Sprachlernapp – Account- und Payment-Setup

## Aktueller Stand
Die v18-App hat browserlokale Benutzerkonten via `localStorage`.

Gespeichert werden pro Benutzer:
- Benutzername
- lokal gehashter Passwortwert
- XP
- Level
- Streak
- Grammatik-Fortschritt
- Vokabel-Fortschritt
- Badges / Profildaten

## Wichtig
Das ist für einen statischen Prototypen geeignet, aber kein sicherer produktiver Login:
- Daten bleiben nur im jeweiligen Browser/Gerät.
- Browserdaten können gelöscht werden.
- Der lokale Passwort-Hash ersetzt keine Server-Authentifizierung.

## Empfohlener nächster Schritt für echte Accounts
Supabase oder Firebase anbinden:
1. Auth aktivieren (E-Mail/Passwort oder OAuth).
2. Tabelle/Profile für XP, Level, Streak und Progress anlegen.
3. Row Level Security aktivieren.
4. Fortschritt bei jeder abgeschlossenen Lektion synchronisieren.
5. Optional Cloud Sync und Leaderboards ergänzen.

## PayPal
In `index.html` ersetzen:
`https://www.paypal.com/paypalme/DEIN_PAYPAL_NAME`

durch deinen echten PayPal.Me-Link.

## Stripe
In `index.html` ersetzen:
`https://buy.stripe.com/DEIN_STRIPE_PAYMENT_LINK`

durch einen Stripe Payment Link.

Stripe kann darüber Karten, Apple Pay und Google Pay anbieten, sofern in deinem Stripe-Konto verfügbar.

## Banküberweisung
Die Platzhalter-IBAN in `index.html` durch echte Angaben ersetzen.

## Rechtliches
Vor Veröffentlichung Zahlungsabwicklung, Impressum, Datenschutz und mögliche steuerliche Behandlung der Zahlungen prüfen.
