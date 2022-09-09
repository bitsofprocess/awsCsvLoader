"use strict";

//imports
const { csvToJson } = require("./csvToJson");
const { getAllowedProperties } = require('./getAllowedProperties');
const { removeIrrelevantPropertiesFromCsvObjects } = require('./removeIrrelevantPropertiesFromCsvObjects');
const { getDynamoTableRecords } = require('./getDynamoTableRecords');
const { getItemsToProcess } = require('./getItemsToProcess');
const { updateDynamoDb } = require('./updateDynamoDb');

const _ = require("lodash");

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

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

        const allowedProperties = await getAllowedProperties(game_code);

        const trimmedCsvObjects = await removeIrrelevantPropertiesFromCsvObjects(csvObjects, allowedProperties);
        
        const existingRecords = await getDynamoTableRecords(tableName, dynamodb);

        const itemsToProcess = await getItemsToProcess(trimmedCsvObjects, existingRecords);

        const DynamoTableResponse = await updateDynamoDb(itemsToProcess, tableName, dynamodb);
    
    } catch (ex) {
        console.error(ex);
        throw new Error(ex);
    }
}

processFile()