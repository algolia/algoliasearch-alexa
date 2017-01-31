import AlexaSDK from 'alexa-sdk';
import EventEmitter from 'events';
import searchConstructor from 'algoliasearch';
import buildHandlers from './utils/build_handlers.js';

export default function algoliaAlexaAdapter (opts) {
  if (!opts) {
    throw new Error('Must initialize with options');
  }

  const {
    algoliaAppId,
    algoliaApiKey,
    defaultIndexName,
    handlers,
    algoliasearch = searchConstructor,
    Alexa = AlexaSDK,
  } = opts;

  if (algoliaAppId === undefined) {
    throw new Error('Must initialize with algoliaAppId');
  }

  if (algoliaApiKey === undefined) {
    throw new Error('Must initialize with algoliaApiKey');
  }

  if (defaultIndexName === undefined) {
    throw new Error('Must initialize with defaultIndexName');
  }

  if (handlers === undefined) {
    throw new Error('Must initialize with handlers');
  }

  const skill = new EventEmitter();
  const client = algoliasearch(algoliaAppId, algoliaApiKey);
  const index = client.initIndex(defaultIndexName);

  skill.handler = function(event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(buildHandlers(handlers, index));
    alexa.execute();
  };

  return skill;
}
