# v35 – Migrationswerkzeug (Altdaten → neues Format)

**Status: Plan, nicht gestartet.** Gehört zu `V35_PLAN.md` (Phase 2 Datenmodell, Phase 5.7 Umsetzung). Das neue v35-Datenformat („F3“) ist **noch nicht entschieden**; dieser Plan ist deshalb formatunabhängig (Stufenkette, Adapter). Was am Formatentscheid hängt, ist mit **[F3]** markiert.

Keine Hintergrundabrufe an den Spielserver; die Migration arbeitet nur mit lokalem Speicher, Dateien und (optional) WebDAV. Nichts davon (Exporte, Fixtures) kommt ins Repo.

## 1 Bestandsaufnahme (belegt per Git/CHANGELOG, Stand origin/beta 34.8)

### 1.1 Entwicklung der Datenformate

| Version (Commit, Datum) | Änderung |
|---|---|
| 31 (`2cd2192`, 25.10.2026, Fork von Peppers Skript) | Ausgangsstand. Schlüssel `eba_food_<srv><id>`, `eba_statistic_<srv><id>`, `eba_tickdur_<srv>ms/tick` (Präfix `speed_` bei Hostname mit „speed“, sonst leer); **global** (nicht je Server): `eba_points1/2`, `eba_hours1/2`, `eba_inv`, `eba_inventory`, `eba_shop_prices`, `eba_enable_shop_remember_prices_*`. Kein Versionsschlüssel, kein Export, kein WebDAV. |
| 31.1 (`1a0c280`, 25.10.) | Export/Import (`format:"openEBA-history"`, `schema`, `exported`, `server`), neue Zeitreihen `eba_hist_<srv><name>` (Kopfzeile `2⇥name⇥einheit⇥tick`), Versionsschlüssel `eba_schema_version` (global), Schema **2**, WebDAV-Abgleich (je Reihe eine Datei `<Schlüssel>.tsv`). |
| 31.1 (`789fa55`, `b7e3ada`, `9a7ce22`; CHANGELOG 31.8) | Server sauber getrennt: `eba_schemaversion_<srv>`, `eba_points_<srv>1/2`, `eba_hours_<srv>1/2`, `eba_inventory_<srv>`, `eba_shop_prices_<srv>`, `eba_saved_state_<srv>…`, `eba_shop_remember_price_<srv>…`. Altwerte gehen an den Normalserver (`migrateServerKeys()`). Export-Feld `onlyServer` (`ed5ee2e`). |
| 31.3 / 31.7 (`f33e8d7`) | **Schema 3**: Formi-/Futter-Historie höchstens eine Zeile je Tick, Futter-Feld 3 = Ausbruchschutz; `EBA_HIST_FORMAT = 2` getrennt von der Schema-Nummer. |
| 31.8 (`5b65704`) | **Schema 4**: Futtertiersuchen aus `antsearch` nach `foodsearch`. Host-Erkennung verankert (`speed.`). Bis hierhin **Export-Schema 2…4**. |
| 32.2/32.3 (`f6c61fe`, `33d5a71`) | WebDAV Zwei-Wege: Index-Datei `eba_index_<normal\|speed>.tsv` (Kopf `eba_index⇥1`, Zeilen `schlüssel⇥ms⇥a\|f`), Löschmarker „vergessen“, Server-Inventar per PROPFIND. |
| 33.4/33.5/33.8 (`8fb12d2`, `2fd6238`) | Zeitbasis: Serverzeit statt PC-Uhr/Zeitzone. Gespeicherte Daten aus Deutschland bleiben gültig; Format unverändert. |
| 33.14 (`c932b8a`) | `eba_rowdel_<srv>list` (Zeilen-Löschliste, Kopf `eba_rowdel⇥1`, WebDAV-Datei `eba_rowdel_<srv>list.tsv`); nur noch `eatenbyants.de`, `www.`, `speed.`. |
| 33.23 ff. | `eba_collection_<srv>ants` (Kopf `eba_collection⇥1`), `eba_profile_<srv>…`, `eba_hist_<srv>stock_*`/`shopprice` (33.38). |
| 33.31/33.32 (`c1d318e`) | Vier Server (`test_`, `testspeed_`); **34.7** (`8fd0daf`) wieder entfernt: unbekannte Präfixe werden ignoriert (`keyServer()` → `"alt_"`), nicht migriert/gelöscht/abgeglichen. |

Seitdem unverändert: Export `schema` 4, `EBA_HIST_FORMAT` 2, WebDAV-Dateinamen, Index-Format `1`.

### 1.2 Aktueller Stand (34.8)

- **GM-Speicher** (`GM_getValue/setValue/listValues`), Server steckt **im Schlüssel** hinter dem Bereichspräfix (`EBA_SRV_PREFIXES`, 15 Familien, dahinter `""` oder `speed_`). `keyServer()` liefert `""`, `speed_`, `alt_` (ignoriert) oder `null` (serverübergreifend: `eba_enable_*`, `eba_disable_reload`, Filter, `eba_bookmarks`, `eba_note`, `eba_stock_items`, `eba_color`).
- Zeitreihen: `isHistoryKey()` = `eba_hist_*`, `eba_statistic_*`, `eba_food_*`, `eba_rowdel_*`; dazu Sammlung (`ebaIsCollKey`). Kopfzeilen: hist `2⇥name…`, statistic erste Zeile = Basisstunde (Zahl), food **ohne** Kopfzeile, collection/rowdel `…⇥1`.
- Gerätezustand (nie exportiert/abgeglichen): `eba_dav_*`, `eba_formi_active_*`, Caches (`eba_sh_imgcache`); `localStorage`: `eba_tickedit`, `eba_bildersuche`.
- **Export**: `{format:"openEBA-history", schema:4, exported, server, onlyServer, values:{Schlüssel→Wert}}`. Import: Zeitreihen werden schlüsseltreu **verschmolzen** (kanonische Merge-Funktionen), alles andere ersetzt; Versionsschlüssel werden nicht übernommen, `schemaKey()` wird auf `min(lokal, Export-schema)` gesetzt und `migrateHistorySchema()` läuft (so werden alte Exporte schon heute hochmigriert).
- **WebDAV**: ein flacher Ordner; je Reihe `<Schlüssel>.tsv` (Inhalt = roher TSV-Text), je Server `eba_index_<normal|speed>.tsv`, Löschliste als eigene Reihe. Schutz: Lokal gilt als Wahrheit, nur `GM_setValue(k, merge(lokal, remote))`, ETag/`If-Match`; `davValidate()` lehnt ab: HTML, fremde Kopfzeile, **hist-Schema > 2**, Sammlung/Löschliste mit anderer Kopfzeile, unplausible Zeitstempel. `PROPFIND`-Liste und Index nehmen nur Namen an, die `davKeyValid()` bestehen (`isHistoryKey`/Sammlung, eigener Server, `[a-z0-9_]+`, `.tsv`): **andere Dateien und Unterordner ignorieren ältere Skripte**. Reihen-Dateien werden nie gelöscht (Löschmarker im Index).
- **Lücke im Schutz:** `eba_statistic_*` und `eba_food_*` haben keine Formatkennung; ein älteres Gerät verschmilzt dort jeden Inhalt. Neue Inhalte unter den **alten Dateinamen** sind also nicht sicher gegen alte Geräte.

### 1.3 Echte Beispieldaten (nur Struktur, `/home/user/eba-work/export/`)

- `export1111/export.json` (268 KB, Schema 4, beide Server, 143 Schlüssel): je Server `eba_statistic_*`/`eba_food_*` (normal 16, speed 6 Kolonien), `eba_inventory_*`, `eba_shop_prices_*`, `eba_saved_state_*`, `eba_tickdur_*`, `eba_points_*`/`eba_hours_*`, `eba_schemaversion_` und `eba_schemaversion_speed_`, rund 40 `eba_enable_*`, Notiz, Bookmarks, Cache `eba_sh_imgcache`; einzelne Streuschlüssel (`eba_points_t`, `eba_inventory_lock/scan`).
- `pc.json` (78 KB, 86 Schlüssel), `handy.json` (18 KB, 82), `openEBA_merged.json` (87 KB, 94): nur Normalserver, Schema 4, gleiche Familien; `merged` ist die Vereinigung aus pc und handy.
- `sb_dl.csv` (6 KB): CSV-Download einer Formicarien-Statistik (Semikolon, BOM), kein Speicherformat.
- **Keine** Beispiele mit `eba_hist_*`, `eba_rowdel_*`, `eba_collection_*`, `eba_profile_*`, `test_`-Präfixen, F1-Altdaten oder WebDAV-Ordner. Diese Fixtures müssen synthetisch gebaut oder vom Nutzer als Export geliefert werden (siehe Abschnitt 8).

## 2 Quellformate und Erkennung

| Format | Gilt für | Merkmale |
|---|---|---|
| **F1** | Skript ≤ 31 (Pepper-Stand, Fork-Basis) | Kein `eba_schemaversion_*`/`eba_schema_version`; globale `eba_points1/2`, `eba_hours1/2`, `eba_inv`, `eba_shop_prices`, `eba_enable_shop_remember_prices_*`; nur `eba_statistic_*`/`eba_food_*` (Mehrfachzeilen je Tick, Abrufzeit in Futterzeile). **Kein Export, kein WebDAV** – existiert nur im GM-Speicher. |
| **F2** | 31.1 … 35.0 | Versionsschlüssel je Server (`eba_schemaversion_<srv>` = 2…4, Altform `eba_schema_version` ≤ 1), `eba_hist_*`, Export `format:"openEBA-history"` mit `schema` 2…4, WebDAV flach (`.tsv` + Index). Untervarianten ohne Konvertierungsbedarf: Zeitbasis vor 33.5, Zusatzfamilien je nach Version, `test_`/`testspeed_` (33.31–34.6, ignorieren). |
| **F3** | ab 35.x | **[F3]** Formatmarker noch festzulegen. |

Erkennung (Reihenfolge, **je Server getrennt**, da die Migration heute je Server läuft):

- [ ] **Speicher (GM):** Formatmarker von F3 vorhanden → F3. Sonst `eba_schemaversion_<srv>` ≥ 2 → F2 (Teilstufe = Wert, weiter mit vorhandenem `migrateHistorySchema()`). Sonst Altmarker (`eba_schema_version`, `eba_points1`, `eba_inv`, `eba_shop_prices`, `eba_enable_shop_remember_prices_*`) oder `eba_statistic_*`/`eba_food_*` ohne Versionsschlüssel → F1. Sonst leer → nichts zu tun.
- [ ] **Exportdatei:** `format === "openEBA-history"` und `schema` (2…4 → F2) bzw. **[F3]**-Kennung; fehlt `schema`: nach Schlüsselmustern wie beim Speicher entscheiden; unbekanntes `format` → Fehlermeldung, nichts schreiben. Feld `server` (`""`/`speed_`) und `onlyServer` für Dialog „falscher Server“ weiter beachten.
- [ ] **WebDAV:** F3-Marker auf dem Server vorhanden → F3-Ablage; sonst `eba_index_*.tsv`/`eba_hist_*.tsv`/`eba_statistic_*.tsv` vorhanden → F2-Ablage; leer → neu.
- [ ] Unbekannte oder alte Präfixe (`test_`, `testspeed_`, künftig Unbekanntes) **still ignorieren**: nicht migrieren, nicht löschen, nicht abgleichen; nur im Protokoll zählen. Kein Rateversuch (Whitelist je Schlüsselfamilie, Rest = „unbekannt“).

## 3 Anforderungen an das Zielformat F3 (Input für Phase 2)

> Orientierung: Datenkonzept des Nutzers (Monatsdateien je Kolonie, Ereignisse, Geräte-ID in der Kennung) und seine Prüfung in `V35_DATENKONZEPT.md`; noch keine Formatentscheidung.

Damit Migration, Rückweg und Mehrgeräte-Betrieb einfach werden:

- [ ] **Formatversion im Speicher** (ein Schlüssel, atomar zuletzt gesetzt) plus Migrationsprotokoll (von→nach, Zeit, Skriptversion, Zähler).
- [ ] **Server explizit und eindeutig** statt aus Präfix geraten (Registerliste bekannter Server; keine Mehrdeutigkeit wie `eba_food_17` vs. `eba_food_speed_17`). Unbekannte Server bleiben unangetastet.
- [ ] Datenarten **getrennt**: Nutzerdaten (Zeitreihen) / Optionen / Gerätezustand (WebDAV-Zugang, Sperren, Caches) / Geheimnisse – damit Export, Abgleich und Migration ohne Ausnahmelisten auskommen.
- [ ] Jede Zeitreihe **selbstbeschreibend** (Name, Server, Formatversion, Einheit, Tick, Zeitbasis = Epoch der Serverzeit) und mit **Kopfzeile auch für Statistik/Futter** (schließt die Lücke aus 1.2).
- [ ] **Zeitstempel je Zeile** (bereits Tick-Zeit) und **Änderungszeit je Reihe**; Löschmarker (Zeilen, Reihen) mit Zeitstempel im selben Merge-Modell, kommutativ/kanonisch wie heute.
- [ ] **Geräte-ID** (einmal erzeugt, nie exportiert) – für Herkunft/Protokoll, nicht für Merge-Entscheidungen.
- [ ] Vorwärtskompatibel: unbekannte Felder erhalten, neuere Formatversion wird erkannt und abgelehnt statt falsch verschmolzen.
- [ ] Export-Container mit eigener Kennung und Formatversion; alte Kennung `openEBA-history`/Schema 2…4 bleibt lesbar (Abschnitt 6).
- [ ] Reihenregister (statt Präfixliste) als Quelle für Export, Abgleich, Speicherinfo und Migration.
- [ ] WebDAV-Ablage so benennen, dass **ältere Geräte sie ignorieren** (Abschnitt 5).

## 4 Architektur des Werkzeugs

**Empfehlung: im Skript integriert, als Stufenkette auf einem Speicherabbild.**

- [ ] Eine Funktionsfamilie `ebaMigrate…`: Eingabe ein **Abbild** (`{Schlüssel: Wert}` im Speicher des Skripts, kein direkter GM-Zugriff), Ausgabe Abbild plus Protokoll. Reine Funktionen, deshalb in Node/Playwright mit Fixtures testbar.
- [ ] Stufen: `F1→F2` (bestehender Code `migrateServerKeys()`/`migrateHistorySchema()` unverändert als Stufe 1 übernehmen, nicht neu schreiben), `F2→F3` **[F3]**. Kein direkter F1→F3-Pfad; künftige Formate hängen eine Stufe an (`EBA_MIGRATIONS = [{von,nach,lauf}, …]`).
- [ ] Dieselbe Maschine an **drei Stellen**: (a) erster Start von v35: Speicher → Abbild → Kette → zurückschreiben; (b) Import einer Exportdatei jeden Alters (Datei → Abbild → Kette → mergen); (c) WebDAV-Altablage lesen (Abschnitt 5). Manuell erneut auslösbar in der Config („Datenformat prüfen / Migration erneut ausführen“, mit Vorschau).
- [ ] Ablauf beim Start: erkennen → falls nötig Hinweis + automatische Sicherung → Trockenlauf-Zählung → migrieren → Prüfsummen vergleichen → Formatmarker setzen. Läuft vor allen anderen Funktionen (Init-Reihenfolge, `V35_PLAN.md` Abschnitt 1).

Begründung und Alternativen:

| Variante | Bewertung |
|---|---|
| **Integriert (empfohlen)** | Einzige Möglichkeit für F1 (kein Export, Daten nur im GM-Speicher), kennt vorhandene Merge-/Validierungsfunktionen, Nutzer muss nichts installieren, automatisch bei jedem Gerät. Nachteil: Skript wird größer; Stufen nach einigen Versionen als „alt“ entfernbar (Stufe bleibt per Import weiter nutzbar). |
| Separates Werkzeug (HTML/Node: Exportdatei rein, Datei raus) | Entfällt für F1; doppelt gepflegte Merge-/Format-Logik; Nutzer müsste auf jedem Gerät exportieren/importieren. Nur als Entwicklerhilfe sinnvoll (Test-Läufer nutzt dieselben Funktionen). |
| Konsolen-Snippet | Fehleranfällig, nicht prüfbar, kein Rückweg; nur Notnagel, nicht geplant. |

Parallel zur Phase 2 entwickelbar (formatunabhängig): Fixtures, Erkennung, Abbild-Schicht, Kette/Protokoll, Sicherung, Vorschau, Prüfsummen, Tests, WebDAV-Lesen der Altablage. Erst nach Formatentscheid: Stufe `F2→F3`, Schlüssel-/Dateinamen **[F3]**, Export-Schema 5.

## 5 Sicherheit

- [ ] **Automatisches Backup vor jeder Migration:** vollständiger Export (alle Server) als Datei-Download und – als Rückweg – **Altschlüssel bleiben unverändert erhalten**, die neuen Daten werden **neben** den alten angelegt.
- [ ] **Trockenlauf/Vorschau:** je Server und Familie Schlüssel-/Zeilenzahl vor und nach, ignorierte Schlüssel, Warnungen (unlesbare Kopfzeile bleibt unangetastet, wie heute).
- [ ] **Idempotent:** mehrfaches Ausführen ergibt dasselbe (Merge ist kanonisch; Formatmarker verhindert Wiederholung, manueller Neulauf erlaubt).
- [ ] **Abbruch ohne Teilzustand:** erst alles im Abbild rechnen und prüfen, dann schreiben; Formatmarker als **letzter** Schreibvorgang. Bricht es davor ab (Tab zu), bleibt der Altzustand gültig, der nächste Start wiederholt.
- [ ] **Rückweg:** Altdaten werden erst nach ausdrücklicher Bestätigung des Nutzers („Migration bestätigen, Altdaten löschen“, frühestens nach Prüfzeitraum) gelöscht. Hinweis: Ein älteres Skript auf demselben Browser liest die Altschlüssel weiter, schreibt aber an v35 vorbei.
- [ ] **Protokoll:** Zeitpunkt, Skriptversion, Quellformat, Zähler je Familie/Server, Warnungen; in der Config einsehbar und exportierbar (ohne Zugangsdaten).
- [ ] Zugangsdaten und Gerätezustand (`eba_dav_*`) nie in Backup/Export/Server; nach der Migration Zugang weiter nutzbar oder neu abfragbar **[F3]**.
- [ ] Größenprüfung vor dem Schreiben (doppelter Speicher während des Prüfzeitraums; Daten liegen heute bei einigen hundert KB).

## 6 Export/Import

- [ ] Alle bekannten Exporte bleiben importierbar: `format:"openEBA-history"`, Schema 2, 3, 4 (und Exporte ohne `schema` nach Schlüsselmuster). Import = Datei → Abbild → Stufenkette bis F3 → Verschmelzen mit lokalen Daten (wie heute: Zeitreihen mergen, Optionen ersetzen).
- [ ] Bestehende Schutzmechanismen bleiben: Server-Dialog („Export vom anderen Server“), `onlyServer`, Versionsschlüssel werden nicht aus dem Export übernommen, Zugangsdaten nie.
- [ ] Neues Export-Schema **[F3]** (Kennung/Version); v35 schreibt nur das neue Format. Ein v34-Skript kann es nicht lesen (`Unbekanntes Format`) – bewusst, Hinweistext im Export.
- [ ] Exportdatei mit F3-Kennung auf einem Skript mit älterem F3-Stand: ablehnen mit „bitte openEBA aktualisieren“.

## 7 WebDAV

Ausgangslage: Geräte mit v34 und v35 sind zeitweise gleichzeitig aktiv; ein älteres Gerät darf migrierte Daten weder überschreiben noch löschen, und die Nutzer sollen nicht alle Geräte am selben Tag umstellen müssen.

**Empfehlung (Strategie A): parallele neue Ablage, alte Dateien bleiben unberührt, v35 liest sie nur.**

- [ ] **Neue Ablage nur für F3**, so benannt, dass ältere Skripte sie ignorieren: entweder gleiches Verzeichnis mit anderem Dateipräfix (z. B. `ebaF3_…`; fällt durch `davKeyValid()`; funktioniert überall, wo der Abgleich heute funktioniert) oder Unterordner (`MKCOL` nötig, auf Freigabe-WebDAV evtl. nicht erlaubt; ältere Skripte ignorieren Unterordner ebenfalls, belegt durch den Testserver). **Offen: Präfix vs. Unterordner [F3]**, Ablage-Layout hängt am Formatentscheid (Datei je Reihe oder je Server ein Bündel).
- [ ] **Formatmarker auf dem Server** (eigene Datei in der neuen Ablage): Formatversion, Mindestskriptversion, Erst-Migration (Gerät, Zeit). Marker mit höherer Formatversion als bekannt → Abgleich verweigern, Hinweis „openEBA aktualisieren“ (analog „neueres Schema“ heute).
- [ ] **Erster v35-Lauf je Server:** Marker fehlt → Nutzer-Hinweis „Server-Daten übernehmen?“ (Vorschau: Reihen/Zeilen) → alte Ablage lesen (`davValidate` + kanonische Merge-Funktionen, danach Stufenkette) → mit lokalen Daten verschmelzen → in neue Ablage schreiben → Marker setzen. Marker da → nur normal abgleichen. Parallele Erst-Migration zweier Geräte ist harmlos (Merge kommutativ/idempotent; Marker per `If-None-Match: *`).
- [ ] **Übergangsmodus (alt → neu, einseitig):** Solange v34-Geräte schreiben, liest v35 die alte Ablage weiter (selten, z. B. je Tick höchstens einmal und nur geänderte ETags) und verschmilzt sie in die neuen Daten. v35 **schreibt nie** in die alte Ablage. Konsequenz: v34-Geräte sehen v35-Daten nicht. Hinweis in der Config; Ende des Übergangsmodus per Schalter/Zeitraum **(Entscheidung offen)**; danach optional „Altablage archivieren“ (nur auf ausdrückliche Bestätigung, nie automatisch löschen).
- [ ] **Index und Löschliste übertragen:** `eba_index_*.tsv` („f“-Marker = vergessene Reihen) und `eba_rowdel_*`-Listen werden mit gelesen und in das Löschmodell von F3 abgebildet; im Übergangsmodus weiter nachgezogen, damit nach der Migration gelöschte Zeilen/vergessene Kolonien auf v34-Geräten nicht zurückkehren.
- [ ] **Konflikte:** Gleiche Reihe auf alt und neu geändert → Vereinigung (Merge kanonisch), Löschmarker gewinnt nach Zeitstempel wie heute. Uneinigkeit über „vergessen“ → größerer Zeitstempel gewinnt, bei Gleichstand „vergessen“ (bestehende Regel).
- [ ] **Warum nicht „in place“ (Strategie B: bestehende Dateien umschreiben):** Ältere Geräte prüfen nur hist-Schema, Sammlung und Löschliste; Statistik/Futter und Index haben keine Formatkennung, ein altes Gerät würde neue Inhalte als Daten lesen, unlesbare Zeilen verwerfen und **seinen Stand zurückschreiben**. Sperrdatei und Mindestversion lassen sich gegenüber v34 nicht erzwingen (v34 kennt beides nicht). B ist nur sicher, wenn alle Geräte vorher auf v35 sind – nicht kontrollierbar.
- [ ] **Hinweis- und Reihenfolge für Nutzer** (README/Config-Text): 1) Export als Backup auf einem Gerät; 2) auf **einem** Gerät auf v35 aktualisieren und WebDAV „Server-Daten übernehmen“; 3) weitere Geräte aktualisieren (holen die neue Ablage); 4) bis alle Geräte v35 haben: Übergangsmodus an lassen; 5) danach Altablage ggf. archivieren. Gerät, das lange offline war und v34 bleibt, schreibt weiter nur in die Altablage – nichts geht verloren, wird aber erst im Übergangsmodus eingearbeitet.
- [ ] Optional **[F3]**: Brücke (v35 schreibt zusätzlich im Altformat) – nicht empfohlen (doppelte Pflege, Risiko, alte Fehler werden mitgeschrieben). Entscheidung beim Nutzer.
- [ ] Keine Sperrdatei als Schutz gegen v34 (wirkungslos); innerhalb von v35 ist `If-Match`/ETag wie heute ausreichend.

## 8 Tests

Alles außerhalb des Repos in `/home/user/eba-work/` (z. B. `migration/fixtures/`), Testlauf wie in `UEBERGABE.md` (eigene Skriptkopie `b_<kürzel>.js`, `run_all.sh`; WebDAV-Tests nur mit `--webdav`).

- [ ] **Fixtures je Quellformat:** F2 aus `export/export1111/export.json` (beide Server), `pc.json`, `handy.json`, `openEBA_merged.json` (Schema 4); F2 mit Schema 2 und 3 und Familien `eba_hist_*`, `eba_rowdel_*`, `eba_collection_*`, `eba_profile_*`, `test_`-Schlüsseln **synthetisch** aus den vorhandenen Daten abgeleitet (Schema 4 rückwärts gebaut); **F1 synthetisch** (globale Punkte-/Stundenschlüssel, ohne Versionsschlüssel, Mehrfachzeilen je Tick). Echte Namen/Inhalte nicht in Berichte oder Repo kopieren.
- [ ] **Prüfkriterien:** Schlüsselanzahl je Familie/Server vor/nach; Zeilenzahl je Reihe (nach Migration ≥ vor Migration bzw. begründet erklärbar, z. B. Mehrfachzeilen zusammengefasst); Menge der Zeitschlüssel je Reihe unverändert; Stichproben von Zeilen byte-genau; Optionen/Notiz/Bookmarks unverändert; ignorierte Schlüssel unangetastet; **zweiter Lauf = identisches Ergebnis**; Abbruch mitten im Lauf (simuliert) = Altzustand intakt; Export F3 → Import in leeren Speicher → gleich.
- [ ] **Importtests:** jedes alte Export-Schema, falscher Server, `onlyServer`, defekte Datei (kein Schreiben).
- [ ] **WebDAV (`--webdav`, Mock-Server aus `tests/archiv/dav_t_base.js`/`dav_coll.js`, PROPFIND-/ETag-Varianten, Unterordner `sub/` ist schon im Mock):** (1) leere Ablage → neu; (2) nur Altablage → Erst-Migration, Marker, Neuablage vollständig; (3) zwei Geräte migrieren gleichzeitig; (4) altes Gerät schreibt nach Migration weiter → v35 liest im Übergangsmodus nach; (5) altes Gerät findet neue Dateien nicht und stürzt nicht ab (Testlauf mit aktuellem 34.8-Skript gegen den Mock mit Neuablage); (6) Löschmarker/Index aus Altablage; (7) Marker mit höherer Formatversion → Abgleich verweigert; (8) Server ohne PROPFIND (nur Index).
- [ ] Kernsatz (`run_all.sh`) bleibt grün; Migration läuft im Smoke-Test ohne Konsolenfehler.

## 9 Arbeitspakete (Reihenfolge)

Formatunabhängig (können vor Phase 2 laufen, aber **kein Eingriff in `OpenEBA.js` ohne Start-Freigabe für v35**):

- [ ] M1 Fixtures bauen, Prüfskript (Zähler/Prüfsummen) im Testordner.
- [ ] M2 Erkennung (Speicher, Export, WebDAV) und Abbild-Schicht.
- [ ] M3 Stufenkette-Gerüst; Stufe F1→F2 aus vorhandenem Code kapseln.
- [ ] M4 Backup, Vorschau, Protokoll, Config-Eintrag.
- [ ] M5 Import alter Exporte über die Kette.
- [ ] M6 WebDAV: Altablage lesen, Übergangsmodus, Marker (Namen **[F3]**).

Nach Formatentscheid:

- [ ] M7 Stufe F2→F3, Export-Schema 5, neue WebDAV-Ablage.
- [ ] M8 Tests komplett (Abschnitt 8), README/CHANGELOG, Hinweistext für Nutzer.

## 10 Offene Entscheidungen für den Nutzer

- [ ] Datenformat F3 (Phase 2) – bestimmt Stufe F2→F3, Ablage und Marker.
- [ ] WebDAV: parallele Neuablage (empfohlen) statt Umschreiben; Präfix oder Unterordner; Bündel je Server oder Datei je Reihe.
- [ ] Übergangsmodus: Dauer/Ende (Schalter, Zeitraum) und ob v35 zusätzlich im Altformat schreibt (nicht empfohlen).
- [ ] Altdaten lokal: wie lange behalten, wer bestätigt das Löschen (Knopf in der Config)?
- [ ] F1: reicht automatische Migration im Skript (Stufe bleibt erhalten), oder wird F1 nicht mehr unterstützt (Fork ist erst seit 25.10.2026 aktiv, F1-Nutzer sind meist schon auf ≥ 31.1 migriert)?
- [ ] Stufen F1→F2 und F2→F3 dauerhaft im Skript lassen oder nach einigen Versionen entfernen?
- [ ] Fixtures: Soll der Nutzer einen echten Export mit eingeschalteten Verläufen (Geld/Punkte/Suchen/Lager/Sammlung/Profil) und ggf. WebDAV-Ordnerlisting (nur Dateinamen und Größen) liefern?
- [ ] Zeitbasis vor 33.5 bei Geräten außerhalb Deutschlands: ungeprüft, keine Umrechnung geplant (Daten aus Deutschland gelten laut CHANGELOG 33.8 unverändert).
