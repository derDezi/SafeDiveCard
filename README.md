# SafeDiveCard

<p align="center">
  <img src="server/assets/Header.png" alt="SafeDiveCard Logo" width="420">
</p>

<p align="center">
  Create an emergency dive card for a safe dive.
</p>

<p align="center">
  <a href="https://safedivecard.com">Live website</a>
  ·
  <a href="project/docs/Projektdokumentation.md">Project documentation</a>
  ·
  <a href="COMMERCIAL-LICENSE.md">Commercial licensing</a>
</p>

SafeDiveCard is a browser-based tool for creating structured emergency dive cards as printable A4 PDFs. It combines dive site data, dive plan details, diver information, emergency contacts, insurance details and multilingual export support into one workflow.

The live project is available at [safedivecard.com](https://safedivecard.com).

## What the project does

- Create emergency dive cards directly in the browser
- Import and export structured dive data as JSON
- Keep dive site data and diver data separately reusable
- Resolve addresses and coordinates for dive sites
- Generate multilingual emergency cards
- Export print-ready A4 PDFs
- Add QR codes for key phone numbers and diver contact data

## Current focus

- practical emergency-card workflow for real dive trips
- robust PDF export that fits A4 reliably
- multilingual output for dive travel scenarios
- progressive improvement of UX, export readability and deployment

## Local usage

1. Open `server/index.html` in a browser.
2. Enter dive site, plan and diver data.
3. Optionally load a JSON file with `Load Dive Data`.
4. Use `Export PDF` to create the printable emergency card.

## Repository structure

- [`server/`](server): production web app files
- [`project/docs/`](project/docs): working documentation
- [`project/references/`](project/references): visual and asset references
- [`scripts/`](scripts): helper scripts, including deployment
- [`deploy/`](deploy): local deployment configuration templates

## Deployment

The project is currently deployed to ALL-INKL from the `server/` directory.

- Deployment script: [`scripts/deploy-allinkl.ps1`](scripts/deploy-allinkl.ps1)
- Deployment notes: [`project/docs/Deployment-All-Inkl.md`](project/docs/Deployment-All-Inkl.md)

## License

This repository is provided under the [PolyForm Noncommercial License 1.0.0](LICENSE).

- This is a source-available repository, not an OSI open-source project.
- Noncommercial use, redistribution and modification are allowed under the license terms.
- Required notices and license information must remain intact.
- Commercial use is not included in this repository license.

If you want to use SafeDiveCard commercially or build a paid offering on top of it, contact [safedivecard@it-schmitt.de](mailto:safedivecard@it-schmitt.de) for a separate commercial license.

## Maintainer

SafeDiveCard is operated by Timo Schmitt.

- Website: [safedivecard.com](https://safedivecard.com)
- Contact: [safedivecard@it-schmitt.de](mailto:safedivecard@it-schmitt.de)
