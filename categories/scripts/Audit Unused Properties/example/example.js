const { auditUnusedProperties } = require('../src/exports');

const properties = ['SKU', 'GTIN', 'Primary Image', 'Brand Name', 'Net Weight'];

console.log(auditUnusedProperties(properties));

// [
//     {
//         property: 'SKU',
//         empty: false
//     },
//     {
//         property: 'GTIN',
//         empty: false
//     },
//     {
//         property: 'Primary Image',
//         empty: true
//     },
//     {
//         property: 'Brand Name',
//         empty: false
//     },
//     {
//         property: 'Net Weight',
//         empty: true
//     }
// ]