
module.exports.updateDynamoDb = (itemsToAddOrUpdate, tableName, dynamodb) => {
    
    // reconcileTableToObjects.js
    // create array with formatted delete requests/deleteIds
    // create combined array comprised of formatted Delete and Put Requests
    
    // this file: 
    // reference: console.log('chunked array: ', _.chunk(itemsToAddOrUpdate, 25)) // chunks array into chunks of 2nd arg #
    
    //chunk into array of 25
    //put array into RequestItems[tableName] = []
    // batchWrite to dynamo
    
    let obj = {};
    obj = itemsToAddOrUpdate[0]
  
    const RequestItems = {};
    RequestItems[tableName] = [obj];
    const params = {};
    params.RequestItems = RequestItems;



    try {
        let res = await dynamodb.batchWrite(params).promise()
        let data = res;
        console.log(data)
    } catch(err) {
        console.log(err)
    }

}