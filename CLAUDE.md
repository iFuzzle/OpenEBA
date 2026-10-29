# Regeln für Claude-Sitzungen

## Branches

- **Niemals auf `main` arbeiten oder nach `main` pushen**, es sei denn, der Nutzer genehmigt das ausdrücklich in der jeweiligen Sitzung.
- Änderungen werden auf dem eigenen, der Sitzung zugewiesenen Branch (`claude/...`) entwickelt, committet und gepusht.
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
