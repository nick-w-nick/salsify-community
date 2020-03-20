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

## Folder Structure
In terms of folder structure, each contribution should stay fairly simplistic without compromising quality and/or information. Firstly, determine the category you will be contributing to by examining the available folder locations in the `categories` folder in the root of this repository.
> If your contribution is for a category that does not yet exist, please make a separate commit first to add it to the `categories` folder.

Next, you will need to create the necessary files and folders that will make up your overall contribution. For a very simplified example of using the `formulas` category , please see the directory tree structure below.

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

#### Formulas
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
> To create a code block in markdown, surround your formula with triple backticks. ( ``` )

Please make sure to properly indent your formula, as well as capitalizing each function.

- `VALUE('Property Name')` ✔️
- `value('Property Name')` ❌