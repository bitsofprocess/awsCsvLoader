// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
const _ = require('lodash');

module.exports.reconcileTableToObjects = async (trimmedCsvObjects, existingRecords) => {
    try {
 
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

        // find ids that exist in csv, but not in dynamo
        let csvIdsNotInDynamo = []
        csvIdsNotInDynamo = csvIds.filter(id => !dynamoIds.includes(id));
        
        // if id exists in csv, but not in dynamo, add object to dynamoItemsToUpdate.itemsToAddOrUpdate
        trimmedCsvObjects.forEach(element => {
            if (csvIdsNotInDynamo.includes(element.id)) {
                dynamoItemsToUpdate.itemsToAddOrUpdate.push(element)
            }
        })

        return dynamoItemsToUpdate

    } catch (ex) {
        console.error(ex);
        throw new Error(ex);
    }
}

