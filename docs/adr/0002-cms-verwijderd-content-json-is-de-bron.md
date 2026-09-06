# CMS verwijderd — content.json is de bron

Het admin-paneel (`src/admin/`) en de Supabase-koppeling worden verwijderd. `src/data/content.json` is voortaan niet de build-uitvoer maar de bron zelf, met het TypeScript-type ernaast als schema.

De reden: er is één redacteur, die schrijft code, en de Supabase-instantie stond gepauzeerd — waardoor `content.json` in de praktijk al de echte bron was terwijl er een heel CMS omheen stond te wachten. Het contentmodel moest bovendien uitgebreid worden met herkomst, status, groep, twee tekstlagen en traces; via Supabase is dat een migratie plus een admin-formulier per veld, via JSON is het een type-wijziging.

## Consequences

Content bijwerken vereist voortaan een commit en een deploy — geen bewerken vanaf de telefoon, en geen redactie door iemand zonder repo-toegang. Dat is de prijs. `scripts/fetch-content.mjs` verliest zijn Supabase-tak maar behoudt de WebP-ladder-generatie, want die is geen CMS-functie.
