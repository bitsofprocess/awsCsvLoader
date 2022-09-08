const csv = require('csvtojson');

module.exports.csvToJson = async (csvFilePath) => {
    try {
        const data = await csv().fromFile(csvFilePath);

        // log the JSON array
        return data;
       

    } catch (err) {
        console.log(err);
    }
    
};