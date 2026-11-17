# v35 „Refactor“ – Plan und ToDo-Liste

**Status: NICHT gestartet.** Wird erst auf ausdrücklichen Befehl des Nutzers abgearbeitet (nach Merge von PR #8, beta → main). Die Major-Version 35 setzt der Nutzer selbst (siehe CLAUDE.md).

## Ziele

1. Leichter verständlicher Code.
2. Klar strukturierter Code.
3. Schnellerer Code (zweitrangig).

Dazu: möglichst einfach erweiterbar, für Menschen und KI. Modularisierung nur, soweit sie die Übersichtlichkeit nicht behindert. Kein Verhaltensverlust ohne Absprache mit dem Nutzer.

## Ist-Stand (Inventur, `OpenEBA.js` v34.8, 8607 Zeilen, Zeilenangaben grob)

Abhängigkeiten: jQuery 1 (`@require`, ca. 470 `$(`-Aufrufe), `GM_getValue/setValue/listValues/deleteValue`, `GM_xmlhttpRequest` (9 Stellen, nur WebDAV), `localStorage` nur für `eba_tickedit`, `eba_bildersuche`. Alles in einer Datei, globaler Scope, Funktionsdeklarationen (wegen Init-Reihenfolge, siehe Kommentar am Dateiende; `var`-Konstanten erst ab ihrer Zeile gesetzt).

| Bereich | Zeilen (ca.) | Umfang | Bemerkung |
|---|---|---|---|
| Kopf, Konstanten, `configItems` (Optionstabelle), Spieldaten-Tabellen (`antcat`, `antmax`, Kapazitäten) | 1–230 | 230 | Option → Funktion → Text in einer Tabelle |
| Shop/Inventar-Helfer (Inventar anzeigen, Preise hervorheben, Nachrichten) | 230–465 | 235 | |
| Zeit, Server, Tick (Zeitzone, Serverzeit, `srvKey`, Tickdauer) | 465–730 | 265 | Grundlage fast aller Bereiche |
| Futter-Snapshot (Futter je Formicarium) | 730–900 | 170 | |
| Formi-Statistik / Übersicht (Tick-Erfassung, Tabellen, CSV, Detail-Links) | 900–1200 | 300 | |
| Globale Historie (Geld/Punkte/Tickdauer, Kompaktierung) | 1195–1305 | 110 | |
| Lager (Parsen, Historie, Merge, Serienleser) | 1303–1520 | 215 | |
| Shoppreis-Historie, Lager-Abruf | 1518–1775 | 260 | |
| Draußen/Suche (Ergebnisse, Verlauf, Zusammenfassung) | 1776–2133 | 360 | |
| Schema-Migration (`migrate*`, Schema 4) | 2133–2310 | 175 | |
| Sammlung (Arten abhaken), Löschliste (`rowdel`) | 2310–2580 | 270 | |
| Merge-Funktionen, Export/Import (JSON) | 2580–2908 | 330 | Kern des Abgleichs |
| Serienleser für Auswertungen (`ebaGlobalSeries` …) | 2908–3122 | 215 | |
| Kleinfunktionen: Auto-Reload, Sound, Übersicht-Escape, Profil-Navigation/Hotkeys, Shopfilter/-sortierung, Notiz, Jobs, Lexikon-Futterdauer, Bookmarks, Tooltip `ebaTip` | 3122–4057 | 935 | viele kleine, unabhängige Seiten-Erweiterungen |
| Reset, Kolonie-Zusammenführen, **Config-Seite** (`enableConfig`) | 4057–4354 | 300 | Overlay, kein eigener Link |
| Schnee | 4354–4381 | 30 | |
| Max-Punkte, Wachstum, Max-Habitat | 4381–4912 | 530 | |
| **WebDAV-Abgleich** (Request, Validierung, Index, Löschliste, Auto-Lauf, Config-UI) | 4912–5978 | 1065 | größter Einzelblock mit Fachlogik |
| **Verlauf** (Diagramme, Seite `stats.php#eba-verlauf`, Abschnitte Lager/Zeilen) | 5978–6828 | 850 | Link `eba_verlauf_start` im Menü |
| **Spielhilfe** (Rahmen, CSS, Reiter: Ameisen, Vergleich, Wohnungen, Forschungsbaum, Ziele & Bonus, Jobs, ASW, Futter, Sammlung, Info; Bildersuche versteckt) | 6828–8131 | 1300 | `lexikon.php#eba-spielhilfe[:reiter]`, Spieldaten als JS-Konstanten |
| Profil (Abzeichen, Formicarien) | 8131–8362 | 230 | |
| Spielhilfe-Rahmen/Einhängen | 8362–8586 | 225 | |
| Start (Init-Schleife, MUSS letzte Anweisung sein) | 8586–8607 | 20 | |

### Speicher-Schlüssel-Familien (GM-Speicher)

- Serverpräfixe (`EBA_SRV_PREFIXES`, dahinter `srvKey()` = `""` oder `speed_`): `eba_hist_`, `eba_statistic_`, `eba_food_`, `eba_tickdur_`, `eba_schemaversion_`, `eba_points_`, `eba_hours_`, `eba_inventory_`, `eba_shop_prices_`, `eba_saved_state_`, `eba_shop_remember_price_`, `eba_formi_active_`, `eba_rowdel_`, `eba_collection_`, `eba_profile_`.
- Serverübergreifend: Optionen `eba_enable_*` (rund 50), `eba_disable_reload`, `eba_sort_filter_options`, `eba_shopfilter`, `eba_bookmarks`, `eba_note`, `eba_stock_items`, `eba_color`.
- WebDAV (Betriebszustand, nicht abgeglichen): `eba_dav_*` (url, user, pass, sync, idx, idxst, bad, stuck, backoff, busy, halt, ok_ms, inv …), `eba_index_*` (Serverdatei).
- localStorage: `eba_tickedit`, `eba_bildersuche`; Cache `eba_sh_imgcache`.

## 0 Voraussetzungen

- [ ] PR #8 (beta → main) ist gemergt.
- [ ] Nutzer gibt den Start von v35 ausdrücklich frei.
- [ ] Arbeitsregeln aus CLAUDE.md gelten: eigener `claude/...`-Branch, Übernahme nach `beta`, Version nur letzte Stelle (Major 35 setzt der Nutzer), `CHANGELOG.md` je Push, Kernsatz-Test vor Push.
- [ ] Höchstens EIN schreibender Agent an `OpenEBA.js` zugleich; parallel nur Lese-/Analyseaufgaben.
- [ ] Neuer Branch von aktuellem `main`/`beta` (Stand nach PR #8) anlegen.
- [ ] Ausgangsmessung (Abschnitt 6) und Ausgangs-Testlauf (`run_all.sh` und `--webdav`) festhalten.

## 1 Analyse und Architekturvorschlag

- [ ] Modulgrenzen vorschlagen (Kandidaten: Kern [Zeit/Server/Speicher], Datenserien [Merge/Export], WebDAV, Verlauf, Spielhilfe samt Spieldaten, Config-Seite, Kleinfunktionen/Seiten-Erweiterungen, Profil).
- [ ] Namenskonventionen festlegen (Präfixe je Modul, z. B. `eba<Modul><Aktion>`; bisherige Mischformen `davX`, `ebaShX`, `ebaHistX`, `enableX` vereinheitlichen).
- [ ] Gemeinsame Helfer sammeln (Zahlenformat, Escape, Zeit, Tooltip `ebaTip`, Speicherzugriff, Seitenprüfung) und Doppelungen finden.
- [ ] Seiten-Router entwerfen: eine Stelle, die je Seite (Pfad, Query, Hash) die passenden Erweiterungen startet, statt je Funktion eigene `location.pathname`-Prüfung.
- [ ] Optionstabelle (`configItems`) als zentrales Register beibehalten/ausbauen: je Funktion Seite, Option, Gruppe, Text.
- [ ] Init-Reihenfolge klären (Funktionsdeklarationen statt `var`; Start als letzte Anweisung) und im Leitfaden festhalten.
- [ ] Spieldaten (Konstanten der Spielhilfe, `antcat`/`antmax`) von Logik trennen, Datenvorrang beachten (echte Spieldaten > Excel > Annahmen; Unbekanntes als „unbekannt“).
- [ ] Entscheidungsvorlage für den Nutzer erstellen: **eine Datei (build-frei)** vs. **mehrere Quelldateien mit Build-Schritt zu einem Userskript** (Tampermonkey braucht eine Datei bzw. `@require`/`@resource`).
  - Build-frei: einfaches Update/Installieren, keine Werkzeugkette; Datei bleibt groß, Struktur nur über Abschnitte und Konventionen.
  - Build-Schritt: Dateien je Modul, bessere Navigierbarkeit für Mensch und KI; dafür Werkzeug, Build-Artefakt im Repo nötig, Debugging über Zeilenzuordnung erschwert, Beta/Main-Ablauf wird komplexer.
  - Zwischenlösung: eine Datei mit festen Modulabschnitten, Inhaltsverzeichnis am Anfang und Modul-Objekten (Namespace) je Bereich.
- [ ] Ergebnis: Architekturdokument (Entwurf) zur Freigabe durch den Nutzer.

## 2 Datenmodell

- [ ] Bestandsaufnahme: alle Schlüssel, Formate (TSV-Reihen, Kopfzeilen, Schemaversion 4), Besitzer (welche Funktion schreibt/liest), Größen.
- [ ] Probleme sammeln (z. B. Mischung aus Optionen/Daten/Betriebszustand im selben Speicher, Präfix-Liste `EBA_SRV_PREFIXES` händisch gepflegt, `eba_dav_*`-Zustand neben Nutzerdaten, uneinheitliche Zeitreihenformate, Migrationen im Hauptpfad).
- [ ] Optionen bewerten, jeweils mit Vor-/Nachteilen: (a) Format beibehalten, nur dokumentieren und kapseln (Speicher-Zugriffsschicht); (b) Schlüssel umbenennen/neu gruppieren; (c) **Breaking Change** mit neuem Gesamtformat.
- [ ] Auswirkungen je Option auf: GM-Speicher/localStorage, Serverpräfixe, Export/Import (JSON), WebDAV-Abgleich (Dateinamen `<key>.tsv`, Index `eba_index_<srv>`, Löschliste `rowdel`), ältere Skriptversionen auf anderen Geräten (parallel laufende Versionen!).
- [ ] Migrationsstrategie für bestehende Nutzerdaten entwerfen (formatunabhängiger Vorplan, Anforderungen an das neue Format und offene Entscheidungen: siehe `V35_MIGRATION.md`, Abschnitte 3 und 10) (einmalig, umkehrbar oder mit Sicherung vor Migration; Schema-Version 5; Verhalten bei WebDAV-Konflikt zwischen alten und neuen Geräten).
- [ ] **Diskussion mit dem Nutzer; kein Breaking Change ohne ausdrückliche Freigabe.**
- [ ] Ergebnis: beschlossenes Datenmodell mit Migrationsplan und Testfällen (alte Daten → neu, Export/Import-Rundlauf, WebDAV-Rundlauf).

## 3 Design- und Funktions-Reviews je Bereich

Je Bereich ein eigener (Lese-/Analyse-)Agent. Auftrag: Ist-Zustand beschreiben, Design und Bedienbarkeit überdenken, Vorschläge machen, **Rückfragen an den Nutzer sammeln und mit ihm besprechen**. Ergebnis je Bereich: **beibehalten** oder **anpassen** (Vieles ist gut, wie es ist; nur ändern, wenn es klar besser wird). Umsetzung erst nach Freigabe, jeweils einzeln.

| # | Bereich | Ergebnis | Rückfragen/Notizen |
|---|---|---|---|
| 1 | Config-Seite (Optionen, Gruppen, Kolonie-Zusammenführen, Reset) | - [ ] beibehalten / - [ ] anpassen | siehe Abschnitt 4 |
| 2 | Verlauf (Diagramme, Abschnitte Lager/Zeilen, Hover-Popups) | - [ ] beibehalten / - [ ] anpassen | siehe Abschnitt 4 |
| 3 | Spielhilfe: Rahmen, Reiterleiste, Banner, Suche/Sortierung | - [ ] beibehalten / - [ ] anpassen | |
| 4 | Spielhilfe: Ameisen (Karten, Stufenbilder) | - [ ] beibehalten / - [ ] anpassen | |
| 5 | Spielhilfe: Vergleich (Shopameisen, Verkaufsrechnung) | - [ ] beibehalten / - [ ] anpassen | |
| 6 | Spielhilfe: Wohnungen und Forschungsbaum | - [ ] beibehalten / - [ ] anpassen | |
| 7 | Spielhilfe: Ziele & Bonus, Jobs, ASW | - [ ] beibehalten / - [ ] anpassen | |
| 8 | Spielhilfe: Futter, Sammlung, Info | - [ ] beibehalten / - [ ] anpassen | |
| 9 | Bildersuche (derzeit versteckt) | - [ ] behalten / - [ ] entfernen | Entscheidung offen (IDEEN.md) |
| 10 | Übersicht/Kolonien (Formi-Statistik, Tick-Erfassung, Detail-Links, Kolonie-Merge) | - [ ] beibehalten / - [ ] anpassen | |
| 11 | Max-Punkte, Wachstum, Max-Habitat, Futter-Snapshot | - [ ] beibehalten / - [ ] anpassen | |
| 12 | Shop/Ankauf (Preise merken/hervorheben, Filter, Sortierung, Preis-Historie) | - [ ] beibehalten / - [ ] anpassen | |
| 13 | Lager (Inventar, Historie, Sortierung/Filter) | - [ ] beibehalten / - [ ] anpassen | |
| 14 | Lexikon-Erweiterungen (Futterdauer, Spielhilfe-Einstieg) | - [ ] beibehalten / - [ ] anpassen | |
| 15 | Draußen/Suche (Ergebnis-Historie, Zusammenfassung, Arten) | - [ ] beibehalten / - [ ] anpassen | |
| 16 | Internet/Jobs (Jobangebote, laufende Aktion, Endzeit) | - [ ] beibehalten / - [ ] anpassen | Idee „Pizza/ASW im Menü“ |
| 17 | Profil (Abzeichen, Formicarien, Blättern Links/Q/E) | - [ ] beibehalten / - [ ] anpassen | Blättern vom Nutzer noch zu bestätigen |
| 18 | Notizen und Bookmarks | - [ ] beibehalten / - [ ] anpassen | |
| 19 | WebDAV-Sync (Einstellungen, Status, Meldungen, Bedienung) | - [ ] beibehalten / - [ ] anpassen | Logik siehe Abschnitt 2 |
| 20 | Export/Import (JSON) und Speicher-Info | - [ ] beibehalten / - [ ] anpassen | |
| 21 | Statistik-/Status-Kosmetik (Statistik verschönern, Punkte-Differenz, Tooltips `ebaTip`) | - [ ] beibehalten / - [ ] anpassen | |
| 22 | Komfort (Auto-Reload aus, Sound, Übersicht-Escape, Tastaturnavigation, Formularpositionen, Nachrichtenfilter) | - [ ] beibehalten / - [ ] anpassen | |
| 23 | Schnee und Saison-Effekte (Winter-Skin) | - [ ] beibehalten / - [ ] anpassen | Dezember beobachten (IDEEN.md) |

Anzahl Review-Bereiche: **23**. Je Review (Checkliste für den Agenten):
- [ ] Ist-Zustand (Funktion, Seite, Optionen, Daten) in 5–10 Zeilen.
- [ ] Bedienbarkeit/Design: Probleme, Verbesserungsvorschläge, Aufwand.
- [ ] Offene Fragen an den Nutzer; Antwort einholen; Ergebnis „beibehalten/anpassen“ eintragen.
- [ ] Spielhilfe-Regeln beachten: keine Spieltexte in Karten, keine Quellenhinweise in Tooltips, Tooltips im openEBA-Stil (`ebaTip`).

## 4 Config-Seite und Verlauf als eigene, verlinkbare Seiten

- [ ] Entwurf: Config-Seite wie die Spielhilfe als konkreter Link aufrufbar (eigene URL bzw. Anker, z. B. `…#eba-config[:gruppe]`, analog zu `lexikon.php#eba-spielhilfe[:reiter]`); Wahl der Trägerseite (welche Spielseite, Fallbacks bei fehlendem Menü).
- [ ] Menülink wie bei der Spielhilfe, am Ende jeder Seite verlinkbar (Option wie `eba_enable_spielhilfe_everywhere`), statt nur Overlay über `#eba_config_start`.
- [ ] Gruppierung und Bedienung der Optionen (rund 50) überdenken (Review 1); `configItems` als Quelle.
- [ ] Dasselbe für den Verlauf: bereits `stats.php#eba-verlauf[-id]` vorhanden; Link am Seitenende, Unter-Anker je Abschnitt, Konsistenz mit Config-Seite und Spielhilfe prüfen.
- [ ] Gemeinsamen Mechanismus für „eigene Seite per Anker“ (Container, Menüeintrag, Hash-Routing, Fallbacks) einmal bauen und für Spielhilfe, Config, Verlauf nutzen (Verbindung zu Abschnitt 1, Seiten-Router).
- [ ] Alte Aufrufwege (Overlay, bestehende Links/Lesezeichen `#eba-verlauf`, `#eba-spielhilfe`) weiter unterstützen.

## 5 Umsetzung in kleinen Schritten

Reihenfolge (jeder Schritt: eigener Commit, Version +1 letzte Stelle, `CHANGELOG.md`, Kernsatz-Test vor Push nach `beta`; verhaltensneutral, sofern nicht ausdrücklich geändert):

- [ ] 5.1 Testsatz in `/home/user/eba-work/tests` an die geplante Struktur anpassen/erweitern (Ausgangsverhalten sichern, Golden-Master für Export/Import, Merge, Tickerfassung, Config); Pfad außerhalb des Repos, siehe `UEBERGABE.md` dort.
- [ ] 5.2 Inhaltsverzeichnis und einheitliche Abschnittsköpfe am Dateianfang (sofern Entscheidung aus Abschnitt 1 es zulässt).
- [ ] 5.3 Zugriffsschicht für Speicher (Lesen/Schreiben/Schlüsselbildung), zunächst ohne Formatänderung.
- [ ] 5.4 Gemeinsame Helfer zusammenführen, Doppelungen entfernen, Namen vereinheitlichen.
- [ ] 5.5 Seiten-Router einführen; Kleinfunktionen darauf umstellen (je Funktion ein kleiner Commit).
- [ ] 5.6 Modul für Zeit/Server/Tick herauslösen (Grundlage).
- [ ] 5.7 Datenserien, Merge, Export/Import ordnen; ggf. Datenmodell (Abschnitt 2) umsetzen inkl. Migration (`--webdav`-Tests).
  - Migrationswerkzeug (Stufenkette F1→F2→F3, Backup/Vorschau, WebDAV-Neuablage mit Übergangsmodus): Arbeitspakete und Tests siehe `V35_MIGRATION.md`, Abschnitte 8 und 9.
- [ ] 5.8 WebDAV-Block gliedern (Request, Validierung, Index, Löschliste, Lauf, UI); `--webdav`-Tests.
- [ ] 5.9 Verlauf-Modul gliedern; Config-/Verlaufsseite nach Abschnitt 4.
- [ ] 5.10 Spielhilfe: Daten (Konstanten) von Reitern trennen, Reiter als gleichförmige Module.
- [ ] 5.11 Ergebnisse der Reviews (Abschnitt 3) bereichsweise umsetzen, nur freigegebene Änderungen.
- [ ] 5.12 Performance-Maßnahmen (nur nach Messung, zweitrangig): Startzeit, Speicherzugriffe bündeln/cachen, nur benötigte Seitenfunktionen ausführen, DOM-Zugriffe.
- [ ] Je Schritt: keine Hintergrundabrufe an den Spielserver ohne Rücksprache; Excel/CSV/Bilder nie ins Repo; WebDAV-Tests nur bei Änderungen an Abgleich, Index, Löschliste, Dateinamen oder Serverpräfixen; keine Warteschleifen, Zeitlimit je Test.

## 6 Abschluss

- [ ] Doku: `README.md` (Funktionen, Config-/Verlaufslink), `CHANGELOG.md`, `IDEEN.md` (Stand aktualisieren).
- [ ] Entwickler-Leitfaden für Erweiterungen durch Mensch und KI (neue Funktion/Option/Reiter/Schlüssel hinzufügen, Init-Reihenfolge, Namenskonventionen, Datenmodell, Testablauf).
- [ ] Performance-Messung vorher/nachher (Startzeit der Init-Schleife je Seite, Speicherzugriffe, Skriptgröße) und Ergebnis dokumentieren.
- [ ] Gesamt-Testlauf (Kernsatz und `--webdav`), manuelle Prüfung durch den Nutzer auf `beta`.
- [ ] Der Nutzer setzt die Major-Version 35 und gibt selbst nach `main` frei.

## Offene Entscheidungen für den Nutzer

- [ ] Start von v35 (nach Merge von PR #8).
- [ ] Architektur: eine Datei build-frei, Datei mit festen Modulabschnitten/Namespaces oder Mehrdatei-Quellen mit Build-Schritt.
- [ ] Datenmodell: beibehalten und kapseln, umbenennen/gruppieren oder Breaking Change; Umgang mit Geräten auf älterem Skriptstand.
- [ ] Migration bestehender Nutzerdaten (Sicherung, Umkehrbarkeit, WebDAV-Verhalten).
- [ ] Config-Seite: Trägerseite, URL/Anker, Menü-/Seitenende-Link, Ablösung des Overlays.
- [ ] Verlauf: Ankerstruktur und Seitenende-Link.
- [ ] Je Review-Bereich (23): beibehalten oder anpassen.
- [ ] Bildersuche: entfernen oder behalten.
- [ ] Profil-Blättern (Links und Q/E): beibehalten bestätigen.
- [ ] Reihenfolge und Umfang der Umsetzung (alles in v35 oder gestaffelt über v35.x).

## Nicht verlieren

Die offenen Ideen nach v34 stehen in `IDEEN.md` (Abschnitt „Offen nach v34“, dazu „Saison-Effekte“). Sie sind bei den Reviews (Abschnitt 3) und der Priorisierung zu berücksichtigen: Auswachsprognose, Verkaufserlös im Lager, Job-Anzeige Pizza/ASW, Fundorte aus eigenen Funden, Polygynie-Zuwachs Speedserver, fehlende Forschungsbilder, Bildersuche entfernen?, Profil-Blättern, Winter-Skin/Saison-Effekte, unbekannte Spieldaten.
