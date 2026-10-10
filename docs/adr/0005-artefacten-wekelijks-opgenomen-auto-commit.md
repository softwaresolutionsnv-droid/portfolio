# Artefacten worden wekelijks opgenomen en zonder review gecommit

De artefacten van live werkstukken worden niet meer met de hand gemaakt. Elke week neemt een GitHub Action ze opnieuw op van de echte site, en commit ze direct naar main, zonder pull request. Vercel deployt daarna. Een opname is altijd een _uitsnede_ (vaste selector, vast scherm), nooit een volledige paginascreenshot.

De reden: het probleem was niet hoe de beelden gemaakt werden, maar dat ze niet werden bijgehouden. Een PR die op goedkeuring wacht, is opnieuw iets om bij te houden; die blijft liggen en dan veroudert het beeld alsnog. Daarom vervangen vangrails de review. Een opname wordt alleen gecommit als de pagina 200 geeft, de selector precies één element vindt, het beeld niet leeg is en het merkbaar verschilt van de vorige opname. Faalt een vangrail, dan blijft het oude beeld staan en komt er een issue. Uitsneden in plaats van volledige pagina's, omdat de artefact-definitie dat vraagt én omdat een vaste uitsnede een bijschrift kan dragen dat klopt.

## Considered Options

- **PR per week, handmatig goedkeuren.** Veiliger, maar het kost elke week aandacht, en precies die aandacht ontbrak.
- **Opnemen tijdens de build.** Geen commits, maar dan hangt elke deploy van het portfolio af van de beschikbaarheid van klantsites.

## Consequences

Een klantsite die er een week slecht uitziet zonder dat een vangrail dat merkt, staat ook een week slecht op het portfolio. Het tekstanker per uitsnede vangt het grootste risico op: een bijschrift dat niet meer klopt bij wat je ziet. Alleen werkstukken met status _live_ worden opgenomen. Pre-launch staat stil tot de launch, en die wordt door dezelfde Action gemeld.
