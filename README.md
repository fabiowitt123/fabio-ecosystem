# Fabio Witt SAP Consulting v4

Statische Website ohne Build-Schritt.

## Vor Veröffentlichung
- Platzhalter-E-Mail in `index.html` ersetzen.
- Impressum und Datenschutz anhand des tatsächlichen Unternehmensstatus vervollständigen.
- Falls die Tätigkeit parallel zu einer Anstellung erfolgt: arbeitsvertragliche / wettbewerbsrechtliche Zulässigkeit separat prüfen.
- Eigene Domain in Hosting und SEO-Konfiguration hinterlegen.

## Deployment
Ordnerinhalt direkt auf Netlify, Cloudflare Pages, GitHub Pages oder klassischen Webspace hochladen.


## v4 Best Practices
- DACH-Einsatzkarte mit Zürich als Basis
- SAP Best-Practice-Prinzipien: Fit-to-Standard, Clean Core, Process Ownership, Traceability, Quality Gates, Knowledge Transfer
- Engagement-Modelle & Deliverables
- Projektpraxis ohne erfundene Kundennamen
- FAQ und Netlify-Kontaktformular
- OpenGraph-Basis und schema.org Person Structured Data

## v4
- Kompetenzmatrix aus LinkedIn-Skills
- aktualisierte SAP-/Industry-Zertifizierungen
- neue DACH-Karte mit klarer Zürich-Markierung
- direkte Links zu LinkedIn Skills & Certifications

## v5
- Senior SAP S/4HANA Supply Chain Consultant Positionierung
- Detaillierte Projektübersicht
- Erweiterte relevante Zertifizierungen
- 7 Sprachen mit Flaggen
- Unique Experience / Differenzierung

## v2 - Unified Navigation
Alle Hauptbereiche verwenden denselben DACHWERK-Navbar:
- Fabio Witt
- SAP Blog
- DACHWERK
- Sprachschule
- Leistungen
- Team
- Projekt besprechen

Der Navbar ist responsive und auf Desktop/Mobile identisch.

## v44 - Mobile UX & Navigation Repair
- Global mobile hamburger controller across DACHWERK, SPRACHWERK, LERNWERK, Fabio Witt and Blog.
- Fixed legacy double-click-handler conflict that could open and immediately close the menu.
- Added overlay, body scroll lock, Escape-to-close, close-on-link, resize reset and improved ARIA states.
- Added mobile hardening for touch targets, forms, dialogs, tables, media and narrow screens.


## v45 – Cloudflare & Mobile Edition

- interne HTML-Links auf Cloudflare-kanonische URLs umgestellt (`/sprachlernapp/` statt `/sprachlernapp/index.html`)
- `wrangler.jsonc` für Static Assets, automatische Trailing-Slash-Logik und echte 404-Seite ergänzt
- gemeinsame Mobile Navigation weiter gehärtet
- iPhone Safe Areas, 48px Touch Targets, mobile Typografie und Reduced Motion verbessert
- temporäre Testdateien entfernt
