import Alexa from 'alexa-sdk';

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

  const errorHandlers = {
    algoliaError () {
      throw new Error('algoliaError must be overwritten by client');
    },
  };

  const skill = {};

  skill.on = function(name, fn) {
    errorHandlers[name] = fn;
  };

  skill.handler = function(event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
  };

  return skill;
}
