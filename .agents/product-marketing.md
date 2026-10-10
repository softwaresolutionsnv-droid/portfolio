# Product Marketing Context

**Document version:** v1.7
**Last updated:** 2026-10-10

> Scope: this document records the **target positioning** from the market research of October 2026. Where the current site (nilsvogelaar.com) says something else, a "Huidige site" note marks the gap. Content is in Dutch because the market and the site's source language are Dutch (ADR-0003). Every claim here has a source; nothing is invented.

## Product Overview
**One-liner:** Ik koppel je systemen en zet AI aan het werk. Eén persoon, van eerste gesprek tot livegang.
**What it does:** Nils Vogelaar bouwt automatisering, koppelingen en software voor webshops en mkb. Dat zijn AI-workflows (n8n, LLM's, agents, MCP), koppelingen tussen webshop, marketplace en boekhouding, dashboards op maat die de cijfers uit meerdere systemen in één overzicht zetten, en waar nodig complete portalen, interne tools en apps. Ontwerp, code en AI-integratie komen van één persoon, zonder overdrachten en zonder accountmanagers.
**Product category:** AI-automatisering & koppelingen voor webshops en mkb. Tweede schap: product-developer voor web en mobiel.
**Product type:** Dienstverlening. Solo freelance, 12–20 uur per week naast een baan.
**Business model:** Nu werkt Nils op uurtarief en met vaste prijzen per project. De richting is een instap-pakket (scan of audit), daarna bouw tegen een vaste prijs, daarna een onderhoud-retainer. Bedragen staan bewust niet in dit doc.

_Huidige site:_ de hero zegt "Eén persoon van eerste gesprek tot livegang." De praktijkzin noemt "web- en mobiele producten voor scale-ups, founders en lokale bedrijven". De groepen zijn apps-ai → mcp-tooling → sites-merk. Automatisering en koppelingen zijn nog geen eigen verhaal.

### Marktcontext (research, okt 2026)
- De vraag verschuift van "bouwen" naar "AI aan het werk zetten in bestaande systemen". AI-integratie groeide +178% (Upwork, feb 2026), AI-agent-briefs ×60 en n8n-projecten +1.390% (Malt Tech Trends 2026). Zoekopdrachten naar Claude Code-specialisten stegen +938% (Fiverr, juni 2026).
- Klanten zoeken op **toolnamen** (n8n, Claude, Shopify, Supabase), niet op "AI-development".
- De NL-inhuurmarkt krimpt: −20% ICT-opdrachten in 2025, nog eens −12% in Q1 2026 (HeadFirst/Intelligence Group). De directe markt (mkb, e-commerce) groeit, maar is minder zichtbaar.
- 70% van het mkb gebruikt AI als losse tool. 47% wil het inzetten maar weet niet hoe, en 48% vindt bedrijfsdata in AI spannend (Exact MKB Barometer, aug 2026). Het gat tussen "proberen" en "werkend in mijn systemen" is de markt.
- Generieke websites en simpele MVP's dalen in prijs door AI-sitebouwers. Integratie, productierijp maken en onderhoud groeien.

## Target Audience
**Target companies:**
- Webshops met €0,5–20 mln omzet. Dit is het sterkste bewijs (Short Commerce, Shaftlab).
- Mkb-dienstverleners van 10–100 fte met administratieve processen.
- E-commerce- en marketingbureaus die white-label AI- en integratiecapaciteit inhuren.
- Scale-ups en founders, voor productbouw (portalen, tools, apps).

**Decision-makers:** eigenaar/DGA, e-commerce- of operationsmanager, founder/CTO/productowner, bureau-eigenaar of projectlead.
**Primary use case:** tikwerk tussen systemen. Mensen zijn de lijm tussen webshop, marketplace, boekhouding, mail en rapportage.
**Jobs to be done:**
- "Zet AI werkend in mijn proces." Echt in mijn systemen, veilig met mijn data, niet in een demo.
- "Bouw wat wij zelf niet gebouwd krijgen." Het portaal, de tool of de koppeling die er niet kant-en-klaar is.

**Use cases:**
- Marketplace ↔ webshop ↔ boekhouding: orders uit Base.com/bol.com lopen automatisch naar voorraad en facturen.
- LLM-workflow op mail en offertes: inkomende mail triageren, offertes opstellen, rapportages genereren.
- Een portaal of dashboard in plaats van Excel of Google Docs. Voorbeeld: het Short Commerce Weekly Report.
- Eén dashboard op maat voor wie met meerdere systemen werkt (bijvoorbeeld vijf): alle cijfers in één overzicht, in de eigen huisstijl. Nog geen werkstuk als bewijs: de site toont gangbare systemen als voorbeeld (Shopify, bol.com, Exact Online, Moneybird, Google Analytics, Google Ads, Meta Ads).

**Lezer van de site:** de warme lead (iemand die al in gesprek is en de link krijgt) én koude instroom via LinkedIn of outreach. Een koude bezoeker moet het aanbod binnen seconden snappen.
_Huidige site:_ CONTEXT.md definieert de site als bewijsstuk voor alleen de warme lead ("geen lead-generator"). Die definitie moet worden bijgewerkt.

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Eigenaar / DGA (beslist en betaalt) | Tijd en kosten terug, laag risico | Weet dat AI kan helpen, niet hoe; is bang voor zijn data | Vaste prijs, werkend in de eigen systemen, data in het eigen account |
| E-com- / operationsmanager (champion) | Minder tikwerk, minder fouten | Moet budget loskrijgen bij de eigenaar | Een concreet rekenvoorbeeld in uren dat de eigenaar overtuigt |
| Founder / CTO / productowner | Tempo, kwaliteit, overdraagbare code | Te weinig capaciteit, half afgemaakte software | Eén persoon van ontwerp tot live, code in hun eigen repo |
| Bureau-eigenaar / projectlead (white-label) | AI- en integratiecapaciteit onder eigen merk, marge | Klanten vragen erom, het team kan het niet | Betrouwbare, discrete capaciteit; bewezen bij Short Commerce |
| Accountant / boekhouder (influencer) | Een kloppende boekhouding | Moet een koppeling vertrouwen | Een koppeling die aansluit op hun pakket en controleerbaar is |
| Huidige webbouwer / IT-partner (influencer) | Eigen terrein en klantrelatie | Voelt zich gepasseerd | Werkt mee en levert gedocumenteerd op |

Bij kleine bedrijven zit er vaak geen tussenlaag: de eigenaar beslist alleen.

## Problems & Pain Points
**Core problem:** bedrijven draaien op tikwerk tussen systemen (webshop, marketplace, boekhouding, mail). Ze weten dat AI kan helpen, maar krijgen het niet werkend in hun eigen processen.
**Why alternatives fall short:**
- Zelf bouwen met Zapier, Lovable of ChatGPT werkt in de demo, maar breekt in productie of is onveilig met bedrijfsdata.
- Standaard-plugins en connectors dekken het proces maar half. De rest blijft tikwerk.

**What it costs them:** elke week uren tikwerk. Groei loopt vast, want meer orders betekent meer mensen. Concurrenten die wél automatiseren lopen uit.
**Emotional tension:** angst om bedrijfsdata in AI te stoppen (48% van het mkb, Exact 2026). Overweldigd door de AI-hype: ze weten dat ze iets moeten, maar niet wat.

## Competitive Landscape
**Direct:** AI-automatiseringsbureaus. Ze zijn duur, werken met retainers van duizenden per maand en zetten lagen tussen klant en maker.
**Direct:** AI/n8n-freelancers (Malt, Upwork). Ze leveren no-code lijm, stoppen waar de tool stopt en hebben weinig integratiekennis.
**Direct:** e-commerce- en webbureaus. Ze kennen de klant al, maar missen AI- en integratiecapaciteit. Daarom zijn ze ook een kanaal.
**Secondary:** connector-SaaS (ChannelEngine, Channable, BaseLinker, Exact/Moneybird App Center). Die dekt de standaardflow, niet het proces van deze klant.
**Indirect:** zelf doen met Zapier of Make. Dat breekt, en niemand onderhoudt het.
**Indirect:** AI-tools zelf gebruiken (Lovable, ChatGPT). Dat werkt tot het in productie moet, en is onveilig met data.

## Differentiation
**Key differentiators:**
- **Productiecode, geen no-code lijm.** (Intern verschil, niet als sitecopy: "prompt-knutselaar" zet Nils af tegen anderen en klinkt te stoer.) Echte code met auth, logging en tests, geen no-code lijm die breekt. Voorbeeld: bij het Short Commerce Weekly Report komen de cijfers deterministisch uit de bron-API's.
- **Koppelen én bouwen.** Waar een plugin of no-code-tool stopt, bouwt Nils het ontbrekende stuk: een portaal, tool of app.
- **Een eigen tool, geen generieke UI.** In Nils' woorden: "Ik maak onderscheid tussen generieke UI en designs en maak er echt een unieke tool van." Elke tool krijgt een interface in de huisstijl van de klant, geen dashboard-template.

**How we do it differently:** Nils begint bij het proces en de systemen die de klant al heeft, niet bij een tool. AI schrijft alleen waar dat waarde toevoegt. Cijfers en data blijven deterministisch, en een mens reviewt voordat er iets naar buiten gaat.
**Why that's better:** het werkt in productie en niet alleen in de demo. Het dekt het hele proces in plaats van de helft. En het is veilig met data.
**Why customers choose us:** één persoon die zowel het proces als de techniek begrijpt ("eindelijk iemand die het snapt") en het product behandelt alsof het van hem is ("denkt mee als eigenaar").

## Objections
| Objection | Response |
|-----------|----------|
| "Ben je wel beschikbaar?" (Nils heeft een baan naast zijn freelance werk) | Noem de capaciteit, niet de baan: 12–20 uur per week, vaste dagen, een beperkt aantal klanten tegelijk. Afgebakende projecten met een vaste prijs, een deadline en een wekelijkse update. Benoem de baan pas als de klant ernaar vraagt. |
| "Heb je dit eerder gedaan?" | Het Short Commerce Weekly Report: vijf advertentiekanalen plus winkelcijfers in één automatisch rapport, Claude schrijft de duiding, live sinds 1 okt 2026. Shaftlab op Shopify. Voor schaal: FleetDisk (portaal voor meerdere leasemaatschappijen op dertig jaar backofficedata) en BerijdersApp (54 white-label-apps uit één codebase). |
| "Is mijn data veilig als er AI aan zit?" | EU-hosting. Code, database en API-sleutels staan op naam van de klant, dus geen lock-in. Cijfers komen rechtstreeks uit de bron; AI schrijft alleen de duiding, en een mens reviewt. (Alleen deze garanties noemen. Een verwerkersovereenkomst en no-training-API's zijn niet bevestigd.) |

**Anti-persona:**
- Fulltime inhuur of detachering (32–40 uur, op locatie, via een broker). Past niet naast de baan en geeft een DBA-risico.
- Lease- en fleetbedrijven die botsen met de werkgever of het concurrentiebeding.
- M365-migraties en IT-beheer: geen ervaring mee, en Nils wil dit werk niet doen.

## Switching Dynamics
**Push:** het tikwerk groeit mee met elke order. Zelfgebouwde Zapier- of AI-experimenten breken. Plugins dekken het proces maar half.
**Pull:** AI die werkt in hún systemen, niet in een demo. Eén developer die koppelt én bouwt. Een vaste prijs per project.
**Habit:** "Het werkt toch": Excel, Google Docs en tikwerk zijn bekend. Er is al een webbouwer of IT-partner. Het connector-abonnement is al betaald.
**Anxiety:** bedrijfsdata in AI. De beschikbaarheid van één persoon. Heeft hij dit eerder gedaan? Breekt het na de livegang?

## Customer Language
**How they describe the problem:**
- "We tikken alles over."
- "Het kost ons elke week uren."
- "We willen iets met AI, maar wat?"

**How they describe us:**
- "Denkt mee als eigenaar."
- "Eindelijk iemand die het snapt."

**Words to use:** vanzelf, (niet meer) overtikken, uren, orders, voorraad, facturen, koppeling, werkend in je eigen systemen, vaste prijs. Gebruik ook de toolnamen die klanten zelf zoeken: n8n, Claude, Shopify, Base.com, bol.com, Exact, Moneybird, Supabase.
**Words to avoid:** "prompt-knutselaar" en andere zinnen die Nils afzetten tegen anderen, "tikwerk" in sitecopy (klinkt als een klein klusje en maakt de opdracht kleiner dan hij is; prima als intern begrip), "handwerk" (leest als ambacht), "AI-oplossingen", "AI-powered", "passie", "gedreven". Volg ook de anti-references uit PRODUCT.md: geen SaaS-landingstaal, geen verzonnen cijfers.
**Glossary:**
| Term | Meaning |
|------|---------|
| Werkstuk | Eén project op de site, met herkomst, status, groep en twee tekstlagen (CONTEXT.md) |
| Bovenlaag / onderlaag | Probleem en uitkomst voor iedereen / één alinea over hoe het in de praktijk werkt, in klanttaal (ADR-0008) |
| Scope-feit | Een verifieerbare uitspraak over omvang of rol, die een niet-onderbouwd cijfer vervangt |
| Warme lead | Iemand die al in gesprek is en de link krijgt |
| Koppeling | Een automatische verbinding tussen twee systemen (webshop, marketplace, boekhouding) |
| Scan | Het geplande instap-pakket: één proces doorlichten, met quick wins (nog niet live) |

## Brand Voice
**Tone:** direct en zelfverzekerd. Professioneel, niet corporate. Persoonlijk, niet casual.
**Style:** geen vulwoorden, geen voorbehoud, korte zinnen. Bewijs boven belofte: laat zien wat gebouwd is en claim niets wat niet aantoonbaar is. Gebruik klanttaal (orders, voorraad, uren) en geen techtaal in de bovenlaag. Nederlands eerst, Engels als vertaling.
**Personality:** Bold. Precise. Memorable.
**Hard rules:** geen verzonnen cijfers, klanten of testimonials. Elk cijfer is een scope-feit met een bron.

## Proof Points
**Metrics:**
- FleetDisk (Autodisk, 2024–2025): vernieuwd portaal met dashboard voor meerdere leasemaatschappijen en hun zakelijke klanten, op dertig jaar backofficedata. Nils deed solo ontwerp en frontend. Geen gemeten resultaat; het eerder genoemde "100k+ voertuigen" klopt niet (gecorrigeerd door Nils, 10 okt 2026).
- Short Commerce Weekly Report: live sinds 1 okt 2026. De eerste wave telt 3 merken; het rapport is gebouwd om met één sectiecatalogus op te schalen naar ~18 klanten.
- BerijdersApp (Autodisk, 2024–2025): één Ionic/Capacitor-codebase levert 54 white-label-apps (één per leasemaatschappij of merk), live in App Store en Google Play. Nils deed frontend en de white-label-pipeline.

**Customers:** Short Commerce (het Amsterdamse performancebureau achter merken als Upfront en Saint Blanc), Autodisk (FleetDisk en BerijdersApp; eindklanten van Autodisk worden niet publiek genoemd), Shaftlab, Puik Bouw, 4 Fruit Company en NB Projectbouw (voorheen N.B. Onderhoudsdiensten).
Noem merknamen alleen als bureau-context. Upfront gebruikt de tool nog niet (niet in de eerste wave), en de first-wave-merken worden niet genoemd.

**Werkstukken (bewijs voor de nieuwe positionering):**
- **Short Commerce Weekly Report** (freelance). Eerst schreef een mediabuyer elke week per klant met de hand een Google Doc. Nu brengt de tool Meta, TikTok, Snapchat, Google en Pinterest plus de winkelcijfers samen in één rapport (via AdManage, AdUp en Triple Whale). Claude schrijft de duiding bij vaste cijfers. De mediabuyer reviewt en publiceert in een klantportaal met rollen, revisiegeschiedenis en comments. Het rapport heeft 11 secties, targets per platform, markt en campagne, en een trend over 8 weken. Elke week staat het rapport klaar voor review (geen vast tijdstip noemen). Een ontbrekende databron krijgt één feitelijke notitie en wordt nooit opgevuld.
- **Shaftlab:** een Shopify-club-builder die een maatwerk-club als één product verkoopt (live).
- **FleetDisk / BerijdersApp:** bewijs voor productbouw op schaal. Alleen als tekst: geen beeld van werk voor de werkgever (ADR-0007).

**Testimonials:** er zijn er geen. Verzin er geen.
> "Denkt mee als eigenaar." / "Eindelijk iemand die het snapt." — klanten, mondeling. _TODO: per citaat naam en toestemming vastleggen voordat het publiek gebruikt wordt._

**Value themes:**
| Theme | Proof |
|-------|-------|
| Het loopt vanzelf, AI werkend in het proces | Short Commerce Weekly Report: van een handgeschreven Google Doc naar een automatisch rapport met AI-duiding |
| Koppelen tussen systemen | SC Weekly Report: advertentieplatforms en winkelcijfers in één rapport |
| Bouwen wat niet kant-en-klaar bestaat | FleetDisk (dashboard op legacy-data), Shaftlab-club-builder, BerijdersApp (54 apps) |
| Productierijp, geen demo | Review-voor-publicatie, deterministische cijfers (SC Weekly Report) |
| Een eigen tool, geen template | Een eigen designtaal per klant (SC Weekly Report in de Short Commerce-huisstijl) |

## Goals
**Business goal:** 2–3 betaalde opdrachten in AI-automatisering en koppelingen binnen een half jaar, als bewijs voor de nieuwe positionering. Daarna doorgroeien naar retainers.
**Conversion action:** een kennismakingsgesprek boeken.
**Current metrics:** nog niet gemeten. _TODO: site-analytics en leadbron per aanvraag bijhouden._

_Huidige site:_ de conversie is nu een mailadres (Gmail) met de pitch "Vertel wat je bouwt. Ik vertel wat het werkelijk vraagt." Er is nog geen agenda-link.

### Kanalen (research)
1. Het bestaande netwerk en referrals: vraag elke klant actief om een introductie.
2. Bureaus als white-label-kanaal: Short Commerce is de ingang.
3. LinkedIn-cases met toolnamen, plus kleine, gerichte outreach (20–30 per week).

## Changelog
*Newest first. One line per revision: what changed and why.*
- v1.7 (2026-10-10) — Contact-afsluiter verbreed: "Wat doe je nog met de hand?" wordt "Waar loop je tegenaan?", met een pitch die koppelingen, tools en complete apps noemt. Automatisering blijft de focus, maar de laatste vraag van de site mag andere software niet uitsluiten (wens van Nils).
- v1.6 (2026-10-10) — Over-mij herschreven op verzoek van Nils: de oude tekst las als een cv (Autodisk, FleetDisk, 54 apps), was te glad en "prompt-knutselaar" was te stoer. Nieuw: eerst het bedrijf snappen, dan bouwen, alles zelf ontwerpen en bouwen, en het als eigen product behandelen. Werkgeverswerk blijft bewijs bij de werkstukken.
- v1.5 (2026-10-10) — Sitecopy zegt geen "tikwerk" meer: het woord klinkt als een klein klusje en maakt de opdracht kleiner. Oplossingen-kop wordt "Het loopt vanzelf." en de contact-pitch "Vertel welk proces vanzelf moet lopen." Zo staat de uitkomst centraal en niet het klusje. Tikwerk blijft een intern begrip voor het probleem.
- v1.4 (2026-10-10) — Werkstukfeiten nagelopen met Nils: "100k+ voertuigen", "623 tests", "maandag 20:30", "zes leasemaatschappijen" en de brandstofscore kloppen niet of worden niet genoemd. BerijdersApp = 54 white-label-apps uit één codebase. FleetDisk = vervangt een oud portaal, dashboard op legacy-data (één backoffice, geen meerdere systemen). Shaftlab is live. NB Projectbouw is de nieuwe naam van N.B. Onderhoudsdiensten.
- v1.3 (2026-10-09) — Geen beeld van Autodisk-werk en Van Mossel niet meer publiek genoemd (ADR-0007): zekerheid richting de werkgever, en het is niet de focus. Dashboards hebben nog geen bewijs-werkstuk; FleetDisk was dat niet (gecorrigeerd door Nils).
- v1.2 (2026-10-09) — Dashboards op maat toegevoegd aan het aanbod: meerdere systemen in één overzicht (wens van Nils). Bewijs: FleetDisk.
- v1.1 (2026-10-09) — Marketplacekoppeling (Base.com ↔ webshop ↔ boekhouding) verwijderd als werkstuk en bewijs: die opdracht bestaat niet (bevestigd door Nils). Marketplace ↔ webshop ↔ boekhouding blijft een use case, geen bewijs.
- v1 (2026-10-06) — Initial context. Positioning is based on the October 2026 market research (AI automation & integrations for webshops and SMBs). The current site is kept as a reference with gap notes.
