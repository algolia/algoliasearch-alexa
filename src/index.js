import Alexa from 'alexa-sdk';
import EventEmitter from 'events';
import Algoliasearch from 'algoliasearch';
import buildHandlers from './utils/build_handlers.js';

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
    SearchConstructor = Algoliasearch,
    AlexaSDK = Alexa,
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

  if (handlers === undefined) {
    throw new Error('Must initialize with handlers');
  }

  const skill = new EventEmitter();
  const client = new SearchConstructor(algolia.appId, algolia.apiKey);
  const index = client.initIndex(defaultIndexName);

  skill.handler = function(event, context) {
    const alexa = AlexaSDK.handler(event, context);
    alexa.registerHandlers(buildHandlers(handlers, index));
    alexa.execute();
  };

  return skill;
}
