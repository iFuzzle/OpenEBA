# Ideen und Vormerkungen

Gesammelte Ideen für spätere Versionen (v35+), die noch nicht umgesetzt sind. Erledigtes steht im [CHANGELOG](CHANGELOG.md).

## Saison-Effekte (v35)

Zusätzlich zum bestehenden Schnee-Effekt (Option *Schnee*) jahreszeitliche Effekte einbauen, auch wenn es im Spiel keine Events mehr gibt.

- **Winter-/Weihnachts-Titelbilder:** Das Spiel hat Spezial-Titelbilder `https://www.eatenbyants.de/img/winter/winter01.png` bis `winter27.png` (27 Dateien). Zusammen mit dem Schnee-Effekt als winterlicher Kopfbereich nutzbar.
  Quelle der Liste: Spielerprofil https://www.eatenbyants.de/profil.php?id=39267
- **Winter-Skin:** Im Dezember je Tag das Bild `img/winter/winterNN.png` (NN = Tag des Monats, ggf. bis 27) im Kopfbereich rechts neben dem Logo einblenden (Bereich zwischen Logo und Statusbox im `#header`), zusammen mit dem Schnee-Effekt; eigene Option. Ostern und Halloween analog, sobald passende Bilder bekannt sind (bekannt: Abzeichen `img/awards/osterei.png` und Futter `img/items/food_osterei.jpg`; Titelbilder für Ostern nicht gefunden, geprüfte Namen in `BILDERSUCHE_GEPRUEFT.md`).
- Die Dezember-Events kommen laut Community automatisch (2024 gab es einen Adventskalender im Spiel) – vor einem eigenen Winter-Skin erst abwarten, was das Spiel im Dezember selbst zeigt.
- Weitere Jahreszeiten (Frühling, Sommer, Herbst, Ostern) als Ideen offen; Bilder dafür sind noch nicht bekannt (Ostern-Titelbilder nicht gefunden; Halloween gab es im Spiel nicht).

## Offen nach v34

- **Auswachsprognose:** dW/dt = r·W·b, r ≈ 0,0052/h bei Stufe 12, Bremse ab 81 %, Restzeit-Formeln; braucht noch Daten für Pheidole und Camponotus.
- **Verkaufserlös im Lager:** Erlös ≈ Punkte·(0,084 + 0,013·Grundpreis) für L. niger; offen: Skalierung mit der Koloniegröße, Einfluss des Nests.
- **Job-Anzeige Pizza/ASW im Menü** (Idee eines anderen Spielers); Variante ohne Hintergrundabruf: Angebot beim Besuch der Jobseite merken.
- **Fundorte aus eigenen Funden** (siehe unten, vertagt).
- **Polygynie-Zuwachs auf dem Speedserver** (siehe unten, vertagt).
- **Fehlende Forschungsbilder:** Bildersuche-Kandidaten im Spiel prüfen.
- **Bildersuche entfernen?** Entscheidung offen (derzeit versteckt, nur per Konsole einblendbar).
- **Profil-Blättern (Links und Q/E):** Beibehalten vom Nutzer noch zu bestätigen.
- **Winter-Skin** (Dezember beobachten) und Saison-Effekte (siehe oben).
- **Unbekannte Spieldaten:** Weihnachtsmann-Job, Werbeplakate stapelbar, Brut-Platzbedarf, Speed-Abzeichen ab Stufe 5.

## Bilder

- Für noch nicht erforschte oder entdeckte Arten nutzt das Spiel `https://www.eatenbyants.de/img/lexikon/notfindable.jpg`.
- Manche Arten haben keine größeren Stufenbilder (z. B. Pheidologeton diversus: `Pheidologeton_diversus2.jpg` auch bei 8 Königinnen und 275.000 Arbeiterinnen).
- Die Stufenbilder aller 35 Arten sind vollständig bekannt (Stufen-Scan abgeschlossen, Ergebnis in `ebaShAntImgs` und `BILDERSUCHE_GEPRUEFT.md`).
