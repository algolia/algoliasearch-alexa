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

  const errorHandlers = {
    algoliaError: undefined,
  };

  const skill = function() {};

  skill.onAlgoliaError = function(e) {
    return errorHandlers(e);
  };

  return skill;
}

algoliaAlexaAdapter.prototype.search = function(event, context) {
  new this.Skill().execute(event, context);
};
