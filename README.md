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
        speechTemplate: 'The top product is {{name}} from {{brand}}. It costs ${{price}}.',
        emptyTemplate: function(data){
          return 'There were no products for your {{data.query}} search.'
        },
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

exports.handler = voiceSearch.search(event, context);
```
