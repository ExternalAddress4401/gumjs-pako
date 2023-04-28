// Deflate coverage tests
import assert from 'assert';
import fs from 'fs';
import path from 'path';

import c from '../lib/zlib/constants.js';
import msg from '../lib/zlib/messages.js';
import zlib_deflate from '../lib/zlib/deflate.js';
import ZStream from '../lib/zlib/zstream.js';

import pako from '../index.js';
import { getDirName } from './helpers.js';

const __dirname = getDirName();
const short_sample = 'hello world';
const long_sample = fs.readFileSync(
  path.join(__dirname, 'fixtures/samples/lorem_en_100k.txt')
);

function testDeflate(data, opts, flush) {
  const deflator = new pako.Deflate(opts);
  deflator.push(data, flush);
  deflator.push(data, true);

  assert.strictEqual(deflator.err, 0, msg[deflator.err]);
}

describe('Deflate support', () => {
  it('stored', () => {
    testDeflate(short_sample, { level: 0, chunkSize: 200 }, 0);
    testDeflate(short_sample, { level: 0, chunkSize: 10 }, 5);
  });
  it('fast', () => {
    testDeflate(short_sample, { level: 1, chunkSize: 10 }, 5);
    testDeflate(long_sample, { level: 1, memLevel: 1, chunkSize: 10 }, 0);
  });
  it('slow', () => {
    testDeflate(short_sample, { level: 4, chunkSize: 10 }, 5);
    testDeflate(long_sample, { level: 9, memLevel: 1, chunkSize: 10 }, 0);
  });
  it('rle', () => {
    testDeflate(short_sample, { strategy: 3 }, 0);
    testDeflate(short_sample, { strategy: 3, chunkSize: 10 }, 5);
    testDeflate(long_sample, { strategy: 3, chunkSize: 10 }, 0);
  });
  it('huffman', () => {
    testDeflate(short_sample, { strategy: 2 }, 0);
    testDeflate(short_sample, { strategy: 2, chunkSize: 10 }, 5);
    testDeflate(long_sample, { strategy: 2, chunkSize: 10 }, 0);
  });
});

describe('Deflate states', () => {
  //in port checking input parameters was removed
  it('inflate bad parameters', () => {
    let ret, strm;

    ret = zlib_deflate.deflate(null, 0);
    assert(ret === c.Z_STREAM_ERROR);

    strm = new ZStream();

    ret = zlib_deflate.deflateInit(null);
    assert(ret === c.Z_STREAM_ERROR);

    ret = zlib_deflate.deflateInit(strm, 6);
    assert(ret === c.Z_OK);

    ret = zlib_deflate.deflateSetHeader(null);
    assert(ret === c.Z_STREAM_ERROR);

    strm.state.wrap = 1;
    ret = zlib_deflate.deflateSetHeader(strm, null);
    assert(ret === c.Z_STREAM_ERROR);

    strm.state.wrap = 2;
    ret = zlib_deflate.deflateSetHeader(strm, null);
    assert(ret === c.Z_OK);

    ret = zlib_deflate.deflate(strm, c.Z_FINISH);
    assert(ret === c.Z_BUF_ERROR);

    ret = zlib_deflate.deflateEnd(null);
    assert(ret === c.Z_STREAM_ERROR);

    //BS_NEED_MORE
    strm.state.status = 5;
    ret = zlib_deflate.deflateEnd(strm);
    assert(ret === c.Z_STREAM_ERROR);
  });
});
