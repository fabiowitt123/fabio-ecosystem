# DACHWERK Website v17

Direkt deploybare statische Website für Netlify, Cloudflare Pages, GitHub Pages oder klassischen Webspace.

## Lokale Vorschau ohne Hosting-Credits

1. ZIP-Datei entpacken.
2. `START-WEBSITE.html` öffnen und die gewünschte Seite auswählen.
3. Für die realistischste Vorschau im entpackten Ordner einen lokalen Webserver starten:

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` im Browser öffnen. Navigation, Filter, SAP-Projekt-Check und Team-Matching funktionieren lokal. Netlify-Formulare werden erst nach einem Deploy verarbeitet; im lokalen Test führt das Readiness-Formular direkt zur Downloadseite.

## Deploy Preview ohne Production-Deploy

Das Projekt mit einem Git-Repository verbinden, Änderungen in einen Branch pushen und einen Pull Request öffnen. Netlify kann daraus eine Deploy Preview erzeugen. Erst die freigegebene Version wird in den Production Branch übernommen.

## Neue Conversion- und SEO-Bausteine

- `projekt-check.html` – interaktiver 8-Fragen-SAP-Projekt-Check mit Sofortauswertung
- `team-matching.html` – dynamischer Rollen- und Teamvorschlag
- `use-cases.html` – sechs klar als illustrativ gekennzeichnete Projektszenarien
- `blog.html` – filterbarer SAP-Wissenshub mit 22 Fachartikeln
- `sap-glossar.html` – durchsuchbares SAP-Glossar A–Z mit 60 Begriffen
- `sap-readiness-check.html` – Leadformular für die PDF-Checkliste
- `readiness-download.html` – Downloadseite für den 6-seitigen Readiness Check
- sechs SEO-Landingpages für PP, PP/DS, PEO, MM, Cloud ALM und Signavio
- SAP-Activate-Projektphasen, transparentes Kostenmodell und Team-Matching auf der Startseite

## Wichtige Dateien

- `index.html` – Startseite
- `START-WEBSITE.html` – lokale Seitenauswahl
- `assets/DACHWERK-SAP-Readiness-Check-v17.pdf` – PDF-Leadmagnet
- `netlify.toml` – Sicherheitsheader und Weiterleitungen
- `sitemap.xml` und `robots.txt` – SEO-Grundlagen

## Vor Veröffentlichung zwingend

- Platzhalter in `impressum.html` und `datenschutz.html` ersetzen.
- Prüfen, ob „Geschäftsleitung“ beziehungsweise „Geschäftsführung“ eure tatsächliche organisatorische und rechtliche Rolle korrekt beschreibt.
- `DOMAIN-BEISPIEL.DE` in `sitemap.xml` durch die echte Domain ersetzen.
- Netlify Form Detection aktivieren und beide Formulare testen.
- E-Mail-Benachrichtigungen für `projektanfrage` und `readiness-check-page` konfigurieren.
- Illustrative KI-Profile durch reale, freigegebene Personen ersetzen, sobald die tatsächliche Projektbesetzung feststeht.


## Neu in v17
Security & Governance, Integrated Toolchain, Branchen-SEO, RFP Review, Quality Gates, Projekt-Templates und weitere Transformation-Landingpages.
