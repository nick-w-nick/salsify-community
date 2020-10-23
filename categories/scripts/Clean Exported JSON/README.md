# Clean Exported JSON

This script can be used to clean/format the JSON exported from a custom channel within Salsify that has been configured to export JSON.

> All code referenced in this README can be found within the [example.js](example/example.js) file located in the [example](example) directory.

## Table of Contents

  - [Configuration](#configuration)
  - [Usage](#usage)
  - [Explanation](#explanation)

**Related Directories/Files**

  - [/example](example)
      - [example.js](example/example.js)
      - [exampleJSON.json](example/exampleJSON.json)
      - [cleanedJSON.json](example/cleanedJSON.json)
  - [/src](src)
      - [cleanSalsifyExport.js](src/cleanSalsifyExport.js)

## Configuration
In order to configure this script, you only need to modify two sections of the script.
- The `input` filename
- The `output` filename

To configure the `input` file, drop your JSON file into the directory your are working inside of, which in this case for us, is within the [example](example) directory.

Once your file has been added to the local directory, simply replace `exampleJSON.json` with the name of your exported JSON file.

```js
const exampleJSON = require('./exampleJSON.json'); // The name of the JSON file exported from Salsify
```

To configure the `output` file, replace `cleanedJSON.json` in the `outputFilename` variable with what you would like the new file containing the cleaned JSON to be named.

```js
const outputFilename = 'cleanedJSON.json'; // the filename that will be used to create the new file containing the cleaned JSON
```

## Usage

Once you've made the configurations specified above, you should be ready to run the script and get the cleaned JSON.

> If you're not sure how to run the script, please see the [How to Run Scripts](../README.md#How%20to%20Run%20Scripts) section of the main [README.md](../README.md) file located in the root of the [scripts](../../scripts) directory.

After running the script, you should see an output similar to this in your output file:
```json
[
	{ "SKU": "AB12-Parent" },
	{
		"Actual Size": "5'3'' x 7'10''",
		"Primary Color": "Multi-Color",
		"Short Size": "5x8",
		"SKU": "ABC1234 5x8"
	},
	{
		"Actual Size": "7'10'' x 9'10''",
		"Primary Color": "Multi-Color",
		"Short Size": "8x10",
		"SKU": "ABC1234 8x10"
	}
]
```
[cleanedJSON.json](./example/cleanedJSON.json)

As you can see, it has cleared out all of the unnecessary data that Salsify includes by default with custom channel JSON exports.

The only problem that you may notice is that while the data is now cleaned and usable, it does seem to include a specific issue, in this case a product that seems to only have a value for the `SKU` property, but nothing else.
This is because in the `example JSON` file there were not only regular products, but also their parent items. This may not be the case for you, depending on how you have your variations (if any) structured inside of Salsify.

The nifty thing about the structure of our data inside of Salsify is that all parents follow a specific naming syntax for their SKU, which will *always* include a dash ("-").
On the opposite side, regular "sellable" variation products are prohibited from containing a dash within their SKU, as it is reserved for parent items only.

Luckily, there is a quick solution provided within the core [`cleanSalsifyExport.js`](src/cleanSalsifyExport.js) script, albeit commented out by default.

```js
// Remove any products that contain a dash "-"
if (obj.SKU.includes('-')) {
    return [];
}
```

Basically, this code inside of the `.flatMap` will check upon each iteration to see if the current SKU contains a dash or not.

If it does happen to contain a dash, an empty array will be outputted during that iteration, which will then be pruned on return due to the iterations occurring inside of a `.flatMap` which will "flatten" the output, causing any empty or nested values to be joined into a single-dimensional array, instead of a regular `.map` which will not remove any empty/nested values by default.
> [Learn more about array dimensions in JavaScript](https://www.javascripttutorial.net/javascript-multidimensional-array/)

After uncommenting the above code and re-running the script, the output now looks like:

```json
[
	{
		"Actual Size": "5'3'' x 7'10''",
		"Primary Color": "Multi-Color",
		"Short Size": "5x8",
		"SKU": "ABC1234 5x8"
	},
	{
		"Actual Size": "7'10'' x 9'10''",
		"Primary Color": "Multi-Color",
		"Short Size": "8x10",
		"SKU": "ABC1234 8x10"
	}
]
```

As you can see, the parent item which contained a dash in its SKU has been pruned upon being returned from the `.flatMap` inside of [`cleanSalsifyExport.js`](src/cleanSalsifyExport.js), since we told it to output an empty array during that iteration if the SKU contains a dash.

## Explanation
This script simply takes an input of JSON which has been exported from a custom channel within Salsify and removes the unnecessary bits and outputs the nested product data with internal Salsify fields removed.
> NOTE: Line 1 - 13 (Between the /** */) is in-code documentation based on the [JSDoc](https://jsdoc.app/) standard, and will be ignored within this README.

In the first part of the script, we are creating a new variable called `productsArray`, which uses the `.find` method to locate and return the object inside of the source data which has a property named `products`.

```js
// Isolate 'products' object from initial array
const productsArray = productData.find(obj => {
    return obj.products;
});
```

The reason we need to use the `.find` method instead of just chaining together properties like `productData.products` is because the object that contains the `products` array is actually inside of an array itself.

**Example** *(some values removed for length/readability)*

```json
[
	{
		"header": {
			"version": "2",
			"scope": ["all"]
		}
	},
	{
		"attributes": []
	},
	{
		"attribute_values": []
	},
	{
		"digital_assets": []
	},
	{
		"products": [
			{
				"salsify:id": "AB12-Parent",
				"salsify:created_at": "2018-02-16T19:12:10.426Z",
				"salsify:updated_at": "2020-08-18T13:48:20.384Z",
				"salsify:version": 31,
				"salsify:relations_updated_at": "2018-05-07T15:05:01.610Z",
				"salsify:profile_asset_id": null,
				"salsify:system_id": "example-id",
				"SKU": "AB12-Parent",
				"salsify:relations": [
					{
						"relation_type": "Variation",
						"salsify:target_product_id": "ABC1234 5x8",
						"salsify:created_at": "2018-05-07T15:05:01.610Z",
						"salsify:updated_at": "2018-05-07T15:05:01.610Z"
					}
				]
			}
		]
	}
]
```
> [exampleJSON.json](example/exampleJSON.json)

Once we have the object containing the `products` array isolated from the source data and now stored in the `productsArray` variable, we can begin iterating!

Under `productsArray` we have created another variable called `filteredProducts`, which will store the result of our iterations.

`filteredProducts` will be home to a `.flatMap`, which will iterate over each of the values inside of the `productsArray.products` array.
Since we are using a `.flatMap`, two _main_ things will occur during iteration and during the output:
- This is a `.map` instead of something like `.forEach`, meaning that it will create create a copy of the original array, and will return the new version once complete, instead of modifying the original array, which would require us to create a temporary empty array to store the results of the iterations by using something like `tempArray.push(data)` if we went with a `.forEach` instead of a `.map` .
- The `flat` part of `.flatMap` is an Array method available in JavaScript which is usually called via `Array.flat()`, which converts an array of nested arrays into a single one-dimensional array, hence the term "flattened array". The purpose behind using it in this function is to remove any empty arrays, which may be present once we finish iterating, depending on the functions that were called during each iteration and their output.

```js
const filteredProducts = productsArray.products.flatMap(obj => {...})
```

The first thing we need to do during our iteration is filter out all of the unnecessary data, otherwise known as internal Salsify properties, which are indicated by their naming convention `salsify:property_name`.

To do this, we will create a new variable inside of the `.flatMap` called `nonSalsify`, indicating this is where all of the properties inside of the object that are **not** internal Salsify properties will be stored.

```js
// Get all keys that don't include "salsify:"
const nonSalsify = Object.keys(obj).filter(key => {
    if (key.slice(0, 8) !== 'salsify:') {
        return key;
    }
});
```

Firstly, we need to get a list of the keys available in the object we are currently iterating on, which is done by calling `Object.keys()` with our current object (`obj`) as the only parameter.

The value of `Object.keys(obj)` (when using the [exampleJSON](example/exampleJSON.json)) will evaluate out to:

```js
[
  'salsify:id',
  'salsify:created_at',
  'salsify:updated_at',
  'salsify:version',
  'salsify:relations_updated_at',
  'salsify:profile_asset_id',
  'salsify:parent_id',
  'salsify:system_id',
  'Actual Size',
  'Primary Color',
  'Short Size',
  'SKU',
  'salsify:relations'
]
```

Now that we have a list of our keys stored in `Object.keys(obj)`, we can chain the `.filter` method onto it so that we can start telling the script which properties to keep based on the conditions provided.

```js
// Get all keys that don't include "salsify:"
const nonSalsify = Object.keys(obj).filter(key => {...});
```

Inside of the `.filter` method, we will create a single condition via an `if` statement which will check to see if any of the keys contain `salsify:`.

```js
// Get all keys that don't include "salsify:"
const nonSalsify = Object.keys(obj).filter(key => {
    if (key.slice(0, 8) !== 'salsify:') {
        return key;
    }
});
```

Our `if` statement contains a condition of `key.slice(0, 8) !== 'salsify:'`, which will take the first eight characters of the key and make sure the result does not equal `salsify:`.
If the key **doesn't** contain `salsify:` then we simply `return` it.
