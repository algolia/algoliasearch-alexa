/* global
  it, expect, describe
*/

import algoliaAlexaAdapter from '../src/index.js';
import copyExcept from '../src/utils/copy_except.js';

const args = {
  algolia: {
    appId: 'APP_ID',
    apiKey: 'API_KEY',
  },
  alexaAppId: 'amzn1.echo-sdk-ams.app.fffff-aaa-fffff-0000',
  defaultIndexName: 'products',
  handlers: {
    intentHandlers: {},
  },
};

describe('constructor', () => {
  describe('requires arguments', () => {
    it('cannot be empty', () => {
      expect(() => {
        algoliaAlexaAdapter();
      }).toThrow();
    });

    it('must be an object', () => {
      expect(() => {
        algoliaAlexaAdapter('APP_ID');
      }).toThrow();
    });

    describe('requires certain values', () => {
      it('must have algolia object', () => {
        expect(() => {
          algoliaAlexaAdapter(copyExcept(args, 'algolia'));
        }).toThrow();
      });

      it('must have alexaAppId', () => {
        expect(() => {
          algoliaAlexaAdapter(copyExcept(args, 'alexaAppId'));
        }).toThrow();
      });

      it('must have defaultIndexName', () => {
        expect(() => {
          algoliaAlexaAdapter(copyExcept(args, 'defaultIndexName'));
        }).toThrow();
      });

      it('must have handlers', () => {
        expect(() => {
          algoliaAlexaAdapter(copyExcept(args, 'handlers'));
        }).toThrow();
      });
    });
  });

  it('returns an object', () => {
    expect(algoliaAlexaAdapter(args)).toEqual(expect.any(Object));
  });
});
