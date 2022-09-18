const _ = require('lodash');

module.exports.getItemsToProcess = async (trimmedCsvObjects, existingRecords) => {
    try {
        
        let itemsToProcess = [];


        // adds itemsToDelete to dynamoItemsToUpdate table
        let dynamoIds = [];
        existingRecords.forEach(element => dynamoIds.push(element.id))

        let csvIds = [];
        trimmedCsvObjects.forEach(element => csvIds.push(element.id));
        
        let idsToDeleteFromDynamo = dynamoIds.filter(id => !csvIds.includes(id));

        // idsToDeleteFromDynamo.map(id => dynamoItemsToUpdate.itemsToDelete.push({DeleteRequest: {Key: {id}}}))
        idsToDeleteFromDynamo.map(id => itemsToProcess.push({DeleteRequest: {Key: {id}}}))

        // returns whole item to be deleted:

        // existingRecords.forEach(element => {
        //     if (idsToDeleteFromDynamo.includes(element.id)) {
        //         let formattedElement = { PutRequest: {Item: {element}}}
        //         dynamoItemsToUpdate.itemsToDelete.push(element)
        //     }
        // })


        // looks for matching ids, compare content, adds differing csvContent to itemsToProcess
        let recordsId 
        existingRecords.forEach((element) => {
            recordsId = element.id;
            let index = trimmedCsvObjects.findIndex(csvElement => csvElement.id === recordsId)

            if (index >= 0 && element.id === recordsId) {
                if (!_.isEqual(element, trimmedCsvObjects[index])) {
                    Item = trimmedCsvObjects[index]
                    let PutRequest = { PutRequest: {Item}}
                    itemsToProcess.push(PutRequest);
                }
            } 
        })

        // find ids that exist in csv, but not in dynamo
        let csvIdsNotInDynamo = []
        csvIdsNotInDynamo = csvIds.filter(id => !dynamoIds.includes(id));
        
        // if id exists in csv, but not in dynamo, add object to dynamoItemsToUpdate.itemsToAddOrUpdate
        trimmedCsvObjects.forEach(element => {
            if (csvIdsNotInDynamo.includes(element.id)) {
                Item = element
                itemsToProcess.push({ PutRequest: {Item}})
            }
        })

        return itemsToProcess

    } catch (ex) {
        console.error(ex);
        throw new Error(ex);
    }
}
