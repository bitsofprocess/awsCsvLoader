module.exports.removeIrrelevantPropertiesFromCsvObjects = async (formattedCsvObjects, allowedProperties) => {

    let filteredCsvObjects = [];
    formattedCsvObjects.forEach(
        (element, index) =>
          (filteredCsvObjects[index] = Object.fromEntries(
            Object.entries(element).filter((element) =>
              allowedProperties.includes(element[0])
            )
          ))
      );

     return filteredCsvObjects;
}