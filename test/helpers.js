import assert from 'assert';
import fs from 'fs';
import path from 'path';

import pako from '../index.js';
import { fileURLToPath } from 'url';

const __dirname = getDirName();

// Load fixtures to test
// return: { 'filename1': content1, 'filename2': content2, ...}
//
function loadSamples(subdir) {
  const result = {};
  const dir = path.join(__dirname, 'fixtures', subdir || 'samples');

  fs.readdirSync(dir)
    .sort()
    .forEach(function (sample) {
      const filepath = path.join(dir, sample);
      const extname = path.extname(filepath);
      const basename = path.basename(filepath, extname);
      const content = new Uint8Array(fs.readFileSync(filepath));

      if (basename[0] === '_') {
        return;
      } // skip files with name, started with dash

      result[basename] = content;
    });

  return result;
}

function testInflate(samples, inflateOptions, deflateOptions) {
  let name, data, deflated, inflated;

  // inflate options have windowBits = 0 to force autodetect window size
  //
  for (name in samples) {
    if (!samples.hasOwnProperty(name)) continue;
    data = samples[name];

    deflated = pako.deflate(data, deflateOptions);
    inflated = pako.inflate(deflated, inflateOptions);

    assert.deepStrictEqual(inflated, data);
  }
}

function getDirName() {
  return fileURLToPath(new URL(".", import.meta.url));
};

export { testInflate, loadSamples, getDirName }

