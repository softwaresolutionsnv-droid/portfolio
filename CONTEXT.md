# Portfolio

Het portfolio van Nils Vogelaar: een bewijsstuk dat aantoont dat hij processen tussen systemen vanzelf laat lopen — koppelingen, automatisering en AI die werken in de eigen systemen van webshops en mkb — als één persoon, van eerste gesprek tot livegang (ADR-0006).

## Language

### Publiek en doel

**Warme lead**:
Iemand die al met Nils in gesprek is en de link toegestuurd krijgt: een twijfelende opdrachtgever, een bureau, een doorverwijzing. Leest door tot in de onderlaag.
_Avoid_: Bezoeker, prospect, klant

**Koude bezoeker**:
Iemand die via LinkedIn of outreach binnenkomt en Nils nog niet kent. Moet het aanbod binnen seconden snappen en de volgende stap zien. Sinds ADR-0006 een even belangrijke lezer als de warme lead.
_Avoid_: Traffic, lead, prospect

**Bewijsstuk**:
Wat de site is. Elke bewering op de pagina wijst naar iets aantoonbaars: een werkstuk, een scope-feit, een garantie die Nils kan nakomen. De site mag het aanbod uitleggen, maar claimt niets wat niet aantoonbaar is.
_Avoid_: Etalage, showcase, visitekaartje

**Kennismaking**:
De primaire actie van de site: een eerste gesprek boeken. Een agenda-link zodra die er is (`contact.bookingUrl`), tot dan een mail met onderwerp.
_Avoid_: Contact opnemen, offerte aanvragen, demo

**Tikwerk**:
Het werk dat Nils eruit haalt: mensen die gegevens met de hand van het ene systeem naar het andere overtikken (orders, voorraad, facturen, rapporten). Alleen een intern begrip. Op de site staat de uitkomst, niet het klusje: de kop van de oplossingen-sectie is "Het loopt vanzelf." (EN: "Runs by itself."). "Tikwerk" klinkt als een klein klusje en maakt de opdracht kleiner dan hij is.
_Avoid_: Handwerk (leest als ambacht en klinkt oubollig), handmatig werk

### Werk

**Werkstuk**:
Eén project op de site. Heeft altijd een herkomst, een status, een groep en twee tekstlagen.
_Avoid_: Case, project, plaat, item

**Herkomst**:
Wie het werkstuk liet maken. Twee waarden: _in opdracht_ (een betalende opdrachtgever bepaalde de richting) of _eigen product_ (Nils nam elke beslissing). Altijd zichtbaar op de site; nooit weglaten om iets groter te laten lijken.
_Avoid_: Type, klantwerk, soort

**Status**:
Hoe ver het werkstuk is. Drie waarden: _live_ (publiek te bezoeken), _pre-launch_ (gebouwd maar nog niet gelanceerd), _besloten_ (opgeleverd maar niet publiek, bijv. door NDA). Bepaalt of er een link staat, welk label de bezoeker ziet, en of de artefacten kunnen meebewegen: alleen bij _live_; bij de andere statussen staan ze stil.
_Avoid_: Fase, staat, published

**Kandidaat**:
Gebouwd en publiek bereikbaar werk dat nog geen werkstuk is en ook niet bewust is uitgesloten. Wacht op één beslissing van Nils: werkstuk worden, of uitgesloten.
_Avoid_: Suggestie, nieuw project, lead

**Groep**:
De drie benoemde clusters waarin werkstukken op de site staan, in vaste volgorde: _Automatisering & koppelingen_ → _Dashboards, portalen & apps_ → _Sites & merk_ (ADR-0006). De groep staat als kop boven zijn werkstukken; de groepsvolgorde draagt de positionering. Sites staan compacter.
_Avoid_: Categorie, sectie, filter

### Inhoud

**Bovenlaag**:
De tekst die iedereen leest, ook zonder technische kennis. Beschrijft het probleem en de uitkomst, nooit de techniek. Staat op de overzichtspagina.
_Avoid_: Samenvatting, description, intro

**Onderlaag**:
De ene alinea op de case-pagina, onder de lede: hoe het werkstuk in de praktijk werkt, wat het oplevert en één onderscheidend feit, in ongeveer 40 tot 60 woorden en in de taal van de opdrachtgever (ADR-0008). Namen van systemen die de klant zelf gebruikt (Shopify, Meta, Triple Whale) mogen erin; namen van Nils' bouwstenen (Liquid, Cloudflare Worker, Nuxt) niet. Die staan alleen in de Stack-regel van de credits. Dezelfde regel geldt voor de highlights.
_Avoid_: Detail, deep dive, body, technische tekst

**Scope-feit**:
Een verifieerbare uitspraak over omvang of rol die een niet-onderbouwd cijfer vervangt — "solo frontend, white-label voor meerdere leasemaatschappijen" in plaats van een getal dat niemand kan narekenen. Elk cijfer op de site is een scope-feit of heeft een aanwijsbare bron.
_Avoid_: Metric, highlight, KPI

**Oplossing**:
Eén regel in de sectie Oplossingen, die de oude stack-sectie vervangt: een probleem in de taal van de opdrachtgever ("We tikken alles over."), plus wat Nils ertegenover zet, plus een verwijzing naar het werkstuk dat het bewijst, met één scope-feit. Vervangt het opsommen van gereedschap.

**Werkwijze**:
De antwoorden op de bezwaren uit het productmarketingdocument: vaste prijs, werkend in de eigen systemen, data op naam van de klant, één persoon, white-label voor bureaus. Alleen garanties die Nils kan nakomen.
_Avoid_: Skill, dienst, capability, stack-item

### Beeld

**Artefact**:
Beeld van zichtbare software: één betekenisvol detail op ware grootte uitgesneden, met een bijschrift dat benoemt wat je ziet. Nooit een volledige paginascreenshot, nooit een apparaat-mockup. Is _opgenomen_ (van een uitsnede; bij een live werkstuk steeds opnieuw) of _aangeleverd_ (door Nils, waar opnemen niet kan); een aangeleverd artefact verloopt na zes maanden.
_Avoid_: Screenshot, mockup, preview

**Uitsnede**:
De vaste aanwijzing welk deel van welke pagina, op welk scherm, een artefact toont. De uitsnede blijft staan terwijl de site verandert; het artefact is steeds de verse opname ervan. Het bijschrift hoort bij de uitsnede, niet bij één opname.
_Avoid_: Shot, crop, screenshot-instelling

**Merkplaat**:
Het opener-beeld van een werkstuk in het merk van de opdrachtgever: hun kleur als vlak, hun logo, hun eigen kop in hun eigen font, en het mobiele scherm dat onderaan van de plaat loopt. Eén vast raster voor elk werkstuk; alleen het merk wisselt. Gerenderd door de wekelijkse opname, dus het scherm erin is vers (ADR-0009). Staat vóór de artefacten, in de strook en op de case-pagina. De kop is van de klant en wordt niet vertaald.
_Avoid_: Moodboard, brand board, styleguide, cover

**Diagram**:
Beeld van software die niet te fotograferen is: onzichtbaar (AI-integratie, datapijplijnen) of afgeschermd (besloten werk). Een getypografeerde architectuurtekening of echte uitvoer. De tegenhanger van het artefact.
_Avoid_: Illustratie, schema, graphic
