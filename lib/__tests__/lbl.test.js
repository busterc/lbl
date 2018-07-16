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
    return execa(
      `${cli}`,
      [
        '-e',
        'x => { if (x.match(/^x/)) { n++; log(chalk.green(x)); } }',
        '-b',
        '() => { $.n = 0; }',
        '-a',
        '() => { log("found: " + n) }'
      ],
      {
        input: 'x\nXX\nxXx'
      }
    ).then(result => {
      let lines = result.stdout.split('\n');
      assert(
        lines.length === 3,
        "Should've found 2 matches and a summary line: " + lines
      );
      assert(lines[2] === 'found: 2', 'The summary line is incorrrect.' + lines);
    });
  });

  it('process each with CLI option -r', () => {
    return execa(`${cli}`, ['-r', 'lib/__tests__/scripts/X.js'], {
      input: 'x\nXX\nxXx'
    }).then(result => {
      let lines = result.stdout.split('\n');
      let matches = lines.filter(l => l.match(/^> X/)).length;
      assert(matches === 1, "Should've found 1 match");
      assert(lines[2] === '> Matched 1 from 3', 'The summary line is incorrect.' + lines);
    });
  });
});
