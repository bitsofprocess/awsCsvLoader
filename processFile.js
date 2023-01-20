"use strict";

//imports
const { csvToJson } = require('./functions/csvToJson');
const { wrapId } = require('./functions/wrapId');
const { getAllowedProperties } = require('./functions/getAllowedProperties');
const { removeIrrelevantPropertiesFromCsvObjects } = require('./functions/removeIrrelevantPropertiesFromCsvObjects');
const { getDynamoTableRecords } = require('./functions/getDynamoTableRecords');
const { getItemsToProcess } = require('./functions/getItemsToProcess');
const { updateDynamoDb } = require('./functions/updateDynamoDb');

const _ = require("lodash");

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// const { ChimeSDKMessaging } = require('aws-sdk');

const csvFilePath = process.argv[2];
const game_code = process.argv[3];
const tableName = process.argv[4];
const myCredentials = {
  accessKeyId: process.argv[5],
  secretAccessKey: process.argv[6],
};
// Set the region
AWS.config = new AWS.Config({
  credentials: myCredentials,
  region: "us-east-1",
});

// Create DynamoDB service object
const dynamodb = new AWS.DynamoDB.DocumentClient();

const processFile = async () => {
    try {
   
        const csvObjects = await csvToJson(csvFilePath);
        
        const formattedCsvObjects = await wrapId(csvObjects);
        
        const allowedProperties = await getAllowedProperties(game_code);

        const trimmedCsvObjects = await removeIrrelevantPropertiesFromCsvObjects(formattedCsvObjects, allowedProperties);

        // console.log(trimmedCsvObjects)
        const existingRecords = await getDynamoTableRecords(tableName, dynamodb);

        // console.log(existingRecords)
        const itemsToProcess = await getItemsToProcess(trimmedCsvObjects, existingRecords);

        console.log(itemsToProcess[0])
        const DynamoTableResponse = await updateDynamoDb(itemsToProcess, tableName, dynamodb);
      
        
    } catch (ex) {
        console.error(ex);
        throw new Error(ex);
    }
}

processFile()