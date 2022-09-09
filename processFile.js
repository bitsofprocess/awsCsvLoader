"use strict";

//imports
const { csvToJson } = require("./csvToJson");
const { getAllowedProperties } = require('./getAllowedProperties');
const { removeIrrelevantPropertiesFromCsvObjects } = require('./removeIrrelevantPropertiesFromCsvObjects');
const { getDynamoTableRecords } = require('./getDynamoTableRecords');
const { reconcileTableToObjects } = require('./reconcileTableToObjects');

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// const csv = require("csvtojson");
const _ = require("lodash");

const csvFilePath = process.argv[2];
const game_code = process.argv[3];
const tableName = process.argv[4];
const myCredentials = {
  accessKeyId: process.argv[5],
  secretAccessKey: process.argv[6],
};
// Set the region
// AWS.config.update({region: 'us-east-1'});
AWS.config = new AWS.Config({
  credentials: myCredentials,
  region: "us-east-1",
});

// Create DynamoDB service object
// var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const dynamodb = new AWS.DynamoDB.DocumentClient();

const processFile = async () => {
    try {
        // create objects from csv
        const csvObjects = await csvToJson(csvFilePath);

        // trim extra properties from csv objects

        const allowedProperties = await getAllowedProperties(game_code);
        const trimmedCsvObjects = await removeIrrelevantPropertiesFromCsvObjects(csvObjects, allowedProperties);
        
        // // get all data that exists in the DB for this table
        // const args = getArgumentsFromCommandLine();
        const existingRecords = await getDynamoTableRecords(tableName, dynamodb);

        // //reconcile rows with csvObjects
        // console.log('trimmedCsvObjects: ', trimmedCsvObjects);
        // console.log('existingRecords: ', existingRecords)
        const { itemsToDelete, itemsToAddOrUpdate } = await reconcileTableToObjects(trimmedCsvObjects, existingRecords);
        
        // const dbDeleteResults = await deleteRowsFromDynamoTable(deletedRows);
        // const dbUpdateResults = await updateRowsInDynamoTable(updatedRows);

    } catch (ex) {
        console.error(ex);
        throw new Error(ex);
    }
}

processFile()