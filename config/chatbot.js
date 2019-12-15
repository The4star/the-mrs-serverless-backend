const dialogflow = require('dialogflow');
const structjson = require('structjson')

// Models
const Registration = require('../models/Registration')

// keys
const {googleProjectID, dialogFlowSessionID, dialogFlowSessionLanguageCode, googleClientEmail, googlePrivateKey} = require('./keys')

const credentials = {
    client_email: googleClientEmail,
    private_key: googlePrivateKey
}

const sessionClient = new dialogflow.SessionsClient({projectId: googleProjectID, credentials});

const textQuery = async (text, userId, parameters = {}) => {
    let sessionPath = sessionClient.sessionPath(googleProjectID, dialogFlowSessionID + userId)
    let self = module.exports;

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: text,
                // The language used by the client (en-US)
                languageCode: dialogFlowSessionLanguageCode,
            },
        },
        queryParams: {
            payload: {
                data: parameters
            }
        }
    };

    let response = await sessionClient.detectIntent(request);
    response = await self.handleAction(response)

    result = response[0].queryResult; 

    return result    
}

const eventQuery = async (event, userId, parameters = {}) => {
    let sessionPath = sessionClient.sessionPath(googleProjectID, dialogFlowSessionID + userId)
    let self = module.exports;

    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                // The query to send to the dialogflow agent
                name: event,
                parameters: structjson.jsonToStructProto(parameters),
                // The language used by the client (en-US)
                languageCode: dialogFlowSessionLanguageCode,
            },
        },
    };

    let response = await sessionClient.detectIntent(request);
    response = await self.handleAction(response)

    result = response[0].queryResult; 

    return result    
}

const handleAction = (response) => {
    let self = module.exports;
    let queryResult = response[0].queryResult;

    switch (queryResult.action) {
        case "RestaurantRecommendations.RestaurantRecommendations-yes":
            if (queryResult.allRequiredParamsPresent) {
                self.saveRegistration(queryResult.parameters.fields);          
            }
            break;
    }
    return response;
}

const saveRegistration = async (fields) => {

    const alreadyexists = await Registration.findOne({
        email: fields.email.stringValue
    })

    if (!alreadyexists) {
         const registration = new Registration({
        name: fields.name.stringValue,
        email: fields.email.stringValue
    })
        try {
        await registration.save();
        } catch (error) {
            console.log(error)
        }
    }
   
}

module.exports = {
    textQuery,
    eventQuery,
    handleAction,
    saveRegistration
}

