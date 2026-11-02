# Regeln für Claude-Sitzungen

## Branches

- **Niemals auf `main` arbeiten oder nach `main` pushen**, es sei denn, der Nutzer genehmigt das ausdrücklich in der jeweiligen Sitzung.
- Änderungen werden auf dem eigenen, der Sitzung zugewiesenen Branch (`claude/...`) entwickelt, committet und gepusht.
- Major-Versionen (z. B. `34.0`) setzt ausschließlich der Nutzer von Hand. Claude-Sitzungen erhöhen nur die letzte Stelle (z. B. `34.0` → `34.1`) und tragen nie selbst eine neue Major-Version ein.
- Danach werden die Änderungen in den Branch `beta` übernommen und nach `beta` gepusht:
  ```sh
  git fetch origin beta
  git checkout -B beta origin/beta
  git merge <eigener-branch>
  git push origin beta
  ```
- Wird der Push nach `beta` abgelehnt (parallele Sitzung war schneller): `git fetch origin beta`, `origin/beta` einmergen, Konflikte auflösen, erneut pushen. Kein Force-Push auf `beta`.
- Der Nutzer prüft `beta` und gibt selbst nach `main` frei.
- Bei jedem Push nach `beta` die `// @version` im Kopf von `OpenEBA.js` erhöhen (letzte Stelle +1, z. B. `31.1` → `31.2`), sonst erkennt Tampermonkey kein Update. Maßgeblich ist die höchste Version auf `origin/beta`; bei einem Merge-Konflikt in dieser Zeile die höhere Version nehmen und nochmals +1.
- `CHANGELOG.md` wird bei jedem Push nach `beta` ergänzt.

## Arbeitsweise

- Die Hauptsitzung orchestriert nur; Umsetzung, Tests, Merges und Pushes erledigen Sonnet-Subagenten (Haiku für einfache Lese-/Prüfaufgaben).
- Höchstens EIN Agent arbeitet gleichzeitig an `OpenEBA.js` und pusht nach `beta`; parallel laufen nur reine Lese-/Analyseaufgaben.
- Tests: Arbeitsordner `/home/user/eba-work/` (außerhalb des Repos, siehe `UEBERGABE.md` dort). Kernsatz (`tests/run_all.sh`, ca. 10 s) einmal direkt vor dem Push nach `beta`, mit eigener Skriptkopie `b_<kürzel>.js`. WebDAV-Tests (`--webdav`) nur bei Änderungen an Abgleich, Index, Löschliste, Dateinamen oder Serverpräfixen. Keine Warteschleifen (`until`/`sleep`), Zeitlimit je Test.
- Versionen: nur die letzte Stelle erhöhen (Major-Regel siehe oben). Reine Doku-Änderungen ohne Skriptänderung dürfen ohne Versionssprung nach `beta` (Ausnahme des Nutzers).
- Datenvorrang: echte Spieldaten (Lexikon/Spielseiten) > Spielhilfe-Excel > Annahmen. Unbekanntes als „unbekannt“ kennzeichnen, nichts erfinden. Excel/CSV/Bilder nie ins Repo.
- Spielhilfe-Texte: keine Spieltexte in Karten, keine Quellenhinweise in Tooltips, Tooltips im openEBA-Stil (`ebaTip`).
- Keine Hintergrundabrufe an den Spielserver ohne Rücksprache; neue Funktionen nutzen vorhandene Abrufe.
