# Fatma Atalay Kötelek Hukuk & Danışmanlık — Webseite

Statische Website (HTML/CSS/JS) für die Kanzlei von Av. Fatma Atalay Kötelek
in Çorum, Türkei. Fertig für GitHub Pages.

## Dateien

- `index.html` – Hauptseite (Türkisch, SEO-optimiert für Çorum)
- `admin.html` – Inhaltsverwaltung (passwortgeschützt, nur clientseitig)
- `style.css` – gesamtes Design
- `script.js` – Logik für die Hauptseite (lädt `content.json`)
- `admin.js` – Logik für die Verwaltungsseite
- `content.json` – die 3 verwaltbaren Inhalte (Bild + Text + Titel + Datum)
- `robots.txt`, `sitemap.xml` – SEO-Grundausstattung

## Wie funktioniert die Inhaltsverwaltung?

Da die Seite komplett statisch ist (kein Server, kein Backend), gibt es
**kein automatisches "Speichern für alle Besucher"**. Der Workflow ist:

1. Öffne `admin.html` im Browser (lokal oder z. B. via
   `https://deinuser.github.io/repo/admin.html`).
2. Passwort eingeben (Standard: `corum2026`, änderbar ganz oben in `admin.js`,
   Konstante `ADMIN_PASSWORD`).
3. Für die 3 Blöcke: Titel, Text, Datum eingeben, Bild hochladen.
4. Auf **"Kaydet"** (Speichern) klicken → Vorschau funktioniert sofort,
   aber nur in diesem Browser/Gerät (localStorage).
5. Auf **"JSON Dışa Aktar"** (JSON exportieren) klicken → lädt eine neue
   `content.json` herunter.
6. Diese heruntergeladene `content.json` in dein GitHub-Repo hochladen und
   die alte Datei **überschreiben** (gleicher Dateiname, gleicher Ort wie
   `index.html`).
7. Nach dem Push aktualisiert GitHub Pages die Seite automatisch
   (meist innerhalb weniger Minuten) – jetzt sehen **alle Besucher** die
   neuen Inhalte, weil `index.html` beim Laden `content.json` einliest.

Wichtig: Bilder werden als Base64 direkt in `content.json` eingebettet.
Das ist praktisch für den Admin-Workflow ohne eigenen Server, macht aber
die JSON-Datei größer. Für sehr große/viele Bilder empfiehlt sich später
ein echtes Backend (z. B. Supabase Storage) – sag Bescheid, falls du das
willst.

## Bevor du live gehst

Bitte in `index.html` und im JSON-LD-Block noch anpassen/prüfen:

- Genaue Kanzleiadresse (aktuell Platzhalter „Adalet Sarayı Cad., Çorum
  Merkez“ – bitte durch die echte Adresse ersetzen)
- E-Mail-Adresse im Kontaktformular (`mailto:info@fatmaatalaykotelek.com`)
- Domain in den `<meta>`- und JSON-LD-Tags (`fatmaatalaykotelek.com`),
  falls eine andere Domain/GitHub-Pages-URL genutzt wird
- Echtes Kanzleifoto unter `assets/avukat-fotografi.jpg` hochladen
  (wird sonst automatisch ausgeblendet)

## SEO für Çorum

- Title/Description/Keywords sind auf "Çorum Ceza Avukatı" /
  "Çorum Ağır Ceza Avukatı" optimiert
- JSON-LD Schema.org `Attorney` mit `areaServed` für Çorum und alle
  12 Landkreise (Alaca, Sungurlu, Osmancık, İskilip, Kargı, Mecitözü,
  Bayat, Dodurga, Boğazkale, Uğurludağ, Oğuzlar, Laçin)
- Eigener Abschnitt „Hizmet Bölgesi" mit allen Bezirken für lokale
  Relevanz
- `sitemap.xml` und `robots.txt` vorhanden (Sitemap-URL ggf. an eure
  echte Domain anpassen)

## Hinweis zum türkischen Anwaltswerberecht

Im Footer steht ein kurzer Disclaimer, der auf die Werbebeschränkungen
der türkischen Rechtsanwaltskammer (Avukatlık Kanunu / TBB Reklam Yasağı
Yönetmeliği) hinweist. Bitte diesen Text nicht entfernen, ohne das mit
der Anwältin abzustimmen.
