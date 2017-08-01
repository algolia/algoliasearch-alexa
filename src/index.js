import AlexaSDK from 'alexa-sdk';
import searchConstructor from 'algoliasearch';
import buildHandlers from './utils/build_handlers.js';
import versionNumber from './version.js';

export default function algoliaAlexaAdapter (opts) {
  if (!opts) {
    throw new Error('Must initialize with options');
  }

  const {
    algoliaAppId,
    algoliaApiKey,
    defaultIndexName,
    handlers,
    alexaAppId,
    languageStrings,
    algoliasearch = searchConstructor,
    Alexa = AlexaSDK,
  } = opts;

  const _StateString = Alexa.StateString;

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

  const skill = {};
  const client = algoliasearch(algoliaAppId, algoliaApiKey);
  client.addAlgoliaAgent(`Alexa Skills Kit Adapter ${versionNumber}`);
  const index = client.initIndex(defaultIndexName);

  skill.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = alexaAppId;
    if (languageStrings) {
      alexa.resources = languageStrings;
    }
    alexa.registerHandlers(...buildHandlers(handlers, index, _StateString));
    alexa.execute();
  };

  return skill;
}
