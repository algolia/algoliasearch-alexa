/* global
  it, expect, describe, jest
*/

import algoliaAlexaAdapter from '../src/index.js';
import copyExcept from '../src/utils/copy_except.js';
import buildHandlers from '../src/utils/build_handlers.js';

const Algoliasearch = jest.fn(() => ({
  initIndex () {},
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
  algolia: {
    appId: 'APP_ID',
    apiKey: 'API_KEY',
  },
  alexaAppId: 'amzn1.echo-sdk-ams.app.fffff-aaa-fffff-0000',
  defaultIndexName: 'products',
  handlers: {
    intentHandlers: {
      HelpHandler: {
        answerWith () {},
      },
    },
  },
  SearchConstructor: Algoliasearch,
  AlexaSDK: Alexa,
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

describe('handlers', () => {
  const searchSpy = jest.fn(() => Promise.resolve());
  const index = {
    search: searchSpy,
  };
  const handlers = {
    onLaunch() {},
    intentHandlers: {
      spyIntent: {
        answerWith () {},
      },
      unChangedIntent () {},
    },
  };

  describe('when intent handler is specified', () => {
    describe('when handler is invoked', () => {
      it('searches Algolia', () => {
        buildHandlers(handlers, index).intentHandlers.spyIntent({slots: {query: {value: ''}}});
        expect(searchSpy).toHaveBeenCalled();
      });
    });
  });
});
