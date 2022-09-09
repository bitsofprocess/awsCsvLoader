module.exports.removeIrrelevantPropertiesFromCsvObjects = async (csvObjects, allowedProperties) => {
 
    let filteredCsvObjects = [];
    csvObjects.forEach(
        (element, index) =>
          (filteredCsvObjects[index] = Object.fromEntries(
            Object.entries(element).filter((element) =>
              allowedProperties.includes(element[0])
            )
          ))
      );

     return filteredCsvObjects;
}