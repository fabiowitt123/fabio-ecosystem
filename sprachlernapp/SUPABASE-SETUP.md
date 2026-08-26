# Sprachwerk v19 – Supabase Cloud Accounts

Die App ist jetzt für echte Cloud-Accounts vorbereitet.

## 1. Supabase-Projekt erstellen
Erstelle ein neues Supabase-Projekt.

## 2. Datenbank einrichten
Öffne im Supabase Dashboard den **SQL Editor** und führe den gesamten Inhalt von:

`supabase-schema.sql`

einmal aus.

Dadurch entstehen:
- `profiles`
- `user_progress`
- Row Level Security Policies
- ein Trigger, der bei Registrierung automatisch Profil und Fortschritt anlegt

## 3. Browser-Konfiguration eintragen
Öffne:

`supabase-config.js`

und ersetze:

```js
url: "https://YOUR-PROJECT.supabase.co",
publishableKey: "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY"
```

durch die Werte aus deinem Supabase-Projekt.

**Wichtig:** Nur den öffentlichen Publishable/Anon Key verwenden. Niemals einen `service_role` Key in eine statische Website schreiben.

## 4. Auth konfigurieren
Unter Authentication kannst du E-Mail/Passwort aktivieren.

Wenn **Confirm email** aktiviert ist:
1. Nutzer registriert sich.
2. Supabase sendet eine Bestätigungs-E-Mail.
3. Nach Bestätigung kann der Nutzer sich einloggen.

Für eine echte Domain sollte außerdem die Site URL / Redirect URL in Supabase Auth auf deine Domain gesetzt werden.

## 5. Was in der Cloud gespeichert wird
Der komplette App-Fortschritt wird als JSONB im Datensatz des Nutzers gespeichert:
- aktive Sprache
- XP
- Level wird daraus berechnet
- Streak
- Herzen
- abgeschlossene Grammatiklektionen
- Vokabelfortschritt
- Tages-XP

Der lokale Browsercache bleibt als Offline-/Performance-Cache erhalten, aber nach Login ist Supabase die Cloud-Quelle.

## 6. Sicherheit
Row Level Security ist aktiviert. Die Policies verwenden `auth.uid()`, damit authentifizierte Nutzer nur ihren eigenen Profil- und Fortschrittsdatensatz lesen oder ändern können.

## 7. Netlify
Das Projekt bleibt statisch deploybar. Es ist kein eigener Server erforderlich. Der Browser kommuniziert direkt mit Supabase Auth und der durch RLS geschützten Datenbank.
