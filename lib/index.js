'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = algoliaAlexaAdapter;

var _alexaSdk = require('alexa-sdk');

var _alexaSdk2 = _interopRequireDefault(_alexaSdk);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _algoliasearch = require('algoliasearch');

var _algoliasearch2 = _interopRequireDefault(_algoliasearch);

var _build_handlers = require('./utils/build_handlers.js');

var _build_handlers2 = _interopRequireDefault(_build_handlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function algoliaAlexaAdapter(opts) {
  if (!opts) {
    throw new Error('Must initialize with options');
  }

  var algoliaAppId = opts.algoliaAppId,
      algoliaApiKey = opts.algoliaApiKey,
      defaultIndexName = opts.defaultIndexName,
      handlers = opts.handlers,
      _opts$algoliasearch = opts.algoliasearch,
      algoliasearch = _opts$algoliasearch === undefined ? _algoliasearch2.default : _opts$algoliasearch,
      _opts$Alexa = opts.Alexa,
      Alexa = _opts$Alexa === undefined ? _alexaSdk2.default : _opts$Alexa;


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

  var skill = new _events2.default();
  var client = algoliasearch(algoliaAppId, algoliaApiKey);
  var index = client.initIndex(defaultIndexName);

  skill.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers((0, _build_handlers2.default)(handlers, index));
    alexa.execute();
  };

  return skill;
}