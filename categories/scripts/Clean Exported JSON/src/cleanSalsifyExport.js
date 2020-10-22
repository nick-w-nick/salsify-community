/**
 * Clean/format the JSON exported from a custom channel within Salsify that has been configured to export JSON
 * @example
 * const exportedJSON = require('./your-salsify-export.json');
 * const cleanedJSON = cleanSalsifyExport(exportedJSON);
 * console.log(cleanedJSON);
 * 
 * @param {[Object]} productData - The entire JSON array from your custom Salsify channel export
 * @returns {[Object]} A clean array consisting only of the product data within the export, with everything else removed
 */

module.exports = cleanSalsifyExport = (productData) => {
    // Isolate 'products' object from initial array
    const productsArray = productData.find(obj => {
        return obj.products;
    });
    
    const filteredProducts = productsArray.products.flatMap(obj => {
        // // Remove any products that contain a dash "-"
        // if (obj.SKU.includes('-')) {
        //     return [];
        // }
        
        // Get all keys that don't include "salsify:"
        const nonSalsify = Object.keys(obj).filter(key => {
            if (key.slice(0, 8) !== 'salsify:') {
                return key;
            }
        })
        
        // Create an object for the key: value pairs
        const valueArray = nonSalsify.map(key => {
            return ({ [key]: obj[key] });
        });
        
        // Merge the new array of objects together
        return Object.assign({}, ...valueArray);
    });
    
    return filteredProducts;
};