const fs = require('fs');
const path = require('path');

const exampleJSON = require('./exampleJSON.json'); // The name of the JSON file exported from Salsify
const { cleanSalsifyExport } = require('../src/exports');

const outputFilename = 'cleanedJSON.json'; // the filename that will be used to create the new file containing the cleaned JSON

try {
    const cleanedJSON = cleanSalsifyExport(exampleJSON);
    
    fs.writeFileSync(
        path.join(__dirname, outputFilename),
        JSON.stringify(cleanedJSON) // Convert the JavaScript object from the output to valid JSON syntax
    );
    
    console.log(`${outputFilename} has successfully been created.`);
} catch (error) {
    console.error(`An error has occurred when creating ${outputFilename}.\n${error}`)
}