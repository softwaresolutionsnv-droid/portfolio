# Plan — portfolio afmaken

Uitkomst van de grill-sessie van 12 augustus 2026. Vocabulaire in [CONTEXT.md](./CONTEXT.md); de drie zwaarwegende keuzes staan als ADR in [docs/adr/](./docs/adr/).

---

## De diagnose

Het probleem is niet de vormgeving. De Concrete Monograph-taal staat en blijft ongewijzigd. Het probleem is dat de site het verkeerde bewijst.

- **Je positionering heeft nul dekking.** Er staat geen MCP op, geen AI-integratie, en één hybride app. De "Specifications — the stack"-sectie noemt zes gereedschappen waarvan er geen enkele je nieuwe richting raakt — die sectie spreekt je positionering niet alleen niet uit, hij weerlegt hem.
- **Het beeld is geen beeld.** Twee volledige paginascreenshots van 1920px (PNG's met een `.jpg`-extensie) en één ontbrekende. Een uitgeknipte browserpagina is een bewijsstuk zonder compositie; dat is de "goedkope" sensatie die je beschreef.
- **Drie van de vier cijfers houden geen stand.** Op een site met "proof over promises" als uitgangspunt is dat het duurste soort fout: één natrekbare claim die niet klopt besmet de rest.
- **De beeldparadox.** Wat je wilt promoten heeft geen visuele oppervlakte (een MCP-server valt niet te fotograferen); wat beeld heeft, is het klantwerk. Die spanning is de eigenlijke ontwerpopgave van dit plan.

---

## De acht werkstukken

| Werkstuk | Groep | Herkomst | Status |
|---|---|---|---|
| nachtagenda | Apps & AI-systemen | Eigen product | Pre-launch |
| BerijdersApp | Apps & AI-systemen | In opdracht — Autodisk | Live |
| garmin-mcp | MCP & tooling | Eigen product | Live |
| FleetDisk | Sites & merk | In opdracht — Autodisk | Besloten (NDA) |
| N.B. Onderhoudsdiensten | Sites & merk | In opdracht | Live |
| Puikbouw | Sites & merk | In opdracht | Live |
| 4fruit | Sites & merk | In opdracht | Pre-launch |
| abeenprojecten | Sites & merk | In opdracht | Pre-launch |

Alle acht krijgen dezelfde behandeling. De **groepsvolgorde** draagt het verhaal: apps eerst, MCP tweede, sites derde. Zo hoeft er niets gedegradeerd te worden en leest een bezoeker in één oogopslag wie je bent.

Bewust eraf: **platform/CFOS** (klantnamen en bedrijfscijfers) en **goldirection** (geen regel code — botst met het criterium "gebouwd telt"). Gevolg: *AI-integratie* is de zwakst gedekte poot van je positionering. Zie de openstaande punten.

---

## De nieuwe paginastructuur

1. **Hero** — ongewijzigd van vorm, nieuwe belofte. De huidige praktijkregel ("I design and build web and mobile products") moet de nieuwe richting benoemen.
2. **De werkstukken**, in drie benoemde groepen, elk met herkomst- en statuslabel.
3. **Oplossingen** — vervangt "Specifications — the stack". Zelfde ruled-rows vorm, andere inhoud: vier tot zes regels van het patroon *probleem in klanttaal → wat je ertegenover zet → het werkstuk dat het bewijst*. Voorbeeld: "Een team dat data uit vijf systemen overtikt → een MCP-server die het rechtstreeks in hun AI-assistent zet → garmin-mcp."
4. **Essay** — ongewijzigd van vorm, herschreven naar de nieuwe positionering.
5. **Colophon** — ongewijzigd.

De **trace** leeft op de case-pagina van garmin-mcp: een opgenomen tool-call die zich afspeelt — vraag, aanroep, JSON-antwoord — getypografeerd in de bestaande taal. Expliciet benoemd als opname, niet als live server.

---

## Uitvoering

### Fase 0 — opruimen (kort, staat los)
- Drie niet-hardmaakbare claims eruit, vervangen door scope-feiten:
  - `Lighthouse 98 / 100 / 100 / 100` (N.B. Onderhoud) — niet geverifieerd
  - `Conversion ~3× category average` (N.B. Onderhoud) — geen bron, en niet te hebben
  - `White-label, 6 lease companies` (BerijdersApp) — aantal niet te staven
  - Blijft staan: `100k+ vehicles, live` (FleetDisk) — het enige harde cijfer.
- Bestandsextensies corrigeren (de PNG's heten nu `.jpg`).

### Fase 1 — fundament
- Contentmodel uitbreiden: `herkomst`, `status`, `groep`, `bovenlaag`, `onderlaag`, `trace`, en per veld een NL/EN-paar.
- Admin-paneel en Supabase-koppeling verwijderen ([ADR-0002](./docs/adr/0002-cms-verwijderd-content-json-is-de-bron.md)); `content.json` wordt de bron, de WebP-ladder in `scripts/` blijft.
- i18n-laag met Nederlands als default ([ADR-0003](./docs/adr/0003-tweetalig-nederlands-is-de-bron.md)). Geen copy meer in componenten.
- Groepsindeling en labels in de werkstukken-sectie.

### Fase 2 — twee werkstukken als proef op de som
**nachtagenda** en **garmin-mcp** helemaal af: nieuw beeld, beide tekstlagen, beide talen, en voor garmin-mcp de trace. Dit zijn precies de twee waar de aanpak het meest onbewezen is — een pre-launch app en software zonder visuele oppervlakte. Als "artefact of diagram" hier werkt, werkt het overal.

**Beslismoment.** Jij keurt deze twee goed voordat de andere zes beginnen.

### Fase 3 — de resterende zes
Beeld en tekst voor BerijdersApp, FleetDisk, N.B. Onderhoud, Puikbouw, 4fruit, abeenprojecten. Ik draai je dev-servers, maak verse opnames en snijd per werkstuk één betekenisvol detail uit.

### Fase 4 — de nieuwe secties
Oplossingen-sectie, herschreven essay, nieuwe heroregel. Deze komen als laatste, omdat ze pas te schrijven zijn als vaststaat wat de werkstukken bewijzen.

---

## Werkverdeling

**Ik** — contentmodel, i18n-laag, CMS verwijderen, alle beeld behalve nachtagenda, eerste versie van alle teksten in beide talen, de trace, de nieuwe secties.

**Jij** — vier dingen die ik niet kan:
1. **Simulator-opnames van nachtagenda.** Ik kan geen Expo-app op een toestel draaien. Zonder deze opnames heeft je best-dekkende app-bewijs geen beeld.
2. **Feiten nalopen.** Ik schrijf zestien teksten uit code en commit-historie; ik ga onvermijdelijk iets aannemen dat niet klopt over jouw rol of beslissingen.
3. **Goedkeuring op het beslismoment** na fase 2.
4. **Garmin-credentials roteren** — zie hieronder.

---

## Openstaand

**Roteer je Garmin-credentials.** Los van dit plan: er staat een werkende Garmin OAuth-tokenblob in je git-historie (commits `af9203d` en `8c0f0dc` — de tweede is de commit die hem uit het bestand haalde maar niet uit de historie). Het access-token is verlopen; het refresh-token is geen JWT, heeft geen zichtbare vervaldatum en kan nog inwisselbaar zijn voor verse tokens met 33 scopes, waaronder `CONNECT_WRITE` en `GARMINPAY_WRITE`. Log alle sessies uit via Garmin Connect en wijzig je wachtwoord.

**garmin-mcp open-sourcen is een aparte klus.** Hem tónen op de site vereist het niet. Wil je er een GitHub-link bij, dan moet eerst de historie herschreven worden (`git filter-repo`) én de credentials geroteerd. Aanbeveling: eerst de site af, dan die klus, dan pas de link.

**AI-integratie is je zwakste poot.** Met platform/CFOS eraf staat er geen enkel werkstuk op dat een LLM-integratie toont. De oplossingen-sectie kan het benoemen, maar benoemen is geen bewijs. Twee uitwegen als je dat gat wilt dichten: een geanonimiseerde versie van platform alsnog toelaten, of de eerste betaalde AI-opdracht afwachten.

**Twee klantsites staan pre-launch.** 4fruit en abeenprojecten krijgen geen bezoekbare link. Overweeg of je ze wilt wachten tot ze live zijn, of ze met een pre-launch-label toont zoals nachtagenda.

**Tweetaligheid is de duurste post in dit plan** — duurder dan al het beeldwerk bij elkaar. Als de doorlooptijd knelt, is dit het eerste dat je zou moeten schrappen, niet het beeld.

---

## Bijlage — waar het beeldmateriaal vandaan komt

Alle projecten liggen in `../` binnen dezelfde workspace. Voor verse opnames:

| Werkstuk | Bron | Hoe |
|---|---|---|
| N.B. Onderhoud, Puikbouw, 4fruit, abeenprojecten | `nbonderhoud-site`, `puikbouw`, `4fruit`, `abeenprojecten` | `npm run dev` → `localhost:3000`. abeenprojecten heeft ook WordPress op `:8881` nodig (`wp/start.sh`) |
| nachtagenda | `nachtagenda` | Expo Go — **alleen jij**, een dev build is geblokkeerd door Xcode 26.1.1 vs Expo SDK 56 |
| garmin-mcp | `garmin-mcp` | Geen UI. Diagram + trace worden getypografeerd uit echte tool-uitvoer |
| BerijdersApp, FleetDisk | Geen repo in deze workspace | Werk voor Autodisk — opnames moeten van jou komen of van de live site |

4fruit heeft al 74 responsive opnames in `.shots/` liggen; die zijn bruikbaar als vertrekpunt, maar moeten nog bijgesneden worden tot artefacten. De honderden foto's in `puikbouw` en `abeenprojecten` zijn foto's van het werk van die klanten (badkamers, timmerwerk), geen bewijs van jouw werk — niet bruikbaar als artefact.
