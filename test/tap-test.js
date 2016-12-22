import test from 'tape';
import algoliaAlexaAdapter from '../src/index.js';
const args = {};

test('constructor', t => {
  t.plan(2);
  t.equal(typeof algoliaAlexaAdapter(args), 'function', 'returns a function');
  t.throws(algoliaAlexaAdapter, Error, 'throws with no arguments');
});
