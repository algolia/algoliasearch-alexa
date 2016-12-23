import test from 'tape';
import algoliaAlexaAdapter from '../src/index.js';
import copyExcept from './lib/copy_except.js';

const args = {
  algoliaAppId: 'EXAMPLE',
  alexaAppId: 'amzn1.echo-sdk-ams.app.fffff-aaa-fffff-0000',
  defaultIndexName: 'products',
};

test('constructor', t => {
  t.plan(5);
  t.throws(algoliaAlexaAdapter, Error, 'throws with no arguments');

  t.throws(() => {
    algoliaAlexaAdapter(copyExcept(args, 'algoliaAppId'));
  }, Error, 'if algoliaAppId is not present');
  t.throws(() => {
    algoliaAlexaAdapter(copyExcept(args, 'alexaAppId'));
  }, Error, 'if alexaAppId is not present');
  t.throws(() => {
    algoliaAlexaAdapter(copyExcept(args, 'defaultIndexName'));
  }, Error, 'if defaultIndexName is not present');

  t.equal(typeof algoliaAlexaAdapter(args), 'function', 'returns a function');
});
