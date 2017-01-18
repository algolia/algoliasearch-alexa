import Alexa from 'alexa-sdk';
import EventEmitter from 'events';
import Algoliasearch from 'algoliasearch';

function isFunction(obj) {
  return typeof obj === 'function';
}

function hasAnswerWith(obj) {
  return typeof obj === 'object' && obj.answerWith;
}

function buildHandlers (handlersObj, index) {
  const intentHandlers = handlersObj.intentHandlers;

  Object.keys(intentHandlers).map(key => {
    if (isFunction(intentHandlers[key])) {
      return intentHandlers[key];
    } else if (hasAnswerWith(intentHandlers[key])) {
      intentHandlers[key].answerWith = function(intent, session, response) {
        const args = {intent, session, response};
        index
          .search(intent.query.slots.value)
          .then((err, content) => {
            Object.assign(args, {err, content});
            intentHandlers[key].answerWith(args);
          });
      };
      return intentHandlers[key];
    } else {
      throw new Error('Intent handler must either be a function or an object' +
      'with key of "answerWith" which is a function.');
    }
  });

  // TODO: Seriously test that
  // FIXME: Also not super happy with this implem
  return handlersObj;
}

export default function algoliaAlexaAdapter (opts) {
  if (!opts) {
    throw new Error('Must initialize with options');
  }

  const {
    algolia,
    alexaAppId,
    defaultIndexName,
    comparisons,
    availableSorts,
    handlers,
  } = opts;

  if (algolia === undefined || algolia.appId === undefined || algolia.apiKey === undefined) {
    throw new Error('Must initialize with algolia object with appId and apiKey');
  }

  if (alexaAppId === undefined) {
    throw new Error('Must initialize with alexaAppId');
  }

  if (defaultIndexName === undefined) {
    throw new Error('Must initialize with defaultIndexName');
  }

  const skill = new EventEmitter();
  const client = new Algoliasearch(algolia.appId, algolia.apiKey);
  const index = client.initIndex(defaultIndexName);

  skill.handler = function(event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(buildHandlers(handlers, index));
    alexa.execute();
  };

  return skill;
}
