<p align="center">
	<img height="300" src="/assets/readme/salsify-logo.png">
</p>

<br>

<h1 align="center">Salsify Community</h1>

## Overview
This repository was created with the intention of centralizing all of the amazing work and innovation that have been developed by the ever-growing community of [Salsify](https://www.salsify.com/) users.

## Contribution
Since this is a community-based repository, any and all contributions are immensely appreciated, as they will serve as an extended source of knowledge and solutions for all to use and learn from.
In order to preseve quality and consistency, there are a few guidelines that would be required for any contributions. Since the overall subject matter of this repository is very broad, the general guidelines will be listed below, along with rulesets for specific types of contributions.

## Requirements
Due to the broad topic of this repository, there aren't many specific overall requirements in place. The main part of each contribution that will remain standard across the repository is the usage of [Markdown](https://www.markdownguide.org/getting-started/), the formatting syntax used to render pages just like this one.
For more information on the markdown syntax and its usage across GitHub, please see the below resources.
> GitHub Markdown Guide / Cheat-Sheet [(GitHub Docs/Basic writing and formatting syntax)](https://docs.github.com/en/free-pro-team@latest/github/writing-on-github/basic-writing-and-formatting-syntax)

> Easy to use GitHub-compatible markdown editor [(StackEdit)](https://stackedit.io/)

> VS Code Extension for writing and previewing markdown [(Markdown All in One)](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)

## Folder Structure
In terms of folder structure, each contribution should stay fairly simplistic without compromising quality and/or information. Firstly, determine the category you will be contributing to by examining the available folder locations in the `categories` folder in the root of this repository.
> If your contribution is for a category that does not yet exist, please make a separate commit first to add it to the `categories` folder.

Next, you will need to create the necessary files and folders that will make up your overall contribution. For a very simplified example of using the `formulas` category, please see the directory tree structure below.

```
categories
├── formulas
    └── Example Formula
	    └── README.md
	    └── exampleFormula.md
```

Currently, the only requirements for a contribution are:

- Choose the correct category location inside of `categories`
-  Always include a `README.md` file with an explanation / summary of your contribution
> The required minimum for a README is a short summary, but the more information the better.

### Category-Specific Requirements

<h4 style="font-weight: 500;">Formulas</h4>
For the file containing the formula itself, please set the filetype to `.md`, and the contents of the file should ONLY be a markdown code block with the formula inside. For example:

`└── checkForRed.md`
```
IF(EQUAL(VALUE('Product Color'), 'Red'),
	CONCATENATE(
		'Red/Maroon',
		' ',
		VALUE('Product Size),
		' ',
		'Umbrella'
	),
	'Not a red umbrella'
)
```
> To create a code block in markdown, surround your formula with triple backticks. (` ``` `)
````
```
let productArea = MULTIPLY(
	VALUE('Product Length'),
	VALUE('Product Width')
) in
```
````

Please make sure to properly indent your formula, as well as capitalizing each function.

- `VALUE('Property Name')` ✔️
- `value('Property Name')` ❌

<h4 style="font-weight: 500;">Scripts</h4>
The following generic structure should be used for all scripts, regardless of the language. If this structure hinders functionality in your contribution, please note your reasoning within the PR so that the requirements can be adjusted to accomodate the addition.

```
categories
├── scripts
    └── Example Script
	    └── example
			└── example.js
			└── exampleData.json
	    └── src
			└── exampleScript.js
		└── README.md
```
The script should have its own folder created within the [scripts](https://github.com/nick-w-nick/salsify-community/tree/master/categories/scripts) directory.

Along with having its own folder, it should contain 2 sub-folders, along with a `README.md` file [as described above](#folder-structure).

One of the two required sub-folders are `src`, which contains the source code for your script. If your language of choice supports the functionality, please `export` your function to make it usable outside of the original file.

The second required sub-folder should be named `example`, which contains an example of your script being utilized, with _(if possible)_ example input and output data.

Outside of the folder requirements, it is requested that you place any dependency requirements in the root of your folder.
As an example, in the case of using JavaScript / NodeJS, the structure shown below would be optimal.
```
categories
├── scripts
    └── Example Script
	    └── example
			└── example.js
			└── exampleData.json
	    └── src
			└── exampleScript.js
		└── README.md
		└── package.json
		└── package-lock.json
```