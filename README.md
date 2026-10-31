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
- *Formicarien-Statistik*: Pro Tick eine Zeile je Formicarium (Eier, Larven, Puppen, Ameisen, Punkte, Hunger), kopierbar nach Excel und Co.
- *Futterbestand und Ausbruchschutz pro Tick festhalten*: Ergänzt die Statistik um Futtertabelle und Ausbruchschutz.
- *Auswachszustand der Kolonien in Prozent anzeigen*: Zeigt, wie weit die Kolonie ausgewachsen ist, mit Wachstumsphase und Warnung bei Nestbelegung über 75 %.
- *Maximale Punktzahl in der Formicarien-Übersicht anzeigen*: Zeigt hinter den Punkten die erreichbare Maximalpunktzahl der Art.
- *Hunger-Prozente mit Nachkommastelle*: Genauere Hungeranzeige.
- *Fütterformular über die Futtertabelle schieben*: Das Formular steht direkt bei der Futtertabelle.
- *Mit v und n (bzw. q und e) zwischen Formicarien navigieren, mit z bzw. p füttern*: Tastaturbedienung der Einzelansicht.
- *Dialog 'Futtertierzucht einrichten' an den Anfang der Seite schieben* und *Dialog 'Formicarium einrichten' an den Anfang der Seite schieben*: Kürzere Wege auf den Einrichtungsseiten.
- *Ameisen im Lager zusammenfassen* und *Nester und Formicarien im Lager nach Größe statt alphabetisch ordnen*: Übersichtlicheres Lager.
- *Inventar in der Seitenleiste anzeigen*: Zeigt ausgewählte Lager-Items links im Menü (Begriffe pflegbar).

### Statistik und Verlauf
- *Geld, Punkte und Ticklänge historisieren*: Hält je Tick Geld, Punkte und Ticklänge fest.
- *Verlaufsgrafiken für Geld, Punkte und Formicarien*: Kurven in der Kopfzeile und die Seite *openEBA-Verlauf* mit Diagrammen (u.a. Punkte pro Tick, Brut, Hunger, Ausbruchschutz).
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
- *Alle Auswahllisten sortieren und zusammenfassen*: Alphabetisch sortiert, gleiche Einträge mit Anzahl.

### Draußen und Suchen
- *Futter- und Ameisensuchen vollständig historisieren*: Speichert alle Ergebnisse statt nur der letzten Treffer.
- *Alle gespeicherten Ergebnisse unter draussen.php?cat=3 anzeigen*: Zeigt ältere Treffer als einklappbare Tabelle unter den Ergebnissen des Spiels.

### Nachrichten
- *Option zum Markieren von Kleinanzeigen-Nachrichten einblenden*: Markiert Nachrichten aus den Kleinanzeigen.
- *Gleichartige Nachrichten zusammenfassen*: Gleicher Absender und Betreff werden eine Zeile.
- *Nachrichten nach Absendern filtern*: Blendet Nachrichten bestimmter Absender aus.

### Lexikon
- *Spielhilfe im Lexikon anzeigen (Community-Daten)*: Zusätzlicher Menüpunkt *openEBA: Spielhilfe* unter lexikon.php (nicht vom Spielbetreiber, Daten aus der Community-Spielhilfe): Ameisen-Steckbriefe mit Bildern, Filter und Sortierung, Shopameisen-Vergleich, Wohnungen, Forschungsbaum als Grafik, Forschungsziele und -bonus, Jobs, Futter. Standardmäßig aus.

### Komfort
- *Auto-Reload ausschalten*: Keine automatische Neuladung nach Ende eines Jobs oder einer Forschung.
- *Am Ende des Countdowns einen Sound abspielen*
- *Jobs/Forschungen mit Informationen anreichern*: Stundenlohn und Dauer; bei den Suchen die Endzeit in der Auswahl der Dauer.
- *Forschungsstufe um 1 verringern*: Korrigiert die angezeigte Stufe.
- *Notizblock*: Lokaler Notizblock.
- *Bookmarks einblenden*: Eigene Links im Navigationsmenü.
- *GUI anpassen*: Breiten, kein Zeilenumbruch in den Kleinanzeigen, Meldungen im Kopf.
- *Schnee*: Dekoration.

### Daten und Sync
- *Historien per WebDAV/Nextcloud zwischen Geräten abgleichen*: Gleicht die Verläufe mehrerer Geräte ab (siehe unten).
- *Exportieren* / *Importieren*: Sichert und überträgt die Daten als JSON.
- *Kolonie umziehen / Historien zusammenführen*: Führt die Historie einer alten Spiel-ID mit der neuen zusammen.

## Daten und Datenschutz

- Alle Daten liegen lokal im Speicher von Tampermonkey. Ohne WebDAV-Abgleich verlassen sie den Browser nicht.
- Normalserver und Speedserver sind vollständig getrennt (Historien, Preise, Auswahlen).
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
- Abgeglichen werden nur Zeitreihen, und zwar nur die des aktuellen Spielservers. Optionen, Filter, Bookmarks und Notizen nie.
- **Die Kompaktierung verträgt sich nicht mit dem Abgleich** (ausgedünnte Zeilen kämen vom anderen Gerät zurück). Solange sie an ist, ist der Abgleich gesperrt.
- Remote-Dateien, die nicht nach openEBA-Daten aussehen (z.B. eine Login-Seite), werden weder verschmolzen noch überschrieben. *Ungültige Remote-Dateien überschreiben* ersetzt sie nach Rückfrage durch den lokalen Stand. Dateien mit einem neueren Speicherschema bleiben unangetastet – dann dieses Skript aktualisieren.
- Zeilen mit unplausiblem Zeitstempel (z.B. von einem Gerät mit falsch gestellter Uhr) werden beim Abgleich verworfen und nicht hochgeladen.
- Nach 401/403 hält der automatische Abgleich an, bis ein Verbindungstest oder ein manueller Abgleich klappt (Nextcloud sperrt sonst nach wiederholten Fehlanmeldungen die IP). Netz- und Serverfehler pausieren ihn 5, 15, dann 60 Minuten.
- Wird lokal *Nur die Daten dieses Servers löschen* gedrückt, holt der nächste Abgleich die Reihen aus der Cloud zurück.
- **Zwei-Wege-Abgleich:** Ein Gerät holt auch Reihen, die es noch nie gesehen hat. Dazu fragt jeder Lauf zuerst den Ordnerinhalt ab (WebDAV-`PROPFIND`, Tiefe 1) und liest die Index-Datei `eba_index_normal.tsv` bzw. `eba_index_speed.tsv`. Jedes Gerät trägt dort seine Reihen ein; das ist der Ersatz, falls der Server `PROPFIND` verbietet (Verbindungstest zeigt, was geht). Ein neues Gerät holt nach *Verbindung testen* mit *Jetzt abgleichen* alle Reihen auf einmal (Fortschritt „x von y Reihen“). Der automatische Lauf holt noch nie abgeglichene Reihen in Portionen (bis zu rund 45 Requests je Tick) und fragt das Inventar höchstens alle 30 Minuten.
- **Vergessene Reihen (Tombstones):** *Vergessen* (ehemalige Kolonien) und *Kolonie umziehen* (alte ID löschen) tragen die Reihe als „vergessen“ in die Index-Datei ein. Alle Geräte ignorieren sie dann: weder holen noch hochladen. Die Datei der Reihe wird nie vom Server gelöscht, und ein Gerät, das die Reihe noch lokal hat, behält sie. Kennt ein Gerät das Formicarium noch als aktiv, ignoriert es den Marker. *Vergessene Reihen wieder zulassen* hebt alle Marker auf. Geräte mit älterer Skriptversion kennen die Marker nicht; sie laden ihre Reihe höchstens wie bisher hoch. Die Zeitstempel der Marker richten sich nach der Serverzeit des Spiels, nicht nach der PC-Uhr: auch bei falsch gehender PC-Uhr gewinnt die zuletzt ausgeführte Aktion (Geräte mit älterer Skriptversion stempeln noch mit ihrer PC-Uhr).

## Änderungen

Änderungen je Version: siehe [CHANGELOG.md](CHANGELOG.md).

## Entwicklung

Entwickelt wird auf eigenen `claude/...`-Branches, danach auf `beta`. Nach Prüfung wird nach `main` freigegeben. Regeln siehe [CLAUDE.md](CLAUDE.md).
