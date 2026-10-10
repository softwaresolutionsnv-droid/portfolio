# Onderlaag in klanttaal

De case-pagina ging te diep. De onderlaag was "de technische tekst voor wie beoordeelt of Nils het kán": drie alinea's van 90 tot 130 woorden over architectuur en keuzes, zoals de catalogus uit Liquid in plaats van de Storefront API, een Cloudflare Worker die het Admin-token beheert, of een dependency-vrije i18n-laag. Sinds ADR-0006 is de koude bezoeker een even belangrijke lezer als de warme lead, en die lezer haakt af op zulke tekst. Ook een twijfelende opdrachtgever wil vooral weten wat het product is en wat het oplevert.

Daarom is de onderlaag nu één alinea van ongeveer 40 tot 60 woorden in de taal van de opdrachtgever. Die alinea zegt hoe het werkstuk in de praktijk werkt en wat het oplevert, met één onderscheidend feit. Het bewijs dat Nils het kán, zit in het live product en de uitkomst. Wie meer wil weten over de techniek, vraagt ernaar in de kennismaking.

De namenregel: systemen die de klant zelf gebruikt (Shopify, Meta, TikTok, Triple Whale, de App Store) mogen in de tekst staan. Ze bewijzen dat Nils in de eigen systemen van de klant werkt (ADR-0006). Nils' bouwstenen (Liquid, Cloudflare Workers, FastAPI, Nuxt, Ionic) staan alleen in de Stack-regel van de credits.

## Consequences

- Dezelfde regel geldt voor de highlights en voor de noten in een diagram. Een highlight over implementatie of een dubbele Stack-regel wordt vervangen door klantwaarde, zoals "Geen omzetfee".
- De lede, de bovenlaag, de credits en de Oplossingen blijven zoals ze zijn.
- `onderlaag` blijft in het schema een lijst (`Localized[]`), maar bevat één alinea.
- De warme lead leest nog steeds door tot in de onderlaag, alleen staat daar geen techniek meer.
