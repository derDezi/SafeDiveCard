# EmergencyCardDiving - Projektdokumentation

## Zweck
Dieses Dokument sammelt alle gemeinsam erarbeiteten Inhalte:
- Konzepte
- Namensideen
- Entscheidungen
- Installationsanleitungen
- Offene Punkte

## Aktueller Stand
- Projektstart am 2026-03-03.
- Im Verzeichnis gefunden: `project/references/Vorlage.pdf`.
- PDF-Inhalt kann jetzt automatisiert ausgelesen werden.

## Installation / Setup
### Ziel
PDF-Dateien lokal per Skript auslesen.

### Installierte Komponenten
- Python 3.12 (lokale Installation unter `C:\Users\Timo\AppData\Local\Programs\Python\Python312\python.exe`)
- Python-Paket `pypdf` (Version 6.7.5)

### Verwendeter Installationsbefehl
```powershell
& "$env:LocalAppData\Programs\Python\Python312\python.exe" -m pip install --user pypdf
```

## Vorlage.pdf - Auslesecheck
- Seitenzahl: 1
- Extrahierter Text auf Seite 1: 1430 Zeichen
- Status: Erfolgreich ausgelesen

### Inhalt (Kurzfassung)
- Dokumenttyp: Notfallkarte / Emergency Card fuer Tauchgang
- Enthalten: Tauchort, Basis-Kontakte, geplante Tauchgaenge, Personendaten, Vorerkrankungen, Medikamente, Notfallkontakte, Versicherungsdaten

## Naechste Schritte
- Inhalte aus `Vorlage.pdf` strukturiert in Projektanforderungen ueberfuehren.
- Erste Projektziele und Funktionsumfang definieren.

## Projektvision (Stand 2026-03-03)
- Ziel: Oeffentliches Webtool, mit dem Taucher eine Notfallkarte als PDF erzeugen koennen.
- Eingabedaten:
- Taucherdaten aus einer strukturierten, systemunabhaengigen Datei (bevorzugt Textformat, z. B. JSON oder CSV).
- Angaben zum Tauchplatz durch den Nutzer.
- Automatisierung:
- So viele Informationen wie moeglich zum Tauchplatz automatisch ermitteln (z. B. Basisdaten, Notruf-relevante Angaben, Standortinfos soweit verfuegbar).
- Ausgabe:
- PDF-Export in einem mitfuehrbaren Format (analog zur bestehenden Notfallkarte).
- Verfuegbarkeit:
- Oeffentlich nutzbar, damit moeglichst viele Taucher eine Notfallkarte mitfuehren.

## Namensideen (englisch, einfach, Tauchbezug)
- DiveCard
- DiveReady Card
- SafeDive Card
- DiveEmergency Card
- BuddyEmergency Card
- DiveRescue Card
- DiveSafe PDF
- EmergencyDive Card

## Name - Erste Empfehlung
- `DiveCard`
- Grund: Sehr kurz, klar verstaendlich, direkter Bezug zu Tauchen + Karte.

## Finaler Projektname
- `SafeDiveCard`
- Entscheidung am 2026-03-03 getroffen.

## Umsetzungsplan (Startempfehlung)
### Phase 1 - Fundament (MVP-Definition)
- Exaktes Zielformat der PDF festlegen (Abschnitte/Felder, Layout, Pflichtfelder).
- Datenmodell definieren (Taucher, Tauchplatz, Notfallkontakte, Versicherung, medizinische Angaben).
- Austauschformat fuer strukturierte Textdatei festlegen: `JSON` (UTF-8) als Standard.

### Phase 1 - Fortschritt
- JSON-Schema erstellt: `server/safedivecard.schema.json`
- JSON-Beispieldatei erstellt: `project/samples/safedivecard.example.json`
- Beide Dateien bilden die technische Basis fuer Dateiimport, Validierung und spaeteren PDF-Export.

## Dateiformat (v1.0)
### Schluesselstruktur
- `meta`: Version, Sprache, Erstellungsdatum
- `dive_site`: Tauchplatzdaten inkl. optionaler Koordinaten
- `plan`: geplanter Tauchrahmen (Zusammenfassung, maximale Tiefe)
- `divers`: Liste mit einem oder mehreren Tauchern

### Validierungsziel
- Pflichtfelder sind im Schema als `required` definiert.
- Zusaetzliche unbekannte Felder werden bewusst geblockt (`additionalProperties: false`), um saubere und vorhersagbare Daten fuer den PDF-Generator sicherzustellen.

### Phase 2 - Webtool Grundfunktionen
- Einfaches Webformular fuer alle Felder aufbauen.
- Import von `JSON`-Dateien (Taucherdaten) implementieren.
- Validierung fuer Pflichtfelder und Plausibilitaet (z. B. Telefonnummern, Tiefe, Alter).

### Phase 2 - Fortschritt (MVP Start)
- Erste lauffaehige Web-App erstellt:
- `server/index.html` (UI-Struktur)
- `server/app.css` (Layout/Print-Styling)
- `server/app.js` (Import, Formularbindung, Vorschau, JSON-Export, PDF-Export via Browser-Print)
- Unterstuetzte MVP-Funktionen:
- JSON-Datei importieren
- Daten im Formular bearbeiten
- Notfallkarte als Live-Vorschau anzeigen
- JSON wieder exportieren
- PDF per `Export PDF` (Browser-Dialog -> Als PDF speichern)

### Phase 2 - Fortschritt (Erweiterung)
- UI erweitert fuer mehrere Taucher:
- Dynamisches Hinzufuegen/Entfernen von Tauchern im Formular.
- Vorschau/PDF zeigt alle Taucher in einer tabellarischen `Who`-Sektion.
- PDF-Layout angenaehert an die Vorlage:
- Klare Sektionen `Where`, `What`, `Who`
- Tabellenrahmen mit druckfreundlicher Darstellung
- Header im Notfallkarten-Stil
- Standortvorschau erweitert:
- Kartenvorschau auf Basis von OpenStreetMap in der `Where`-Sektion.
- Kartenvorschau wurde spaeter in einen separaten Bereich oberhalb der A4-Card-Preview verschoben (Screen-only), damit der Druckexport fokussiert bleibt.
- Zusaetzliche Koordinatenfelder (`Latitude`, `Longitude`) im Formular.
- Adressauflösung ueber Button `Locate Address` (Nominatim/OSM) fuer praeziseren Marker.
- Koordinatenanzeige als Dezimalgrad.
- Koordinaten werden auf 5 Nachkommastellen gerundet (praktischer Bereich um wenige Meter, Genauigkeit haengt von Quelldaten ab).
- Mehrsprachigkeit (UI + Export) umgesetzt:
- Englisch ist immer die Basissprache.
- Optional zusaetzliche Landessprache: `Deutsch` oder `Spanisch`.
- Ausgabeformat ist bei aktivierter Zusatzsprache zweisprachig (`English / Local`).
- Exportlayout deutlich an Vorlage angenaehert:
- Linke Abschnittsleiste (`Where/What/Who`) im Kartenstil.
- `Who` als transponierte Tabelle (Merkmal links, Taucher als Spalten) fuer bessere Drucklesbarkeit.
- A4-Print-CSS mit optimierter Schriftgroesse, Abstaenden und Seitenlayout.

## Sprachmodell (v1.0)
- `meta.language`: immer `en`
- `meta.auto_local_language`: automatische Landessprache aus Tauchort-Land (`country_code`)
- `meta.optional_extra_language`: optionale Zusatzsprache

## Sprachlogik (aktuell)
- Ausgabe basiert auf `EN + Auto-Local + Optional Extra`.
- Auto-Local wird bei `Locate Address` aus Geokodierung abgeleitet.
- Fuer Aegypten (`country_code=eg`) wird aktuell `Arabic (ar)` als Local-Sprache gesetzt.
- Laender-Override vorhanden:
- `country_override_enabled`: standardmaessig `true`
- `country_override_code`: optionales Land fuer erzwungene Local-Sprache
- Bei aktivem Override hat Override Vorrang vor Auto-Local.
- UI-Beschriftungen nutzen nur `EN + Optional Extra`.
- Die Ziellandsprache (Auto-Local) wird nur im Export/der Card ausgegeben.
- Verarbeitete Zusatzsprachen: `DE`, `ES`, `AR`, `FR`, `IT` (FR/IT mit nachgezogenem Label-Set fuer UI und Export).

## Sprachstrategie (Best Practice Umsetzung)
- Englisch bleibt die feste Basissprache.
- Landessprache des Tauchortes wird automatisch aus dem Land (`country_code`) abgeleitet.
- Optionale Zusatzsprache kann manuell ausgewaehlt werden.
- Ergebnisprinzip: `EN + Auto Local + Optional Extra`.
- Bei noch nicht fertig uebersetzten Sprachen: kontrollierter Fallback auf Englisch.

## Weitere Ideen (nur dokumentiert, noch nicht umgesetzt)
- Nach dem PDF-Export einen Hinweis anzeigen, wie man dem Entwickler ein `DecoBeer` ausgeben kann.
- Nach dem PDF-Export Empfehlung fuer eine wasserdichte Huelle fuer den Ausdruck anzeigen (inkl. Amazon-Ref-Link).
- Export-Footer erweitern: Projekt-Website als Linktext + QR-Code zur Website.
- Optionales Feature: Routenplanung von der Divesite-Adresse zur naechsten Druckkammer (Chamber) und daraus eine Abschaetzung der voraussichtlich benoetigten Notfallsauerstoff-Menge.

## Mehrseiten-Export (A4)
- Ziel: Ausgabe als DIN A4.
- Umsetzung: Bei mehr als 2 Tauchern wird die `Who`-Tabelle automatisch in weitere Seiten aufgeteilt.
- Erste Seite enthaelt `Where` + `What` + erste `Who`-Tabelle, weitere `Who`-Bloecke beginnen mit Seitenumbruch.
- Drucklayout auf randnahen A4-Export angepasst (`@page margin: 0`; echte Randlosigkeit bleibt druckerabhaengig).
- Uebergaenge zwischen Header/`Where`/`What`/`Who` sind nahtlos (kein Trennbalken zwischen Sektionen).
- PDF-Dateiname im Speicherdialog: `SafeDiveCard-[DiveSite]-[YYYY-MM-DD]` (ueber Dokumenttitel gesteuert).
- Export-Headertitel bleibt einzeilig; bei zu langem mehrsprachigen Text wird die Schrift automatisch verkleinert.
- `Where/What/Who`-Seitenleiste verbreitert und zentriert.
- Angaben im `Who`-Tabellenbereich fuer Taucherwerte zentriert.

## UI Redesign (Stand)
- Sticky-Aktionsleiste mit den Hauptaktionen.
- A4-Preview-Rahmen, damit der Export schon in der UI wie ein Druckdokument wirkt.
- Tool-Theme in dunklem Farbschema umgesetzt (`#041823`, `#072D3F`, `#007C8A`, `#C93030`, `#0E3A4E`).
- Mehrsprachige Labeldarstellung in der Card-Preview: jede Sprache in eigener Zeile, nicht-englische Zeilen kursiv (Ausnahme: Hauptueberschrift oben bleibt einzeilig).
- Lesbarkeit der A4-Preview korrigiert (Card-Textfarbe fest auf dunkel gesetzt).
- Linke Abschnittsleiste (`Where/What/Who`) unterstuetzt mehrzeilige Sprachdarstellung.
- Arabische Uebersetzungen deutlich erweitert (Formular- und Exportlabels).
- Arabische Export-Zeilen haben RTL-Mikrolayout fuer bessere Lesbarkeit.
- Tool-Header mit `Header.png`: Logo links neben dem Titelblock, Hoehe dynamisch an Titel + Untertitel gekoppelt.
- Preview-Bereich strukturiert: oben `Map`, darunter `Card Preview`.
- Preview-Bereich erweitert: oberhalb von `Card Preview` ein `Export`-Abschnitt.
- Tool-Header vergroessert (Titel/Untertitel groesser) und Logo links neben dem Titelblock.
- Export-Panel visuell staerker hervorgehoben.
- Ueberschriften von rechter Spalte vereinheitlicht (`Export`, `Map`, `Card Preview` als H2).
- Reihenfolge rechte Spalte angepasst: `Map` ueber `Export`.
- Ueberschriften `Map`/`Export` stehen oberhalb der jeweiligen Boxen (wie bei `Card Preview`).
- Statusrahmen (rot/gruen) im Export-Bereich entfernt.
- Rechte Spalte nutzt jetzt drei vollwertige Panels: `Map`, `Export`, `Card Preview`.
- Initiale Karten-Startadresse wird aus dem Herkunftsland des Aufrufs vorbelegt (Browser-Region als Startwert).
- Input-Begriffe fuer Taucher verstaendlicher:
- `Import JSON` -> `Load Dive Data`
- `Export JSON` -> `Save Dive Data`
- `Locate Address` direkt an der Adresszeile positioniert.
- Sprachbereich vereinfacht:
- Ueberschrift `Languages`
- Override-Checkbox entfernt
- Feld klarer benannt als lokale Sprache am Divesite-Land mit optionaler Ueberschreibung.
- Feld fuer Zusatzsprache benannt als `Anzeigesprache / optionale Zusatzsprache`.
- Hinweis unter Koordinaten: automatische Befuellung via `Locate Address`.
- `Add Diver` ans Ende der Taucherliste verschoben.
- Neues Eingabefeld `Divers in Group` eingefuehrt (unabhaengig von der Anzahl ausgefuellter Taucherformulare).
- Formular-Header angepasst:
- `Input` mit rechtsbuendig platzierten Buttons `Load Dive Data` und `Save Dive Data`.
- Ueberschriftenstil fuer `Input`, `Languages` und `Dive Site` an `Export`/`Map` angeglichen.
- Status- und Fehlermeldungen neu aufgeteilt:
- Laufende Infos (z. B. erfolgreicher Import, aufgeloeste Adresse) im Statusbereich am Seitenende.
- Fehler werden als Notification/Toast ausgegeben (statt als statischer Text im Formularbereich).
- Teilimporte/-exporte erweitert:
- Dive Data (vollstaendig): `Load Dive Data` / `Save Dive Data`.
- Dive Site separat: `Load Dive Site Data` / `Save Dive Site Data`.
- Diver separat: `Load Diver Data` plus `Save Diver Data` pro Diver-Eintrag.
- `Load Diver Data` fuegt importierte Taucher an bestehende Eintraege an (Append), statt sie pauschal zu ueberschreiben.
- JSON-Dateinamen vereinheitlicht:
- Dive Data: `SafeDiveCard-Dive-[DiveSiteName]-[YYYY-MM-DD].json`
- Dive Site: `SafeDiveCard-Site-[DiveSiteName].json`
- Diver: `SafeDiveCard-Diver-[FullName].json`
- DiveSite erweitert:
- Feld `Local Emergency Number` im Formular und im Export.
- Nummer wird aus dem per Adresse ermittelten Land (`country_code`) gesetzt.
- Sicherheitsregel: Nur verifizierte Nummern werden gesetzt; falls keine verifizierte Zuordnung vorliegt, bleibt das Feld leer.
- Technische Basis:
- Vollstaendige ISO-Laenderliste in der App vorhanden.
- Verifizierte Nummern in separatem Mapping; kein blindes `112`-Fallback.
- Export-Hinweis prominent und zentriert:
- `Make sure to send a digital copy of this PDF to your dive buddies via email or WhatsApp before the dive.`

## Dateisortierung (Deployment vs. lokal)
### Auf Webserver (Produktivbetrieb)
- `server/index.html`
- `server/app.css`
- `server/app.js`
- `server/assets/Header.png` (Headergrafik fuer Card-Header)
- Optional: `server/safedivecard.schema.json` (wenn Client-seitige oder externe Validierung darueber laufen soll)

### Nur lokal fuer Projekt/Entwicklung
- `project/docs/Projektdokumentation.md` (Arbeitsdokumentation)
- `project/samples/safedivecard.example.json` (Test- und Demo-Daten)
- `project/references/Vorlage.pdf` (Referenzdokument)
- `project/references/Screenshot 2026-03-03 142026.png` (Vergleich/Designabstimmung)
- `project/references/Screenshot 2026-03-03 142109.png` (Vergleich/Designabstimmung)

## Startanleitung (lokal)
1. Datei `server/index.html` im Browser oeffnen.
2. Optional `project/samples/safedivecard.example.json` ueber `Load Dive Data` laden.
3. Daten anpassen.
4. `Export PDF` klicken und im Browser als PDF speichern.

### Phase 3 - Automatische Ermittlung Tauchplatzdaten
- Eingabe: Name/Adresse/Koordinaten des Tauchplatzes.
- Automatisch ergaenzen: Adresse, Hoehe, ggf. lokale Notruf-/Standortinfos (je nach API-Verfuegbarkeit).
- Manuelle Ueberschreibung immer erlauben.

### Phase 4 - PDF-Export
- PDF-Template analog zur Vorlage umsetzen.
- Export als druckbares, mobil mitfuehrbares Dokument.
- Test mit realen Beispieldaten (mehrere Taucher, unterschiedliche Szenarien).

### Phase 5 - Oeffentliche Bereitstellung
- Deployment als oeffentliches Webtool.
- Datenschutzhinweise und sichere Verarbeitung (keine unnoetige Datenspeicherung).

