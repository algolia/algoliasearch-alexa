/* global
  it, expect, describe, jest, beforeEach
*/

import algoliaAlexaAdapter from '../src/index.js';
import copyExcept from '../src/utils/copy_except.js';
import buildHandlers from '../src/utils/build_handlers.js';

const algoliasearch = jest.fn(() => ({
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

describe('handlers', () => {
  const searchSpy = jest.fn(() => Promise.resolve());
  const index = {
    search: searchSpy,
  };
  const handlers = {
    LaunchRequest () {},
    spyIntent: {
      answerWith () {},
    },
    unChangedIntent () {},
  };

  beforeEach(() => {
    searchSpy.mockClear();
  });

  describe('when intent handler is specified', () => {
    describe('with answerWith', () => {
      describe('when handler is invoked', () => {
        it('searches Algolia', () => {
          const expectedQuery = 'query';
          const scope = {event: {request: {intent: {slots: {query: {value: expectedQuery}}}}}};
          const builtHandlers = buildHandlers(handlers, index);
          builtHandlers.spyIntent.call(scope);
          expect(searchSpy).toHaveBeenCalledWith(expectedQuery);
        });
      });
    });

    describe('without answerWith', () => {
      it('does not search Algolia', () => {
        buildHandlers(handlers, index).unChangedIntent();
        expect(searchSpy).not.toHaveBeenCalled();
      });
    });
  });
});
