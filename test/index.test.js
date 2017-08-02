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

const state = 'START_STATE';
const argsWithState = {
  algoliaAppId: 'APP_ID',
  algoliaApiKey: 'API_KEY',
  alexaAppId: 'amzn1.echo-sdk-ams.app.fffff-aaa-fffff-0000',
  defaultIndexName: 'products',
  handlers: [{
    HelpHandler: {
      answerWith () {},
    },
  }, {
    state,
    HelpHandler: {
      answerWith () {},
    },
    'AMAZON.YesIntent' () {},
  }],
  algoliasearch,
  Alexa,
};

const req = {
  session: {
    new: false,
    sessionId: 'amzn1.echo-api.session.[unique-value-here]',
    attributes: {},
    user: {
      userId: 'amzn1.ask.account.[unique-value-here]',
    },
    application: {
      applicationId: 'amzn1.ask.skill.[unique-value-here]',
    },
  },
  version: '1.0',
  request: {
    locale: 'en-US',
    timestamp: '2016-10-27T21:06:28Z',
    type: 'IntentRequest',
    requestId: 'amzn1.echo-api.request.[unique-value-here]',
    intent: {
      slots: {
        query: {
          name: 'query',
          value: 'snowball',
        },
      },
      name: 'AMAZON.YesIntent',
    },
  },
  context: {
    AudioPlayer: {
      playerActivity: 'IDLE',
    },
    System: {
      device: {
        supportedInterfaces: {
          AudioPlayer: {},
        },
      },
      application: {
        applicationId: 'amzn1.ask.skill.[unique-value-here]',
      },
      user: {
        userId: 'amzn1.ask.account.[unique-value-here]',
      },
    },
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

  it('can handle state-based handlers', () => {
    expect(() => { algoliaAlexaAdapter(argsWithState); }).not.toThrow();
  });
});

describe('handler', () => {
  describe('without state', () => {
    it('executes without error', () => {
      expect(() => {
        algoliaAlexaAdapter(argsWithState).handler(req, {}, () => {});
      }).not.toThrow();
    });
  });

  describe('with state', () => {
    req.session.attributes[Alexa.StateString] = state;
    it('executes without error', () => {
      expect(() => {
        algoliaAlexaAdapter(argsWithState).handler(req, {}, () => {});
      }).not.toThrow();
    });
  });
});
