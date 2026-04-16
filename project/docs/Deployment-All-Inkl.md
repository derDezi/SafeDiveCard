# Deployment zu All-INKL

Dieses Projekt ist eine statische Website. Fuer das Deployment wird nur der Ordner `server/` auf den Webspace hochgeladen.

## Dateien

- Deploy-Skript: `scripts/deploy-allinkl.ps1`
- Lokale Konfiguration: `deploy/all-inkl.config.json`
- Vorlage: `deploy/all-inkl.config.example.json`

## Vorbereitung

1. `deploy/all-inkl.config.example.json` nach `deploy/all-inkl.config.json` kopieren.
2. Die Werte fuer `host`, `username`, `password` und `remotePath` eintragen.
3. `protocol` auf `ftps` lassen, sofern dein All-INKL-Zugang FTPS erlaubt.
4. Bei `ftps` nutzt das Skript explizites FTP ueber Port 21 mit TLS, so wie ALL-INKL es dokumentiert.

## Testlauf

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-allinkl.ps1 -DryRun
```

## Deployment

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-allinkl.ps1
```

## Hinweise

- Die Datei `deploy/all-inkl.config.json` ist in `.gitignore` eingetragen und wird nicht ins Repository committed.
- Das Skript ueberschreibt vorhandene Dateien mit demselben Namen.
- Nicht mehr benoetigte Dateien auf dem Webspace werden mit diesem einfachen Deploy nicht automatisch geloescht.
- Wenn deine Domain auf einen Unterordner zeigt, muss `remotePath` genau auf diesen Zielordner zeigen.
