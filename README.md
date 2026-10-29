# OpenEBA
Basierend auf dem OpenEBA Userskript von Pepper, zuvor angepasst von &lt;?>. Die Version, die ich hier forke liegt unter https://pastebin.com/raw/MZkjZPUW#.user.js

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
- **Vergessene Reihen (Tombstones):** *Vergessen* (ehemalige Kolonien) und *Kolonie umziehen* (alte ID löschen) tragen die Reihe als „vergessen“ in die Index-Datei ein. Alle Geräte ignorieren sie dann: weder holen noch hochladen. Die Datei der Reihe wird nie vom Server gelöscht, und ein Gerät, das die Reihe noch lokal hat, behält sie. Kennt ein Gerät das Formicarium noch als aktiv, ignoriert es den Marker. *Vergessene Reihen wieder zulassen* hebt alle Marker auf. Geräte mit älterer Skriptversion kennen die Marker nicht; sie laden ihre Reihe höchstens wie bisher hoch.

Änderungen je Version: siehe [CHANGELOG.md](CHANGELOG.md).
