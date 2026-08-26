# v32 – E-Mail-Formulare und PayPal

## E-Mail-Ziel
Alle Anfrageformulare senden an:

fabiowitt@gmx.de

Die statische Website verwendet dafür FormSubmit (`formsubmit.co`).

### Wichtig beim ersten Formular
FormSubmit sendet beim ersten Einsatz eine Aktivierungs-/Bestätigungs-E-Mail an `fabiowitt@gmx.de`.
Diese muss einmal bestätigt werden. Erst danach werden Formularnachrichten zuverlässig weitergeleitet.

## Formulare
- DACHWERK: SAP-Anfrage
- SPRACHWERK: Kursanfrage
- Fabio Witt: SAP-Projektanfrage
- LERNWERK: Kauf-CTA führt zur Pricing-/Checkout-Seite

## PayPal
Am Ende jeder Seite befindet sich ein PayPal-Spendenbutton.

In:
`shared-assets/site-config.js`

muss ersetzt werden:

`DEIN_PAYPAL_BUTTON_ID`

durch die echte Hosted Button ID aus deinem PayPal-Konto.

Alternativ kann `paypalDonationUrl` auf einen verifizierten PayPal.Me-Link gesetzt werden.

## Sicherheit
Keine PayPal- oder Stripe-Secrets in HTML/JavaScript eintragen. Für PayPal wird nur ein öffentlicher Donate-/PayPal.Me-Link benötigt.
