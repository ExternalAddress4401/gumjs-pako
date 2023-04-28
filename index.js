// Top level file is just a mixin of submodules & constants
import { Deflate, deflate, deflateRaw, gzip } from "./lib/deflate.js";

import { Inflate, inflate, inflateRaw, ungzip } from "./lib/inflate.js";

import constants from "./lib/zlib/constants.js";

export default {
  Deflate,
  deflate,
  deflateRaw,
  gzip,
  Inflate,
  inflate,
  inflateRaw,
  ungzip,
  constants,
};

export {
  Deflate,
  deflate,
  deflateRaw,
  gzip,
  Inflate,
  inflate,
  inflateRaw,
  ungzip,
  constants,
};
