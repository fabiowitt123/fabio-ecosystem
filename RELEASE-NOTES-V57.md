# v57 – Reliable Forms & Mobile Hardening

- SPRACHWERK booking and consultation forms send their complete content to `fabiowitt@gmx.de` via FormSubmit.
- Main Fabio contact form and DACHWERK project/RFP inquiry forms are Vercel-compatible and also route to `fabiowitt@gmx.de`.
- Dynamic success URLs use the currently deployed domain, so Vercel preview/production URLs both work.
- Added FormSubmit table formatting, subject lines, CAPTCHA-free flow and honeypot spam protection.
- Added site-wide mobile hardening for responsive media, forms, tables, dialogs, tap targets and iOS input zoom.
- Existing interactive forms (course finder, level test, login/register) remain client-side and are not converted to email forms.

## One-time activation
FormSubmit requires a one-time confirmation for the recipient address. After deployment, submit a real test form once and click the activation link sent to `fabiowitt@gmx.de`. All subsequent submissions are then delivered automatically.
