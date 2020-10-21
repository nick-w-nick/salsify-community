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
