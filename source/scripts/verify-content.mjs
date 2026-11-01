import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { copy, services, extras, PHONE, PHONE_LINK, TELEGRAM } from '../src/content.ts';
import { concise } from '../src/concise.ts';

const original = await readFile(new URL('../original.html', import.meta.url), 'utf8');
const readArray = name => {
  const match = original.match(new RegExp(`var ${name}=(\\[[\\s\\S]*?\\]);`));
  assert.ok(match, `Original ${name} exists`);
  return JSON.parse(JSON.stringify(vm.runInNewContext(match[1])));
};
assert.deepEqual(services.map(x => [x.name[0], x.price]), readArray('items'), 'All original service names and prices must remain');
assert.deepEqual(extras.map(x => [x.name[0], x.price]), readArray('extras'), 'All extra prices must remain');
assert.deepEqual(copy.ru.faq, readArray('F'), 'All original FAQ questions and answers must remain');
assert.deepEqual(copy.ru.reviews.map(x => ({ t: x.place, q: x.quote, a: x.author })), readArray('R'), 'All original reviews must remain');
assert.ok(original.includes(PHONE) && original.includes(PHONE_LINK) && original.includes(TELEGRAM), 'Contacts must remain');
assert.ok(original.includes(copy.ru.street), 'Street address must remain');
for (const [key, value] of Object.entries(copy.ru)) {
  assert.equal(typeof copy.en[key], typeof value, `English translation exists for ${key}`);
  if (Array.isArray(value)) assert.equal(copy.en[key].length, value.length, `Matching translation count for ${key}`);
}
const luminance = hex => {
  const channels = hex.match(/[a-f\d]{2}/gi).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
};
const contrast = (a, b) => { const values = [luminance(a), luminance(b)].sort((a, b) => b - a); return (values[0] + .05) / (values[1] + .05); };
for (const key of Object.keys(concise.ru)) assert.equal(typeof concise.en[key], typeof concise.ru[key], `Concise translation exists for ${key}`);
for (const [foreground, background] of [['A8ADBD','0B0D12'],['A8ADBD','1A1D27'],['FFFFFF','3B45E0'],['101217','E8E9F1']]) {
  const ratio = contrast(foreground, background);
  assert.ok(ratio >= 4.5, `Text contrast ${foreground}/${background}: ${ratio.toFixed(2)}`);
  console.log(`Contrast #${foreground} / #${background}: ${ratio.toFixed(2)}:1`);
}
console.log('PASS: original prices, contacts, reviews, FAQ, RU/EN parity and text contrast.');
