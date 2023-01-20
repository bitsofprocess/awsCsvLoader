const csv = require('csvtojson');

module.exports.csvToJson = async (csvFilePath) => {
    // const converter = csv({escape: "~"});
    
    try {
        const data = await csv({checkType: true, escape: '~'})
            .preRawData((csvRawData)=>{
                return new Promise((resolve,reject)=>{
                    var newData=csvRawData
                        .replace(/\[""dquotes/gi, function (x) {
                            return '["\"';})
                        .replace(/dquotes"",""dquotes/gi, function (x) {
                            return '\\"","\\"' ;})
                        .replace(/dquotes""\]/gi, function (x) {
                            return '\\""]' ;})
                        .replace(/dquotes/gi, function (x) {
                            return '\\""]' ;})
                    resolve(newData);
                    console.log("newData" + newData);
                })
            })
            .fromFile(csvFilePath);
        console.log("data:\n" + data);
        // log the JSON array
        return data;
       

    } catch (err) {
        console.log(err);
    }
    
};
