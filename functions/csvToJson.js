const csv = require('csvtojson');

module.exports.csvToJson = async (csvFilePath) => {
    // const converter = csv({escape: "~"});
    
    try {
        const data = await csv({checkType: true, escape: "~"}).fromFile(csvFilePath);

        // log the JSON array
        return data;
       

    } catch (err) {
        console.log(err);
    }
    
};