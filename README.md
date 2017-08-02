<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Algolia Alexa Skills Kit Adapter](#algolia-alexa-skills-kit-adapter)
  - [Quick start guide](#quick-start-guide)
  - [API Description](#api-description)
    - [algoliaAlexaAdapter](#algoliaalexaadapter)
      - [Handlers Configuration](#handlers-configuration)
        - [Without Querying Algolia](#without-querying-algolia)
        - [Querying Algolia](#querying-algolia)
      - [Localization](#localization)
  - [Dev](#dev)
  - [Linting](#linting)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Algolia Alexa Skills Kit Adapter

This is an adapter that allows you to use the Algolia search API easily within your Alexa Skills Kit Skill. It provides tools for integrating Algolia search and a framework for structuring your Alexa skill.

Developed to be used on Amazon Lambda, you set up your intent handlers normally except for any that you want to leverage Algolia. For these handlers, a configuration object must be provided that defines the handler you want to call upon completion of the Algolia search. Algolia will be queried automatically, then provide an object with the results, intent, session, and response to your defined handler.

Here you can see an example usage:

```javascript
const algoliaAlexaAdapter = require('algoliasearch-alexa').default;

const handlers = {
  LaunchRequest () {
    this.emit(':tell', 'Welcome to the skill!');
  },
  SearchProductIntent: {
    answerWith (data) {
      if(data.results.length) {
        this.emit(':tell', `There were ${data.results.hits.length} products found.`);
      } else {
        this.emit(':tell', 'We could find no products. Please try again.');
      }
    },
    params: {
      hitsPerPage: 1,
      filters (requestBody) {
        return `brand:${requestBody.request.intent.slots.brand.value}`;
      }
    },
  },
  CustomHelpIntent () {
    const speechOutput = 'Find one of 10,000 products from the Product Store, powered by Algolia.';
    this.emit(':ask', speechOutput);
  },
  Unhandled () {
    this.emit(':ask', 'Look for products in the Product Store.');
  },
};

const voiceSearch = algoliaAlexaAdapter({
  algoliaAppId: 'applicationId',
  algoliaApiKey: 'publicSearchKey',
  defaultIndexName: 'products',
  alexaAppId: 'amzn1.echo-sdk-ams.app.[unique-value-here]',
  handlers,
});

module.exports = voiceSearch;
```

## Quick start guide

Follow [this guide](quickstart.md) to quickly start with Algolia and Alexa.

## API Description

### algoliaAlexaAdapter

This function accepts a single argument, which is a configuration object.

This configuration object accepts:
 - `algoliaAppId`: The app ID from your Algolia application **(required)**
 - `algoliaApiKey`: The public search key associated with your Algolia application **(required)**
 - `alexaAppId`: Used to verify that the request is coming from your Alexa Skill, responding with an error if defined and requesting application does not match this ID; optional but recommended
 - `defaultIndexName`: The index you want to query on Algolia **(required)**
 - `handlers`: An object with your standard request (`LaunchRequest`, `IntentRequest`, or `SessionEndedRequest`) or built-in and intent handlers **(required)**

#### Handlers Configuration

Each handler can be configured in one of two ways. How it's configured depends on whether one wants to query Algolia first or not.

##### Without Querying Algolia

Specify a key-value pair where the key is the intent handler name and the value is a function. The function will accept no arguments, but has the current request information bound to `this`, provided by the Alexa service via Lambda.

##### Querying Algolia

Specify a key-value pair where the key is the intent handler name and the value is an object. That object contains a function `answerWith` which will be invoked following the Algolia search. This accepts one argument: an object with values for the keys of `results` from Algolia and `event` from the Alexa service.

#### State Management

States in the Alexa Skills Kit represent, roughly, different steps in the skill flow process. For example, there can be a state for starting a game, a state for being in the middle of a turn, and an empty state that represents the skill launch. You can [read more here](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs#making-skill-state-management-simpler) at the Alexa Skills Kit SDK README.

To define your states for each handler, provide an array of objects, with each that you want tied to a specific state to have a key of `state`:

```javascript
const states = {
  SEARCHINGMODE: '_SEARCHINGMODE'
};

const handlers = [
  {
    NewSession () {
      this.handler.state = states.SEARCHINGMODE;
      this.emit(':ask', 'Welcome to the skill! What product would you like to find?');
    },
  }, {
    state: states.SEARCHINGMODE,
    'AMAZON.YesIntent': {
      answerWith (data) {
        // Do something...
      }
    }
  }
];
```

#### Localization

You can set your localization strings via the `languageStrings` option on the top level object. Within the intents, you will invoke them with `this.t` as normal. [See here for more information](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs#adding-multi-language-support-for-skill) on localizing a skill.

## Dev

```
$ npm run dev
```

## Linting

Lints using eslint:

```
$ npm run lint
```

Autofixer:

```
$ npm run lint:fix
```
