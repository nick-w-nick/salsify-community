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