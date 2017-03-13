# Quickstart Guide

To start, create an [Algolia account](https://algolia.com) and index with your data. To learn more about getting up and running, view the [Algolia documentation](https://algolia.com/docs).

## Setting up Lambda

Next set up your Lambda function by following these steps:
  - Log in to your [AWS Management Console](http://aws.amazon.com/) and navigate to Lambda
  - Select your region in the upper-righthand corner of your dashboard
    - Currently this must be either US East (N. Virginia) or EU (Ireland)
  - Click on either **Get Started Now** or **Create a Lambda Function**
  - On the next screen, select the **Blank Function** blueprint
  - In the following screen, click on the dashed square and select **Alexa Skills Kit** from the dropdown, then click on **Next**
  - Name your function (this is only for you to be able to easily find when you return to the Lambda console) and confirm that the selected runtime is **Node.js 4.3**
    - Skip the example code for now
  - For handler, leave this as `index.handler`
  - For the role, follow these steps:
    - Select **Create new role from template(s)**
    - Enter a role name
    - Select **Simple Microservice permissions** from the policy templates list
  - Click **Next** and on the following screen select **Create function**

## Setting up our Alexa skill

Now that we have our Lambda function set up, we need to set up our Alexa Skill through the following:
  - Log in to the [Amazon Developer Alexa Console](https://developer.amazon.com/edw/home.html) using your Amazon credentials
  - Beneath **Alexa Skills Kit** select **Get Started**
  - In the upper-righthand corner, you should see a yellow button that says **Add a New Skill** that you will click on
  - Fill out the fields on the next screen:
    - **Skill Type**: leave this as *Custom Interaction Model*
    - **Language**: Choose the language in which users will interact with your skill
    - **Name**: This is what's displayed in the Alexa app
    - **Invocation Name**: When users say `Alexa ask`, they follow it with the invocation name
      - It should be memorable and follow [Amazon's guidelines](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/choosing-the-invocation-name-for-an-alexa-skill)
  - On the next screen, we'll fill out our intent schema and sample utterances

  ### Creating the intent schema

  An intent schema will outline the different intents and slots. The intent names should match the handlers we specify in our code (and vice-versa). A sample intent schema would look like this:

  ```json
  {
  "intents": [
    {
      "intent": "GetListingsIntent",
      "slots": [
        {
          "name": "query",
          "type": "AMAZON.US_CITY"
        }
      ]
    },
    {
      "intent": "CustomHelpIntent",
      "slots": []
    }
  ]
}
```

An intent like our `CustomHelpIntent`, which has a very simple interaction model (e.g. `How can I use this skill?`), has no slots.

Most intents, however, will have slots. A slot is like an argument for the intent. For example, our `GetListingsIntent` could be invoked by `What homes are available for sale in Houston?` or `What homes are available for sale in Tulsa?`. New slot types are being added often and more information can be [found here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/slot-type-reference) and [here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/migrating-to-the-improved-built-in-and-custom-slot-types).

**Very important to note**: currently for the Alexa adaptor the slot name **must** be `query` and we can have just the single slot. This is what will be passed to Algolia and will be searched for in the specified index.

Fill out the custom slot types if necessary, and follow with the sample utterances. 

### Sample utterances

Sample utterances are the "training set" for Alexa to understand how people might interact with the skill. For our intent schema above, we might have the following sample utterances:

```
GetListingsIntent what homes are available in {query}
GetListingsIntent homes in {query}
GetListingsIntent {query} homes available
GetListingsIntent {query} homes for sale
GetListingsIntent what homes are for sale in {query}

CustomHelpIntent help
CustomHelpIntent help me
CustomHelpIntent what can I ask you
CustomHelpIntent get help
CustomHelpIntent to help
CustomHelpIntent to help me
CustomHelpIntent what commands can I ask
CustomHelpIntent what commands can I say
CustomHelpIntent what can I do
CustomHelpIntent what can I use this for
CustomHelpIntent what questions can I ask
CustomHelpIntent what can you do
CustomHelpIntent what do you do
CustomHelpIntent how do I use you
CustomHelpIntent how can I use you
CustomHelpIntent what can you tell me
```

Here we have the name of the intent on the left, the utterance on the right, and the slot in curly braces. You can find more information on sample utterances in [the Amazon documentation](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface#h2_sample_utterances).

Save that, and on the next screen select the radio button for **AWS Lambda ARN (Amazon Resource Name)**, select the region you selected for your Lambda function, and paste in the ARN from your Lambda function. The ARN can be found in the upper-righthand corner on the Lambda function page.

Save this, we'll be coming back to it later.

## Uploading and testing our code

Write your code using the Algolia Alexa adapter, making sure you've installed the `algoliasearch-alexa` npm module and that you have your code in an index.js file, exporting the returned function result as the only export of that file. For example:

```javascript
const algoliaAlexaAdapter = require('algoliasearch-alexa').default;

const voiceSearch = algoliaAlexaAdapter({
  algoliaAppId: 'applicationId',
  algoliaApiKey: 'publicSearchKey',
  defaultIndexName: 'listings',
  handlers: {
    onLaunch(launchRequest, session, response) {
      this.emit(':tell', 'Welcome to the skill!')
    },
    GetListingsIntent: {
      answerWith: function (data) {
        if(data.results.length) {
          this.emit(':tell', `There were ${data.results.hits.length} listings found.`);
        } else {
          this.emit(':tell', 'We could find no listings. Please try again.');
        }
      },
    },
    CustomHelpIntent: function (intent, session, response) {
      const speechOutput = 'Find one of thousands of listings from the Listing Store, powered by Algolia.';
      this.emit(':ask', speechOutput);
    },
  },
});

module.exports = voiceSearch;
```

Notice the synchronicity between our handler name and our intent schema. (`GetListingsIntent` in both.)

Next, zip up both the `index.js` file and `node_modules` directory *without* zipping them into a directory themselves.

```bash
$ zip files.zip index.js -r node_modules/
```

In the **Code** tab of the Lambda function manager, select **Upload a .ZIP file** for the code entry type and upload our new zip file. Click on the **Save and Test** button. A modal will appear that allow you to create a JSON payload that mimic what your Lambda function will receive from the Alexa Skills service.

You can create this payload by going to the **Test** section of the skill setup section of your Amazon Developer Console and typing in an utterance. You do not need to preface it with `ask {invocation name}`. The JSON payload will appear below as the Lambda Request. Copy that and paste it in the modal and hit **Save and Test** at the bottom.

All should go well and the execution result should have succeeded. You've got your Alexa Skill all set up and now just need to follow through in the Amazon Developer Console filling out the rest of the information and getting it published!

## Questions?

Run into problems or have questions? [File an issue](https://github.com/algolia/algoliasearch-alexa/issues) or [create a PR](https://github.com/algolia/algoliasearch-alexa/pulls).