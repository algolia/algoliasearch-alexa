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

  const skill = function() {};

  skill.on = function(name, fn) {
    errorHandlers[name] = fn;
  };

  return skill;
}

algoliaAlexaAdapter.prototype.search = function(event, context) {
  new this.Skill().execute(event, context);
};
