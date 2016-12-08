# Algolia Alexa Skills Kit Adapter

This is an adapter that allows you to use the Algolia search API easily within your Alexa Skills Kit Skill.

```javascript
let voiceSearch = algoliaAlexaAdapter({
  algoliaAppId: 'APP_ID',
  alexaAppId: 'FROM_AMAZON_LAMBDA',
  defaultIndexName: 'products',
  comparisons: [{
    'less than': '>',
    'greater than': '>'
  }],
  availableSorts: [{
    indexName: 'products_PRICE_DESC',
    invocations: ['price descending', 'price low to high']
  }, {
    indexName: 'products_PRICE_ASC',
    invocations: ['price ascending', 'price high to low']
  }],
  handlers: {
    onLaunch: function(launchRequest, session, response) {
      //
    },
    intentHandlers: {
      SearchProductIntent: {
        answerWith: function(data)
          // Can tell/ask based on whatever criteria they like (even if there are no results)
        }
        comparisons: {
          'more expensive than': '>',
          'less expensive than': '<'
        },
        facets: ['brand', 'availability']
      },
      HelpIntent: function(intent, session, response){
        var speechOutput = 'Find one of 10,000 products from Best Buy, powered by Algolia.';
        response.ask(speechOutput);
      }
    }
  }
});

voiceSearch.on('algoliaError', (err)=> {
  // Speak to the user
  // Tell the user if it's something they can fix or if it's unfixable
});

exports.handler = voiceSearch;
```
