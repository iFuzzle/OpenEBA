# openEBA

Erweiterungen für das Browserspiel [EatenByAnts](https://eatenbyants.de) als Tampermonkey-Userskript: mehr Übersicht in Formicarien, Kleinanzeigen und Nachrichten, lückenlose Verläufe und ein paar Komfortfunktionen. Alle Funktionen sind einzeln in der Konfiguration schaltbar.

Basierend auf dem OpenEBA Userskript von Pepper, zuvor angepasst von &lt;?>. Die Version, die ich hier forke liegt unter https://pastebin.com/raw/MZkjZPUW#.user.js

## Installation und Update

1. [Tampermonkey](https://www.tampermonkey.net/) im Browser installieren.
2. Skript über die Raw-URL öffnen, Tampermonkey bietet die Installation an:
   - **Stabil (`main`):** https://raw.githubusercontent.com/iFuzzle/OpenEBA/refs/heads/main/OpenEBA.js
   - **Beta (`beta`):** https://raw.githubusercontent.com/iFuzzle/OpenEBA/refs/heads/beta/OpenEBA.js
3. Updates holt Tampermonkey nur, wenn die `@version` im Skriptkopf höher ist als die installierte. Ein Update lässt sich in Tampermonkey auch von Hand anstoßen.
4. **Vor jedem Update** die Daten sichern: Konfiguration öffnen (Statistik-Seite → *openEBA*) und *Exportieren* drücken. Manche Versionen wandeln gespeicherte Daten beim ersten Start um (siehe [CHANGELOG.md](CHANGELOG.md)).

Die Konfiguration steht auf der Statistik-Seite des Spiels unter *openEBA*. Die Optionsnamen unten entsprechen den Beschriftungen dort.

## Funktionen

### Formicarien
- *Formicarien-Statistik*: Pro Tick eine Zeile je Formicarium (Eier, Larven, Puppen, Ameisen, Punkte, Hunger). In der Übersicht stehen unter jeder Kolonie drei Links: *Verlauf* (Seite *openEBA-Verlauf* mit dieser Kolonie), *CSV* (Download für Excel) und *Tabelle* (Textfeld zum Kopieren). Dieselben Links stehen in der Einzelansicht unter den Hungerleisten.
- *Futterbestand und Ausbruchschutz pro Tick festhalten*: Ergänzt die Statistik um Futtertabelle und Ausbruchschutz.
- *Ausbruchschutz in der Formicarien-Übersicht anzeigen*: Zeile *Ausbruchschutz* unter Hunger bzw. Pilzstatus mit dem Wert aus dem letzten Tick (z.B. `97,4 %`, Art im Tooltip), unter 20 % orange, unter 10 % rot; ein älterer Wert ist blass und kursiv. Mit *… mit Prozentbalken* (Standard aus) zusätzlich als Balken.
- *Auswachszustand der Kolonien in Prozent anzeigen*: Zeigt, wie weit die Kolonie ausgewachsen ist, mit Wachstumsphase und Warnung bei Nestbelegung über 75 %.
- *Maximale Punktzahl in der Formicarien-Übersicht anzeigen*: Zeigt hinter den Punkten die erreichbare Maximalpunktzahl der Art und den Punktezuwachs im letzten Tick (z.B. `4817 / 5000 +37`; fehlen Ticks dazwischen, der Durchschnitt je Tick mit ⌀).
- *Formicarium-Einzelansicht: höchstens benötigtes Formicarium bzw. Nest anzeigen*: Unter „Formicarium wechseln“ und „Nest wechseln“ steht, was die Art höchstens braucht (Platzbedarf × maximale Arbeiterinnen, bei polygynen Arten mit deiner Königinnenzahl); Symbol dahinter: ↑ = deins ist zu klein, ⚠ = größer als nötig (belegt unnötig Regalplätze), ? = bei mehreren Königinnen unklar, kein Symbol = passt genau. Der Tooltip zeigt die Rechnung.
- *Hunger-Prozente mit Nachkommastelle*: Genauere Hungeranzeige.
- *Fütterformular über die Futtertabelle schieben*: Das Formular steht direkt bei der Futtertabelle.
- *Mit v und n (bzw. q und e) zwischen Formicarien navigieren, mit z bzw. p füttern*: Tastaturbedienung der Einzelansicht.
- *Dialog 'Futtertierzucht einrichten' an den Anfang der Seite schieben* und *Dialog 'Formicarium einrichten' an den Anfang der Seite schieben*: Kürzere Wege auf den Einrichtungsseiten.
- *Ameisen im Lager zusammenfassen* und *Nester und Formicarien im Lager nach Größe statt alphabetisch ordnen*: Übersichtlicheres Lager.
- *Inventar in der Seitenleiste anzeigen*: Zeigt ausgewählte Lager-Items links im Menü (Begriffe pflegbar, Ameisen mit `@Art`).
- *Lagerbestand je Tick festhalten*: Speichert einmal pro Tick das Lager (Futter in Gramm je Sorte, Zubehör, Formicarien und Nester, Möbel, Ameisen je Art), höchstens ein Abruf pro Tick und Server.

### Statistik und Verlauf
- *Geld, Punkte und Ticklänge historisieren*: Hält je Tick Geld, Punkte und Ticklänge fest.
- *Verlaufsgrafiken für Geld, Punkte und Formicarien*: Kurven in der Kopfzeile und die Seite *openEBA-Verlauf* mit Diagrammen (u.a. Punkte pro Tick, Brut, Hunger, Ausbruchschutz). Mit dem Lagerbestand kommt ein einklappbarer Bereich *Lager* dazu: Futtervorrat nach Art (Zucker, Körner, Blätter, Protein, je mit Einzelsorten) und Zubehör. Jede Kolonie hat einen CSV-Link.
- *Statistik verbessern*: 1.000er-Trennzeichen und Tooltips mit Differenz zu den eigenen Punkten und Punkten pro Stunde.
- *Historien ausdünnen, wenn sie zu groß werden*: Optional, entfernt bei großen Reihen alte Messpunkte (nicht mit dem WebDAV-Abgleich kombinierbar).

### Kleinanzeigen und Shop
- *Kleinanzeigen filtern*: Blendet Angebote und Anbieter nach eigenen Suchbegriffen aus.
- *Auswahllisten in den Kleinanzeigen nach Kategorie filtern*: Die Auswahlliste passt sich der gewählten Unterkategorie an.
- *Formular in den Kleinanzeigen über die Tabelle schieben*: Das Suchformular steht oberhalb der Tabelle.
- *Selektierte Kleinanzeigen-Einträge nach oben schieben*: Gewählte Einträge stehen am Tabellenanfang.
- *Gleichartige Kleinanzeigen-Einträge zusammenfassen* und *Nur das jeweils erste Angebot eines Verkäufers anzeigen (Sortierung beachten!)*: Kürzere Listen.
- *Kleinanzeigen-Einträge trennen*: Optische Trennung der Zeilen.
- *Preise im Shop wiederverwenden*: Merkt Preise für den nächsten Besuch.
- *Ameisenshop-Preise immer zeigen* und *Ameisenshop-Preise färben*: Preise im Menü, eingefärbt nach Nähe zum Höchstpreis.
- *Ankaufspreise des Ameisenshops festhalten und als Diagramme zeigen*: Hält die Preise von *Ameisenshop → Ankauf* je Tick fest (beim stündlichen Preisabruf der Menüanzeige und bei jedem Besuch der Seite, ohne zusätzliche Abrufe). Unter der Kurstabelle erscheint je Art ein Diagramm, zwei nebeneinander (auf dem Handy untereinander), darunter gemessenes Minimum, Maximum und Spanne, z.B. `min. 1,00 € · max. 5,00 € · Spanne: 4,00 €`; Zeitraum wählbar. Die Reihe wird wie die anderen Verläufe exportiert und per WebDAV abgeglichen.
- *Alle Auswahllisten sortieren und zusammenfassen*: Alphabetisch sortiert, gleiche Einträge mit Anzahl.

### Draußen und Suchen
- *Jobs/Forschungen mit Informationen anreichern*: Bei Ameisen- und Futtersuche steht in der Auswahl der Dauer die voraussichtliche Endzeit (z.B. `8:00:00 → morgen 07:53`), gerechnet ab Seitenaufruf nach Serverzeit.
- *Findbare Arten bei den Suchorten anzeigen (Ameisen suchen)*: Bei jedem Suchort steht eine Zeile *Findbare Arten* laut Community-Spielhilfe (nicht vom Spielbetreiber, evtl. unvollständig; Shop-Arten getrennt, versteckte Arten mit `*`), ohne zusätzliche Abrufe.
- *Futter- und Ameisensuchen vollständig historisieren*: Speichert alle Ergebnisse statt nur der letzten Treffer.
- *Alle gespeicherten Ergebnisse unter draussen.php?cat=3 anzeigen*: Zeigt ältere Treffer als einklappbare Tabelle unter den Ergebnissen des Spiels.

### Nachrichten
- *Option zum Markieren von Kleinanzeigen-Nachrichten einblenden*: Markiert Nachrichten aus den Kleinanzeigen.
- *Gleichartige Nachrichten zusammenfassen*: Gleicher Absender und Betreff werden eine Zeile.
- *Nachrichten nach Absendern filtern*: Blendet Nachrichten bestimmter Absender aus.

### Lexikon
- *Haltbarkeit der Futter im Lexikon anzeigen*: Unter *Zersetzungsrate* (lexikon.php?cat=4) die Zeile *Haltbarkeit*: Ticks, bis die Frische 0 % erreicht (100 % ÷ Rate, aufgerundet), für den aktuellen Server; der Tooltip zeigt die Rechnung und den Wert des anderen Servers.
- *Spielhilfe im Lexikon anzeigen (Community-Daten)*: Zusätzlicher Menüpunkt *openEBA: Spielhilfe* unter lexikon.php (nicht vom Spielbetreiber, Daten überwiegend aus der Community-Spielhilfe, Angaben je Königin). Standardmäßig aus. Reiter:
  - *Ameisen*: Steckbriefe mit Bildern (Hauptbild = ausgewachsene Kolonie) und Filtern. Vorne Max. Punkte, Max. Kolonie, ASW-Punkte, Verkaufspreis, Max. Nest und Formicarium sowie Platzbedarf in Regalplätzen; in den Details Polygynie (Rechner), Freischaltung, Fundorte, Futter, Entwicklungszeiten und eine Galerie der Bilder je Wachstumsstufe (lädt erst beim Aufklappen).
  - *Vergleich*: alle Arten, umschaltbar zwischen *Alle*, *im Shop kaufbar* und *nicht im Shop*, mit Kategorie-Filter; Punkte und Geld pro Tag, Regalplätze, ASW-Spalten. Sortierbar (zweiter Klick kehrt um).
  - *Wohnungen*: in Spielreihenfolge, sortierbar nach Punkten, Preis, Plätzen und € je Platz.
  - *Forschungsbaum*: als Grafik und als Stufentabellen.
  - *Ziele & Bonus*, *Jobs* (Karten mit Dauer, Lohn, Stundenlohn, Freischaltung; auch der Weihnachtsmann-Job), *ASW* (Aktionen der Ameisenschutzwarte mit Kosten und ASW-Punkten) und *Futter* (sortier- und filterbar, Shop-Packungen mit Preis pro g, Rubrik *Relikte* mit dem Osterei, Abschnitt *Frühere Events*).
  - *Sammlung*: alle 35 Arten zum Abhaken (open → ready → active → done) mit Fortschritt. *Alle Stati einlesen* liest Profil (ausgewachsene Kolonien) und Lager aus und zeigt eine Vorschau; übernommen wird per Klick, nichts wird herabgestuft. Export fürs Spielerprofil (BBCode). Getrennt je Server, in Export/Import und im WebDAV-Abgleich enthalten.
  - *Abzeichen*: bekannte Abzeichen nach Gruppen (Kolonien, Top 3 der Statistik, ASW, Sonstige).
  - *Info*: Quellen und Hinweise. Die Bilder lädt das Skript vom Spielserver.
  - Ein Schalter zeigt die Werte des Speedservers.
- *Spielhilfe überall zugänglich*: Link *openEBA: Spielhilfe* in der Seitenleiste jeder Seite, unter den Bookmarks (setzt die Spielhilfe im Lexikon voraus).

### Komfort
- *Auto-Reload ausschalten*: Keine automatische Neuladung nach Ende eines Jobs oder einer Forschung.
- *Am Ende des Countdowns einen Sound abspielen*
- *Jobs/Forschungen mit Informationen anreichern*: Stundenlohn und Dauer; bei den Suchen die Endzeit in der Auswahl der Dauer. Die laufende Aktion (Startseite „Momentane Aktion“, Arbeitsamt, Forschung) zeigt ihre Endzeit, laufende Jobs zusätzlich den Stundenlohn.
- *Forschungsstufe um 1 verringern*: Korrigiert die angezeigte Stufe.
- *Auf Spielerprofilen zur vorherigen/nächsten ID blättern (Links)*: Links *vorherige ID* / *nächste ID* neben dem Spielernamen, ohne automatische Abrufe. Die Tasten Q / E für dasselbe sind eine eigene Option (Entwickler-Werkzeug).
- *Notizblock*: Lokaler Notizblock.
- *Bookmarks einblenden*: Eigene Links im Navigationsmenü.
- *GUI anpassen*: Breiten, kein Zeilenumbruch in den Kleinanzeigen, Meldungen im Kopf.
- *Schnee*: Dekoration.
- Versionsanzeige: Oben auf der Einstellungsseite steht „openEBA Version X“.

### Daten und Sync
- *Historien per WebDAV/Nextcloud zwischen Geräten abgleichen*: Gleicht die Verläufe mehrerer Geräte ab (siehe unten).
- *Exportieren* / *Importieren*: Sichert und überträgt die Daten als JSON.
- *Kolonie umziehen / Historien zusammenführen*: Führt die Historie einer alten Spiel-ID mit der neuen zusammen.
- *Falsche Einträge korrigieren* (versteckt): Einzelne Zeitzeilen löschen (🗑 im openEBA-Verlauf unter „Datentabellen“, in der Kolonie-Tabelle und bei älteren Suchergebnissen) und „↻ aktuellen Tick neu erfassen“ in der Formicarien-Übersicht. Normalerweise nicht nötig, daher ausgeblendet. Einblenden: auf eatenbyants.de die Browser-Konsole öffnen (F12 → Konsole) und `localStorage.setItem("eba_tickedit", "1")` eingeben, Seite neu laden. Ausblenden: `localStorage.removeItem("eba_tickedit")`. Die Einstellung gilt je Browser und Server (normal/speed getrennt). Gelöschte Zeilen bleiben gelöscht, auch per WebDAV auf den anderen Geräten.
- *Bildersuche* (Entwickler-Werkzeug, versteckt): einblenden mit `localStorage.setItem("eba_bildersuche", "1")` (Spielhilfe → Info), ausblenden mit `localStorage.removeItem("eba_bildersuche")`.

## Daten und Datenschutz

- Alle Daten liegen lokal im Speicher von Tampermonkey. Ohne WebDAV-Abgleich verlassen sie den Browser nicht.
- Das Skript läuft auf vier Servern, die vollständig getrennt gespeichert werden (Historien, Preise, Auswahlen, Sammlung): Normal (`eatenbyants.de`, `www.eatenbyants.de`), Speed (`speed.eatenbyants.de`), Test (Normal) (`test.eatenbyants.de`) und Test (Speed) (`testspeed.eatenbyants.de`). Die Test-Server rechnen wie ihr Gegenstück (Tick 60 bzw. 12 Minuten). Auf anderen Subdomains (z.B. `forum.`) tut es nichts und speichert nichts. Die bisherigen Daten von Normal und Speed bleiben unverändert.
- Zeiten richten sich nach der Uhr des Spielservers (deutsche Zeit), nicht nach Uhr oder Zeitzone des PCs. Alle Zeitangaben erscheinen in deutscher Zeit, auch wenn der PC z.B. im Urlaub auf eine andere Zeitzone gestellt ist; Daten verschiedener Geräte passen so zusammen. Das gilt auch für Endzeiten, Zeitraumfilter, Punkte pro Stunde und den WebDAV-Abgleich.
- *Exportieren* / *Importieren* sichert und überträgt die Daten (optional nur für den aktuellen Server). Die WebDAV-Zugangsdaten sind nicht enthalten.
- *Nur die Daten dieses Servers löschen* und *Alle gespeicherten Daten löschen* setzen zurück, jeweils mit Rückfrage.

## Abgleich der Historien per WebDAV (z.B. Nextcloud)

Wer auf mehreren Geräten oder Browsern spielt, erfasst auf jedem nur, was dessen Tab mitbekommt. Mit der Option *Historien per WebDAV/Nextcloud zwischen Geräten abgleichen* landet jede Zeitreihe als eigene Datei in einem WebDAV-Ordner (`eba_hist_money.tsv`, `eba_statistic_17.tsv`, `eba_food_17.tsv`, ...) und wird mit den lokalen Daten verschmolzen. Lokal geht dabei nie etwas verloren.

### Einrichtung

1. In Nextcloud einen eigenen Ordner anlegen, z.B. `openEBA`.
2. Zugang wählen, in dieser Reihenfolge:
   - **Empfohlen:** den Ordner per Link freigeben, *Hochladen und Bearbeiten erlauben*, am besten mit Passwort und Ablaufdatum. Ordner-URL ist dann `https://<host>/public.php/webdav/`, Benutzer ist der Freigabe-Token (der letzte Teil des Freigabelinks), Passwort das Freigabe-Passwort. Mit diesen Zugangsdaten kommt man an genau diesen einen Ordner.
   - Sonst ein eigener Nextcloud-Nutzer (z.B. `eba-sync`) mit kleinem Kontingent und einem App-Passwort. Ordner-URL `https://<host>/remote.php/dav/files/eba-sync/openEBA/`.
   - **Nicht** das eigene Konto: ein App-Passwort des Hauptkontos öffnet alle Dateien, Kalender und Kontakte.
3. In der openEBA-Konfiguration (Statistik-Seite → *openEBA*) unter *Abgleich der Historien per WebDAV* Ordner-URL, Benutzer und Passwort eintragen und **Verbindung testen** drücken. Tampermonkey fragt dabei einmal, ob das Skript den Host erreichen darf: *Immer erlauben*. Das ist auf jedem Gerät einmal nötig.
4. Oben die Option einschalten. Der automatische Abgleich läuft höchstens einmal pro Tick, nach Ende des Ticks, und erst nachdem auf dem Gerät ein Verbindungstest geklappt hat. *Jetzt abgleichen* gleicht sofort alle Reihen ab.

Am Skript muss nichts geändert werden. Nur ein Skriptmanager, der fremde Hosts hart blockt statt nachzufragen, braucht im Skriptkopf eine Zeile `// @connect <host>` – die geht beim nächsten Skript-Update verloren.

### Gut zu wissen

- **Die Zugangsdaten liegen im Klartext** im Speicher des Skriptmanagers, damit auch in dessen Backups und Cloud-Sync. Deshalb die Freigabe mit kleinem Wirkungskreis. Im Export der openEBA-Daten stehen sie nicht, und ein Import kann sie nicht setzen.
- Gelöschte Zeilen (siehe *Falsche Einträge korrigieren*) stehen in der Datei `eba_rowdel_list.tsv` und werden so auf allen Geräten gelöscht; der Abgleich bringt sie nicht zurück.
- Abgeglichen werden nur Zeitreihen, und zwar nur die des aktuellen Spielservers. Optionen, Filter, Bookmarks und Notizen nie.
- **Die Kompaktierung verträgt sich nicht mit dem Abgleich** (ausgedünnte Zeilen kämen vom anderen Gerät zurück). Solange sie an ist, ist der Abgleich gesperrt.
- Remote-Dateien, die nicht nach openEBA-Daten aussehen (z.B. eine Login-Seite), werden weder verschmolzen noch überschrieben. *Ungültige Remote-Dateien überschreiben* ersetzt sie nach Rückfrage durch den lokalen Stand. Dateien mit einem neueren Speicherschema bleiben unangetastet – dann dieses Skript aktualisieren.
- Sperren, Wartezeiten und die Anzeige „Letzter Abgleich“ laufen nach Serverzeit, nicht nach der PC-Uhr.
- Zeilen mit unplausiblem Zeitstempel (z.B. von einem Gerät mit falsch gestellter Uhr) werden beim Abgleich verworfen und nicht hochgeladen.
- Nach 401/403 hält der automatische Abgleich an, bis ein Verbindungstest oder ein manueller Abgleich klappt (Nextcloud sperrt sonst nach wiederholten Fehlanmeldungen die IP). Netz- und Serverfehler pausieren ihn 5, 15, dann 60 Minuten.
- Wird lokal *Nur die Daten dieses Servers löschen* gedrückt, holt der nächste Abgleich die Reihen aus der Cloud zurück.
- **Zwei-Wege-Abgleich:** Ein Gerät holt auch Reihen, die es noch nie gesehen hat. Dazu fragt jeder Lauf zuerst den Ordnerinhalt ab (WebDAV-`PROPFIND`, Tiefe 1) und liest die Index-Datei `eba_index_normal.tsv`, `eba_index_speed.tsv`, `eba_index_test.tsv` bzw. `eba_index_testspeed.tsv`. Jedes Gerät trägt dort seine Reihen ein; das ist der Ersatz, falls der Server `PROPFIND` verbietet (Verbindungstest zeigt, was geht). Ein neues Gerät holt nach *Verbindung testen* mit *Jetzt abgleichen* alle Reihen auf einmal (Fortschritt „x von y Reihen“). Der automatische Lauf holt noch nie abgeglichene Reihen in Portionen (bis zu rund 45 Requests je Tick) und fragt das Inventar höchstens alle 30 Minuten.
- **Vergessene Reihen (Tombstones):** *Vergessen* (ehemalige Kolonien) und *Kolonie umziehen* (alte ID löschen) tragen die Reihe als „vergessen“ in die Index-Datei ein. Alle Geräte ignorieren sie dann: weder holen noch hochladen. Die Datei der Reihe wird nie vom Server gelöscht, und ein Gerät, das die Reihe noch lokal hat, behält sie. Kennt ein Gerät das Formicarium noch als aktiv, ignoriert es den Marker. *Vergessene Reihen wieder zulassen* hebt alle Marker auf. Geräte mit älterer Skriptversion kennen die Marker nicht; sie laden ihre Reihe höchstens wie bisher hoch. Die Zeitstempel der Marker richten sich nach der Serverzeit des Spiels, nicht nach der PC-Uhr: auch bei falsch gehender PC-Uhr gewinnt die zuletzt ausgeführte Aktion (Geräte mit älterer Skriptversion stempeln noch mit ihrer PC-Uhr).

## Änderungen

Änderungen je Version: siehe [CHANGELOG.md](CHANGELOG.md).

## Entwicklung

Entwickelt wird auf eigenen `claude/...`-Branches, danach auf `beta`. Nach Prüfung wird nach `main` freigegeben. Regeln siehe [CLAUDE.md](CLAUDE.md).
