import Alexa from 'alexa-sdk';
import EventEmitter from 'events';

export default function algoliaAlexaAdapter (opts) {
  if (!opts) {
    throw new Error('Must initialize with options');
  }

  const {
    algoliaAppId,
    alexaAppId,
    defaultIndexName,
    comparisons,
    availableSorts,
    handlers,
  } = opts;

  if (algoliaAppId === undefined) {
    throw new Error('Must initialize with algoliaAppId');
  }

  if (alexaAppId === undefined) {
    throw new Error('Must initialize with alexaAppId');
  }

  if (defaultIndexName === undefined) {
    throw new Error('Must initialize with defaultIndexName');
  }

  const skill = new EventEmitter();

  skill.handler = function(event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
  };

  return skill;
}
