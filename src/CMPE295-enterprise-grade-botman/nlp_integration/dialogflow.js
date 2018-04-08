// You can find your project ID in your Dialogflow agent settings
const projectId = 'my-weather-4e08d'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const query = 'What is the weather like in Pune tomorrow';
const languageCode = 'en-US';

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
// Instantiates clients
const sessionClient = new dialogflow.SessionsClient();
const contextsClient = new dialogflow.ContextsClient();
const intentsClient = new dialogflow.IntentsClient();

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

//Function to detect intent
function detectIntent(query) {
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };

    // Send request and log result
    sessionClient
        .detectIntent(request)
        .then(responses => {
            console.log('Detected intent : \n' + JSON.stringify(responses));
            const result = responses[0].queryResult;
            console.log(`  Query: ${result.queryText}`);
            console.log(`  Response: ${result.fulfillmentText}`);
            if (result.intent) {
                console.log(`  Intent: ${result.intent.displayName}`);
                console.log(logIntent(result.intent));
            } else {
                console.log(`  No intent matched.`);
            }
        })
        .catch(err => {
            console.error('ERROR:', err);
        });

}






function listIntents(projectId) {


    // The path to identify the agent that owns the intents.
    const projectAgentPath = intentsClient.projectAgentPath(projectId);

    const request = {
        parent: projectAgentPath,
    };

    // Send the request for listing intents.
    return intentsClient
        .listIntents(request)
        .then(responses => {
            return responses[0];
        })
        .catch(err => {
            console.error('Failed to list intents:', err);
        });
}

function showIntents(projectId) {
    return listIntents(projectId).then(intents => {
        return Promise.all(
            intents.map(intent => {
                return getIntent(intent);
            })
        );
    });
}

function getIntent(intent) {
    const request = {
        // By default training phrases are not returned. If you want training
        // phrases included in the returned intent, uncomment the line below.
        //
        // intentView: 'INTENT_VIEW_FULL',
        name: intent.name,
    };

    // Send the request for retrieving the intent.
    return intentsClient
        .getIntent(request)
        .then(responses => {
            console.log('Found intent:');
            logIntent(responses[0]);
        })
        .catch(err => {
            console.error(`Failed to get intent ${intent.displayName}`, err);
        });
}

function logIntent(intent) {
    console.log(`  ID:`, intentsClient.matchIntentFromIntentName(intent.name));
    console.log(`  Display Name: ${intent.displayName}`);
    const outputContexts = intent.outputContexts
        .map(context => {
            return contextsClient.matchContextFromContextName(context.name);
        })
        .join(', ');
    console.log(`  Priority: ${intent.priority}`);
    console.log(`  Output contexts: ${outputContexts}`);

    console.log(`  Action: ${intent.action}`);
    console.log(`  Parameters:`);
    intent.parameters.forEach(parameter => {
        console.log(
            `    ${parameter.displayName}: ${parameter.entityTypeDisplayName}`
        );
    });

    console.log(`  Responses:`);
    intent.messages.forEach(message => {
        const messageContent = JSON.stringify(message[message.message]);
        console.log(
            `    (${message.platform}) ${message.message}: ${messageContent}`
        );
    });

    const defaultResponsePlatforms = intent.defaultResponsePlatforms.join(', ');
    console.log(
        `  Platforms using default responses: ${defaultResponsePlatforms}`
    );
    console.log('');
}


detectIntent(query);
//showIntents(projectId);