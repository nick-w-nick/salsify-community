const path = require('path'); // Built-in module to traverse file paths/directories
const fs = require('fs'); // Built in module to interact with the filesystem
const XLSX = require('xlsx'); // NPM module to interact with spreadsheets

// Parse XLSX spreadsheet in the current directory named 'groups-to-import.xlsx'
const sheetData = XLSX.readFile(path.join(__dirname, 'groups-to-import.xlsx'));

// Convert the first sheet inside of the workbook to JSON
const jsonData = XLSX.utils.sheet_to_json(sheetData.Sheets[Object.keys(sheetData.Sheets)[0]]);

const groupData = jsonData.map(group => {
    // Isolate the group name from the roles
    const { groupName, ...roles } = group;
    
    // Create a new array containing the names of the roles
    const rolesList = Object.keys(roles);
    
    // Iterate over the array of roles to put them in the correct format
    const accessRules = rolesList.map(role => {
        return {
            entityName: role,
            roles: roles[role].split('|') // Split the roles into an array based on the pipe (|) delimiter
        };
    });
    
    return {
        groupName,
        accessRules
    };
});

// Create a new JSON file locally containing the data from the spreadsheet in the correct format
fs.writeFile(path.join(__dirname, 'imported-groups.json'), JSON.stringify(groupData), (err) => {
    if (err) {
        return console.error(`Error importing groups from spreadsheet.\n${err}`);
    }
    return console.log('Successfully imported groups from spreadsheet.');
});