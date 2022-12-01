module.exports.wrapId = async (arrayOfObjects) => {

    let formattedObjectArray = [];

    //converts id to a string and adds zeroes for numbers less than 3 digits
    arrayOfObjects.map(element => {
        
          let currentId = `${element.id}`;
          
        
          formattedObjectArray.push({...element, id: currentId.padStart(3, 0)})
          
        })

    return formattedObjectArray;
}


