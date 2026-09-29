# v59 - Vercel Static Route Fix

- Fixed LERNWERK language cards opening 404 pages on Vercel.
- All language links now point explicitly to `language-xx.html`.
- Fixed extensionless links to course, pricing, legal and DACHWERK HTML pages when a matching static HTML file exists.
- Preserved directory routes such as `/sprachlernapp/`, `/sprachschule/` and `/dachwerk/`.
- Improves compatibility with static Vercel deployment without relying on clean URL rewrites.
