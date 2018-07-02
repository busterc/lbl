# lbl [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Process stdin, line by line, sort of like AWK but 100% JS

## Installation

```sh
$ npm install lbl --global
```

## Usage

```sh
Usage

  $ lbl <Options> <STDIN>

Options

  # Pass processing functions on CLI
  -a, --after     function to run after processing lines [optional]
  -b, --before    function to run before processing lines [optional]
  -e, --each      function to run on each line [required]

  # Or, use a node module file with processing functions:
  # onBefore, onAfter, onEach
  -r, --require   module file with functions

  -h, --help      show this usage info
  --version       show the current version installed

Examples

  $ cat ./data/x.file | lbl -r ./scripts/X.js
  <<BEGIN>>
  > XX
  > Matched 1 from 3

  $ printf 'x\nXX\nxXx' | lbl -e 'x => { $.n++; if(x.match(/^X/)) { $.log("> "+ x); $.f++ } }' -b '()=>{$.log=console.log;$.n=0;$.f=0;$.log("<<BEGIN>>")}' -a '()=>{$.log("> Matched " + $.f + " from " + $.n)}'
  <<BEGIN>>
  > XX
  > Matched 1 from 3
```

### Sample Module File

```js
'use strict';

const $ = {
  onEach: x => {
    $.n++;
    if (x.match(/^X/)) {
      $.log('> ' + x);
      $.f++;
    }
  },
  onBefore: () => {
    $.log = console.log;
    $.n = 0;
    $.f = 0;
    $.log('<<BEGIN>>');
  },
  onAfter: () => {
    $.log('> Matched ' + $.f + ' from ' + $.n);
  }
};
module.exports = $;
```

## License

ISC © [Buster Collings]()

[npm-image]: https://badge.fury.io/js/lbl.svg
[npm-url]: https://npmjs.org/package/lbl
[travis-image]: https://travis-ci.org/busterc/lbl.svg?branch=master
[travis-url]: https://travis-ci.org/busterc/lbl
[daviddm-image]: https://david-dm.org/busterc/lbl.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/busterc/lbl
