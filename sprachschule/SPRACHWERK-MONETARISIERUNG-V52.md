# SPRACHWERK Monetarisierung v52

## Was live funktioniert
- Vier bezahlte Pakete: Economy, Standard, Premium und Pro.
- Zusätzliche Einstiegsprodukte: Einstufung, Writing Review, Conversation Booster und Gutschein.
- Firmenpaket als Lead-/Sales-Angebot.
- CTA-Auswahl übernimmt das gewählte Produkt automatisch in das Buchungsformular.
- Buchungsformular wird via FormSubmit an `fabiowitt@gmx.ch` gesendet.
- Zahlung findet bewusst erst nach Termin-/Verfügbarkeitsbestätigung statt.

## Vor echtem Zahlungs-Livegang
1. Geschäftliche Rechnungsangaben und steuerliche Behandlung prüfen.
2. AGB / Widerrufs- und Stornierungsregeln rechtlich prüfen und veröffentlichen.
3. Stripe Payment Links oder PayPal-Zahlungslinks pro Produkt erstellen.
4. Erst danach können die CTA-Links direkt auf Checkout umgestellt werden. Keine geheimen API-Keys in HTML/JS speichern.
5. Für Monatsmodelle exakt festlegen, ob es sich um monatliche Einzelbuchungen oder echte Abonnements handelt.

## Empfohlene Zahlungslogik für Unterricht
Die jetzige Reservierungslogik ist für Einzelunterricht sinnvoll: Kunde wählt Paket -> Anfrage -> Termin wird bestätigt -> Kunde erhält Rechnung/Payment Link -> Zahlung -> Unterricht. So wird kein Termin verkauft, der nicht verfügbar ist.
