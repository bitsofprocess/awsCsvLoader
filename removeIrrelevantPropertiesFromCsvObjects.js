module.exports.removeIrrelevantPropertiesFromCsvObjects = async (csvObjects, allowedProperties) => {
 

    csvObjects.forEach(
        (element, index) =>
          (csvObjects[index] = Object.fromEntries(
            Object.entries(element).filter((element) =>
              allowedProperties.includes(element[0])
            )
          ))
      );

     return csvObjects;
}