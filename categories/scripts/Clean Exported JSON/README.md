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

To configure the `input` file, drop your JSON file into the directory you are working inside of, which in this case for us, is within the [example](example) directory.

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
This is because in the [`exampleJSON.json`](example/exampleJSON.json) file there were not only regular products, but also their parent items. This may not be the case for you, depending on how you have your variations (if any) structured inside of Salsify.

Luckily, there is a quick solution provided within the core [`cleanSalsifyExport.js`](src/cleanSalsifyExport.js) script, albeit commented out by default.

```js
// Remove any parent products
if (!obj['salsify:parent_id']) {
    return [];
}
```
The nifty thing about the structure of the export from Salsify is that only regular "sellable" items contain a property in their object named `salsify:parent_id`.

Basically, this code inside of the `.flatMap` will check upon each iteration to see if the current product contains the `salsify:parent_id` property within the object.

If it does not happen to contain this property, an empty array will be outputted during that iteration, which will then be pruned on return due to the iterations occurring inside of a `.flatMap` which will "flatten" the output, causing any empty or nested values to be joined into a single-dimensional array, instead of a regular `.map` which will not remove any empty/nested values by default.
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

As you can see, the parent items have been pruned upon being returned from the `.flatMap` inside of [`cleanSalsifyExport.js`](src/cleanSalsifyExport.js), since we told it to output an empty array during that iteration if the product contains a `salsify:parent_id` property.

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

```js
const filteredProducts = productsArray.products.flatMap(obj => {...})
```

`filteredProducts` is home to a `.flatMap`, which will iterate over each of the values inside of the `productsArray.products` array.
Since we are using a `.flatMap`, two _main_ things will occur during iteration and during the output:
- This is a `.map` instead of something like `.forEach`, meaning that it will create create a copy of the original array, and will return the new version once complete, instead of modifying the original array, which would require us to create a temporary empty array to store the results of the iterations by using something like `tempArray.push(data)` if we went with a `.forEach` instead of a `.map`.
- The `flat` part of `.flatMap` is an Array method available in JavaScript which is usually called via `Array.flat()`, which converts an array of nested arrays into a single one-dimensional array, hence the term "flattened array". The purpose behind using it in this function is to remove any empty arrays, which may be present once we finish iterating, depending on the functions that were called during each iteration and their output.

> [Learn more about `Array.flatMap()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)

The first thing we need to do during our iteration is filter out all of the unnecessary data, otherwise known as internal Salsify properties, which are indicated by their naming convention `salsify:property_name`.

To do this, we will create a new variable inside of the `.flatMap` called `nonSalsify`, indicating this is where all of the properties inside of the object that are **not** internal Salsify properties will be stored.

Firstly, we need to get a list of the keys available in the object we are currently iterating on, which is done by calling `Object.keys()` with our current object (`obj`) as the only parameter.

```js
const nonSalsify = Object.keys(obj);
```

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

> [Learn more about `Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)

Now that we have a list of our keys stored in `Object.keys(obj)`, we can chain the `.filter` method onto it so that we can start telling the script which properties to keep based on the conditions provided.

```js
// Get all keys that don't include "salsify:"
const nonSalsify = Object.keys(obj).filter(key => {...});
```

> [Learn more about `Array.filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

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
If the key **doesn't** contain `salsify:` then we simply `return` it so we can use it further down the line within the iterations.

> [Learn more about `String.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice)

Once we have pruned out all of the internal Salsify properties, we are left with a list of keys from our original data, which looks something like:

```js
[
  'Actual Size',
  'Primary Color',
  'Short Size',
  'SKU'
]
```

Since all we have are the keys, we need a way to link them back to their original values. We can do this by creating a new variable named `valueArray` to store the values we need to retrieve during this iteration.

```js
// Create an object for the key: value pairs
const valueArray = nonSalsify.map(key => {
	return ({ [key]: obj[key] });
});
```

In the `valueArray` variable, we are creating a new `.map`, which will iterate through our list of keys we created inside of the `nonSalsify` variable.

In this `.map`, we are `return`ing a new object, which contains the key we are iterating on, as well as its original value from the `obj` parameter, which is basically the object from `filteredProducts` that we are currently iterating on within the overall `.map`.

> [Learn more about `Array.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

When this runs, it will set the property of the new object to the current key, and will set the value to the value of that specific key from within `obj`. For example, if the key we are currently iterating on was `SKU`, the result that is used to retrieve the value would look something like:

```js
return ({ SKU: obj.SKU });
```

The final result stored inside of `valueArray` after completing an iteration for each of the keys would look something like:

```js
[
  { 'Actual Size': "5'3'' x 7'10''" },
  { 'Primary Color': 'Multi-Color' },
  { 'Short Size': '5x8' },
  { SKU: 'ABC1234 5x8' }
]
```

Now that we have isolated the product data from the original export, filtered out all Salsify internal properties, associated the keys we want to keep with their original values, we are able to move onto the final step, which consists of formatting what we currently have into a format that will be clean and easy to use.

Since we currently have an array of objects, each of which contain a `key:value` pair, we need to merge all of the objects together to create a single object which contains each of the properties and their values.

This can be accomplished by utilizing the `Object.assign()` method, combined with the spread (`...`) operator.

```js
// Merge the new array of objects together
return Object.assign(...valueArray);
```

The `Object.assign()` method takes multiple objects as parameters, and will combine any enumerable properties between the objects for a result consisting of just a singular object that contains all of the properties together.

Our parameter needs to be a object and not an array of objects, so we can use the spread (`...`) operator to "spread" out each of our objects from `valueArray`, which will cause `Object.assign()` to treat each of the objects in the array as if they were individual parameters.

The end result that is evaluated by `Object.assign()` would look something like:

```js
Object.assign({'Actual Size': "5'3'' x 7'10''"}, {'Primary Color': 'Multi-Color'}, {'Short Size': '5x8'}, {SKU: 'ABC1234 5x8'});
```

> [Learn more about `Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

Now that all of the code inside iteration is complete, we can simply return our result with:
```js
return filteredProducts;
```
Once the final result has been returned, we finally get to see the much cleaner and easier to use output:

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