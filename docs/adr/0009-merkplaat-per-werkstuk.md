# Elk werkstuk opent met een merkplaat, gerenderd door de wekelijkse opname

De strook en de case-pagina openen nu met een merkplaat: een vast raster gevuld met het merk van de opdrachtgever. Hun kleur als vlak, hun logo, hun eigen kop in hun eigen font, en hun mobiele scherm dat onderaan van de plaat loopt. Daarna volgen een of twee artefacten van kenmerkende onderdelen, zoals een projectkaart, een stappenlijn of de assortimentstegels. Liever één sterk detail dan een tweede dat alleen vult. Een artefact wordt nooit groter getoond dan het is opgenomen (density-srcset). Uitsneden van hele secties (hero, diensten, projecten op desktop) vervallen.

De reden: de opnames van hele secties lieten zien dát er een site was, maar niet van wie, en niet hoe die voelt. Een rij screenshots van hero's leest als goedkoop en uitwisselbaar, terwijl het verschil juist in het merk en de details zit. Een plaat in het merk van de klant laat dat in één beeld zien. De details laten zien dat het merk tot in de onderdelen is doorgevoerd.

De plaat is een HTML-sjabloon (`scripts/merkplaat.mjs`). `scripts/capture-artefacts.mjs` rendert het na de opnames naar `public/projects/<slug>-plaat.jpg`. Zo blijft ADR-0005 staan: het merk verandert zelden, het scherm erin is elke week vers, en er is niets met de hand bij te houden. Gegevens per werkstuk staan onder `merkplaat` in `content.json`. Logo's staan in `scripts/merkplaten/`, net als het telefoonframe (`telefoon.png`, gegenereerd, scherm uitgeknipt) waarin het mobiele scherm valt.

## Considered Options

- **Handgemaakte platen.** Meer vrijheid per project, maar statisch beeld dat veroudert. Dat is precies het onderhoud dat ADR-0005 wilde voorkomen.
- **Live component op de pagina.** Scherpe tekst, maar dan laadt het portfolio vier of vijf klantfonts. Vooraf renderen houdt het portfolio op zijn eigen twee fonts.
- **Vrije compositie per project.** Sterker per plaat, maar de werklijst wordt een lappendeken. Een vast raster houdt het één systeem, zoals de werklijst van lamalama.
- **Captures beter kadreren.** Kleinste stap, maar het blijft een screenshot.

## Consequences

- Een plaat wordt alleen geschreven als het klantfont laadt. Een plaat in een fallback-font is een plaat in andermans merk. Ontbreekt het mobiele scherm of laadt het font niet, dan blijft de vorige plaat staan en komt er een issue (reden `plaat`).
- Platen worden voor elke status gerenderd, want het materiaal is lokaal. Bij _pre-launch_ en _besloten_ staat het scherm erin stil tot iemand het opnieuw opneemt.
- De kop staat in de taal van de klantsite en wordt niet vertaald. Een EN-bezoeker leest de vertaling in de alt-tekst.
- De logo-kleur volgt hoe de klant zelf zijn logo op een gekleurd vlak zet (`logoFilter`). 4 Fruit zet zijn logo op donker volledig wit, dus de plaat ook.
- De verschilcontrole (`scripts/verschil.mjs`) telt een wijziging zodra één cel van het raster merkbaar verschuift, niet op het gemiddelde. Zo komen ook een paar gewijzigde woorden op een klantsite door, net als een kleine aanpassing aan het sjabloon.
- Werk voor de werkgever krijgt geen plaat (ADR-0007).
- De plaat is ook de deelkaart van `/work/:slug` (og:image).
