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

### Adding Content

[qGen](https://github.com/alarisprime/qgen) generator for new pages and person are in place.

#### A New Page

To create a new page with title `Hello World`, run:

```bash
npm run qgen -- page ./contents --title "Hello World"
```

The base file will be generated at `./contents/hello-world.html`.

#### A New Person

To create a new persone 'Jane Doe', run:

```bash
npm run qgen -- person ./contents --name "Jane Doe" --email "jane@example.com"
```

The base file will be generated at `./members/jane-doe.html`.

### Development server

Run `npm start` to run the development build, watch for changes and serve locally.

## Build

`npm run build` to build the website for production.

## Deploy

`npm run deploy`
