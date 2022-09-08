// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

module.exports.getDynamoTableRecords = async (tableName, dynamodb) => {

    let ddbData
    var params = {
        TableName: tableName
    }

    try {
        let data = await dynamodb.scan(params).promise().then(response => {
            ddbData = response.Items
        });
        
      }
    catch (err) {
      console.log(err);
    } 
   return ddbData

  };




