"use strict";

//imports
const { csvToJson } = require("./csvToJson");
const { getAllowedProperties } = require('./getAllowedProperties');
const { removeIrrelevantPropertiesFromCsvObjects } = require('./removeIrrelevantPropertiesFromCsvObjects');
const { getDynamoTableRecords } = require('./getDynamoTableRecords');


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
const reconcileTableToObjects = async () => {
    try {
        // create objects from csv
        const csvObjects = await csvToJson(csvFilePath);

        // trim extra properties from csv objects

        const allowedProperties = await getAllowedProperties(game_code);
        const trimmedCsvObjects = await removeIrrelevantPropertiesFromCsvObjects(csvObjects, allowedProperties);
        
        // // get all data that exists in the DB for this table
        // const args = getArgumentsFromCommandLine();
        const existingRecords = await getDynamoTableRecords(tableName, dynamodb);
        
        // *** NEW FUNCTION STARTS HERE  ***
        
        let dynamoItemsToUpdate = {
            itemsToDelete: [],
            itemsToAddOrUpdate: []
        }

        // adds itemsToDelete to dynamoItemsToUpdate table
        let dynamoIds =[];
        existingRecords.forEach(element => dynamoIds.push(element.id))

        let csvIds = [];
        trimmedCsvObjects.forEach(element => csvIds.push(element.id));
        
        let idsToDeleteFromDynamo = dynamoIds.filter(id => !csvIds.includes(id));
        
        existingRecords.forEach(element => {
            if (idsToDeleteFromDynamo.includes(element.id)) {
                dynamoItemsToUpdate.itemsToDelete.push(element)
            }
        })

        // looks for matching ids, compare content, adds differing csvContent to dynamoItemsToUpdate.itemsToAddOrUpdate
        let recordsId 
        existingRecords.forEach((element) => {
            recordsId = element.id;
            let index = trimmedCsvObjects.findIndex(element => element.id === recordsId)

            if (index >= 0 && element.id === recordsId) {
                if (!_.isEqual(element, trimmedCsvObjects[index])) {
                    dynamoItemsToUpdate.itemsToAddOrUpdate.push(trimmedCsvObjects[index]);
                }
            } 
        })

    // put all ids that exist in dynamo in an array (idsInDyanmoToDelete)
    // if id exists in csv, remove from idsInDyanmoToDelete



    } catch (ex) {
        console.error(ex);
        throw new Error(ex);
    }
}

reconcileTableToObjects()