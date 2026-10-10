#!/usr/bin/env node
/**
 * Turns the capture report (scripts/capture-artefacts.mjs) into GitHub issues
 * via the `gh` CLI — ADR-0005: guardrails replace review, so whatever a
 * guardrail stops lands here. One open issue per uitsnede per kind: a failure
 * that persists for weeks does not pile up duplicates, and an issue closes
 * itself once the uitsnede captures cleanly again.
 */
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = promisify(execFile);
const gh = async (...args) => (await run('gh', args, { cwd: ROOT })).stdout;

const rapport = JSON.parse(await readFile(path.join(ROOT, 'artefacten-rapport.json'), 'utf8').catch(() => 'null'));
if (!rapport) {
  console.log('[issues] geen rapport — de opname is niet gedraaid.');
  process.exit(0);
}

const LABELS = ['needs-triage', 'artefact'];
for (const label of LABELS) await gh('label', 'create', label).catch(() => {}); // already exists

const open = JSON.parse(await gh('issue', 'list', '--state', 'open', '--label', 'artefact', '--limit', '200', '--json', 'number,title'));
const titel = { mislukt: (r) => `Artefact mislukt: ${r.beeld}`, anker: (r) => `Bijschrift controleren: ${r.beeld}` };

const REDEN = {
  pagina: 'De pagina gaf geen 200 of laadde niet.',
  selector: 'De selector vond niet precies één element — waarschijnlijk is de site verbouwd.',
  leeg: 'De opname was leeg of te klein.',
};

for (const r of rapport.mislukt) {
  await maak(titel.mislukt(r), [
    `**${r.slug}** · \`${r.beeld}\` · ${r.scherm}`,
    '',
    `${REDEN[r.reden] ?? r.reden}`,
    '',
    '```',
    r.detail,
    '```',
    '',
    `Selector: \`${r.selector}\``,
    '',
    'Het vorige beeld blijft staan. Lag de site tijdelijk plat, dan sluit dit issue zichzelf na de volgende geslaagde opname. Anders: pas de uitsnede aan in `src/data/content.json`.',
  ]);
}

for (const r of rapport.ankerGewijzigd) {
  await maak(titel.anker(r), [
    `**${r.slug}** · \`${r.beeld}\` · ${r.scherm}`,
    '',
    `Het tekstanker **${r.anker}** staat niet meer in de uitsnede. Het beeld is wel vernieuwd, maar het bijschrift beschrijft mogelijk iets dat er niet meer staat.`,
    '',
    'Nu in de uitsnede:',
    '',
    `> ${r.gevonden}`,
    '',
    'Werk in `src/data/content.json` het `anker` en het `bijschrift` (nl + en) van deze uitsnede bij.',
  ]);
}

// An issue is over once the same uitsnede captured cleanly (new or unchanged)
// and, for a caption issue, its anker matches again.
const ankerOpen = new Set(rapport.ankerGewijzigd.map((r) => r.beeld));
for (const r of [...rapport.opgenomen, ...rapport.ongewijzigd]) {
  await sluit(titel.mislukt(r), 'Opname slaagt weer — automatisch gesloten.');
  if (!ankerOpen.has(r.beeld)) await sluit(titel.anker(r), 'Anker klopt weer — automatisch gesloten.');
}

async function sluit(title, comment) {
  const issue = open.find((i) => i.title === title);
  if (!issue) return;
  await gh('issue', 'close', String(issue.number), '--comment', comment);
  console.log(`[issues] gesloten #${issue.number} ${title}`);
}

async function maak(title, body) {
  if (open.some((i) => i.title === title)) return;
  await gh('issue', 'create', '--title', title, '--body', body.join('\n'), ...LABELS.flatMap((l) => ['--label', l]));
  console.log(`[issues] geopend: ${title}`);
}
