import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { veranderd } from './verschil.mjs';

// A mobile capture's size with one line of small text, like the Shaftlab lead time.
const scherm = (tekst, breedte = 1170) =>
  sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${breedte}" height="2475">
        <rect width="100%" height="100%" fill="#fff"/>
        <text x="60" y="1400" font-family="sans-serif" font-size="42" fill="#111">Levertijd ${tekst}</text>
      </svg>`,
    ),
  )
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

test('the same capture twice is unchanged', async () => {
  assert.equal(await veranderd(await scherm('7-10 dagen'), await scherm('7-10 dagen')), false);
});

test('a few changed words count as a change', async () => {
  assert.equal(await veranderd(await scherm('7-10 days'), await scherm('7-10 dagen')), true);
});

test('a different size always counts as a change', async () => {
  assert.equal(await veranderd(await scherm('7-10 dagen', 780), await scherm('7-10 dagen')), true);
});
