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
