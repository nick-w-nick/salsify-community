# Scripts

This is an overview that covers the basics of the `scripts` category, such as usage instructions and specific contribution guidelines.

## Table of Contents
- [How to Run Scripts](#how-to-run-scripts)
  - [Javascript](#javascript)
    - [Prerequisites](#prerequisites-js)
    - [Installing Dependencies](#installing-dependencies-js)
    - [Running the Script](#running-the-script-js)

<br/>

## How to Run Scripts

<h3 id="javascript" style="font-weight: 500;"><img align="center" src="../../assets/readme/javascript-icon.jpg">&nbsp;&nbsp;Javascript</img></h3>

<br/>

> Try following along with this guide using the [Clean Exported JSON](Clean%20Exported%20JSON) script!

<h4 id="prerequisites-js" style="font-weight: 500;">Prerequisites</h4>
In order to run Javascript scripts from this category, the following are required, and will be utilized in the sections below:

- [NodeJS](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm) *(automatically installed alongside NodeJS)*
- An IDE/Code Editor ([Visual Studio Code](https://code.visualstudio.com/) recommended)
- A terminal (Command Prompt / Mac Bash works, [Git Bash](https://git-scm.com/) recommended)

To ensure NodeJS and npm are properly installed, run `node -v` and `npm -v` in your terminal.

If they don't throw an error and each output something that looks like a version number (`v00.00.0`), that means they are correctly installed and accessible via terminal.

If you are receiving an error after running either of these commands, you will want to ensure they are installed correctly and the executables have been added as environment variables on your system. A common issue that new users of NodeJS run into would be that it isn't added to the environment variables properly and cannot be used via the command line. If you've just installed NodeJS, make sure to restart your system for the environment variable updates to take effect.

<h4 id="installing-dependencies-js" style="font-weight: 500;">Installing Dependencies</h4>
When a script contains dependencies, that means it relies on third-party modules and packages to properly function.

A script with dependencies can be denoted by a file in the root of the folder named `package.json`.

This file contains general information about the script/application, along with a list of dependencies it relies on.

A generic `package.json` is structured similarly to the below example:

```json
{
  "name": "salsify-community",
  "version": "1.0.0",
  "description": "An open-source location for any and all things Salsify.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/nick-w-nick/salsify-community.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/nick-w-nick/salsify-community/issues"
  },
  "homepage": "https://github.com/nick-w-nick/salsify-community#readme",
  "dependencies": {
    "axios": "^0.21.0",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "nodemon": "^2.0.6"
  }
}
```

The dependencies for the example `package.json` are shown in the `dependencies` object near the bottom of the file.

In order to install these dependencies, follow the steps below from within your terminal:
- Move into the directory containing the `package.json` by running `cd` followed by the path to the directory (`cd C:\Users\name\..\..\`)
  - This is made easy when utilizing VS Code by opening the folder in VS Code and then by opening an integrated terminal (Windows: ``CTRL+` `` / Mac: ``CMD+` ``)
- Run `npm install` and wait a few moments for everything to finish installing into the newly created `node_modules` folder that should appear in the directory

<h4 id="running-the-script-js" style="font-weight: 500;">Running The Script</h4>

To run the script, the process may vary depending on the type of script and its functionality, but a majority of them will follow the [required structure in the main README](../../README.md#scripts), which makes the process fairly simple.

- Navigate to the `src` folder by using the `cd` command
- When inside of the folder from within the terminal, simply run `node exampleScript.js` (This can be done quicker and easier with the [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner) VS Code extension!)

> *Depending on the script, you may or may not see some sort of output in your terminal once the script has finished running.*