#!/usr/bin/env node
'use strict';

const path = require('path');
const meow = require('meow');
const split = require('split');
const chalk = require('chalk');

const cli = meow(`
Usage

  $ lbl <Options> <STDIN>

Options

  # Pass processing functions on CLI
  -a, --after     function to run after processing lines [optional]
  -b, --before    function to run before processing lines [optional]
  -e, --each      function to run on each line [required]

  # Or, use a node module file with processing functions:
  # before(), after(), each()
  -r, --require   module file with  processing functions

  -h, --help      show this usage info
  --version       show the current version installed

Examples

  $ cat ./data/x.file | lbl -r ./scripts/X.js
  <<BEGIN>>
  > XX
  > Matched 1 from 3

  $ printf 'x\\nXX\\nxXx' | lbl -e 'x => { n++; if (x.match(/^X/)) { log(chalk.yellow('> ') + x); f++; } }' -b '() => { $.n = 0; $.f = 0; log('<<BEGIN>>'); }' -a '() => { log('> Matched ' + f + ' from ' + n); }'
  <<BEGIN>>
  > XX
  > Matched 1 from 3

`);

(function() {
  if (cli.flags.h || cli.flags.help) {
    return cli.showHelp(0);
  }

  global.log = console.log;
  global.chalk = chalk;
  let $ = global;

  let moduleFile = cli.flags.r || cli.flags.require || false;

  if (moduleFile) {
    moduleFile = path.resolve(process.cwd(), moduleFile);
    $.$ = $;
    let $$ = require(moduleFile);
    $.before = $$.before || function() {};
    $.each = $$.each || function() {};
    $.after = $$.after || function() {};
  } else {
    let each = cli.flags.e || cli.flags.each || false;
    if (!each) {
      console.error('Error: Missing argument -e, --each OR -r, --require');
      console.error('Run `lbl --help` for more info.');
      process.exit(1);
    }
    /* eslint-disable no-eval */
    $.each = eval(each);
    $.before = eval(cli.flags.b || cli.flags.before || '() => {}');
    $.after = eval(cli.flags.a || cli.flags.after || '() => {}');
  }

  $.before();
  process.stdin
    .pipe(split())
    .on('data', $.each)
    .on('end', $.after);
})();
