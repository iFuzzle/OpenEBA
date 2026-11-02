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

## 33.39 (02.11.2026)

- Bildersuche (Entwickler-Werkzeug unter Spielhilfe → Info): 136 neue Dateinamen-Kandidaten für Ausbruchschutz, Biologie, Formicarienbau, Nestbau, zweites Bild Handwerkliches Geschick und die Jobverbesserungen Kloputz/Verhaltensforscher; der Prüf-Button ist wieder da, mit kurzer Pause zwischen den Anfragen.

## 33.38 (02.11.2026)

- Ameisenshop-Ankauf: Neue Option. Die Ankaufspreise werden je Tick festgehalten (beim stündlichen Preisabruf der Menüanzeige und bei jedem Besuch von „Ankauf“, ohne zusätzliche Abrufe). Unter der Kurstabelle steht je Art ein Diagramm (zwei nebeneinander, auf dem Handy untereinander) mit gemessenem Minimum, Maximum und der Spanne, z.B. „min. 1,00 € · max. 5,00 € · Spanne: 4,00 €“. Die Werte werden wie die anderen Verläufe exportiert und per WebDAV abgeglichen.

## 33.37 (02.11.2026)

- Formicarium-Ansicht: Unter „Formicarium wechseln“ und „Nest wechseln“ steht jetzt, welches Formicarium bzw. Nest die Art höchstens braucht (✓, wenn deins schon reicht). Neue Option, der Tooltip zeigt die Rechnung; bei Arten mit mehreren Königinnen zählt deine Königinnenzahl.

## 33.36 (02.11.2026)

- Jobs: Der Job „Verhaltensforscher für Studie gesucht“ zeigt jetzt sein Bild.
- Spielhilfe: Beim Weihnachtsmann-Job unter „Frühere Events“ steht jetzt das Bild dazu.
- Info → Abzeichen: Platz 1–3 der ASW-Statistik (gesamt und letzter Monat) mit allen drei Bildern; beim Auszug werden alle Wohnungs-Abzeichen gezeigt.
- Info → Bildersuche: zeigt nur noch die Liste, welche Forschungsbilder gefunden bzw. nicht gefunden wurden.

## 33.35 (02.11.2026)

- Spielerprofile: neue Option mit Links „← vorherige ID“ / „nächste ID →“ neben dem Spielernamen; die Option für die Tasten Q/E steuert nur noch die Tasten (dann mit „(Q)/(E)“ beschriftet).
- Spielhilfe, Jobs: „Aushilfskraft zum Regale einräumen gesucht“ vollständig – Stufe 1 8 h / 15 €, mit Gabelstaplerschein 8 h / 20 €.
- Spielhilfe, Abzeichen: ASW-Statistik (Platz 3, letzter Monat Platz 2), Marsameise, Auszug-Abzeichen je nach Wohnung.
- Bildersuche (Entwickler-Werkzeug): Varianten der ASW- und Wohnungs-Abzeichen.

## 33.34 (02.11.2026)

- Spielhilfe, Info: Abzeichen ans Ende verschoben, eingeklappt und in Originalgröße (16×16); Speedserver-Medaillen 1–4. Danksagung an seupai8969 (Peppers Skript nach dem Serverumzug wieder lauffähig gemacht).
- Spielhilfe, Jobs: Werbeplakate „je 40 Klicks auf die Werbebanner ein Job“; der 12-h-Job heißt „Verhaltensforscher für Studie gesucht“ (wird auch bei der laufenden Aktion erkannt).
- Spielhilfe, Futter: Abschnitt „Frühere Events“ (Ostern 2009–2013, Weihnachtsaktion mit Weihnachtsmann-Job).
- Spielhilfe, Ameisen: alle Stufenbild-Listen vollständig (Scan abgeschlossen, Stufen-Scan entfernt).
- Bildersuche (Entwickler-Werkzeug): neue Kandidaten für Ausbruchschutz, Biologie, Formicarien-/Nestbau, Handwerk Stufe 2 und die Bilder des Verhaltensforscher- und Weihnachtsmann-Jobs.

## 33.33 (01.11.2026)

- Spielhilfe, Futter: neue Rubrik „Relikte“ mit dem Osterei (nur während der Oster-Events 2009–2013 sammelbar, heute nur noch über Verkauf).
- Spielhilfe, Info: neuer Abschnitt „Abzeichen“ (ausgewachsene Kolonie, Größenrekord, Auszug bei den Eltern, Gabelstaplerschein, Ostereiersuche, Sponsor, Speedserver-Medaillen).
- Bildersuche (Entwickler-Werkzeug): neue Gruppen „Marsameise“ (wissenschaftlicher Name) und „Abzeichen“ (Speedserver-Medaillen).

## 33.32 (01.11.2026)

- Vier Server getrennt: Normal (`www.`/ohne www), Speed (`speed.`), Testserver Normal (`test.`) und Testserver Speed (`testspeed.`). Jeder Server hat eigene Daten, eigene WebDAV-Dateien und einen eigenen Index; Testserver Speed rechnet wie Speed (12-Minuten-Tick). Bestehende Daten von Normal und Speed bleiben unverändert. Andere Subdomains (z. B. Forum) bleiben ausgeschlossen.
- Spielhilfe, Ameisen: Bildlisten aller 35 Arten fest eingetragen (Ergebnis des Stufen-Scans); der Steckbrief lädt nur noch bestätigte Bilder, keine Fehlanfragen (404) mehr. „Allgemeines über Ameisen“ hat sein Bild (`research_allgemeinwissen.jpg`).
- Bildersuche (Entwickler-Werkzeug): Stufen-Scan prüft nur noch Unbekanntes, nacheinander mit kurzen Pausen; Halloween-Suche entfernt.
- Spielhilfe, Jobs: Pizza „Je 12* aktive Spieler pro Tick …“ und Werbeplakate „ca. 10* Abstimmungen“ mit Hinweis im openEBA-Stil, Spieltexte entfernt.

## 33.31 (01.11.2026)

- Bildersuche (Entwickler-Werkzeug): zweiter Button „Ameisen-Stufenbilder prüfen“ – prüft für alle 35 Arten die Bilder Stufe 0–15 und `_shop` (ca. 595 Anfragen, nur per Klick, abbrechbar) und liefert eine Liste zum Kopieren.

## 33.30 (01.11.2026)

- Einstellungsseite: oben „openEBA Version X“, damit man im Spiel sieht, welche Version geladen ist.
- Neue Option (Entwickler-Werkzeug): Auf Spielerprofilen mit Q / E zum vorherigen / nächsten Spieler blättern (ID −1 / +1), keine automatischen Abrufe.
- Bildersuche: bereits erfolglos geprüfte Namen entfernt (dokumentiert in `BILDERSUCHE_GEPRUEFT.md`), neue Kandidaten für die sieben unbekannten Forschungsbilder, neue Gruppe für Saisonbilder (Ostern, Halloween).
- `IDEEN.md`: Abschnitt „Vor dem Release v34“ (Bildersuche entfernen) und Winter-Skin-Idee.

## 33.29 (01.11.2026)

- Spielhilfe: Pheidologeton diversus zeigt das größte vorhandene Bild (`Pheidologeton_diversus2.jpg`).
- Neue Datei `IDEEN.md` mit Vormerkungen für spätere Versionen (u. a. Saison-Effekte mit den Winter-Titelbildern des Spiels).

## 33.28 (01.11.2026)

- Spielhilfe, Ameisen: bestätigte Bilder je Wachstumsstufe (Lasius niger, L. flavus, Formica fusca, Myrmica rubra, Camponotus herculeanus, C. ligniperda, Temnothorax nylanderi mit Haselnuss, Pheidole pallidula). Das Hauptbild zeigt die ausgewachsene Kolonie; unter Details eine Galerie „Bilder je Wachstumsstufe“, die erst beim Aufklappen lädt. Quelle: Spielerprofil mit gesammelten Bildpfaden.

## 33.27 (01.11.2026)

- Jobs/Forschungen anreichern: auch die laufende Aktion bekommt die Endzeit („[Endet Montag, 05:50]“) – auf der Internet-Startseite („Momentane Aktion“), im Arbeitsamt und in der Forschung. Laufende Jobs zeigen zusätzlich den Stundenlohn (feste Jobdauern, Speedserver ÷5). Wunsch aus der Community.

## 33.26 (01.11.2026)

- Sammlung, Profil-Export: Die Trennstriche stehen jetzt über alle drei Gruppen auf gleicher Höhe (eine gemeinsame Spaltenbreite).

## 33.25 (01.11.2026)

- Spielhilfe, Sammlung: Button „Alle Stati einlesen“ – liest das eigene Profil (Abzeichen „ausgewachsene … Kolonie“ → done, Formicarien → active) und das Lager (→ ready) und zeigt eine Vorschau; übernommen wird per Klick, nichts wird herabgestuft. Die Einzelvorschläge nutzen die Profildaten mit.
- Sammlung: Text-Import entfernt. Neuer Export fürs Spielerprofil (nur [b], [i], [center]; eine Zeile je Art), Spalten pixelgenau für die Spielschrift ausgerichtet (gemessen im Browser, aufgefüllt mit Sonder-Leerzeichen, die das Profil nicht zusammenfasst).
- Sammlung: Tooltips im openEBA-Stil (klickbar).

## 33.24 (01.11.2026)

- Spielhilfe, Ameisen: Steckbrief neu geordnet – vorne Max. Punkte, Max. Kolonie, ASW-Punkte, Verkaufspreis, Max. Nest, Max. Formi, Platzbedarf (bei Nestbecken „N + M (Nestbecken) Regalplätze“); in den Details „Polygyn“ (z. B. „20.000 A je K“), Freischaltung kurz („Exotische Arten 3“), Fundorte.
- Spielhilfe, Forschungsbaum: rechts nicht mehr abgeschnitten (Breitenberechnung korrigiert, Spaltenabstand verringert). Gabelstaplerschein-Bild fest eingetragen; neue Kandidaten für die Bildersuche.
- Spielhilfe, Jobs: Texte gekürzt (keine Job-IDs, keine Tick-Hinweise), Pizzeria Omerta mit Originaltext, Pümpel nach 200 Klos, Regale immer 8 h, Werbeplakate nach ca. 10 Abstimmungen.
- Spielhilfe, ASW: Faustformel ASW-Punkte ≈ 1,57 × ∛(Punkte). Futter: Filter „züchtbar“, Brombeerblätter über Blättersammeln, Ertrags-Verbesserung für Samen und Blätter, Dauer der Futtersuche erklärt.
- Spielhilfe, Info: Telas verlinkt, Links neu (Discord, openEBA auf GitHub, Fork von Peppers Skript).
- Tooltips im openEBA-Stil (wie in den Einstellungen) auf „Ameisen suchen“; „auch im Shop“ / „nicht im Shop“ fett.
- Lexikon → Futter: Zeilen sauber abwechselnd eingefärbt, „Schon züchtbar“.
- Neue Option „Spielhilfe überall zugänglich“ (unter „Spielhilfe im Lexikon anzeigen“): Link in der Seitenleiste jeder Seite, unter den Lesezeichen.

## 33.23 (01.11.2026)

- Spielhilfe: neuer Reiter „Sammlung“ – alle 35 Arten zum Abhaken (open → ready → active → done), mit Fortschritt, `*` für versteckte Arten, Shop-Kennzeichen und Vorschlägen aus Lager, aktiven Formicarien und ausgewachsenen Kolonien (nur per Klick übernommen). Liste als Text einfügen und als BBCode exportieren; getrennt je Server, in Export/Import und im WebDAV-Abgleich (Datei `eba_collection_ants.tsv`).
- Ameisen suchen: „Findbare Arten“ als Block mit „auch im Shop“ / „nicht im Shop“; versteckte Arten mit `*` und Tooltip.
- Lexikon → Futter: neue Zeile „Haltbarkeit“ unter der Zersetzungsrate (Ticks bis 0 % = 100 ÷ Rate, aufgerundet; für den aktuellen Server, der andere im Tooltip). Eigene Option.
- Spielhilfe, Regalplätze: Bei Lasius fuliginosus reicht das große Ytong (100 % Belegung), bremst aber am Ende stark; die Spielhilfe empfiehlt das riesige Ytong.

## 33.22 (01.11.2026)

- Spielhilfe, Regalplätze korrigiert: Bei den Nestbecken-Arten (Acromyrmex spec., A. versicolor, Polyrhachis dives) ist das Nest ein eigenes Formicarium neben dem Formicarium, unabhängig in der Größe, und belegt eigene Regalplätze (jetzt 12 statt 6). Temnothorax nylanderi: Normalfall kleines Nest + kleines Formicarium (1 Regalplatz), Haselnuss-Fund als Sonderfall in der Mini Arena (0,5). Lasius fuliginosus: großes Ytong reicht rechnerisch genau (Spielhilfe-Tabelle: riesiges Ytong), Regalplätze 0 wegen riesiger Anlage.

## 33.21 (01.11.2026)

- Spielhilfe: Regalplätze für alle 35 Arten berechnet (Platzbedarf je Arbeiterin × maximale Arbeiterinnen → kleinstes passendes Nest und Formicarium; das Formicarium zieht mit der Nestgröße nach; bei Nestbecken zählen beide Formicarien). Neue sortierbare Spalte im Vergleich mit Rechnung im Tooltip, Zeile „Benötigt“ im Steckbrief. Hinweis auf die riesige Anlage (0 Regalplätze, gewollt). Abweichungen zur Spielhilfe-Tabelle sind mit ‡ markiert, die Tabelle hat Vorrang.

## 33.20 (01.11.2026)

- Spielhilfe: neuer Reiter „ASW“ mit den Aktionen der Ameisenschutzwarte (riesige Anlage, Riesen-YTong-Nest, Käferlarven) samt Bild, Dauer, Kosten und verbrauchten ASW-Punkten; ASW-Punkte gibt es fürs Auswildern.
- Spielhilfe: Quellen klargestellt – bei Abweichungen gilt die Spielhilfe-Tabelle (Excel), das Lexikon ergänzt nur (Entwicklungszeiten, Shop-Kaufpreis, Futterliste).

## 33.19 (01.11.2026)

- Spielhilfe, Forschungsbaum: „Handwerkliches Geschick“ steht links unter „Zuckerwasser selbst herstellen“, der Baum passt ohne Seitenscrollen in die Lexikon-Spalte; Karten und Schrift etwas größer.
- Spielhilfe, Bilder: 14 im Spiel bestätigte Forschungsbilder fest eingetragen (u. a. `research_werkzeug.jpg` für Handwerkliches Geschick, `research_sugarwater.jpg`). Die Bildersuche unter Info prüft nur noch die unbekannten (Allgemeines, Ausbruchschutz, Biologie, Formicarienbau, Nestbau und die drei Jobverbesserungen einzeln).
- Spielhilfe: Forschungsbaum vollständig gegen die Spielhilfe-Tabelle geprüft (keine Abweichungen). Klargestellt: „Körner und Samen sammeln“ gibt es ab Futtertiere Stufe 6, die Forschung Samensammeln erhöht nur den Ertrag.
- Spielhilfe, Vergleich: Filter „Alle / im Shop kaufbar / nicht im Shop“ (Shop-Arten sind ebenfalls findbar). Steckbriefe zeigen die Fundorte.
- Neue Option: Auf „Ameisen suchen“ steht bei jedem Suchort, welche Arten dort laut Spielhilfe findbar sind.

## 33.18 (01.11.2026)

- Kolonie-Verlauf: Arbeiterinnen und Punkte in einem Diagramm (Punkte auf eigener rechter Achse), direkt darunter neu der Punktezuwachs je Tick (bei Lücken Durchschnitt je Tick, Nulllinie). Untertitel nennt die fehlenden Punkte bis zum Maximum und wie lange die Kolonie schon ohne Zuwachs ist – hilft zu entscheiden, ob sich das Weiterwachsen noch lohnt.
- README auf den aktuellen Stand gebracht.

## 33.17 (01.11.2026)

- Spielhilfe, Jobs: Der 12-h-Job (30 €) nach der Verhaltensforscher-Forschung ist ein eigener Job, keine Vorstufe der Biologie-Exkursion (20 h, 50 €).

## 33.16 (01.11.2026)

- Zeilen löschen (🗑, „Datentabellen“ im Verlauf) und „↻ aktuellen Tick neu erfassen“ sind ausgeblendet. Einblenden über die Browser-Konsole, siehe README (*Falsche Einträge korrigieren*). Der Abgleich bereits gelöschter Zeilen läuft weiter.

## 33.15 (01.11.2026)

- Formicarien-Übersicht: Link „↻ aktuellen Tick neu erfassen“ unter der Überschrift. Verwirft (nach Rückfrage) die Statistik- und Futterzeilen des aktuellen Ticks aller Kolonien und erfasst sie nach dem Neuladen frisch, z. B. nach einem falschen Eintrag. Verworfen wird nur genau diese Fassung der Zeile (per WebDAV auch auf anderen Geräten), die neu erfasste bleibt.

## 33.14 (01.11.2026)

- Das Skript läuft nur noch auf `eatenbyants.de`, `www.eatenbyants.de` und `speed.eatenbyants.de`; auf dem Testserver (`test.eatenbyants.de`) und anderen Subdomains tut es nichts mehr und speichert nichts.
- Einzelne Zeitzeilen löschen (🗑 mit Rückfrage): im openEBA-Verlauf unter „Datentabellen“ (standardmäßig alle Reihen dieses Zeitpunkts), in der Kolonie-Tabelle und bei den älteren Suchergebnissen. Gelöschte Zeilen werden per WebDAV auf allen Geräten gelöscht und kommen durch den Abgleich nicht zurück (Datei `eba_rowdel_list.tsv`).
- Spielhilfe, Bilder: Keine automatischen Probe-Anfragen mehr. Unter Info → Bildersuche einmalig per Button prüfen, Ergebnis zum Kopieren.
- Spielhilfe, Jobs: Dauer des Klojobs = ein Tick (1 h normal, 12 min Speed), andere Jobs ein Vielfaches; Speedserver-Werte rechnen die Dauern um. Die Länge unterscheidet die Jobs, der Lohn die Stufen; 12-h-Job als vermutliche Vorstufe der Exkursion gekennzeichnet.

## 33.13 (01.11.2026)

- Spielhilfe, Forschungsbaum: von oben nach unten aufgebaut, mehr Abstand, Stufen-Plaketten direkt an der Zielkarte; bei schmaler Spalte seitlich scrollbar.
- Spielhilfe, Bilder: Der Browser probiert je Forschung mehrere mögliche Dateinamen und merkt sich den Treffer (Futtertiere: `research_futter.jpg`); unter Info → „Bildersuche“ steht, was gefunden wurde und was fehlt.
- Spielhilfe, Jobs: nach echter Arbeitsamt-Seite und Spielhilfe-Tabelle korrigiert – Museumsjob ist „Museum sucht versierten Myrmekologen“ (Ameisen finden und bestimmen Stufe 4), danach Verhaltensforscher-Forschung mit neuem Job (12 h, 30 €); Pizza mit Pümpel 25 €; Werbeplakate durch Abstimmen für EBA; Klo dauert 1 Tick; Job-IDs auf den Karten.
- Spielhilfe: Hinweis, dass sich die Angaben auf eine Königin beziehen; Futter-Reiter mit den drei Sammelarten der Futtersuche.

## 33.12 (31.10.2026)

- Spielhilfe, Wohnungen: in Spielreihenfolge (Zimmer bei den Eltern, Schuppen, Dachboden, Hochhaus, Haus, Schloss), zusätzlich sortierbar nach Punkten, Preis, Plätzen und € je Platz.
- Spielhilfe, Jobs: alle 10 Jobstufen als Karten mit Bild, Dauer, Lohn, Stundenlohn und Freischaltung (Klos putzen mit Pümpel, Pizza ausfahren, Regale einräumen mit Gabelstaplerschein, Museum bis „versierter Myrmekologe“, Werbeplakate kleben, Biologie-Exkursion). Fehlende Werte als „unbekannt“.
- Spielhilfe, Futter: sortier- und filterbar (Futterart, Shop), Shop-Packungen mit Preis und Preis pro g; `&ndash;` wurde als Text angezeigt (behoben, auch in den Ameisen-Steckbriefen); Zuckerwasser, Mehlwürmer und Grassamen sind von Beginn an im Shop.
- Spielhilfe, Vergleich: Spalten ASW-Punkte, ASW/Tag, ASW/Tag/Platz und ASW je € Kaufpreis.
- Spielhilfe, Info: Dank an Telas, Links zu GitHub und Discord; tote Links (Forum-Backup, Polygynierechner-Sheet) entfernt; Schlusszeile „Danke an Martin für EBA!“.

## 33.11

### Verbessert
- Spielhilfe:
  - Der Menüpunkt heißt nur noch *openEBA: Spielhilfe*. Der Hinweis auf Community-Daten steht auf der Seite selbst.
  - Der Reiter *Shopameisen* heißt jetzt *Vergleich* und umfasst alle Arten. Oben lässt sich umschalten zwischen *Alle*, *kaufbar (Shop)* und *nur findbar*, dazu kommt ein Filter nach Kategorie. Werte, die nur für Shopameisen bekannt sind (Tage, Regalplatz, Preise, Punkte bzw. Geld pro Tag), stehen bei findbaren Arten als „–“.
  - Sortieren: Ein zweiter Klick auf dieselbe Spalte kehrt die Richtung um, ▲/▼ zeigt sie an. „–“ steht immer am Ende. Die Steckbriefe haben einen Knopf für auf- oder absteigend.
  - Die Wohnung im Hochhaus hat jetzt ein Bild.

## 33.10

### Behoben
- Zeitzone: Alle Zeiten sind jetzt unabhängig von Zeitzone und Uhr des Rechners, z. B. beim Spielen im Urlaub. Die Serverzeit der Seite wird ausdrücklich als deutsche Zeit (inkl. Sommerzeit) gelesen, gespeichert wird eine weltweit eindeutige Zeit, angezeigt wird immer deutsche Zeit. Ein Gerät im Ausland erzeugt beim WebDAV-Abgleich mit einem Gerät in Deutschland kein endloses Hin und Her mehr. Bereits gespeicherte Daten aus Deutschland bleiben unverändert gültig.

## 33.9

### Verbessert
- Endzeit beim Suchen: wird immer ab dem Seitenaufruf gerechnet, nicht mehr ab dem Ende einer laufenden Aktion. Im Spiel läuft ohnehin nur eine Aktion gleichzeitig.
- Ausbruchschutz in der Übersicht: sichtbar nur noch der Wert, z. B. `97,4 %`. Die Art steht im Tooltip. Läuft für die Kolonie noch ein Abruf, steht ein ⏳ hinter dem Wert statt des Textes „wird aktualisiert …“.

## 33.8

### Verbessert
- WebDAV-Abgleich mit Serverzeit statt Rechner-Uhr:
  - Sperren, Wartezeiten und die Anzeige „Letzter Abgleich“ laufen jetzt nach Serverzeit.
  - Die Zeitstempel der Lösch-Marker („vergessen“ und „wieder zulassen“) sind auf allen Geräten vergleichbar. Bei zwei Geräten gewinnt die zeitlich spätere Aktion, auch wenn eine Rechner-Uhr falsch geht.
  - Rückwärtskompatibel: Das Indexformat ist unverändert. Geräte mit älterer Version und vorhandene Index-Dateien funktionieren weiter. Gespeicherte Sperren aus der Rechner-Uhr führen nicht zu Dauersperren.

## 33.7

### Neu
- Option *Spielhilfe im Lexikon anzeigen (Community-Daten)*: Im Lexikon steht unter den Kategorien der neue Punkt **openEBA: Spielhilfe** mit dem Hinweis „Community-Daten, nicht vom Spielbetreiber“. Er enthält acht Reiter:
  - **Ameisen:** Steckbriefe aller Arten mit Bild, Filter und Sortierung, Details mit Platzbedarf, Fundorten, Futter und Entwicklungszeiten, dazu ein Polygynie-Rechner und eine Bildergalerie der Entwicklungsstufen.
  - **Shopameisen:** Punkte und Geld pro Tag, auch je Regalplatz.
  - **Wohnungen.**
  - **Forschungsbaum:** als Grafik und als Stufentabellen.
  - **Ziele & Bonus.**
  - **Jobs.**
  - **Futter.**
  - **Info:** Wachstumshinweise und Danksagungen.
  
  Ein Schalter zeigt die Werte des Speedservers. Die Bilder lädt das Skript vom Spielserver, die Daten stammen aus der Community-Spielhilfe.
- Ameisen- und Futtersuche: In der Auswahl der Dauer steht hinter jeder Option die voraussichtliche Endzeit, z. B. `8:00:00 → morgen 07:53`. Läuft gerade eine Aktion, wird ab deren Ende gerechnet. Die Anzeige nutzt die Serverzeit und aktualisiert sich jede Minute. Gehört zur Option *Jobs/Forschungen mit Informationen anreichern*.

## 33.6

### Verbessert
- Ausbruchschutz in der Übersicht: Ein Wert aus einem früheren Tick ist immer blass und kursiv dargestellt, auch während der neue Wert noch abgerufen wird. Der Tooltip nennt dann zusätzlich „wird aktualisiert …“. Sobald der Wert des aktuellen Ticks da ist, erscheint die Zeile normal.

## 33.5

### Verbessert
- Formicarien-Übersicht: Der Link *Statistik* unter jeder Kolonie ist ersetzt durch drei Links:
  - **Verlauf** öffnet die Seite *openEBA-Verlauf* mit dieser Kolonie aufgeklappt.
  - **CSV** lädt die Statistik als Datei für Excel herunter (Semikolon, Dezimalkomma).
  - **Tabelle** öffnet das bisherige Textfeld zum Kopieren.
- Seite *openEBA-Verlauf*: Jede Formicarium-Gruppe hat in der Kopfzeile einen CSV-Link.
- Einheitlich Serverzeit statt Rechner-Uhr: Endzeit „[Endet …]“ bei Jobs und Forschung, Zeitraumfilter der Seite *openEBA-Verlauf* und der Kurve im Header, Stunden-Cache der Ameisenshop-Preise, Punkte pro Stunde, Sperre des Lager-Abrufs und Zeitstempel im Export. Zwei Browser im selben Tick verhalten sich damit gleich. Das Punkte-pro-Stunde-Fenster wird nach dem Update einmal neu befüllt („+?“, bis zwei Stunden vorliegen).
- *Ausbruchschutz in der Formicarien-Übersicht anzeigen*: Der Prozentbalken ist eine eigene Option (*… mit Prozentbalken*, Standard aus). Ohne sie steht nur der Wert, z. B. `97,4 % PTFE`.

### Behoben
- Mit *Bookmarks einblenden* stand *openEBA-Verlauf* im Statistik-Menü hinter den Bookmarks. Er steht jetzt immer direkt unter *openEBA*.
- Ausbruchschutz in der Übersicht: Die Zeile aktualisiert sich jetzt, sobald der Hintergrundabruf den neuen Wert geliefert hat. Bisher blieben Kolonien, die noch nicht abgerufen waren, blass und kursiv. Während ein Abruf läuft, ist die Zeile neutral dargestellt. Ein hängender Abruf blockiert die Warteschlange nicht mehr. Balken und Text brechen nicht mehr um.

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
