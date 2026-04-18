# EmergencyCardDiving - Projektdokumentation

## Merker / offene Idee
- Das mobile Design sollte grundlegend ueberarbeitet werden. Der aktuelle Fokus lag bisher auf Desktop und A4-Export.
- Eine mobile App fuer SafeDiveCard bauen.
- Mehrsprachigkeit pruefen und vollstaendig umsetzen.
- Eine Suchmaschinenoptimierung (SEO) fuer Website und Projekt umsetzen, damit SafeDiveCard besser gefunden wird.
- Pruefen, wie der Export bei mehr als zwei Tauchern aussieht und ob das Layout dann noch sauber funktioniert.
- Die Suche nach hyperbaren Kammern vereinfachen.
- Eine Tauchplatzliste als Referenz fuer die Suche vorbereiten.
- Im Projekt erwaehnen, dass die Idee aus dem Sidemount Podcast kommt.
- Einen Aktivitaetscounter fuer das Projekt bzw. die Nutzung einbauen.

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
- Pro Taucher sind jetzt bis zu 2 Notfallkontakte im Formular moeglich.
- `Sex` wurde von Freitext auf ein Auswahlfeld mit ausgeschriebenen Werten umgestellt.
- `Breathing Gas` wurde auf ein Auswahlfeld mit Presets (`Air`, `EAN32`, `EAN36`, `EAN40`) erweitert; bei `Other...` erscheint wieder ein Freitextfeld.
- PDF-Layout angenaehert an die Vorlage:
- Klare Sektionen `Where`, `What`, `Who`
- Tabellenrahmen mit druckfreundlicher Darstellung
- Header im Notfallkarten-Stil
- Standortvorschau erweitert:
- Kartenvorschau auf Basis von OpenStreetMap in der `Where`-Sektion.
- Kartenvorschau wurde spaeter in einen separaten Bereich oberhalb der A4-Card-Preview verschoben (Screen-only), damit der Druckexport fokussiert bleibt.
- Zusaetzliche Koordinatenfelder (`Latitude`, `Longitude`) im Formular.
- Adressauflösung ueber Button `Locate Address` (Nominatim/OSM) fuer praeziseren Marker.
- `Locate Address` kann zusaetzlich eine grobe Hoehe ueber Meeresspiegel automatisch setzen, wenn der externe Hoehendienst erreichbar ist.
- Koordinatenanzeige als Dezimalgrad.
- Koordinaten werden auf 5 Nachkommastellen gerundet (praktischer Bereich um wenige Meter, Genauigkeit haengt von Quelldaten ab).
- Mehrsprachigkeit (UI + Export) umgesetzt:
- Englisch ist immer die Basissprache.
- Optional zusaetzliche Landessprache: `Deutsch` oder `Spanisch`.
- Ausgabeformat ist bei aktivierter Zusatzsprache zweisprachig (`English / Local`).
- Inzwischen unterstuetzt der Export auch 3 Sprachen (`EN + Local + Optional Extra`) mit dynamischer Skalierung und kompakterem Tabellenlayout.
- Exportlayout deutlich an Vorlage angenaehert:
- Linke Abschnittsleiste (`Where/What/Who`) im Kartenstil.
- `Who` als transponierte Tabelle (Merkmal links, Taucher als Spalten) fuer bessere Drucklesbarkeit.
- A4-Print-CSS mit optimierter Schriftgroesse, Abstaenden und Seitenlayout.
- Export wurde weiter verfeinert:
- Echte A4-Seitencontainer statt losem Blocklayout.
- Dynamische Seitenskalierung pro Exportseite.
- Gewichtete Tabellenzeilen in `Who` fuer bessere Verteilung bei langen Inhalten und mehreren Sprachen.
- `Where` und `What` zentrieren die Werte-Spalte im Export.
- `Local Emergency Number` steht im Export oben in `Where` und wird fett dargestellt.
- Export-Header nutzt jetzt die Brand `SafeDiveCard.com`.
- QR-Codes im Export:
- `Dive Base Phone` als direkter Anruf (`tel:`).
- `Dive Insurance Hotline` als direkter Anruf (`tel:`).
- `Emergency Contact` als direkter Anruf (`tel:`), bei 2 Kontakten mit gespiegelt angeordneten QR-Codes fuer leichteres Scannen.
- `Own Phone` als `vCard`-QR mit `Diver 1` / `Diver 2` vor dem Namen sowie Adresse, Rufnummer und Geburtsdatum.

## Sprachmodell (v1.0)
- `meta.language`: immer `en`
- `meta.auto_local_language`: automatische Landessprache aus Tauchort-Land (`country_code`)
- `meta.optional_extra_language`: optionale Zusatzsprache

## Sprachlogik (aktuell)
- Ausgabe basiert auf `EN + Auto-Local + Optional Extra`.
- Auto-Local wird bei `Locate Address` aus Geokodierung abgeleitet.
- Fuer Aegypten (`country_code=eg`) wird aktuell `Arabic (ar)` als Local-Sprache gesetzt.
- Laender-Override vorhanden:
- Override erfolgt jetzt zweistufig:
- Zuerst Kontinent (`Europe`, `Africa`, `Asia`) oder `No override`
- Danach Land innerhalb des gewaehlten Kontinents
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
- Effektive Seitenhoehe wurde leicht unter A4-Maximum abgesenkt, um Browser-/PDF-Randartefakte besser abzufangen.
- Erste Exportseite nutzt jetzt `Where + What + Who` mit inhaltsgesteuerter Hoehenverteilung (`auto / auto / rest`).
- Seitenfit prueft nicht nur die Gesamthoehe, sondern auch Zell-/Container-Ueberlaeufe, damit 3-sprachige Inhalte robuster skaliert werden.

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
- Override-Auswahl inzwischen als 2-stufige Auswahl aufgebaut: Kontinent -> Land.
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
- Feldbeschriftungen im Formular/Export wurden sprachlich nachgeschaerft:
- `Local dive site language (auto by dive site country, optional override)`
- `Hyperbaric Chamber Information (Address and Emergency Contact Phone)` im Formular
- `Hyperbaric Chamber` als kompakter Export-Label
- `Dive Plan Summary (...)`
- `Medical Conditions`
- `Health Insurance Provider`
- Technische Basis:
- Vollstaendige ISO-Laenderliste in der App vorhanden.
- Verifizierte Nummern in separatem Mapping; kein blindes `112`-Fallback.
- Export-Hinweis prominent und zentriert:
- `Make sure to send a digital copy of this PDF to your dive buddies via email or WhatsApp before the dive.`
- Toast-/Fehlerhinweise:
- Fehler-Toasts bleiben jetzt laenger sichtbar (ca. 10 Sekunden).
- Fehler bei optionalen Zusatzdiensten (z. B. Hoehenabfrage) blockieren `Locate Address` nicht mehr komplett.

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
- `project/references/SafeDiveCard-*.pdf` (lokale Exporttests / nicht fuer Deployment gedacht)

## Git / Repository
- Projekt wurde lokal als Git-Repository initialisiert und nach GitHub ueberfuehrt.
- Sensible Beispieldaten unter `project/samples/` werden ueber `.gitignore` vom Repository ausgeschlossen.
- Export-/Testdateien im Referenzbereich sind weiterhin lokale Arbeitsdateien und sollten bewusst vor Commits geprueft werden.

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

