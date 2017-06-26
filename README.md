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
  - [Dev](#dev)
  - [Linting](#linting)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Algolia Alexa Skills Kit Adapter

This is an adapter that allows you to use the Algolia search API easily within your Alexa Skills Kit Skill. It provides tools for integrating Algolia search and a framework for structuring your Alexa skill.

Developed to be used on Amazon Lambda, you set up your intent handlers normally except for any that you want to leverage Algolia. For these handlers, a configuration object must be provided that defines the handler you want to call upon completion of the Algolia search. Algolia will be queried automatically, then provide an object with the results, intent, session, and response to your defined handler.

Here you can see an example usage:

```javascript
const algoliaAlexaAdapter = require('algoliasearch-alexa').default;

const voiceSearch = algoliaAlexaAdapter({
  algoliaAppId: 'applicationId',
  algoliaApiKey: 'publicSearchKey',
  defaultIndexName: 'products',
  alexaAppId: 'amzn1.echo-sdk-ams.app.[unique-value-here]',
  handlers: {
    LaunchRequest (launchRequest, session, response) {
      this.emit(':tell', 'Welcome to the skill!')
    },
    SearchProductIntent: {
      answerWith: function (data) {
        if(data.results.length) {
          this.emit(':tell', `There were ${data.results.hits.length} products found.`);
        } else {
          this.emit(':tell', 'We could find no products. Please try again.');
        }
      },
    },
    CustomHelpIntent: function (intent, session, response) {
      const speechOutput = 'Find one of 10,000 products from the Product Store, powered by Algolia.';
      this.emit(':ask', speechOutput);
    },
  },
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
