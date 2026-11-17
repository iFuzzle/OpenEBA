# v35 – Datenkonzept (Orientierung) und Prüfung

**Status: Orientierung, keine Entscheidung.** Gehört zu `V35_PLAN.md` (Phase 2 Datenmodell) und `V35_MIGRATION.md` (Abschnitt 3, Zielformat F3). Das Konzept stammt vom Nutzer (Nebenchat); die Prüfung unten stützt sich auf `origin/beta:OpenEBA.js` (v34.8, 52a5634) und die Fixtures in `/home/user/eba-work/input/` und `export/` (nichts davon im Repo).

## Orientierung (Nutzer, Stand 17.11.2026)

**Platzbedarf der Brut.** Die Spielhilfe nennt einen Platzbedarf für die Brut; unklar, ob Eier, Larven und Puppen gleich zählen. Die Detailseite zeigt die Belegung auf eine Nachkommastelle. Je Tick Belegung Nest und Formicarium zusammen mit Arbeiterinnen, Eiern, Larven, Puppen speichern und per Ausgleichsrechnung den Platz je Brutstufe bestimmen (Nest und Formi getrennt; laut Spielhilfe belegt Brut nur das Nest). Wenige Ticks mit stark schwankender Brut reichen (nach Einlagern oder Proteinhunger).

**A. Grundsätze:** Rohwerte statt Abgeleitetem · eine Tick-Kennung je Messung = Beginn des Ticks als UTC-Zeitstempel, je Kolonie und Tick zählt die erste Ablesung nach Tick-Beginn, spätere überschreiben nicht · Ereignisse getrennt vom Zustand, je mit Zeitstempel und Geräte-ID · Formatkennung je Datensatz/Datei, unbekannte Felder durchreichen.

**B. Erfassung:**
- Kolonie-Zustand aus der Detailansicht `ameisenzimmer.php?cat=9&id=…` (laut Konzept „je Tick ohnehin gelesen“): Königinnen, Arbeiterinnen, Eier, Larven, Puppen, Punkte, Zucker-/Proteinhunger, Ausbruchschutz (Art, %), Formicarium und Nest (Art, Belegung %).
- Futterstücke: Futtertabelle der Detailansicht je `foodid` (Art, Gramm, Zustand %).
- Ereignisse: „gefüttert“ (Meldung `eba-notice`: Kolonie, Art, Menge, neue `foodid`), „Futter entfernt“ (Kolonie, `foodid`, Rest, Zustand), „Wechsel“ (Formulare Nest/Formi/Ausbruchschutz, „ins Lager“: alt → neu).
- Shoppreise (wie bisher), Verkaufsangebot (`shop.php?cat=99` nach „Angebot abfragen“: `antid`, Art, Königinnen, Arbeiterinnen, Nest, Erlös als Rohtext, Shoppreis), Spielerwerte (Geld, Gesamtpunkte, Stunden; wie bisher).

**C. Ablage (lokal und WebDAV gleich):** je Server und Kolonie Zeitreihe der Zustände, Ereignisliste, Futterstücke; Dateien je Server, Kolonie und Monat, nur anhängen; Shoppreise und Verkaufsangebote je Server und Monat eigene Dateien. Löschen per Markierung im Datensatz statt Löschliste. Zusammenführen: Zustände Vereinigung je Tick (früheste Ablesung gewinnt), Ereignisse Vereinigung mit Kennung aus Zeitstempel + Geräte-ID + Laufnummer, Futterstücke je `foodid` neuester Stand.

**D. Berechnet (nicht gespeichert):** Futterverbrauch je Tick und Art (Rest vorher + gefüttert − entfernt − Rest nachher, je `foodid`); Platzbedarf je Brutstufe; Abrieb Ausbruchschutz (Arbeiterinnen, Zuckerhunger, PTFE-Faktor, abgeglichen mit gemessenem %); Wachstum und Restzeit; Verkaufsformel; Anzeige Belegung in der Übersicht.

**E. Noch zu klären (Nutzer):** Aufbewahrung Futterstücke (bis Verbrauch + einige Ticks?); Detailansicht bei jedem Aufruf oder einmal je Tick lesen; genaue Tick-Länge Speedserver.

## Prüfung

Legende: ✔ passt · ⚠ Einwand · ? offen/unbelegt.

### 1 Quellen und Hintergrundabrufe

- ⚠ **„Detailansicht wird je Tick ohnehin gelesen“ stimmt nur bedingt.** Die Detailansicht wird (a) beim Öffnen durch den Nutzer gelesen (`ebaCaptureFoodFromPage`, Z. 802 ff.; zusätzlich vor dem Füttern per Capture-Phase-Handler) und (b) **im Hintergrund** je Kolonie und Tick geholt: `queueFoodSnapshot`/`runFoodQueue` (Z. 855 ff., `GM_xmlhttpRequest` auf `ameisenzimmer.php?cat=9&id=…`, sequentiell, 300 ms Pause), ausgelöst aus der Formicarien-Übersicht (Z. 1020 ff.). Das passiert aber **nur mit der Option `eba_enable_food_snapshot`** (Standard aus) und nur nach Tickende. Das Konzept baut also auf einem vorhandenen, optionalen Hintergrundabruf auf; es setzt ihn voraus.
- Alle Hintergrundabrufe heute (`GM_xmlhttpRequest`, 9 Stellen, davon Spielserver): `shop.php?cat=99` (stündlich, Z. 444), `stats.php?s=serverstats` (Tickdauer, einmal je Tick, Z. 661), Detailseite je Kolonie (Z. 855), Lagerseite `ameisenzimmer.php?cat=2` (einmal je Tick, höchstens 3 Versuche, Z. 1720). Der Rest (Z. 4942 ff., 8174) ist WebDAV.
- ⚠ **Regel „keine neuen Hintergrundabrufe ohne Rücksprache“:** Solange das Konzept nur das nutzt, was der Detailabruf ohnehin liefert (Belegung, Brutzahlen, Futtertabelle stehen auf derselben Seite), entsteht kein neuer Abruf. **Nicht** abgedeckt wäre: Zustandserfassung *ohne* Option, häufiger als je Tick, oder für Kolonien, die die Übersicht nicht listet. Vorschlag: Erfassung bleibt an dieselbe Option und denselben Abrufpfad gebunden (einmal je Tick und Kolonie, erste Ablesung gewinnt = bestehendes Verhalten); „bei jedem Aufruf lesen“ (E-Frage) ist unproblematisch, solange es nur die vom Nutzer geöffnete Seite ist und nichts Zusätzliches abgerufen wird. Eine Erweiterung der Ticks auf den Speedserver (12 min = fünffache Abrufmenge) braucht Rücksprache.
- ⚠ **Ereignisse „gefüttert“/„Futter entfernt“ via `eba-notice`: nicht belegt.** Weder im Code (kein `eba-notice`, kein „Futter entfernt“) noch in den Fixtures kommt das vor. Es gibt nur die Formulare: `action=addfood` mit `select name=foodid` + `amount`, `newescapeprotection`, `changeformi`, `changenest`, `backtolager` („Zurück ins Lager“ in `zucht_real.html`; in der Detailansicht der Text „Kolonie zurück ins Lager“). Das Skript fängt Absenden schon ab (Z. 826 ff.) – dort ließe sich ein Ereignis ableiten, ohne neue Abrufe. Die Meldungstexte müssen vom Nutzer als HTML-Beispiel geliefert werden.
- ⚠ **`foodid` ist zweideutig.** Im Fixture (`detail_aphaenogaster.html`) ist `foodid` im Formular die **Futterart-ID** aus dem Lager (z. B. 453 = gemixtes Zuckerwasser, 407 = Waldschaben), *nicht* die ID eines einzelnen Futterstücks. Ob die Futtertabelle (`table.liste` im Block `data-formi='food'`, Spalten Name/Gramm/…/Zustand) eine Stück-ID liefert, ist im Fixture nicht prüfbar (leere Kolonie) und wird heute nicht ausgelesen (`ebaFoodLine`, Z. 793: nur Name, Gramm, Zustand). Ohne Stück-ID ist „je `foodid` neuester Stand“ und der Verbrauch je Stück nicht möglich; Notlösung wäre Zuordnung nach Art + Reihenfolge (unsicher). ? Vom Nutzer klären, ob die Tabelle Stück-IDs enthält (Fixture mit gefülltem Formi liefern).
- ⚠ **Belegung in %:** In der Detailansicht steht der Wert nur im Skript `jsProgressBar($('spacenest'), 28, …)` bzw. `$('spaceformi'), 19.9` (Fixture; Auslesen: `ebaGameSpace`, Z. 4703). Eine Nachkommastelle stimmt (28 / 19,9). Heute **nicht gespeichert** (die Statistik hat nur Zuckerhunger/Proteinhunger als letzte Spalten, nicht Belegung).
- ? **`shop.php?cat=99` „Angebot abfragen“ mit `antid`:** weder im Code noch in `shop_ankauf_real.html` belegt. Das Fixture zeigt nur das Verkaufsformular (`<form action="/shop.php" method=post>`, `input name=ant`, Button „verkaufen“). Mit „Angebot abfragen“ wäre ein **zusätzlicher Abruf/Formular-Absenden durch den Nutzer** gemeint; solange der Nutzer das selbst auslöst und das Skript nur mitliest, ist es unkritisch. Beispiel-HTML nötig.
- ✔ **Schon erfasst:** Formicarien-Statistik je Tick (`eba_statistic_<srv><id>`: Stunden, Königinnen, Arbeiterinnen, Brut, Nest-/Formi-Art, Zucker-/Proteinhunger, Zeit; Kopf = Basisstunde + Art), Futter+Ausbruchschutz je Tick (`eba_food_…`, Feld 3 „PTFE 97,4“), Shoppreise je Tick (`eba_shop_prices_…`, `eba_hist_…shopprice`), Lagerstand, Geld/Punkte/Stunden (`eba_points_`, `eba_hours_`, `eba_hist_`), Tickdauer. Neu wären v. a. Belegung %, Futter-Stück-IDs, Ereignisse und Verkaufsangebote.

### 2 Tick-Kennung

- ✔ Tick = `floor(Serverzeit / Tickdauer) × Tickdauer` (`getTickInfo`, Z. 682; Normal 60 min, **Speed 12 min** laut `getTickMinutes`, Z. 622) – exakt „Beginn des Ticks als UTC-/Epoch-Zeitstempel“. Serverzeit (nicht PC-Uhr) seit 33.4/33.5, daher **keine Sommer-/Winterzeit-Probleme**, solange die Kennung Epoch ist. Der Wert in der Statistik-Anzeige (`25.10.2026 10:00`) ist lokale Darstellung; speichern sollte man Epoch-Minuten (so macht es `eba_food_*` schon: `29892120`).
- ✔ „Ablesung erst nach Tickende“: `done = (jetzt − Tickbeginn) > Tickdauer + 3 s` (Z. 686; letzte Tickdauer aus `stats.php?s=serverstats`, Fixture: 36,244 s; Fallback 30 s). Auf dem Speedserver (12 min = 720 s) ist die Tickdauer relativ größer, Ablesefenster kürzer.
- ✔ Die Frage E „genaue Tick-Länge Speed“ ist im Code beantwortet: 12 min (Spielhilfe/`lexikon_speed_einheimische.html` nicht nötig). Ob sie auf *allen* Speed-Servern gilt, bleibt offen.
- ⚠ Der Tick-Zeitstempel nennt den **Beginn**, die Ablesung kann bis zu fast einem Tick später liegen; die Ablesezeit (Epoch) sollte als eigenes Feld mitgespeichert werden (Ausgleichsrechnung, Verbrauch zwischen Ablesungen). Die „früheste Ablesung gewinnt“-Regel entspricht dem heutigen „erster Stand gewinnt“.

### 3 Ablage und WebDAV

- ⚠ **„Nur anhängen“ gibt es auf WebDAV nicht.** Eine Datei wird komplett per `GET` gelesen und per `PUT` ersetzt (heute mit ETag/`If-Match`, Z. 4942 ff.). Zwei Geräte, die gleichzeitig anhängen, sehen sich über `If-Match`/412 und müssen neu mergen – das funktioniert, ist aber kein Append. Vorschlag: Merge-Modell beibehalten (kommutativ, idempotent), „nur anhängen“ als logische Eigenschaft (Zeilen werden nie geändert, nur hinzugefügt/markiert), nicht als Transportart.
- ⚠ **Dateianzahl und Abrufaufwand.** Heute: je Kolonie 2 Dateien (`eba_statistic_`, `eba_food_`) + Index. Konzept: Kolonien × Monate × Dateiarten. Beispiel: 16 Kolonien (Export `export1111`: 16 normal) × 12 Monate × 2–3 Arten ≈ 400–600 Dateien/Jahr/Server; der Abgleich müsste je Datei prüfen (heute über den Index mit ms-Zeitstempel). Alte Monate ändern sich nie → ETag-Vergleich entfällt; Vorschlag: abgeschlossene Monate nur einmal lesen und lokal als „fertig“ markieren; nur der laufende Monat wird je Abgleich geprüft. Index muss Monatsdateien kennen (Format erweitern).
- ⚠ **Konkurrenz:** Mehrere Geräte schreiben den laufenden Monat derselben Kolonie, vor allem Normalserver (stündlich). Mit ETag-Retry beherrschbar; die Monatsgrenze (Datei wechselt) sollte aus dem Tickzeitstempel in **UTC** bestimmt werden (nicht lokale Zeit), damit zwei Geräte dieselbe Datei meinen.
- ⚠ **Tombstones statt Löschliste:** Löschmarkierung im Datensatz verhindert zwar Wiederauferstehen alter Zeilen, **wächst aber mit** und lässt sich nicht bereinigen, ohne die Markierung auf älteren Geräten zu verlieren. Heute: Löschliste (`eba_rowdel_<srv>list`, Z. ca. 2386 ff., „Inhalts-Tombstone“) als *eine* kleine Datei. Vorschlag: Tombstones im Datensatz ok, aber mit Zeitstempel und einer festen Aufbewahrung (z. B. nach Abschluss des Monats zusammenfassen: Monatsdatei enthält dann nur gültige Zeilen + kompakte Löschliste); Bereinigung nur auf Nutzerbestätigung.
- ⚠ **Geräte-ID gibt es nicht.** Im Code keine Geräte-ID (nur die Sperrmarke `now + "." + Math.random()` für Abrufversuche, Z. 1010, und `eba_dav_*` als Gerätezustand). V35_MIGRATION §3 fordert sie bereits („für Herkunft/Protokoll, nicht für Merge-Entscheidungen“). Das Konzept nutzt sie dagegen **für die Ereignis-Kennung** – dann wird sie Teil der Merge-Identität; sie darf nie neu vergeben werden (Neuinstallation → neue ID → Duplikate nur, falls Zeitstempel + Laufnummer kollidieren; also harmlos). Empfehlung: ID einmal zufällig (≥ 8 Zeichen) erzeugen, nie exportieren, Laufnummer lokal je ID hochzählen.
- ✔ Merge-Regeln (Zustände: Vereinigung je Tick, früheste Ablesung; Ereignisse: Vereinigung nach Kennung; Futterstücke: neuester Stand) sind kommutativ/idempotent und passen zum bisherigen Modell (`mergeFormiHistory`, `mergeFoodHistory`: höchstens eine Zeile je Tick).
- ⚠ **Datenvolumen.** Gemessen im Export (`export1111`): Statistik ≈ 70–80 B/Tick, Futter ≈ 100 B/Tick je Kolonie (z. B. 87 Zeilen ≈ 6–7 KB bzw. ≈ 9 KB). Konzept fügt Belegung, Eier/Larven/Puppen (teils schon da), Futterstück-IDs und Ereignisse hinzu: grob 250–400 B/Tick und Kolonie. Normalserver: 8 760 Ticks/Jahr × 16 Kolonien × ~300 B ≈ **40 MB/Jahr** (≈ 2,5 MB/Kolonie). **Speedserver: 43 800 Ticks/Jahr** → fünffach, ≈ 13 MB/Kolonie/Jahr. GM-Speicher (Tampermonkey, `chrome.storage`/IndexedDB-nah) und die Gesamtgröße der Exporte (heute 268 KB für 22 Kolonien) wachsen damit deutlich; ein ganzes Jahr im GM-Speicher ist heikel (alles wird bei jedem `GM_getValue` als String geladen). Vorschläge: Rohzeilen kompakt (Epoch-Delta, numerische Felder, Texte als Wörterbuch-Index), ältere Monate abgeschlossen und optional nur noch in WebDAV/Export statt lokal, Speedserver mit eigener (gröberer) Aufbewahrung oder Opt-in. ? Aufbewahrungsdauer vom Nutzer entscheiden lassen.

### 4 Rohwerte, Durchreichen, Formatkennung

- ✔ **Rohwerte statt Abgeleitetem** passt zum Datenvorrang (CLAUDE.md) und zu den heutigen Reihen (Punkte, Hunger, Belegung entstehen berechnet bzw. werden roh gespeichert). Rechenregeln können später korrigiert werden, ohne Daten zu verlieren.
- ✔ **Formatkennung je Datensatz/Datei** schließt die in V35_MIGRATION §1.2 genannte Lücke (Statistik/Futter ohne Kopfzeile). Je Datei genügt (Kopfzeile mit Format, Server, Kolonie, Monat); je Datensatz nur, wo Felder wechseln.
- ✔ **Unbekannte Felder durchreichen** entspricht V35_MIGRATION §3 („neuere Formatversion wird erkannt und abgelehnt statt falsch verschmolzen“). Zusatz: durchreichen heißt *unveränderte Rückgabe beim Schreiben*; bei *höherer Hauptversion* weiterhin ablehnen. Beides muss sich auf Feldebene (Minor) bzw. Dateiebene (Major) trennen lassen.

### 5 Berechnungen (D)

- ⚠ **Auflösung Belegung:** 1 Nachkommastelle → 0,1 % entspricht bei Nestgröße N dem Fehler 0,001·N Platz. Bei N = 15 000 sind das 15 Plätze je Messung (Rundung ±7,5). Brutstufen (Ei/Larve/Puppe) belegen pro Stück wenig; ein Einzelwert ist damit nicht aussagekräftig, nur die Ausgleichsrechnung über **viele Ticks mit stark schwankender Brut** (wie im Konzept) – und nur in kleineren Nestern genau. Vorschlag: Fehlergrenze je Schätzung mit ausgeben („± x Plätze“), bei großen Nestern „unbestimmt“ statt Zahl; Belegung des Spiels auch roh (so, wie `jsProgressBar` sie liefert, z. B. 19.9), nie nachgerundet. Die Annahme „Brut belegt nur das Nest“ ist ein Spielhilfe-Wert, kein Messwert: kennzeichnen und gegen Formicarium-Belegung (Arbeiterinnen allein) prüfen.
- ⚠ **Futterverbrauch je `foodid`:** nur möglich, wenn die Futtertabelle Stück-IDs liefert (siehe 1). Sonst nur Summe je Art aus Gramm-Differenz + Ereignissen; Verdunstung/Zustand verändern die Gramm ohne Verbrauch (Zustand % ist ein eigener Verlauf). Ereignis „gefüttert“ ist die einzige verlässliche Zufuhrmenge; fehlt es (Ereignis nicht erfasst, weil Seite nicht geöffnet), bleibt eine Lücke → Verbrauch als „unbekannt“ kennzeichnen, nichts erfinden (CLAUDE.md).
- ? **Abrieb Ausbruchschutz / PTFE-Faktor:** im Code nicht vorhanden (keine Treffer zu Abrieb/Faktor); es gibt nur Art + Prozent (z. B. 97,4). Faktor und Abhängigkeit von Arbeiterinnen/Zuckerhunger sind **unbekannt** und müssen aus Messreihen (Konzept: Ausgleichsrechnung) geschätzt werden; vorerst nur Rohwerte sammeln.
- ✔ Wachstum und Restzeit, Belegungsanzeige: bestehen bereits (Polygynie-, Wachstums-Prozent-Funktionen), Berechnung bleibt aus den Rohwerten.

### 6 Verträglichkeit mit V35_MIGRATION.md und V35_PLAN.md

- ✔ Passt zu Strategie A (parallele neue WebDAV-Ablage, alte Dateien nur gelesen): Monatsdateien mit eigenem Präfix (`ebaF3_…`) werden von v34 ignoriert (`davKeyValid`).
- ✔ Die F3-Anforderungen (Geräte-ID, Formatversion, Zeitstempel je Zeile, Löschmarker im Merge-Modell, selbstbeschreibende Reihen) decken sich mit dem Konzept; das Konzept konkretisiert sie (Monatsdateien, Ereignisse, Tombstone im Datensatz).
- ⚠ **Migration F2→F3:** Alte Statistik-/Futterzeilen haben weder Belegung noch Stück-ID noch Ablesezeit. Beim Überführen Felder als „unbekannt“ leer lassen, nicht ableiten. Die alte Futterzeile ist ein Text (`Waldschaben 0,92g 83% | …`) – Rückführung auf Felder ist verlustbehaftet (Reihenfolge = Tabellenreihenfolge), die Stufe F2→F3 sollte den Originaltext zusätzlich aufbewahren.
- ⚠ **Verträglichkeit mit Phase 2 Optionen (a)/(b)/(c):** Das Konzept ist faktisch Option (c), Breaking Change (neues Gesamtformat) – braucht ausdrückliche Freigabe (V35_PLAN Phase 2) und passt nur zusammen mit der Übergangsstrategie A.

## Empfohlene Anpassungen

1. Erfassung des Kolonie-Zustands an die vorhandene Option `eba_enable_food_snapshot` und den vorhandenen Hintergrundabruf (je Tick/Kolonie, sequentiell) binden; kein zusätzlicher Abruf; Speedserver nur nach Rücksprache.
2. Ereignisse zuerst aus den **Formular-Absendungen im Skript** ableiten (`addfood`, `newescapeprotection`, `changeformi`, `changenest`, `backtolager`), `eba-notice`-Auswertung erst nach Beispiel-HTML.
3. `foodid` im Modell trennen: `foodtype` (Art-ID aus dem Formular) und `pieceid` (Stück-ID der Tabelle, falls vorhanden); sonst Stück = Art + Position + Ablesezeit.
4. Zeitstempel: Tickbeginn **und** Ablesezeit als Epoch-Minuten speichern; Monatsgrenze nach UTC.
5. „Nur anhängen“ als Merge-Eigenschaft, nicht als Transport; abgeschlossene Monate lokal als fertig markieren und im Abgleich überspringen; Index um Monatsdateien erweitern.
6. Tombstones im Datensatz mit Zeitstempel; Zusammenfassung abgeschlossener Monate; Bereinigung nur auf Nutzerbestätigung.
7. Geräte-ID einmal erzeugen, nie exportieren; Laufnummer lokal; Teil der Ereignis-Kennung.
8. Kompakte Rohzeilen (Epoch-Delta, numerisch) und Aufbewahrungsregel; Speicher im Gesamtvolumen abschätzen (≈ 40 MB/Jahr normal, ≈ 5× Speed) und mit dem Nutzer festlegen.
9. Platzbedarf der Brut: Fehlergrenze ausgeben; bei großen Nestern „unbestimmt“; Abrieb-Faktoren erst nach Messreihen.
10. Migration F2→F3: unbekannte Felder leer, Originaltext der Futterzeile behalten.

## Offene Fragen an den Nutzer (ergänzt Liste E des Konzepts)

1. Liefert die Futtertabelle Stück-IDs? (HTML einer Detailseite mit gefülltem Formi liefern.)
2. HTML der Meldungen `eba-notice` („gefüttert“, „Futter entfernt“) und der Seite nach „Angebot abfragen“ (`antid`) liefern.
3. Darf die Erfassung an die Option `eba_enable_food_snapshot` gebunden bleiben (kein neuer Hintergrundabruf), und soll der Speedserver (12-min-Tick) mit erfasst werden?
4. Aufbewahrung: Wie lange lokal (Monate), Futterstücke wie lange? Speicherbedarf ≈ 40 MB/Jahr normal akzeptabel?
5. Gilt Tick 12 min für alle Speed-Server? Ablesezeit zusätzlich zur Tickkennung speichern (empfohlen)?
6. Ist das Konzept als Breaking Change (Phase 2 Option c) mit Strategie A (parallele Neuablage) gemeint?
7. Soll der Platzbedarf der Brut bei Nestern über ca. 5 000 Platz nur mit Fehlergrenze oder gar nicht ausgegeben werden?
8. Dateien je Monat ODER je Kolonie ein Bündel mit Index (weniger Dateien, größerer Konfliktbereich)?
