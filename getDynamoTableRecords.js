// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

module.exports.getDynamoTableRecords = async (tableName, dynamodb) => {

    let ddbData
    var params = {
        TableName: tableName
    }

    try {
      let dataScan = await dynamodb.scan(params).promise().then(
          result => ddbData = result.Items
      )
      
    } catch (err) {
      console.log(err);
    }
    return ddbData;
   
  };



