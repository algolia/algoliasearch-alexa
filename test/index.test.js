/* global
  it, expect, describe, jest
*/

import algoliaAlexaAdapter from '../src/index.js';
import copyExcept from '../src/utils/copy_except.js';

const algoliasearch = jest.fn(() => ({
  initIndex () {},
  addAlgoliaAgent () {},
}));

const Alexa = {
  handler () {
    return {
      registerHandlers () {},
      execute () {},
    };
  },
};

const args = {
  algoliaAppId: 'APP_ID',
  algoliaApiKey: 'API_KEY',
  alexaAppId: 'amzn1.echo-sdk-ams.app.fffff-aaa-fffff-0000',
  defaultIndexName: 'products',
  handlers: {
    HelpHandler: {
      answerWith () {},
    },
  },
  algoliasearch,
  Alexa,
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
      it('must have algoliaAppId', () => {
        expect(() => {
          algoliaAlexaAdapter(copyExcept(args, 'algoliaAppId'));
        }).toThrow();
      });

      it('must have algoliaApiKey', () => {
        expect(() => {
          algoliaAlexaAdapter(copyExcept(args, 'algoliaApiKey'));
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
