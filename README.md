# alarisprime.com

[![Greenkeeper badge](https://badges.greenkeeper.io/alarisprime/alarisprime.com.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/alarisprime/alarisprime.com.svg?branch=master)](https://travis-ci.org/alarisprime/alarisprime.com)


## Development

### Setup

```bash
$ npm install -g yarn # get yarn

$ yarn # install dependencies
```

### File structure

	|-- root - Keep all static files - robots.txt, favicon.ico,… - which needs to be copied to the root of the website
	|-- images
	|-- contents - pages to be rendered
		+-- projects - the files from this folder will not be rendered. It is used as collections to populate `projects` page.
	|-- layouts - Nunjucks templates, which can be used for pages
	|-- macros - Nunjucks macro files
	|-- includes - Nunjucks include files
	|-- scss
	+-- scripts

### Adding a new page

[qGen](https://github.com/alarisprime/qgen) generator for new pages is in place. To create a new page with slug `hello-page` and title `Hello World`, run:

```bash
npm run qgen -- page ./contents --title "Hello World" --slug hello-world
```

The base file will be generated at `./contents/hello-world.html`.

### Development server

Run `npm start` to run the development build, watch for changes and serve locally.

## Build

`npm run build` to build the website for production.

## Deploy

`npm run deploy`
