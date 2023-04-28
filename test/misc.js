import assert from 'assert';
import fs from 'fs';
import path from 'path';

import pako from '../index.js';
import { getDirName } from './helpers.js';

const __dirname = getDirName();

describe('ArrayBuffer', () => {
  const file = path.join(__dirname, 'fixtures/samples/lorem_utf_100k.txt');
  const sample = new Uint8Array(fs.readFileSync(file));
  const deflated = pako.deflate(sample);

  it('Deflate ArrayBuffer', () => {
    assert.deepStrictEqual(deflated, pako.deflate(sample.buffer));
  });

  it('Inflate ArrayBuffer', () => {
    assert.deepStrictEqual(sample, pako.inflate(deflated.buffer));
  });
});
