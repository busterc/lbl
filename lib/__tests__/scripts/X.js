'use strict';
/* global $, log, chalk, n:true, f:true */

module.exports = {
  each: x => {
    n++;
    if (x.match(/^X/)) {
      log(chalk.yellow('> ') + x);
      f++;
    }
  },
  before: () => {
    $.n = 0;
    $.f = 0;
    log('<<BEGIN>>');
  },
  after: () => {
    log('> Matched ' + f + ' from ' + n);
  }
};
