# Änderungsprotokoll

Alle Änderungen an openEBA seit dem Fork des Skripts von Pepper (Version 31, siehe [README](README.md)). Neueste Version zuerst.

## Seit dem Fork

- **Vollständige Historien:** Neben der Formicarien-Statistik werden jetzt auch Geld, Punkte, Ticklänge sowie Futter- und Ameisensuchen als Zeitreihen gespeichert. Ältere Treffer der Suchen bleiben erhalten.
- **Verlaufsgrafiken:** Kurven für Geld und Punkte in der Kopfzeile und eine eigene Seite *openEBA-Verlauf* mit Diagrammen je Formicarium (Hunger, Brut, Ausbruchschutz).
- **Mehr Infos zu Kolonien:** maximale Punktzahl, Auswachszustand in Prozent mit Wachstumsphasen und Nestwarnung.
- **Abgleich per WebDAV/Nextcloud** zwischen Geräten, ab 32.3 in beide Richtungen.
- **Normal- und Speedserver sauber getrennt**, Export/Import der Daten und Löschen mit Rückfrage.
- **Kolonienpflege:** ehemalige Kolonien vergessen und Kolonien nach einem Umzug (neue ID) zusammenführen.
- **Ameisenshop-Preise** nach Aktionen des Spiels (AJAX) wieder angezeigt, mit feinerer Einfärbung.
- Viele Korrekturen an Statistik, Suchhistorie und Datenabgleich.

> **Hinweis vor dem Update:** Mehrere Versionen (31.1, 31.7, 31.9) wandeln gespeicherte Daten beim ersten Start automatisch um. Empfehlung: vorher in der openEBA-Konfiguration die Daten über *Exportieren* sichern.

## 33.5

### Verbessert
- Formicarien-Übersicht: Der Link *Statistik* unter jeder Kolonie ist ersetzt durch drei Links:
  - **Verlauf** öffnet die Seite *openEBA-Verlauf* mit dieser Kolonie aufgeklappt.
  - **CSV** lädt die Statistik als Datei für Excel herunter (Semikolon, Dezimalkomma).
  - **Tabelle** öffnet das bisherige Textfeld zum Kopieren.
- Seite *openEBA-Verlauf*: Jede Formicarium-Gruppe hat in der Kopfzeile einen CSV-Link.

- Einheitlich Serverzeit statt Rechner-Uhr: Endzeit „[Endet …]“ bei Jobs und Forschung, Zeitraumfilter der Seite *openEBA-Verlauf* und der Kurve im Header, Stunden-Cache der Ameisenshop-Preise, Punkte pro Stunde, Sperre des Lager-Abrufs und Zeitstempel im Export. Zwei Browser im selben Tick verhalten sich damit gleich. Das Punkte-pro-Stunde-Fenster wird nach dem Update einmal neu befüllt („+?“, bis zwei Stunden vorliegen).

### Behoben
- Mit *Bookmarks einblenden* stand *openEBA-Verlauf* im Statistik-Menü hinter den Bookmarks. Er steht jetzt immer direkt unter *openEBA*.

## 33.4

### Neu
- Option *Ausbruchschutz in der Formicarien-Übersicht anzeigen*: Unter „Hunger (Proteine)“ bzw. „Pilzstatus“ steht je Kolonie eine Zeile *Ausbruchschutz* mit Balken und Wert, z. B. `97,4 % PTFE`. Unter 20 % orange, unter 10 % rot. Ein Wert aus einem früheren Tick ist blass dargestellt, der Tooltip nennt den Stand. Quelle ist die Erfassung von Futter und Ausbruchschutz je Tick.

### Verbessert
- Lager: höchstens ein Scan pro Tick und Server, egal ob über die Lagerseite, den Hintergrundabruf, mehrere Tabs oder die Seitenleisten-Anzeige. Der erste Stand eines Ticks gewinnt. Fehlversuche frühestens nach 10 Minuten wiederholt, höchstens 3 pro Tick. Während eines laufenden Ticks wird nicht mehr abgerufen.
- Changelog: Abschnitt 33.0 zusammengefasst.

## 33.3

### Neu
- Seite *openEBA-Verlauf*: neuer einklappbarer Bereich **Lager** unter Geld, Punkte und Ticklänge. Die Kopfzeile zeigt den letzten Futtervorrat in kg je Art. Das Diagramm *Futtervorrat nach Art* hat vier Linien: Zucker (gemixtes Zuckerwasser, Zuckerwasser, Honig), Körner (Löwenzahnsamen, Grassamen), Blätter (Brombeerblätter) und Protein (alle übrigen Sorten). Jede Art lässt sich aufklappen und zeigt die Einzelsorten. Dazu kommt ein Diagramm für Zubehör. Voraussetzung: Option *Lagerbestand je Tick festhalten*.

## 33.2

### Neu
- Option *Lagerbestand je Tick festhalten*: Einmal pro Tick werden die Bestände aus dem Lager gespeichert, getrennt nach Futter (Gramm je Sorte), Zubehör, Formicarien und Nester, Möbel sowie Ameisen im Lager (je Art). Erfasst wird beim Besuch der Lagerseite, sonst mit einem einzigen Hintergrundabruf pro Tick. Die Reihen laufen mit WebDAV, Export und Import.

### Behoben
- *Inventar in der Seitenleiste anzeigen*: aktualisiert sich jetzt pro Tick statt pro Stunde. Begriffe mit Sonderzeichen wie `(` oder `[` lassen die Anzeige nicht mehr ausfallen. Mehrdeutige Begriffe wie „Nest“ werden aufsummiert, ein exakter Name hat Vorrang. Unsichtbare Zeilenenden in der Itemliste stören nicht mehr. Fehlerseiten werden nicht mehr zwischengespeichert. Ameisen im Lager lassen sich mit `@Art` anzeigen.

## 33.1

### Neu
- Formicarien-Übersicht und Detailansicht: Hinter Punkten und Maximum steht der Punktezuwachs im letzten Tick, z. B. `4817 / 5000 +37 (96,3 %)`. Grün bei Zuwachs, grau bei ±0, orange bei Rückgang. Fehlen dazwischen Ticks, wird der Durchschnitt je Tick gezeigt und mit ⌀ markiert. Quelle ist die Formicarien-Statistik.

### Verbessert
- Punkte und Maximum in der Punkte-Zelle ohne Tausenderpunkt.

## 33.0 (31.10.2026)

Erste Veröffentlichung auf `main` seit dem Fork von Pepper. Die Version fasst die Änderungen von 32.0 bis 32.9 zusammen; die Einzelheiten stehen unten in den Einträgen der jeweiligen Versionen.

### Highlights
- **Abgleich per WebDAV/Nextcloud in beide Richtungen:** Ein neues Gerät holt nach *Verbindung testen* und *Jetzt abgleichen* alle Reihen auf einmal (32.3).
- **Kolonienpflege:** ehemalige Kolonien lassen sich vergessen, Kolonien nach einem Umzug (neue Spiel-ID) lassen sich mit *Kolonie umziehen* zusammenführen (32.1, 32.5).
- **Diagramm *Punkte pro Tick*** auf der Seite *openEBA-Verlauf* (32.6).
- **Zuverlässigere Zeiten:** Datum und Uhrzeit kommen aus der Serverzeit des Spiels, eine falsch gestellte Rechner-Uhr stört nicht mehr (32.8).

### Neu
- WebDAV: Reihen, die ein Gerät noch nie gesehen hat, werden über den Ordnerinhalt bzw. die Index-Dateien `eba_index_normal.tsv` / `eba_index_speed.tsv` geholt. Der automatische Lauf holt neue Reihen in Portionen (32.3).
- Vergessene Reihen werden als „vergessen“ markiert und von allen Geräten ignoriert; die Datei auf dem Server bleibt bestehen. *Vergessene Reihen wieder zulassen* hebt die Markierungen auf (32.3).
- Ehemalige Kolonien erscheinen auf der Verlaufsseite in einem eigenen Bereich und lassen sich dort lokal mit *Vergessen* löschen (32.1).
- *Kolonie umziehen / Historien zusammenführen* in der openEBA-Konfiguration, mit Prüfung (Art, Arbeiterinnen, Königinnen, zeitliche Reihenfolge) und Vorschau (32.1).
- Diagramm *Punkte pro Tick*; bei Lücken in den Daten wird der Durchschnitt über mehrere Ticks gezeigt, markiert mit einem Ring (32.6).
- Dieses Änderungsprotokoll (`CHANGELOG.md`) (32.6).

### Verbessert
- *Kolonie umziehen* behält immer die größere ID und vergisst die kleinere; die Reihenfolge der Eingabe spielt keine Rolle mehr (32.5).
- Futterbestand wird zu Tickbeginn erfasst (beim Öffnen der Detailseite bzw. unmittelbar vor dem Füttern), nicht erst nach dem Füttern. Der erste Stand eines Ticks gewinnt (32.6).
- README neu gegliedert, Tippfehler in Optionstexten korrigiert, Skriptbeschreibung ergänzt, Forum auch unter `https` ausgenommen (32.9).

### Behoben
- WebDAV: Dauerschleife mit Fehler 412 („Precondition Failed“) behoben; der Abgleich verträgt unterschiedliche ETag-Schreibweisen. Eine nicht schreibbare Reihe bricht den Abgleich nicht mehr ab, der automatische Lauf pausiert sie 15 Minuten (32.4).
- Suchhistorie funktioniert auch auf `draussen.php` mit leerem `cat`-Parameter, wohin das Spiel nach Ende einer Aktion weiterleitet (32.2).
- Falsche Rechner-Uhr führt nicht mehr zu Zeilen mit falschem Datum oder Tick (32.8).

### Hinweise zum Update
- **Backup vor dem Update:** Mehrere frühere Versionen (31.1, 31.7, 31.9) wandeln gespeicherte Daten beim ersten Start automatisch um. Vorher in der openEBA-Konfiguration die Daten über *Exportieren* sichern.
- **WebDAV:** Geräte mit älterer Skriptversion kennen die Markierungen für vergessene Reihen nicht und laden ihre Reihe höchstens wie bisher hoch. Am besten alle Geräte auf 33 aktualisieren. Details im [README](README.md).
- Wird auf einem Gerät ohne Skript gefüttert, kann weiterhin der Nachher-Zustand des Futterbestands erfasst werden (32.6).

### Einzelversionen 32.0 bis 32.9

## 32.9

### Verbessert
- Vorbereitung auf 33: README neu gegliedert (Installation, Funktionsübersicht, Daten und Datenschutz), Tippfehler in Optionstexten korrigiert, Skriptbeschreibung ergänzt, Forum auch unter https ausgeschlossen. Keine Funktionsänderung.

## 32.8

### Behoben
- Serverzeit: Datum und Uhrzeit kommen jetzt aus der Serverzeit, die das Spiel in jede Seite schreibt. Eine falsch gestellte Rechner-Uhr (auch ein falsches Datum) führt nicht mehr zu Zeilen mit falschem Datum oder Tick. Ersatz, falls nicht vorhanden: die Serverzeit im Seitenfuß, zuletzt die Rechner-Uhr.

## 32.7

### Verbessert
- Nur Dokumentation: Changelog um Version 32.6 ergänzt. Keine Funktionsänderung.

## 32.6

### Neu
- Diagramm *Punkte pro Tick* auf der Seite *openEBA-Verlauf* (zwischen *Punkte* und *Ticklänge*). Bei Lücken in den Daten wird der Durchschnitt über mehrere Ticks gezeigt, markiert mit einem Ring und dem Tooltip „Ø über N Ticks“.
- Dieses Änderungsprotokoll (`CHANGELOG.md`).

### Verbessert
- Futter zu Tickbeginn: Der Futterbestand eines Ticks wird jetzt beim Öffnen der Detailseite bzw. unmittelbar vor dem Füttern (Button, AJAX, Hotkey z/p) erfasst, sofern für den Tick noch kein Wert vorliegt. Der erste Stand gewinnt. Vorher konnte nach dem Füttern der Zustand „nachher“ gespeichert werden. Die Erfassung aus der Übersicht bleibt als Ersatz.
- Grenze: Wird auf einem Gerät ohne Skript gefüttert, kann weiterhin der Nachher-Zustand erfasst werden.

## 32.5

### Verbessert
- *Kolonie umziehen* behält immer die größere ID und vergisst die kleinere. Die Reihenfolge der Eingabe spielt keine Rolle mehr, die Auswahl zum Löschen der alten ID entfällt.

## 32.4

### Behoben
- WebDAV-Abgleich: Dauerschleife mit Fehler 412 („Precondition Failed“) behoben. Der Abgleich verträgt nun unterschiedliche ETag-Schreibweisen der Server, umgeht Zwischenspeicher und hat einen Notweg, falls eine Datei trotzdem abgelehnt wird.
- Eine nicht schreibbare Reihe bricht den Abgleich nicht mehr ab, sie wird übersprungen. Der automatische Lauf pausiert sie 15 Minuten.
- Die Fehlermeldung nennt den gesendeten ETag und die Server-Header.

## 32.3

### Neu
- **WebDAV-Abgleich in beide Richtungen:** Ein Gerät holt auch Reihen, die es noch nie gesehen hat (über den Ordnerinhalt bzw. die Index-Dateien `eba_index_normal.tsv` / `eba_index_speed.tsv`). Ein neues Gerät holt nach *Verbindung testen* mit *Jetzt abgleichen* alle Reihen auf einmal (Fortschritt „x von y Reihen“). Der automatische Lauf holt neue Reihen in Portionen.
- **Vergessene Reihen:** *Vergessen* und *Kolonie umziehen* tragen die Reihe als „vergessen“ ein. Alle Geräte ignorieren sie dann; die Datei auf dem Server bleibt bestehen. *Vergessene Reihen wieder zulassen* hebt die Markierungen auf.

> **Hinweis WebDAV:** Geräte mit älterer Skriptversion kennen die Markierungen nicht und laden ihre Reihe höchstens wie bisher hoch. Details im [README](README.md).

## 32.2

### Behoben
- `draussen.php` mit leerem `cat`-Parameter (so leitet das Spiel nach Ende einer Aktion weiter) wird als Ergebnisseite erkannt, die Suchhistorie funktioniert dort jetzt ebenfalls.

## 32.1

### Neu
- **Ehemalige Kolonien** erscheinen auf der Verlaufsseite in einem eigenen Bereich und lassen sich dort lokal mit *Vergessen* löschen (inkl. ihres WebDAV-Zustands). Aktiv sind die Kolonien, die zuletzt in der Formicarien-Übersicht standen.
- **Kolonie umziehen / Historien zusammenführen** in der openEBA-Konfiguration: führt die Historie einer alten Spiel-ID mit der neuen ID zusammen. Es gibt eine Prüfung (Art, Arbeiterinnen, Königinnen, zeitliche Reihenfolge) und eine Vorschau vor dem Zusammenführen. Die neue Reihe wird beim nächsten WebDAV-Lauf hochgeladen.

## 32.0

### Verbessert
- Versionssprung ohne eigene Funktionsänderung. Der Funktionsumfang entspricht 31.11.

## 31.11

### Verbessert
- Verlauf: Die Kopfzeile je Formicarium zeigt den Ausbruchschutz nicht mehr.
- Der Tooltip des Hunger-Diagramms zeigt Zucker und Protein getrennt. Das Diagramm zeigt eine Nachkommastelle.

## 31.10

### Neu
- Verlauf: Brut-Diagramm mit Eiern, Larven, Puppen und Gesamt sowie ein Ausbruchschutz-Diagramm je Formicarium.

### Verbessert
- *Ameisenshop-Preise färben*: neue Stufen bezogen auf den Höchstpreis: ab 95 % gelb, ab 98 % sanftes Rot, bei 100 % dunkelrot mit weißer, fetter Schrift. Der Tooltip zeigt den Prozentwert.

## 31.9

### Verbessert
- *Auswachszustand der Kolonien in Prozent anzeigen*: Der Wert steht jetzt hinter den Punkten (bzw. der maximalen Punktzahl), z.B. `4998 / 5.000 (99,9 %)`. Der Balken entfällt. Die Nestwarnung erscheint nur noch als orangefarbenes Warnzeichen mit Tooltip. Beide Anzeigen lassen sich unabhängig schalten.
- Die Verlaufsseite zeigt die Diagramme je Formicarium als eingeklappte Gruppe. Sie werden erst beim Aufklappen gezeichnet. Mit Kopfzeile (Art, ID, aktueller Stand) und *Alle auf-/zuklappen*; der Zustand gilt nur für die Sitzung.
- Suchhistorie auf `draussen.php`: je Tabelle (Ameisensuche, Futtertiersuche) ein Aufklapper nur mit den älteren, nicht mehr sichtbaren Ergebnissen, ohne Doppelanzeige. Häufigkeitsliste und Spalte „Erfasst“ sind entfallen, stattdessen gibt es kurze Summen.

### Behoben
- Ameisen- und Futtertiersuche wurden vermischt erfasst: Futterergebnisse landeten in der Ameisensuche, Ameisensuchen wurden nie gespeichert.

> **Hinweis:** Bereits falsch abgelegte Futterzeilen werden beim ersten Start automatisch in die richtige Historie verschoben (Datenmigration, Backup empfohlen).

## 31.8

### Neu
- Wachstumsphasen farbig: Anlauf (unter 24 %), Hauptphase (24–94 %), Ende (ab 94 %), ausgewachsen (100 %). Der Tooltip nennt die Phase.
- Nestwarnung: Bei einer Nestbelegung über 75 % bremst das Wachstum. In der Einzelansicht mit der Belegung laut Spiel, in der Übersicht nur als „mind. X %“, wenn schon die Arbeiterinnen allein darüber liegen. Formicarien warnen nicht.

### Verbessert
- Polygyne Arten werden nach dem Polygynierechner des Spiels berechnet (Arbeiterinnen steigen mit jeder weiteren Königin linear). Die Werte der Art-Tabelle stimmen damit überein.
- Der Tooltip der maximalen Punkte zeigt nur noch den Tabellenwert, nicht mehr die gemessenen Punkte je Arbeiterin.

## 31.7

### Behoben
- Formicarien-Statistik: Es wurden bei jedem Aufruf der Übersicht zusätzliche Zeilen für denselben Tick angelegt (Ursache: Zeitprüfung beim Start noch nicht initialisiert). Jetzt gibt es höchstens eine Zeile je Tick.
- Der Hungerwert wird korrekt aus der Fortschrittsanzeige gelesen.

### Neu
- Statistik-Spalte **Ausbruchschutz** (z.B. `PTFE 97,4`), erfasst im Hintergrundabruf der Detailseite. Die Option heißt jetzt *Futterbestand und Ausbruchschutz pro Tick festhalten*. Die Spalten „Futter erfasst“ und „Pr-Bedeutung“ sind entfallen.

> **Hinweis:** Die Daten werden beim ersten Start automatisch bereinigt (doppelte Zeilen je Tick entfernt). Backup vor dem Update empfohlen.

## 31.6

### Verbessert
- Prozentangaben (Auswachszustand, Tooltips, Belegung) werden auf eine Nachkommastelle abgeschnitten statt gerundet. 100 % erscheint nur bei erreichtem Maximum.

## 31.5

### Neu
- Detailansicht eines Formicariums: maximale Punktzahl (`x / max`), Art aus der Überschrift, und der Tooltip des Auswachszustands nutzt die vom Spiel gelieferte Belegung von Nest und Formicarium.

## 31.4

### Behoben
- `draussen.php` ohne `cat`-Parameter wird wie `cat=3` (Ergebnisse) behandelt, weil das Spiel beim ersten Aufruf automatisch diese Seite zeigt.

## 31.3

### Neu
- Option *Auswachszustand der Kolonien in Prozent anzeigen*: Arbeiterinnen im Verhältnis zu den maximalen Arbeiterinnen der Art (bei polygynen Arten mit Polygynie-Logik), in Übersicht (auch Nestbecken) und Einzelansicht. Der Tooltip zeigt, ob Nest oder Formicarium zuerst voll ist.
- Option *Verlaufsgrafiken für Geld, Punkte und Formicarien*: Beim Überfahren von *Geld* und *Punkte* in der Kopfzeile erscheint eine kleine Kurve. Ein Klick öffnet unter *Statistik* die Seite *openEBA-Verlauf* mit großen Diagrammen.

## 31.2

### Neu
- Option *Alle gespeicherten Ergebnisse unter draussen.php?cat=3 anzeigen* (standardmäßig aus): eine einklappbare Tabelle mit der gesamten gespeicherten Suchhistorie unter den Ergebnistabellen des Spiels (neueste oben, Erfassungszeit, Seitenwechsel, Zusammenfassung). Sie wird nach Neuaufbau der Seite durch das Spiel erneut angezeigt.

## 31.1

Erste Version der Fork-Entwicklung auf Basis von Version 31.

### Neu
- **Geld, Punkte, Ticklänge und Suchen werden vollständig historisiert** (Optionen *Geld, Punkte und Ticklänge historisieren* und *Futter- und Ameisensuchen vollständig historisieren*). Das Spiel zeigt nur die letzten Treffer, die Historie verschmilzt die angezeigte Tabelle mit den gespeicherten Daten. Bestehende Formicarien- und Futter-Historien bleiben unverändert, alte Werte für Punkte und Ticklänge werden als Startpunkte übernommen.
- *Historien ausdünnen, wenn sie zu groß werden* (optional, standardmäßig aus): Ab 2000 Zeilen wird aus der älteren Hälfte jede zweite Zeile entfernt.
- **Exportieren / Importieren** der Historien als JSON in der Konfiguration, mit Anzeige des Speicherverbrauchs. Der Export lässt sich auf den aktuellen Server beschränken. Beim Import wird nachgefragt, wenn die Daten von einem anderen Server stammen.
- Option *Maximale Punktzahl in der Formicarien-Übersicht anzeigen*: z.B. `12.340 / 50.000`, bei polygynen Arten mit Zuwachs je weiterer Königin (Speedserver mit anderen Werten).
- **Historien per WebDAV/Nextcloud zwischen Geräten abgleichen**: jede Zeitreihe als eigene Datei, Verbindungstest, automatischer Abgleich höchstens einmal pro Tick. Einrichtung und Grenzen im [README](README.md). Die Zugangsdaten werden nicht exportiert.
- Zweiter Knopf *Nur die Daten dieses Servers löschen*.

### Verbessert
- Der Abgleich verschmilzt Daten verlässlich und konvergent: Zwei Geräte überschreiben sich nicht mehr gegenseitig. Zeilen mit unplausiblem Zeitstempel (z.B. falsch gestellte Uhr) werden verworfen und können die Erfassung nicht mehr einfrieren.
- Das Löschen aller Daten fragt vorher nach und nennt beide Server ausdrücklich.
- Futtertabelle, Hunger-Prozente (mit Nachkommastelle) und Ameisenshop-Preise samt Einfärbung werden nach AJAX-Aktionen des Spiels (z.B. Füttern, Preisanfrage) erneut angezeigt.

### Behoben
- Normal- und Speedserver teilten sich Werte: Schema-Version, Punkte-/Stundenfenster (führte zu absurden Raten wie -983.000 Punkte/h), Shop-Preise, gemerkte Preise und gespeicherte Auswahlen sind jetzt je Server getrennt. Altwerte gehen an den Normalserver, der Speedserver startet mit leerem Fenster.
- Der Lager-Cache griff nie, weil er unter zwei verschiedenen Namen gelesen und geschrieben wurde; jetzt wird er verwendet.
- Eine unmögliche Punkte-Rate wird als „+?“ angezeigt.
- Als Speedserver gilt nur noch ein Host, der mit `speed.` beginnt (Hosts wie `speedtest.eatenbyants.de` nicht mehr).

> **Hinweis:** Beim ersten Start wird das Datenschema (Version 2) automatisch migriert, und die serverabhängigen Werte werden den Servern zugeordnet. Backup vor dem Update empfohlen. Die Zugangsdaten des WebDAV-Abgleichs liegen im Klartext im Speicher des Skriptmanagers (siehe README).

## 31

Ausgangsstand des Forks (Skript von Pepper, zuvor angepasst von &lt;?&gt;), mit den Anpassungen aus dem ersten Commit: mobile Ansicht (Notizen, Ameisenshoppreise) sowie Formicarien-Statistik mit Uhrzeit und Futterdetails pro Tick und an der Serverzeit orientierter Tick-Logik.
