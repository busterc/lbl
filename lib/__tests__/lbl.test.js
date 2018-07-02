'use strict';

const execa = require('execa');
const assert = require('assert');
const cli = require('path').resolve(__dirname, '../cli.js');

describe('lbl', () => {
  it('shows help', () => {
    return execa(`${cli}`, ['-h'], {
      stdio: ['inherit', 'pipe', 'pipe']
    }).then(result => {
      assert(result.stdout.match(/\$ lbl <Options> <STDIN>/));
    });
  });

  it('requires options', () => {
    return execa(`${cli}`, {
      stdio: ['inherit', 'pipe', 'pipe']
    })
      .then(() => {
        assert(false, 'Should have failed with no arguments');
      })
      .catch(error => {
        assert(
          error.message.match('Error: Missing argument -e, --each OR -r, --require')
        );
      });
  });

  it('process each with CLI option -e', () => {
    return execa(`${cli}`, ['-e', 'x => { if (x.match(/^x/)) console.log(x) }'], {
      input: 'x\nXX\nxXx'
    }).then(result => {
      let linesOut = result.stdout.split('\n').length;
      assert(linesOut === 2, "Should've found 2 matches");
    });
  });

  it('process each with CLI option -r', () => {
    return execa(`${cli}`, ['-r', 'lib/__tests__/scripts/X.js'], {
      input: 'x\nXX\nxXx'
    }).then(result => {
      let matches = result.stdout.split('\n').filter(l => l.match(/^> X/)).length;
      assert(matches === 1, "Should've found 1 match");
    });
  });
});
