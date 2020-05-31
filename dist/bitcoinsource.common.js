/**
 * https://github.com/the-bitcoin-token/bitcoin-source
 * Copyright (c) 2019 Bitcoin Computer
 * Copyright (c) 2019 Brenton Gunning
 * Copyright (c) 2018 Janez Urevc
 * Copyright (c) 2018-2019 Clemens Ley
 * Copyright (c) 2017-2018 Emilio Almansi
 * Copyright (c) 2013-2017 BitPay, Inc.
 * Copyright (c) 2009-2015 The Bitcoin Core developers
 * Copyright (c) 2014 Ryan X. Charles
 * Copyright (c) 2014 reddit, Inc.
 * Copyright (c) 2011 Stefan Thomas <justmoon@members.fsf.org>
 * Copyright (c) 2011 Google Inc.
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));
var elliptic = _interopDefault(require('elliptic'));
var BN = _interopDefault(require('bn.js'));
var bs58 = _interopDefault(require('bs58'));
var cashaddr = _interopDefault(require('cashaddrjs'));
var hash = _interopDefault(require('hash.js'));
var assert = _interopDefault(require('assert'));
var randomBytes = _interopDefault(require('randombytes'));
var bufferCompare = _interopDefault(require('buffer-compare'));
var unorm = _interopDefault(require('unorm'));
var URL = _interopDefault(require('url'));

var docsURL = 'http://bitcore.io/';
var data = [{
  name: 'InvalidB58Char',
  message: 'Invalid Base58 character: {0} in {1}'
}, {
  name: 'InvalidB58Checksum',
  message: 'Invalid Base58 checksum for {0}'
}, {
  name: 'InvalidNetwork',
  message: 'Invalid version for network: got {0}'
}, {
  name: 'InvalidState',
  message: 'Invalid state: {0}'
}, {
  name: 'NotImplemented',
  message: 'Function {0} was not implemented yet'
}, {
  name: 'InvalidNetworkArgument',
  message: 'Invalid network: must be "livenet" or "testnet", got {0}'
}, {
  name: 'InvalidArgument',

  message() {
    return "Invalid Argument".concat((arguments.length <= 0 ? undefined : arguments[0]) ? ": ".concat(arguments.length <= 0 ? undefined : arguments[0]) : '').concat((arguments.length <= 1 ? undefined : arguments[1]) ? " Documentation: ".concat(docsURL).concat(arguments.length <= 1 ? undefined : arguments[1]) : '');
  }

}, {
  name: 'AbstractMethodInvoked',
  message: 'Abstract Method Invocation: {0}'
}, {
  name: 'InvalidArgumentType',

  message() {
    return "Invalid Argument for ".concat(arguments.length <= 2 ? undefined : arguments[2], ", expected ").concat(arguments.length <= 1 ? undefined : arguments[1], " but got ").concat(typeof (arguments.length <= 0 ? undefined : arguments[0]));
  }

}, {
  name: 'Unit',
  message: 'Internal Error on Unit {0}',
  errors: [{
    name: 'UnknownCode',
    message: 'Unrecognized unit code: {0}'
  }, {
    name: 'InvalidRate',
    message: 'Invalid exchange rate: {0}'
  }]
}, {
  name: 'Transaction',
  message: 'Internal Error on Transaction {0}',
  errors: [{
    name: 'Input',
    message: 'Internal Error on Input {0}',
    errors: [{
      name: 'MissingScript',
      message: 'Need a script to create an input'
    }, {
      name: 'UnsupportedScript',
      message: 'Unsupported input script type: {0}'
    }, {
      name: 'MissingPreviousOutput',
      message: 'No previous output information.'
    }]
  }, {
    name: 'NeedMoreInfo',
    message: '{0}'
  }, {
    name: 'InvalidSorting',
    message: 'The sorting function provided did not return the change output as one of the array elements'
  }, {
    name: 'InvalidOutputAmountSum',
    message: '{0}'
  }, {
    name: 'MissingSignatures',
    message: 'Some inputs have not been fully signed'
  }, {
    name: 'InvalidIndex',
    message: 'Invalid index: {0} is not between 0, {1}'
  }, {
    name: 'UnableToVerifySignature',
    message: 'Unable to verify signature: {0}'
  }, {
    name: 'DustOutputs',
    message: 'Dust amount detected in one output'
  }, {
    name: 'InvalidSatoshis',
    message: 'Output satoshis are invalid'
  }, {
    name: 'FeeError',
    message: 'Internal Error on Fee {0}',
    errors: [{
      name: 'TooSmall',
      message: 'Fee is too small: {0}'
    }, {
      name: 'TooLarge',
      message: 'Fee is too large: {0}'
    }, {
      name: 'Different',
      message: 'Unspent value is different from specified fee: {0}'
    }]
  }, {
    name: 'ChangeAddressMissing',
    message: 'Change address is missing'
  }, {
    name: 'BlockHeightTooHigh',
    message: 'Block Height can be at most 2^32 -1'
  }, {
    name: 'NLockTimeOutOfRange',
    message: 'Block Height can only be between 0 and 499 999 999'
  }, {
    name: 'LockTimeTooEarly',
    message: "Lock Time can't be earlier than UNIX date 500 000 000"
  }]
}, {
  name: 'Script',
  message: 'Internal Error on Script {0}',
  errors: [{
    name: 'UnrecognizedAddress',
    message: 'Expected argument {0} to be an address'
  }, {
    name: 'CantDeriveAddress',
    message: "Can't derive address associated with script {0}, needs to be p2pkh in, p2pkh out, p2sh in, or p2sh out."
  }, {
    name: 'InvalidBuffer',
    message: "Invalid script buffer: can't parse valid script from given buffer {0}"
  }]
}, {
  name: 'HDPrivateKey',
  message: 'Internal Error on HDPrivateKey {0}',
  errors: [{
    name: 'InvalidDerivationArgument',
    message: 'Invalid derivation argument {0}, expected string, or number and boolean'
  }, {
    name: 'InvalidEntropyArgument',
    message: 'Invalid entropy: must be an hexa string or binary buffer, got {0}',
    errors: [{
      name: 'TooMuchEntropy',
      message: 'Invalid entropy: more than 512 bits is non standard, got "{0}"'
    }, {
      name: 'NotEnoughEntropy',
      message: 'Invalid entropy: at least 128 bits needed, got "{0}"'
    }]
  }, {
    name: 'InvalidLength',
    message: 'Invalid length for xprivkey string in {0}'
  }, {
    name: 'InvalidPath',
    message: 'Invalid derivation path: {0}'
  }, {
    name: 'UnrecognizedArgument',
    message: 'Invalid argument: creating a HDPrivateKey requires a string, buffer, json or object, got "{0}"'
  }]
}, {
  name: 'HDPublicKey',
  message: 'Internal Error on HDPublicKey {0}',
  errors: [{
    name: 'ArgumentIsPrivateExtended',
    message: 'Argument is an extended private key: {0}'
  }, {
    name: 'InvalidDerivationArgument',
    message: 'Invalid derivation argument: got {0}'
  }, {
    name: 'InvalidLength',
    message: 'Invalid length for xpubkey: got "{0}"'
  }, {
    name: 'InvalidPath',
    message: 'Invalid derivation path, it should look like: "m/1/100", got "{0}"'
  }, {
    name: 'InvalidIndexCantDeriveHardened',
    message: 'Invalid argument: creating a hardened path requires an HDPrivateKey'
  }, {
    name: 'MustSupplyArgument',
    message: 'Must supply an argument to create a HDPublicKey'
  }, {
    name: 'UnrecognizedArgument',
    message: 'Invalid argument for creation, must be string, json, buffer, or object'
  }]
}, {
  name: 'Mnemonic',
  message: 'Internal Error on bitcore-mnemonic module {0}',
  errors: [{
    name: 'InvalidEntropy',
    message: 'Entropy length must be an even multiple of 11 bits: {0}'
  }, {
    name: 'UnknownWordlist',
    message: 'Could not detect the used word list: {0}'
  }, {
    name: 'InvalidMnemonic',
    message: 'Mnemonic string is invalid: {0}'
  }]
}];

function format(message, args) {
  return message.replace('{0}', args[0]).replace('{1}', args[1]).replace('{2}', args[2]);
}

var traverseNode = function traverseNode(parent, errorDefinition) {
  var NodeError = function NodeError() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (_.isString(errorDefinition.message)) {
      this.message = format(errorDefinition.message, args);
    } else if (_.isFunction(errorDefinition.message)) {
      this.message = errorDefinition.message.apply(null, args);
    } else {
      throw new Error("Invalid error definition for ".concat(errorDefinition.name));
    }

    this.stack = "".concat(this.message, "\n").concat(new Error().stack);
  };

  NodeError.prototype = Object.create(parent.prototype);
  NodeError.prototype.name = parent.prototype.name + errorDefinition.name;
  parent[errorDefinition.name] = NodeError;

  if (errorDefinition.errors) {
    // eslint-disable-next-line no-use-before-define
    childDefinitions(NodeError, errorDefinition.errors);
  }

  return NodeError;
}; // TODO Try to get rid of this and copy the body into the callers.


var childDefinitions = function childDefinitions(parent, children) {
  _.each(children, child => traverseNode(parent, child));
};

var traverseRoot = function traverseRoot(parent, errorsDefinition) {
  childDefinitions(parent, errorsDefinition);
  return parent;
};

var bitcore = {};

bitcore.Error = function () {
  this.message = 'Internal error';
  this.stack = "".concat(this.message, "\n").concat(new Error().stack);
};

bitcore.Error.prototype = Object.create(Error.prototype);
bitcore.Error.prototype.name = 'bitcore.Error';
traverseRoot(bitcore.Error, data);

bitcore.Error.extend = function (spec) {
  return traverseNode(bitcore.Error, spec);
};

var errors = bitcore.Error;

var preconditions = {
  checkState(condition, message) {
    if (!condition) {
      throw new errors.InvalidState(message);
    }
  },

  checkArgument(condition, argumentName, message, docsPath) {
    if (!condition) {
      throw new errors.InvalidArgument(argumentName, message, docsPath);
    }
  },

  checkArgumentType(argument, type, argumentName) {
    argumentName = argumentName || '(unknown name)';

    if (_.isString(type)) {
      if (type === 'Buffer') {
        if (!Buffer.isBuffer(argument)) {
          throw new errors.InvalidArgumentType(argument, type, argumentName);
        } // eslint-disable-next-line valid-typeof

      } else if (typeof argument !== type) {
        throw new errors.InvalidArgumentType(argument, type, argumentName);
      }
    } else if (!(argument instanceof type)) {
      throw new errors.InvalidArgumentType(argument, type.name, argumentName);
    }
  }

};

var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'.split('');

var Base58 = function Base58(obj) {
  if (!(this instanceof Base58)) {
    return new Base58(obj);
  }

  if (Buffer.isBuffer(obj)) {
    var buf = obj;
    this.fromBuffer(buf);
  } else if (typeof obj === 'string') {
    var str = obj;
    this.fromString(str);
  } else if (obj) {
    this.set(obj);
  }
};

Base58.validCharacters = function validCharacters(chars) {
  if (Buffer.isBuffer(chars)) {
    chars = chars.toString();
  }

  return _.every(_.map(chars, char => _.includes(ALPHABET, char)));
};

Base58.prototype.set = function (obj) {
  this.buf = obj.buf || this.buf || undefined;
  return this;
};

Base58.encode = function (buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new Error('Input should be a buffer');
  }

  return bs58.encode(buf);
};

Base58.decode = function (str) {
  if (typeof str !== 'string') {
    throw new Error('Input should be a string');
  }

  return Buffer.from(bs58.decode(str));
};

Base58.prototype.fromBuffer = function (buf) {
  this.buf = buf;
  return this;
};

Base58.prototype.fromString = function (str) {
  var buf = Base58.decode(str);
  this.buf = buf;
  return this;
};

Base58.prototype.toBuffer = function () {
  return this.buf;
};

Base58.prototype.toString = function () {
  return Base58.encode(this.buf);
};

/**
 * Determines whether a string contains only hexadecimal values
 *
 * @name JSUtil.isHexa
 * @param {string} value
 * @return {boolean} true if the string is the hexa representation of a number
 */

var isHexa = function isHexa(value) {
  if (!_.isString(value)) {
    return false;
  }

  return /^[0-9a-fA-F]+$/.test(value);
};
/**
 * @namespace JSUtil
 */


var JSUtil = {
  /**
   * Test if an argument is a valid JSON object. If it is, returns a truthy
   * value (the json object decoded), so no double JSON.parse call is necessary
   *
   * @param {string} arg
   * @return {Object|boolean} false if the argument is not a JSON string.
   */
  isValidJSON: function isValidJSON(arg) {
    var parsed;

    if (!_.isString(arg)) {
      return false;
    }

    try {
      parsed = JSON.parse(arg);
    } catch (e) {
      return false;
    }

    if (typeof parsed === 'object') {
      return true;
    }

    return false;
  },
  isHexa,
  isHexaString: isHexa,

  /**
   * Clone an array
   */
  cloneArray(array) {
    return [].concat(array);
  },

  /**
   * Define immutable properties on a target object
   *
   * @param {Object} target - An object to be extended
   * @param {Object} values - An object of properties
   * @return {Object} The target object
   */
  defineImmutable: function defineImmutable(target, values) {
    Object.keys(values).forEach(key => {
      Object.defineProperty(target, key, {
        configurable: false,
        enumerable: true,
        value: values[key]
      });
    });
    return target;
  },

  /**
   * Checks that a value is a natural number, a positive integer or zero.
   *
   * @param {*} value
   * @return {Boolean}
   */
  isNaturalNumber: function isNaturalNumber(value) {
    return typeof value === 'number' && Number.isFinite(value) && Math.floor(value) === value && value >= 0;
  }
};

function equals(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  var {
    length
  } = a;

  for (var i = 0; i < length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

var BufferUtil = {
  /**
   * Fill a buffer with a value.
   *
   * @param {Buffer} buff
   * @param {number} value
   * @return {Buffer}
   */
  fill: function fill(buff, value) {
    preconditions.checkArgumentType(buff, 'Buffer', 'buffer');
    preconditions.checkArgumentType(value, 'number', 'value');
    var {
      length
    } = buff;

    for (var i = 0; i < length; i += 1) {
      buff[i] = value;
    }

    return buff;
  },

  /**
   * Return a copy of a buffer
   *
   * @param {Buffer} original
   * @return {Buffer}
   */
  copy(original) {
    var buff = Buffer.alloc(original.length);
    original.copy(buff);
    return buff;
  },

  /**
   * Returns true if the given argument is an instance of a buffer. Tests for
   * both node's Buffer and Uint8Array
   *
   * @param {*} arg
   * @return {boolean}
   */
  isBuffer: function isBuffer(arg) {
    return Buffer.isBuffer(arg) || arg instanceof Uint8Array;
  },

  /**
   * Returns a zero-filled byte array
   *
   * @param {number} bytes
   * @return {Buffer}
   */
  emptyBuffer: function emptyBuffer(bytes) {
    preconditions.checkArgumentType(bytes, 'number', 'bytes');
    var result = Buffer.alloc(bytes);

    for (var i = 0; i < bytes; i += 1) {
      result.write('\0', i);
    }

    return result;
  },

  /**
   * Concatenates a buffer
   *
   * Shortcut for <tt>Buffer.concat</tt>
   */
  concat: Buffer.concat,
  equals,
  equal: equals,

  /**
   * Transforms a number from 0 to 255 into a Buffer of size 1 with that value
   *
   * @param {number} integer
   * @return {Buffer}
   */
  integerAsSingleByteBuffer: function integerAsSingleByteBuffer(integer) {
    preconditions.checkArgumentType(integer, 'number', 'integer');
    return Buffer.from([integer & 0xff]);
  },

  /**
   * Transform a 4-byte integer into a Buffer of length 4.
   *
   * @param {number} integer
   * @return {Buffer}
   */
  integerAsBuffer: function integerAsBuffer(integer) {
    preconditions.checkArgumentType(integer, 'number', 'integer');
    var bytes = [];
    bytes.push(integer >> 24 & 0xff);
    bytes.push(integer >> 16 & 0xff);
    bytes.push(integer >> 8 & 0xff);
    bytes.push(integer & 0xff);
    return Buffer.from(bytes);
  },

  /**
   * Transform the first 4 values of a Buffer into a number, in little endian encoding
   *
   * @param {Buffer} buff
   * @return {number}
   */
  integerFromBuffer: function integerFromBuffer(buff) {
    preconditions.checkArgumentType(buff, 'Buffer', 'buffer');
    return buff[0] << 24 | buff[1] << 16 | buff[2] << 8 | buff[3];
  },

  /**
   * Transforms the first byte of an array into a number ranging from -128 to 127
   * @param {Buffer} buff
   * @return {number}
   */
  integerFromSingleByteBuffer: function integerFromBuffer(buff) {
    preconditions.checkArgumentType(buff, 'Buffer', 'buffer');
    return buff[0];
  },

  /**
   * Transforms a buffer into a string with a number in hexa representation
   *
   * Shorthand for <tt>buffer.toString('hex')</tt>
   *
   * @param {Buffer} buff
   * @return {string}
   */
  bufferToHex: function bufferToHex(buff) {
    preconditions.checkArgumentType(buff, 'Buffer', 'buffer');
    return buff.toString('hex');
  },

  /**
   * Reverse a buffer
   * @param {Buffer} param
   * @return {Buffer}
   */
  reverse: function reverse(param) {
    var ret = Buffer.alloc(param.length);

    for (var i = 0; i < param.length; i += 1) {
      ret[i] = param[param.length - i - 1];
    }

    return ret;
  },

  /**
   * Transforms an hexa encoded string into a Buffer with binary values
   *
   * Shorthand for <tt>Buffer(string, 'hex')</tt>
   *
   * @param {string} string
   * @return {Buffer}
   */
  hexToBuffer: function hexToBuffer(string) {
    assert(JSUtil.isHexa(string));
    return Buffer.from(string, 'hex');
  }
};
BufferUtil.NULL_HASH = BufferUtil.fill(Buffer.alloc(32), 0);
BufferUtil.EMPTY_BUFFER = Buffer.alloc(0);

var Hash = {};

Hash.sha1 = function (buf) {
  preconditions.checkArgument(BufferUtil.isBuffer(buf));
  var digest = hash.sha1().update(buf).digest('hex');
  return Buffer.from(digest, 'hex');
};

Hash.sha1.blocksize = 512;

Hash.sha256 = function (buf) {
  preconditions.checkArgument(BufferUtil.isBuffer(buf));
  var digest = hash.sha256().update(buf).digest('hex');
  return Buffer.from(digest, 'hex');
};

Hash.sha256.blocksize = 512;

Hash.sha256sha256 = function (buf) {
  preconditions.checkArgument(BufferUtil.isBuffer(buf));
  return Hash.sha256(Hash.sha256(buf));
};

Hash.ripemd160 = function (buf) {
  preconditions.checkArgument(BufferUtil.isBuffer(buf));
  var digest = hash.ripemd160().update(buf).digest('hex');
  return Buffer.from(digest, 'hex');
};

Hash.sha256ripemd160 = function (buf) {
  preconditions.checkArgument(BufferUtil.isBuffer(buf));
  return Hash.ripemd160(Hash.sha256(buf));
};

Hash.sha512 = function (buf) {
  preconditions.checkArgument(BufferUtil.isBuffer(buf));
  var digest = hash.sha512().update(buf).digest('hex');
  return Buffer.from(digest, 'hex');
};

Hash.sha512.blocksize = 1024;

Hash.hmac = function (hashf, data, key) {
  // http://en.wikipedia.org/wiki/Hash-based_message_authentication_code
  // http://tools.ietf.org/html/rfc4868#section-2
  preconditions.checkArgument(BufferUtil.isBuffer(data));
  preconditions.checkArgument(BufferUtil.isBuffer(key));
  preconditions.checkArgument(hashf.blocksize);
  var blocksize = hashf.blocksize / 8;

  if (key.length > blocksize) {
    key = hashf(key);
  } else if (key < blocksize) {
    var fill = Buffer.alloc(blocksize);
    fill.fill(0);
    key.copy(fill);
    key = fill;
  }

  var oKey = Buffer.alloc(blocksize);
  oKey.fill(0x5c);
  var iKey = Buffer.alloc(blocksize);
  iKey.fill(0x36);
  var oKeyPad = Buffer.alloc(blocksize);
  var iKeyPad = Buffer.alloc(blocksize);

  for (var i = 0; i < blocksize; i += 1) {
    oKeyPad[i] = oKey[i] ^ key[i];
    iKeyPad[i] = iKey[i] ^ key[i];
  }

  return hashf(Buffer.concat([oKeyPad, hashf(Buffer.concat([iKeyPad, data]))]));
};

Hash.sha256hmac = function (data, key) {
  return Hash.hmac(Hash.sha256, data, key);
};

Hash.sha512hmac = function (data, key) {
  return Hash.hmac(Hash.sha512, data, key);
};

var Base58Check = function Base58Check(obj) {
  if (!(this instanceof Base58Check)) return new Base58Check(obj);

  if (Buffer.isBuffer(obj)) {
    var buf = obj;
    this.fromBuffer(buf);
  } else if (typeof obj === 'string') {
    var str = obj;
    this.fromString(str);
  } else if (obj) {
    this.set(obj);
  }
};

Base58Check.prototype.set = function (obj) {
  this.buf = obj.buf || this.buf || undefined;
  return this;
};

Base58Check.validChecksum = function validChecksum(data, checksum) {
  if (_.isString(data)) {
    data = Buffer.from(Base58.decode(data));
  }

  if (_.isString(checksum)) {
    checksum = Buffer.from(Base58.decode(checksum));
  }

  if (!checksum) {
    checksum = data.slice(-4);
    data = data.slice(0, -4);
  }

  return Base58Check.checksum(data).toString('hex') === checksum.toString('hex');
};

Base58Check.decode = function (s) {
  if (typeof s !== 'string') throw new Error('Input must be a string');
  var buf = Buffer.from(Base58.decode(s));
  if (buf.length < 4) throw new Error('Input string too short');
  var data = buf.slice(0, -4);
  var csum = buf.slice(-4);
  var hash = Hash.sha256sha256(data);
  var hash4 = hash.slice(0, 4);
  if (csum.toString('hex') !== hash4.toString('hex')) throw new Error('Checksum mismatch');
  return data;
};

Base58Check.checksum = function (buff) {
  return Hash.sha256sha256(buff).slice(0, 4);
};

Base58Check.encode = function (buf) {
  if (!Buffer.isBuffer(buf)) throw new Error('Input must be a buffer');
  var checkedBuf = Buffer.alloc(buf.length + 4);
  var hash = Base58Check.checksum(buf);
  buf.copy(checkedBuf);
  hash.copy(checkedBuf, buf.length);
  return Base58.encode(checkedBuf);
};

Base58Check.prototype.fromBuffer = function (buf) {
  this.buf = buf;
  return this;
};

Base58Check.prototype.fromString = function (str) {
  var buf = Base58Check.decode(str);
  this.buf = buf;
  return this;
};

Base58Check.prototype.toBuffer = function () {
  return this.buf;
};

Base58Check.prototype.toString = function () {
  return Base58Check.encode(this.buf);
};

var networks = [];
var networkMaps = {};
/**
 * A network is merely a map containing values that correspond to version
 * numbers for each bitcoin network. Currently only supporting "livenet"
 * (a.k.a. "mainnet") and "testnet".
 * @constructor
 */

function Network() {}

Network.prototype.toString = function toString() {
  return this.name;
};
/**
 * @function
 * @member Networks#get
 * Retrieves the network associated with a magic number or string.
 * @param {string|number|Network} arg
 * @param {string|Array} keys - if set, only check if the magic number associated with this name
 *   matches
 * @return Network
 */


function get(arg, keys) {
  if (~networks.indexOf(arg)) {
    return arg;
  }

  if (keys) {
    if (!_.isArray(keys)) {
      keys = [keys];
    }

    var index = networks.findIndex(network => _.some(keys, key => network[key] === arg));

    if (index !== -1) {
      return networks[index];
    }

    return undefined;
  }

  return networkMaps[arg];
}
/**
 * @function
 * @member Networks#add
 * Will add a custom Network
 * @param {Object} data
 * @param {string} data.name - The name of the network
 * @param {string} data.alias - The aliased name of the network
 * @param {Number} data.pubkeyhash - The publickey hash prefix
 * @param {Number} data.privatekey - The privatekey prefix
 * @param {Number} data.scripthash - The scripthash prefix
 * @param {Number} data.xpubkey - The extended public key magic
 * @param {Number} data.xprivkey - The extended private key magic
 * @param {Number} data.networkMagic - The network magic number
 * @param {Number} data.port - The network port
 * @param {Array}  data.dnsSeeds - An array of dns seeds
 * @return Network
 */


function addNetwork(data) {
  var network = new Network();
  JSUtil.defineImmutable(network, {
    name: data.name,
    alias: data.alias,
    pubkeyhash: data.pubkeyhash,
    privatekey: data.privatekey,
    scripthash: data.scripthash,
    xpubkey: data.xpubkey,
    xprivkey: data.xprivkey
  });

  if (data.networkMagic) {
    JSUtil.defineImmutable(network, {
      networkMagic: BufferUtil.integerAsBuffer(data.networkMagic)
    });
  }

  if (data.port) {
    JSUtil.defineImmutable(network, {
      port: data.port
    });
  }

  if (data.dnsSeeds) {
    JSUtil.defineImmutable(network, {
      dnsSeeds: data.dnsSeeds
    });
  }

  _.each(network, value => {
    if (!_.isUndefined(value) && !_.isObject(value)) {
      networkMaps[value] = network;
    }
  });

  networks.push(network);
  return network;
}
/**
 * @function
 * @member Networks#remove
 * Will remove a custom network
 * @param {Network} network
 */


function removeNetwork(network) {
  for (var i = 0; i < networks.length; i += 1) {
    if (networks[i] === network) {
      networks.splice(i, 1);
    }
  }

  Object.keys(networkMaps).forEach(objectKey => {
    if (networkMaps[objectKey] === network) {
      delete networkMaps[objectKey];
    }
  });
}

addNetwork({
  name: 'livenet',
  alias: 'mainnet',
  pubkeyhash: 0x00,
  privatekey: 0x80,
  scripthash: 0x05,
  xpubkey: 0x0488b21e,
  xprivkey: 0x0488ade4,
  networkMagic: 0xf9beb4d9,
  port: 8333,
  dnsSeeds: ['seed.bitcoin.sipa.be', 'dnsseed.bluematt.me', 'dnsseed.bitcoin.dashjr.org', 'seed.bitcoinstats.com', 'seed.bitnodes.io', 'bitseed.xf2.org']
});
/**
 * @instance
 * @member Networks#livenet
 */

var livenet = get('livenet');
addNetwork({
  name: 'testnet',
  alias: 'regtest',
  pubkeyhash: 0x6f,
  privatekey: 0xef,
  scripthash: 0xc4,
  xpubkey: 0x043587cf,
  xprivkey: 0x04358394
});
/**
 * @instance
 * @member Networks#testnet
 */

var testnet = get('testnet'); // Add configurable values for testnet/regtest

var TESTNET = {
  PORT: 18333,
  NETWORK_MAGIC: BufferUtil.integerAsBuffer(0x0b110907),
  DNS_SEEDS: ['testnet-seed.bitcoin.petertodd.org', 'testnet-seed.bluematt.me', 'testnet-seed.alexykot.me', 'testnet-seed.bitcoin.schildbach.de']
};
Object.keys(TESTNET).forEach(objectKey => {
  if (!_.isObject(TESTNET[objectKey])) {
    networkMaps[TESTNET[objectKey]] = testnet;
  }
});
var REGTEST = {
  PORT: 18444,
  NETWORK_MAGIC: BufferUtil.integerAsBuffer(0xfabfb5da),
  DNS_SEEDS: []
};
Object.keys(REGTEST).forEach(objectKey => {
  if (!_.isObject(REGTEST[objectKey])) {
    networkMaps[REGTEST[objectKey]] = testnet;
  }
});
Object.defineProperty(testnet, 'port', {
  enumerable: true,
  configurable: false,

  get() {
    if (this.regtestEnabled) {
      return REGTEST.PORT;
    }

    return TESTNET.PORT;
  }

});
Object.defineProperty(testnet, 'networkMagic', {
  enumerable: true,
  configurable: false,

  get() {
    if (this.regtestEnabled) {
      return REGTEST.NETWORK_MAGIC;
    }

    return TESTNET.NETWORK_MAGIC;
  }

});
Object.defineProperty(testnet, 'dnsSeeds', {
  enumerable: true,
  configurable: false,

  get() {
    if (this.regtestEnabled) {
      return REGTEST.DNS_SEEDS;
    }

    return TESTNET.DNS_SEEDS;
  }

});
/**
 * @function
 * @member Networks#enableRegtest
 * Will enable regtest features for testnet
 */

function enableRegtest() {
  testnet.regtestEnabled = true;
}
/**
 * @function
 * @member Networks#disableRegtest
 * Will disable regtest features for testnet
 */


function disableRegtest() {
  testnet.regtestEnabled = false;
}
/**
 * @namespace Networks
 */


var Networks = {
  add: addNetwork,
  remove: removeNetwork,
  defaultNetwork: livenet,
  livenet,
  mainnet: livenet,
  testnet,
  get,
  enableRegtest,
  disableRegtest
};

var reversebuf = function reversebuf(buf) {
  var buf2 = Buffer.alloc(buf.length);

  for (var i = 0; i < buf.length; i += 1) {
    buf2[i] = buf[buf.length - 1 - i];
  }

  return buf2;
};

BN.Zero = new BN(0);
BN.One = new BN(1);
BN.Minus1 = new BN(-1);

BN.fromNumber = function (n) {
  preconditions.checkArgument(_.isNumber(n));
  return new BN(n);
};

BN.fromString = function (str, base) {
  preconditions.checkArgument(_.isString(str));
  return new BN(str, base);
};

BN.fromBuffer = function (buf, opts) {
  if (typeof opts !== 'undefined' && opts.endian === 'little') {
    buf = reversebuf(buf);
  }

  var hex = buf.toString('hex');
  var bn = new BN(hex, 16);
  return bn;
};
/**
 * Instantiate a BigNumber from a "signed magnitude buffer"
 * (a buffer where the most significant bit represents the sign (0 = positive, -1 = negative))
 */


BN.fromSM = function (buf, opts) {
  var ret;

  if (buf.length === 0) {
    return BN.fromBuffer(Buffer.from([0]));
  }

  var endian = 'big';

  if (opts) {
    ({
      endian
    } = opts);
  }

  if (endian === 'little') {
    buf = reversebuf(buf);
  }

  if (buf[0] & 0x80) {
    buf[0] &= 0x7f;
    ret = BN.fromBuffer(buf);
    ret.neg().copy(ret);
  } else {
    ret = BN.fromBuffer(buf);
  }

  return ret;
};

BN.prototype.toNumber = function () {
  return parseInt(this.toString(10), 10);
};

BN.prototype.toBuffer = function (opts) {
  var buf;
  var hex;

  if (opts && opts.size) {
    hex = this.toString(16, 2);
    var natlen = hex.length / 2;
    buf = Buffer.from(hex, 'hex');

    if (natlen > opts.size) {
      buf = BN.trim(buf, natlen);
    } else if (natlen < opts.size) {
      buf = BN.pad(buf, natlen, opts.size);
    }
  } else {
    hex = this.toString(16, 2);
    buf = Buffer.from(hex, 'hex');
  }

  if (typeof opts !== 'undefined' && opts.endian === 'little') {
    buf = reversebuf(buf);
  }

  return buf;
};

BN.prototype.toSMBigEndian = function () {
  var buf;

  if (this.cmp(BN.Zero) === -1) {
    buf = this.neg().toBuffer();

    if (buf[0] & 0x80) {
      buf = Buffer.concat([Buffer.from([0x80]), buf]);
    } else {
      buf[0] |= 0x80;
    }
  } else {
    buf = this.toBuffer();

    if (buf[0] & 0x80) {
      buf = Buffer.concat([Buffer.from([0x00]), buf]);
    }
  }

  if (buf.length === 1 & buf[0] === 0) {
    buf = Buffer.from([]);
  }

  return buf;
};

BN.prototype.toSM = function (opts) {
  var endian = opts ? opts.endian : 'big';
  var buf = this.toSMBigEndian();

  if (endian === 'little') {
    buf = reversebuf(buf);
  }

  return buf;
};
/**
 * Create a BN from a "ScriptNum":
 * This is analogous to the constructor for CScriptNum in bitcoind. Many ops in
 * bitcoind's script interpreter use CScriptNum, which is not really a proper
 * bignum. Instead, an error is thrown if trying to input a number bigger than
 * 4 bytes. We copy that behavior here. A third argument, `size`, is provided to
 * extend the hard limit of 4 bytes, as some usages require more than 4 bytes.
 */


BN.fromScriptNumBuffer = function (buf, fRequireMinimal, size) {
  var nMaxNumSize = size || 4;
  preconditions.checkArgument(buf.length <= nMaxNumSize, new Error('script number overflow'));

  if (fRequireMinimal && buf.length > 0) {
    // Check that the number is encoded with the minimum possible
    // number of bytes.
    //
    // If the most-significant-byte - excluding the sign bit - is zero
    // then we're not minimal. Note how this test also rejects the
    // negative-zero encoding, 0x80.
    if ((buf[buf.length - 1] & 0x7f) === 0) {
      // One exception: if there's more than one byte and the most
      // significant bit of the second-most-significant-byte is set
      // it would conflict with the sign bit. An example of this case
      // is +-255, which encode to 0xff00 and 0xff80 respectively.
      // (big-endian).
      if (buf.length <= 1 || (buf[buf.length - 2] & 0x80) === 0) {
        throw new Error('non-minimally encoded script number');
      }
    }
  }

  return BN.fromSM(buf, {
    endian: 'little'
  });
};
/**
 * The corollary to the above, with the notable exception that we do not throw
 * an error if the output is larger than four bytes. (Which can happen if
 * performing a numerical operation that results in an overflow to more than 4
 * bytes).
 */


BN.prototype.toScriptNumBuffer = function () {
  return this.toSM({
    endian: 'little'
  });
};

BN.trim = function (buf, natlen) {
  return buf.slice(natlen - buf.length, buf.length);
};

BN.pad = function (buf, natlen, size) {
  var rbuf = Buffer.alloc(size);

  for (var i = 0; i < buf.length; i += 1) {
    rbuf[rbuf.length - 1 - i] = buf[buf.length - 1 - i];
  }

  for (var _i = 0; _i < size - natlen; _i += 1) {
    rbuf[_i] = 0;
  }

  return rbuf;
};

var ec = elliptic.curves.secp256k1;
var ecPoint = ec.curve.point.bind(ec.curve);
var ecPointFromX = ec.curve.pointFromX.bind(ec.curve);
/**
 *
 * Instantiate a valid secp256k1 Point from the X and Y coordinates.
 *
 * @param {BN|String} x - The X coordinate
 * @param {BN|String} y - The Y coordinate
 * @link https://github.com/indutny/elliptic
 * @augments elliptic.curve.point
 * @throws {Error} A validation error if exists
 * @returns {Point} An instance of Point
 * @constructor
 */

var Point = function Point(x, y, isRed) {
  var point;

  try {
    point = ecPoint(x, y, isRed);
  } catch (e) {
    throw new Error('Invalid point on curve');
  }

  point.validate();
  return point;
};

Point.prototype = Object.getPrototypeOf(ec.curve.point());
/**
 *
 * Instantiate a valid secp256k1 Point from only the X coordinate
 *
 * @param {boolean} odd - If the Y coordinate is odd
 * @param {BN|String} x - The X coordinate
 * @throws {Error} A validation error if exists
 * @returns {Point} An instance of Point
 */

Point.fromX = function fromX(odd, x) {
  var point;

  try {
    point = ecPointFromX(x, odd);
  } catch (e) {
    throw new Error('Invalid x value for curve.');
  }

  point.validate();
  return point;
};
/**
 *
 * Will return a secp256k1 ECDSA base point.
 *
 * @link https://en.bitcoin.it/wiki/Secp256k1
 * @returns {Point} An instance of the base point.
 */


Point.getG = function getG() {
  return ec.curve.g;
};
/**
 *
 * Will return the max of range of valid private keys as governed by the secp256k1 ECDSA standard.
 *
 * @link https://en.bitcoin.it/wiki/Private_key#Range_of_valid_ECDSA_private_keys
 * @returns {BN} A BN instance of the number of points on the curve
 */


Point.getN = function getN() {
  return new BN(ec.curve.n.toArray());
};

Point.prototype._getX = Point.prototype.getX;
/**
 *
 * Will return the X coordinate of the Point
 *
 * @returns {BN} A BN instance of the X coordinate
 */

Point.prototype.getX = function getX() {
  return new BN(this._getX().toArray());
};

Point.prototype._getY = Point.prototype.getY;
/**
 *
 * Will return the Y coordinate of the Point
 *
 * @returns {BN} A BN instance of the Y coordinate
 */

Point.prototype.getY = function getY() {
  return new BN(this._getY().toArray());
};
/**
 *
 * Will determine if the point is valid
 *
 * @link https://www.iacr.org/archive/pkc2003/25670211/25670211.pdf
 * @param {Point} An instance of Point
 * @throws {Error} A validation error if exists
 * @returns {Point} An instance of the same Point
 */


Point.prototype.validate = function validate() {
  if (this.isInfinity()) {
    throw new Error('Point cannot be equal to Infinity');
  }

  var p2;

  try {
    p2 = ecPointFromX(this.getX(), this.getY().isOdd());
  } catch (e) {
    throw new Error('Point does not lie on the curve.');
  }

  if (p2.y.cmp(this.y) !== 0) {
    throw new Error('Invalid y value for curve.');
  } // todo: needs test case


  if (!this.mul(Point.getN()).isInfinity()) {
    throw new Error('Point times N must be infinity');
  }

  return this;
};

Point.pointToCompressed = function pointToCompressed(point) {
  var xbuf = point.getX().toBuffer({
    size: 32
  });
  var ybuf = point.getY().toBuffer({
    size: 32
  });
  var prefix;
  var odd = ybuf[ybuf.length - 1] % 2;

  if (odd) {
    prefix = Buffer.from([0x03]);
  } else {
    prefix = Buffer.from([0x02]);
  }

  return BufferUtil.concat([prefix, xbuf]);
};

//      
var Random = {};

Random.getRandomBufferNode = function (size) {
  return randomBytes(size);
};

Random.getRandomBufferBrowser = function (size) {
  var windowCrypto;

  if (window.crypto && window.crypto.getRandomValues) {
    windowCrypto = window.crypto;
  } else if (window.msCrypto && window.msCrypto.getRandomValues) {
    // internet explorer
    windowCrypto = window.msCrypto;
  } else {
    throw new Error('window crypto.getRandomValues not available');
  }

  var bbuf = new Uint8Array(size);
  windowCrypto.getRandomValues(bbuf);
  var buf = Buffer.from(bbuf);
  return buf;
};
/* secure random bytes that sometimes throws an error due to lack of entropy */


Random.getRandomBuffer = function (size) {
  if (typeof window !== 'undefined' && (typeof window.crypto !== 'undefined' || typeof window.msCrypto !== 'undefined')) {
    return Random.getRandomBufferBrowser(size);
  }

  return Random.getRandomBufferNode(size);
};
/* insecure random bytes, but it never fails */


Random.getPseudoRandomBuffer = function (size) {
  var b32 = 0x100000000;
  var b = Buffer.alloc(size);
  var r = 0;

  for (var i = 0; i <= size; i += 1) {
    var j = Math.floor(i / 4);
    var k = i - j * 4;

    if (k === 0) {
      r = Math.random() * b32;
      b[i] = r & 0xff;
    } else {
      b[i] = (r >>>= 8) & 0xff;
    }
  }

  return b;
};

/**
 * Instantiate a PrivateKey from a BN, Buffer and WIF.
 *
 * @example
 * ```javascript
 * // generate a new random key
 * var key = PrivateKey();
 *
 * // get the associated address
 * var address = key.toAddress();
 *
 * // encode into wallet export format
 * var exported = key.toWIF();
 *
 * // instantiate from the exported (and saved) private key
 * var imported = PrivateKey.fromWIF(exported);
 * ```
 *
 * @param {string} data - The encoded data in various formats
 * @param {Network|string=} network - a {@link Network} object, or a string with the network name
 * @returns {PrivateKey} A new valid instance of an PrivateKey
 * @constructor
 */

function PrivateKey(data, network) {
  if (!(this instanceof PrivateKey)) {
    return new PrivateKey(data, network);
  }

  if (data instanceof PrivateKey) {
    return data;
  }

  var info = this._classifyArguments(data, network); // validation


  if (!info.bn || info.bn.cmp(new BN(0)) === 0) {
    throw new TypeError('Number can not be equal to zero, undefined, null or false');
  }

  if (!info.bn.lt(Point.getN())) {
    throw new TypeError('Number must be less than N');
  }

  if (typeof info.network === 'undefined') {
    throw new TypeError('Must specify the network ("livenet" or "testnet")');
  }

  JSUtil.defineImmutable(this, {
    bn: info.bn,
    compressed: info.compressed,
    network: info.network
  });
  Object.defineProperty(this, 'publicKey', {
    configurable: false,
    enumerable: true,
    get: this.toPublicKey.bind(this)
  });
  return this;
}
/**
 * Internal helper to instantiate PrivateKey internal `info` object from
 * different kinds of arguments passed to the constructor.
 *
 * @param {*} data
 * @param {Network|string=} network - a {@link Network} object, or a string with the network name
 * @return {Object}
 */


PrivateKey.prototype._classifyArguments = function (data, network) {
  var info = {
    compressed: true,
    network: network ? Networks.get(network) : Networks.defaultNetwork
  }; // detect type of data

  if (_.isUndefined(data) || _.isNull(data)) {
    info.bn = PrivateKey._getRandomBN();
  } else if (data instanceof BN) {
    info.bn = data;
  } else if (data instanceof Buffer || data instanceof Uint8Array) {
    info = PrivateKey._transformBuffer(data, network);
  } else if (data.bn && data.network) {
    info = PrivateKey._transformObject(data);
  } else if (!network && Networks.get(data)) {
    info.bn = PrivateKey._getRandomBN();
    info.network = Networks.get(data);
  } else if (typeof data === 'string') {
    if (JSUtil.isHexa(data)) {
      info.bn = new BN(Buffer.from(data, 'hex'));
    } else {
      info = PrivateKey._transformWIF(data, network);
    }
  } else {
    throw new TypeError('First argument is an unrecognized data type.');
  }

  return info;
};
/**
 * Internal function to get a random Big Number (BN)
 *
 * @returns {BN} A new randomly generated BN
 * @private
 */


PrivateKey._getRandomBN = function () {
  var condition;
  var bn;

  do {
    var privbuf = Random.getRandomBuffer(32);
    bn = BN.fromBuffer(privbuf);
    condition = bn.lt(Point.getN());
  } while (!condition);

  return bn;
};
/**
 * Internal function to transform a WIF Buffer into a private key
 *
 * @param {Buffer} buf - An WIF string
 * @param {Network|string=} network - a {@link Network} object, or a string with the network name
 * @returns {Object} An object with keys: bn, network and compressed
 * @private
 */


PrivateKey._transformBuffer = function (buf, network) {
  var info = {};

  if (buf.length === 32) {
    return PrivateKey._transformBNBuffer(buf, network);
  }

  info.network = Networks.get(buf[0], 'privatekey');

  if (!info.network) {
    throw new Error('Invalid network');
  }

  if (network && info.network !== Networks.get(network)) {
    throw new TypeError('Private key network mismatch');
  }

  if (buf.length === 1 + 32 + 1 && buf[1 + 32 + 1 - 1] === 1) {
    info.compressed = true;
  } else if (buf.length === 1 + 32) {
    info.compressed = false;
  } else {
    throw new Error('Length of buffer must be 33 (uncompressed) or 34 (compressed)');
  }

  info.bn = BN.fromBuffer(buf.slice(1, 32 + 1));
  return info;
};
/**
 * Internal function to transform a BN buffer into a private key
 *
 * @param {Buffer} buf
 * @param {Network|string=} network - a {@link Network} object, or a string with the network name
 * @returns {object} an Object with keys: bn, network, and compressed
 * @private
 */


PrivateKey._transformBNBuffer = function (buf, network) {
  var info = {};
  info.network = Networks.get(network) || Networks.defaultNetwork;
  info.bn = BN.fromBuffer(buf);
  info.compressed = false;
  return info;
};
/**
 * Internal function to transform a WIF string into a private key
 *
 * @param {string} buf - An WIF string
 * @returns {Object} An object with keys: bn, network and compressed
 * @private
 */


PrivateKey._transformWIF = function (str, network) {
  return PrivateKey._transformBuffer(Base58Check.decode(str), network);
};
/**
 * Instantiate a PrivateKey from a Buffer with the DER or WIF representation
 *
 * @param {Buffer} arg
 * @param {Network} network
 * @return {PrivateKey}
 */


PrivateKey.fromBuffer = function (arg, network) {
  return new PrivateKey(arg, network);
};
/**
 * Internal function to transform a JSON string on plain object into a private key
 * return this.
 *
 * @param {string} json - A JSON string or plain object
 * @returns {Object} An object with keys: bn, network and compressed
 * @private
 */


PrivateKey._transformObject = function (json) {
  var bn = new BN(json.bn, 'hex');
  var network = Networks.get(json.network);
  return {
    bn,
    network,
    compressed: json.compressed
  };
};
/**
 * Instantiate a PrivateKey from a WIF string
 *
 * @param {string} str - The WIF encoded private key string
 * @returns {PrivateKey} A new valid instance of PrivateKey
 */


PrivateKey.fromWIF = function (str) {
  preconditions.checkArgument(_.isString(str), 'First argument is expected to be a string.');
  return new PrivateKey(str);
};

PrivateKey.fromString = PrivateKey.fromWIF;
/**
 * Instantiate a PrivateKey from a plain JavaScript object
 *
 * @param {Object} obj - The output from privateKey.toObject()
 */

PrivateKey.fromObject = function (obj) {
  preconditions.checkArgument(_.isObject(obj), 'First argument is expected to be an object.');
  return new PrivateKey(obj);
};
/**
 * Instantiate a PrivateKey from random bytes
 *
 * @param {string=} network - Either "livenet" or "testnet"
 * @returns {PrivateKey} A new valid instance of PrivateKey
 */


PrivateKey.fromRandom = function (network) {
  var bn = PrivateKey._getRandomBN();

  return new PrivateKey(bn, network);
};
/**
 * Check if there would be any errors when initializing a PrivateKey
 *
 * @param {string} data - The encoded data in various formats
 * @param {string=} network - Either "livenet" or "testnet"
 * @returns {null|Error} An error if exists
 */


PrivateKey.getValidationError = function (data, network) {
  var error;

  try {
    // #weirdstuff Refactor.
    // eslint-disable-next-line no-new
    new PrivateKey(data, network);
  } catch (e) {
    error = e;
  }

  return error;
};
/**
 * Check if the parameters are valid
 *
 * @param {string} data - The encoded data in various formats
 * @param {string=} network - Either "livenet" or "testnet"
 * @returns {Boolean} If the private key is would be valid
 */


PrivateKey.isValid = function (data, network) {
  if (!data) {
    return false;
  }

  return !PrivateKey.getValidationError(data, network);
};
/**
 * Will output the PrivateKey encoded as hex string
 *
 * @returns {string}
 */


PrivateKey.prototype.toString = function () {
  return this.toBuffer().toString('hex');
};
/**
 * Will output the PrivateKey to a WIF string
 *
 * @returns {string} A WIP representation of the private key
 */


PrivateKey.prototype.toWIF = function () {
  var buf;

  if (this.compressed) {
    buf = Buffer.concat([Buffer.from([this.network.privatekey]), this.bn.toBuffer({
      size: 32
    }), Buffer.from([0x01])]);
  } else {
    buf = Buffer.concat([Buffer.from([this.network.privatekey]), this.bn.toBuffer({
      size: 32
    })]);
  }

  return Base58Check.encode(buf);
};
/**
 * Will return the private key as a BN instance
 *
 * @returns {BN} A BN instance of the private key
 */


PrivateKey.prototype.toBigNumber = function () {
  return this.bn;
};
/**
 * Will return the private key as a BN buffer
 *
 * @returns {Buffer} A buffer of the private key
 */


PrivateKey.prototype.toBuffer = function () {
  // TODO: use `return this.bn.toBuffer({ size: 32 })` in v1.0.0
  return this.bn.toBuffer();
};
/**
 * WARNING: This method will not be officially supported until v1.0.0.
 *
 *
 * Will return the private key as a BN buffer without leading zero padding
 *
 * @returns {Buffer} A buffer of the private key
 */


PrivateKey.prototype.toBufferNoPadding = function () {
  return this.bn.toBuffer();
};
/**
 * Will return the corresponding public key
 *
 * @returns {PublicKey} A public key generated from the private key
 */


PrivateKey.prototype.toPublicKey = function () {
  if (!this._pubkey) {
    this._pubkey = PublicKey.fromPrivateKey(this);
  }

  return this._pubkey;
};
/**
 * Will return an address for the private key
 * @param {Network=} network - optional parameter specifying
 * the desired network for the address
 *
 * @returns {Address} An address generated from the private key
 */


PrivateKey.prototype.toAddress = function (network) {
  var pubkey = this.toPublicKey();
  return Address.fromPublicKey(pubkey, network || this.network);
};
/**
 * @returns {Object} A plain object representation
 */


PrivateKey.prototype.toJSON = function toObject() {
  return {
    bn: this.bn.toString('hex'),
    compressed: this.compressed,
    network: this.network.toString()
  };
};

PrivateKey.prototype.toObject = PrivateKey.prototype.toJSON;
/**
 * Will return a string formatted for the console
 *
 * @returns {string} Private key
 */

PrivateKey.prototype.inspect = function () {
  var uncompressed = !this.compressed ? ', uncompressed' : '';
  return "<PrivateKey: ".concat(this.toString(), ", network: ").concat(this.network).concat(uncompressed, ">");
};

/**
 * Instantiate a PublicKey from a {@link PrivateKey}, {@link Point}, `string`, or `Buffer`.
 *
 * There are two internal properties, `network` and `compressed`, that deal with importing
 * a PublicKey from a PrivateKey in WIF format. More details described on {@link PrivateKey}
 *
 * @example
 * ```javascript
 * // instantiate from a private key
 * var key = PublicKey(privateKey, true);
 *
 * // export to as a DER hex encoded string
 * var exported = key.toString();
 *
 * // import the public key
 * var imported = PublicKey.fromString(exported);
 * ```
 *
 * @param {string} data - The encoded data in various formats
 * @param {Object} extra - additional options
 * @param {Network=} extra.network - Which network should the address for this public key be for
 * @param {String=} extra.compressed - If the public key is compressed
 * @returns {PublicKey} A new valid instance of an PublicKey
 * @constructor
 */

function PublicKey(data, extra) {
  if (!(this instanceof PublicKey)) {
    return new PublicKey(data, extra);
  }

  preconditions.checkArgument(data, 'First argument is required, please include public key data.');

  if (data instanceof PublicKey) {
    // Return copy, but as it's an immutable object, return same argument
    return data;
  }

  extra = extra || {};

  var info = this._classifyArgs(data, extra); // validation


  info.point.validate();
  JSUtil.defineImmutable(this, {
    point: info.point,
    compressed: info.compressed,
    network: info.network || Networks.defaultNetwork
  });
  return this;
}
/**
 * Internal function to differentiate between arguments passed to the constructor
 * @param {*} data
 * @param {Object} extra
 */


PublicKey.prototype._classifyArgs = function (data, extra) {
  var info = {
    compressed: _.isUndefined(extra.compressed) || extra.compressed
  }; // detect type of data

  if (data instanceof Point) {
    info.point = data;
  } else if (data.x && data.y) {
    info = PublicKey._transformObject(data);
  } else if (typeof data === 'string') {
    info = PublicKey._transformDER(Buffer.from(data, 'hex'));
  } else if (PublicKey._isBuffer(data)) {
    info = PublicKey._transformDER(data);
  } else if (PublicKey._isPrivateKey(data)) {
    info = PublicKey._transformPrivateKey(data);
  } else {
    throw new TypeError('First argument is an unrecognized data format.');
  }

  if (!info.network) {
    info.network = _.isUndefined(extra.network) ? undefined : Networks.get(extra.network);
  }

  return info;
};
/**
 * Internal function to detect if an object is a {@link PrivateKey}
 *
 * @param {*} param - object to test
 * @returns {boolean}
 * @private
 */


PublicKey._isPrivateKey = function (param) {
  return param instanceof PrivateKey;
};
/**
 * Internal function to detect if an object is a Buffer
 *
 * @param {*} param - object to test
 * @returns {boolean}
 * @private
 */


PublicKey._isBuffer = function (param) {
  return param instanceof Buffer || param instanceof Uint8Array;
};
/**
 * Internal function to transform a private key into a public key point
 *
 * @param {PrivateKey} privkey - An instance of PrivateKey
 * @returns {Object} An object with keys: point and compressed
 * @private
 */


PublicKey._transformPrivateKey = function (privkey) {
  preconditions.checkArgument(PublicKey._isPrivateKey(privkey), 'Must be an instance of PrivateKey');
  var info = {};
  info.point = Point.getG().mul(privkey.bn);
  info.compressed = privkey.compressed;
  info.network = privkey.network;
  return info;
};
/**
 * Internal function to transform DER into a public key point
 *
 * @param {Buffer} buf - An hex encoded buffer
 * @param {bool=} strict - if set to false, will loosen some conditions
 * @returns {Object} An object with keys: point and compressed
 * @private
 */


PublicKey._transformDER = function (buf, strict) {
  preconditions.checkArgument(PublicKey._isBuffer(buf), 'Must be a hex buffer of DER encoded public key');
  var info = {};
  strict = _.isUndefined(strict) ? true : strict;
  var x;
  var y;
  var xbuf;
  var ybuf;

  if (buf[0] === 0x04 || !strict && (buf[0] === 0x06 || buf[0] === 0x07)) {
    xbuf = buf.slice(1, 33);
    ybuf = buf.slice(33, 65);

    if (xbuf.length !== 32 || ybuf.length !== 32 || buf.length !== 65) {
      throw new TypeError('Length of x and y must be 32 bytes');
    }

    x = new BN(xbuf);
    y = new BN(ybuf);
    info.point = new Point(x, y);
    info.compressed = false;
  } else if (buf[0] === 0x03) {
    xbuf = buf.slice(1);
    x = new BN(xbuf);
    info = PublicKey._transformX(true, x);
    info.compressed = true;
  } else if (buf[0] === 0x02) {
    xbuf = buf.slice(1);
    x = new BN(xbuf);
    info = PublicKey._transformX(false, x);
    info.compressed = true;
  } else {
    throw new TypeError('Invalid DER format public key');
  }

  return info;
};
/**
 * Internal function to transform X into a public key point
 *
 * @param {Boolean} odd - If the point is above or below the x axis
 * @param {Point} x - The x point
 * @returns {Object} An object with keys: point and compressed
 * @private
 */


PublicKey._transformX = function (odd, x) {
  preconditions.checkArgument(typeof odd === 'boolean', 'Must specify whether y is odd or not (true or false)');
  var info = {};
  info.point = Point.fromX(odd, x);
  return info;
};
/**
 * Internal function to transform a JSON into a public key point
 *
 * @param {String|Object} json - a JSON string or plain object
 * @returns {Object} An object with keys: point and compressed
 * @private
 */


PublicKey._transformObject = function (json) {
  var x = new BN(json.x, 'hex');
  var y = new BN(json.y, 'hex');
  var point = new Point(x, y);
  return new PublicKey(point, {
    compressed: json.compressed
  });
};
/**
 * Instantiate a PublicKey from a PrivateKey
 *
 * @param {PrivateKey} privkey - An instance of PrivateKey
 * @returns {PublicKey} A new valid instance of PublicKey
 */


PublicKey.fromPrivateKey = function (privkey) {
  preconditions.checkArgument(PublicKey._isPrivateKey(privkey), 'Must be an instance of PrivateKey');

  var info = PublicKey._transformPrivateKey(privkey);

  return new PublicKey(info.point, {
    compressed: info.compressed,
    network: info.network
  });
};
/**
 * Instantiate a PublicKey from a Buffer
 * @param {Buffer} buf - A DER hex buffer
 * @param {bool=} strict - if set to false, will loosen some conditions
 * @returns {PublicKey} A new valid instance of PublicKey
 */


PublicKey.fromBuffer = function (buf, strict) {
  preconditions.checkArgument(PublicKey._isBuffer(buf), 'Must be a hex buffer of DER encoded public key');

  var info = PublicKey._transformDER(buf, strict);

  return new PublicKey(info.point, {
    compressed: info.compressed
  });
};

PublicKey.fromDER = PublicKey.fromBuffer;
/**
 * Instantiate a PublicKey from a Point
 *
 * @param {Point} point - A Point instance
 * @param {boolean=} compressed - whether to store this public key as compressed format
 * @returns {PublicKey} A new valid instance of PublicKey
 */

PublicKey.fromPoint = function (point, compressed) {
  preconditions.checkArgument(point instanceof Point, 'First argument must be an instance of Point.');
  return new PublicKey(point, {
    compressed
  });
};
/**
 * Instantiate a PublicKey from a DER hex encoded string
 *
 * @param {string} str - A DER hex string
 * @param {String=} encoding - The type of string encoding
 * @returns {PublicKey} A new valid instance of PublicKey
 */


PublicKey.fromString = function (str, encoding) {
  var buf = Buffer.from(str, encoding || 'hex');

  var info = PublicKey._transformDER(buf);

  return new PublicKey(info.point, {
    compressed: info.compressed
  });
};
/**
 * Instantiate a PublicKey from an X Point
 *
 * @param {Boolean} odd - If the point is above or below the x axis
 * @param {Point} x - The x point
 * @returns {PublicKey} A new valid instance of PublicKey
 */


PublicKey.fromX = function (odd, x) {
  var info = PublicKey._transformX(odd, x);

  return new PublicKey(info.point, {
    compressed: info.compressed
  });
};
/**
 * Check if there would be any errors when initializing a PublicKey
 *
 * @param {string} data - The encoded data in various formats
 * @returns {null|Error} An error if exists
 */


PublicKey.getValidationError = function (data) {
  var error;

  try {
    // #weirdstuff Refactor.
    // eslint-disable-next-line no-new
    new PublicKey(data);
  } catch (e) {
    error = e;
  }

  return error;
};
/**
 * Check if the parameters are valid
 *
 * @param {string} data - The encoded data in various formats
 * @returns {Boolean} If the public key would be valid
 */


PublicKey.isValid = function (data) {
  return !PublicKey.getValidationError(data);
};
/**
 * @returns {Object} A plain object of the PublicKey
 */


PublicKey.prototype.toJSON = function toObject() {
  return {
    x: this.point.getX().toString('hex', 2),
    y: this.point.getY().toString('hex', 2),
    compressed: this.compressed
  };
};

PublicKey.prototype.toObject = PublicKey.prototype.toJSON;
/**
 * Will output the PublicKey to a DER Buffer
 *
 * @returns {Buffer} A DER hex encoded buffer
 */

PublicKey.prototype.toDER = function () {
  var x = this.point.getX();
  var y = this.point.getY();
  var xbuf = x.toBuffer({
    size: 32
  });
  var ybuf = y.toBuffer({
    size: 32
  });
  var prefix;

  if (!this.compressed) {
    prefix = Buffer.from([0x04]);
    return Buffer.concat([prefix, xbuf, ybuf]);
  }

  var odd = ybuf[ybuf.length - 1] % 2;

  if (odd) {
    prefix = Buffer.from([0x03]);
  } else {
    prefix = Buffer.from([0x02]);
  }

  return Buffer.concat([prefix, xbuf]);
};

PublicKey.prototype.toBuffer = PublicKey.prototype.toDER;
/**
 * Will return a sha256 + ripemd160 hash of the serialized public key
 * @see https://github.com/bitcoin/bitcoin/blob/master/src/pubkey.h#L141
 * @returns {Buffer}
 */

PublicKey.prototype._getID = function _getID() {
  return Hash.sha256ripemd160(this.toBuffer());
};
/**
 * Will return an address for the public key
 *
 * @param {String|Network=} network - Which network should the address be for
 * @returns {Address} An address generated from the public key
 */


PublicKey.prototype.toAddress = function (network) {
  return Address.fromPublicKey(this, network || this.network);
};
/**
 * Will output the PublicKey to a DER encoded hex string
 *
 * @returns {string} A DER hex encoded string
 */


PublicKey.prototype.toString = function () {
  return this.toDER().toString('hex');
};
/**
 * Will return a string formatted for the console
 *
 * @returns {string} Public key
 */


PublicKey.prototype.inspect = function () {
  return "<PublicKey: ".concat(this.toString()).concat(this.compressed ? '' : ', uncompressed', ">");
};

var BufferReader = function BufferReader(buf) {
  if (!(this instanceof BufferReader)) {
    return new BufferReader(buf);
  }

  if (_.isUndefined(buf)) {
    return undefined;
  }

  if (Buffer.isBuffer(buf)) {
    this.set({
      buf
    });
  } else if (_.isString(buf)) {
    var b = Buffer.from(buf, 'hex');

    if (b.length * 2 !== buf.length) {
      throw new TypeError('Invalid hex string');
    }

    this.set({
      buf: b
    });
  } else if (_.isObject(buf)) {
    var obj = buf;
    this.set(obj);
  } else {
    throw new TypeError('Unrecognized argument for BufferReader');
  }
};

BufferReader.prototype.set = function (obj) {
  this.buf = obj.buf || this.buf || undefined;
  this.pos = obj.pos || this.pos || 0;
  return this;
};

BufferReader.prototype.eof = function () {
  return this.pos >= this.buf.length;
};

BufferReader.prototype.finished = BufferReader.prototype.eof;

BufferReader.prototype.read = function (len) {
  preconditions.checkArgument(!_.isUndefined(len), 'Must specify a length');
  var buf = this.buf.slice(this.pos, this.pos + len);
  this.pos += len;
  return buf;
};

BufferReader.prototype.readAll = function () {
  var buf = this.buf.slice(this.pos, this.buf.length);
  this.pos = this.buf.length;
  return buf;
};

BufferReader.prototype.readUInt8 = function () {
  var val = this.buf.readUInt8(this.pos);
  this.pos += 1;
  return val;
};

BufferReader.prototype.readUInt16BE = function () {
  var val = this.buf.readUInt16BE(this.pos);
  this.pos += 2;
  return val;
};

BufferReader.prototype.readUInt16LE = function () {
  var val = this.buf.readUInt16LE(this.pos);
  this.pos += 2;
  return val;
};

BufferReader.prototype.readUInt32BE = function () {
  var val = this.buf.readUInt32BE(this.pos);
  this.pos += 4;
  return val;
};

BufferReader.prototype.readUInt32LE = function () {
  var val = this.buf.readUInt32LE(this.pos);
  this.pos += 4;
  return val;
};

BufferReader.prototype.readInt32LE = function () {
  var val = this.buf.readInt32LE(this.pos);
  this.pos += 4;
  return val;
};

BufferReader.prototype.readUInt64BEBN = function () {
  var buf = this.buf.slice(this.pos, this.pos + 8);
  var bn = BN.fromBuffer(buf);
  this.pos += 8;
  return bn;
};

BufferReader.prototype.readUInt64LEBN = function () {
  var second = this.buf.readUInt32LE(this.pos);
  var first = this.buf.readUInt32LE(this.pos + 4);
  var combined = first * 0x100000000 + second; // Instantiating an instance of BN with a number is faster than with an
  // array or string. However, the maximum safe number for a double precision
  // floating point is 2 ^ 52 - 1 (0x1fffffffffffff), thus we can safely use
  // non-floating point numbers less than this amount (52 bits). And in the case
  // that the number is larger, we can instatiate an instance of BN by passing
  // an array from the buffer (slower) and specifying the endianness.

  var bn;

  if (combined <= 0x1fffffffffffff) {
    bn = new BN(combined);
  } else {
    var data = Array.prototype.slice.call(this.buf, this.pos, this.pos + 8);
    bn = new BN(data, 10, 'le');
  }

  this.pos += 8;
  return bn;
};

BufferReader.prototype.readVarintNum = function () {
  var first = this.readUInt8();

  switch (first) {
    case 0xfd:
      return this.readUInt16LE();

    case 0xfe:
      return this.readUInt32LE();

    case 0xff:
      {
        var n = this.readUInt64LEBN().toNumber();

        if (n <= 2 ** 53) {
          return n;
        }

        throw new Error('number too large to retain precision - use readVarintBN');
      }

    default:
      return first;
  }
};
/**
 * reads a length prepended buffer
 */


BufferReader.prototype.readVarLengthBuffer = function () {
  var len = this.readVarintNum();
  var buf = this.read(len);
  preconditions.checkState(buf.length === len, "Invalid length while reading varlength buffer. Expected: ".concat(len, ", Received: ").concat(buf.length));
  return buf;
};

BufferReader.prototype.readVarintBuf = function () {
  var first = this.buf.readUInt8(this.pos);

  switch (first) {
    case 0xfd:
      return this.read(1 + 2);

    case 0xfe:
      return this.read(1 + 4);

    case 0xff:
      return this.read(1 + 8);

    default:
      return this.read(1);
  }
};

BufferReader.prototype.readVarintBN = function () {
  var first = this.readUInt8();

  switch (first) {
    case 0xfd:
      return new BN(this.readUInt16LE());

    case 0xfe:
      return new BN(this.readUInt32LE());

    case 0xff:
      return this.readUInt64LEBN();

    default:
      return new BN(first);
  }
};

BufferReader.prototype.reverse = function () {
  var buf = Buffer.alloc(this.buf.length);

  for (var i = 0; i < buf.length; i += 1) {
    buf[i] = this.buf[this.buf.length - 1 - i];
  }

  this.buf = buf;
  return this;
};

BufferReader.prototype.readReverse = function (len) {
  if (_.isUndefined(len)) {
    len = this.buf.length;
  }

  var buf = this.buf.slice(this.pos, this.pos + len);
  this.pos += len;
  return BufferUtil.reverse(buf);
};

var BufferWriter = function BufferWriter(obj) {
  if (!(this instanceof BufferWriter)) return new BufferWriter(obj);
  if (obj) this.set(obj);else this.bufs = [];
};

BufferWriter.prototype.set = function (obj) {
  this.bufs = obj.bufs || this.bufs || [];
  return this;
};

BufferWriter.prototype.toBuffer = function () {
  return this.concat();
};

BufferWriter.prototype.concat = function () {
  return Buffer.concat(this.bufs);
};

BufferWriter.prototype.write = function (buf) {
  assert(BufferUtil.isBuffer(buf));
  this.bufs.push(buf);
  return this;
};

BufferWriter.prototype.writeReverse = function (buf) {
  assert(BufferUtil.isBuffer(buf));
  this.bufs.push(BufferUtil.reverse(buf));
  return this;
};

BufferWriter.prototype.writeUInt8 = function (n) {
  var buf = Buffer.alloc(1);
  buf.writeUInt8(n, 0);
  this.write(buf);
  return this;
};

BufferWriter.prototype.writeUInt16BE = function (n) {
  var buf = Buffer.alloc(2);
  buf.writeUInt16BE(n, 0);
  this.write(buf);
  return this;
};

BufferWriter.prototype.writeUInt16LE = function (n) {
  var buf = Buffer.alloc(2);
  buf.writeUInt16LE(n, 0);
  this.write(buf);
  return this;
};

BufferWriter.prototype.writeUInt32BE = function (n) {
  var buf = Buffer.alloc(4);
  buf.writeUInt32BE(n, 0);
  this.write(buf);
  return this;
};

BufferWriter.prototype.writeInt32LE = function (n) {
  var buf = Buffer.alloc(4);
  buf.writeInt32LE(n, 0);
  this.write(buf);
  return this;
};

BufferWriter.prototype.writeUInt32LE = function (n) {
  var buf = Buffer.alloc(4);
  buf.writeUInt32LE(n, 0);
  this.write(buf);
  return this;
};

BufferWriter.prototype.writeUInt64BEBN = function (bn) {
  var buf = bn.toBuffer({
    size: 8
  });
  this.write(buf);
  return this;
};

BufferWriter.prototype.writeUInt64LEBN = function (bn) {
  var buf = bn.toBuffer({
    size: 8
  });
  this.writeReverse(buf);
  return this;
};

BufferWriter.prototype.writeVarintNum = function (n) {
  var buf = BufferWriter.varintBufNum(n);
  this.write(buf);
  return this;
};

BufferWriter.prototype.writeVarintBN = function (bn) {
  var buf = BufferWriter.varintBufBN(bn);
  this.write(buf);
  return this;
};

BufferWriter.varintBufNum = function (n) {
  var buf;

  if (n < 253) {
    buf = Buffer.alloc(1);
    buf.writeUInt8(n, 0);
  } else if (n < 0x10000) {
    buf = Buffer.alloc(1 + 2);
    buf.writeUInt8(253, 0);
    buf.writeUInt16LE(n, 1);
  } else if (n < 0x100000000) {
    buf = Buffer.alloc(1 + 4);
    buf.writeUInt8(254, 0);
    buf.writeUInt32LE(n, 1);
  } else {
    buf = Buffer.alloc(1 + 8);
    buf.writeUInt8(255, 0);
    buf.writeInt32LE(n & -1, 1);
    buf.writeUInt32LE(Math.floor(n / 0x100000000), 5);
  }

  return buf;
};

BufferWriter.varintBufBN = function (bn) {
  var buf;
  var n = bn.toNumber();

  if (n < 253) {
    buf = Buffer.alloc(1);
    buf.writeUInt8(n, 0);
  } else if (n < 0x10000) {
    buf = Buffer.alloc(1 + 2);
    buf.writeUInt8(253, 0);
    buf.writeUInt16LE(n, 1);
  } else if (n < 0x100000000) {
    buf = Buffer.alloc(1 + 4);
    buf.writeUInt8(254, 0);
    buf.writeUInt32LE(n, 1);
  } else {
    var bw = new BufferWriter();
    bw.writeUInt8(255);
    bw.writeUInt64LEBN(bn);
    buf = bw.concat();
  }

  return buf;
};

function Opcode(num) {
  if (!(this instanceof Opcode)) {
    return new Opcode(num);
  }

  var value;

  if (_.isNumber(num)) {
    value = num;
  } else if (_.isString(num)) {
    value = Opcode.map[num];
  } else {
    throw new TypeError("Unrecognized num type: \"".concat(typeof num, "\" for Opcode"));
  }

  JSUtil.defineImmutable(this, {
    num: value
  });
  return this;
}

Opcode.fromBuffer = function (buf) {
  preconditions.checkArgument(BufferUtil.isBuffer(buf));
  return new Opcode(Number("0x".concat(buf.toString('hex'))));
};

Opcode.fromNumber = function (num) {
  preconditions.checkArgument(_.isNumber(num));
  return new Opcode(num);
};

Opcode.fromString = function (str) {
  preconditions.checkArgument(_.isString(str));
  var value = Opcode.map[str];

  if (typeof value === 'undefined') {
    throw new TypeError('Invalid opcodestr');
  }

  return new Opcode(value);
};

Opcode.prototype.toHex = function () {
  return this.num.toString(16);
};

Opcode.prototype.toBuffer = function () {
  return Buffer.from(this.toHex(), 'hex');
};

Opcode.prototype.toNumber = function () {
  return this.num;
};

Opcode.prototype.toString = function () {
  var str = Opcode.reverseMap[this.num];

  if (typeof str === 'undefined') {
    throw new Error('Opcode does not have a string representation');
  }

  return str;
};

Opcode.smallInt = function (n) {
  preconditions.checkArgument(_.isNumber(n), 'Invalid Argument: n should be number');
  preconditions.checkArgument(n >= 0 && n <= 16, 'Invalid Argument: n must be between 0 and 16');

  if (n === 0) {
    return Opcode('OP_0');
  }

  return new Opcode(Opcode.map.OP_1 + n - 1);
};

Opcode.map = {
  // push value
  OP_FALSE: 0,
  OP_0: 0,
  OP_PUSHDATA1: 76,
  OP_PUSHDATA2: 77,
  OP_PUSHDATA4: 78,
  OP_1NEGATE: 79,
  OP_RESERVED: 80,
  OP_TRUE: 81,
  OP_1: 81,
  OP_2: 82,
  OP_3: 83,
  OP_4: 84,
  OP_5: 85,
  OP_6: 86,
  OP_7: 87,
  OP_8: 88,
  OP_9: 89,
  OP_10: 90,
  OP_11: 91,
  OP_12: 92,
  OP_13: 93,
  OP_14: 94,
  OP_15: 95,
  OP_16: 96,
  // control
  OP_NOP: 97,
  OP_VER: 98,
  OP_IF: 99,
  OP_NOTIF: 100,
  OP_VERIF: 101,
  OP_VERNOTIF: 102,
  OP_ELSE: 103,
  OP_ENDIF: 104,
  OP_VERIFY: 105,
  OP_RETURN: 106,
  // stack ops
  OP_TOALTSTACK: 107,
  OP_FROMALTSTACK: 108,
  OP_2DROP: 109,
  OP_2DUP: 110,
  OP_3DUP: 111,
  OP_2OVER: 112,
  OP_2ROT: 113,
  OP_2SWAP: 114,
  OP_IFDUP: 115,
  OP_DEPTH: 116,
  OP_DROP: 117,
  OP_DUP: 118,
  OP_NIP: 119,
  OP_OVER: 120,
  OP_PICK: 121,
  OP_ROLL: 122,
  OP_ROT: 123,
  OP_SWAP: 124,
  OP_TUCK: 125,
  // splice ops
  OP_CAT: 126,
  OP_SUBSTR: 127,
  OP_LEFT: 128,
  OP_RIGHT: 129,
  OP_SIZE: 130,
  // bit logic
  OP_INVERT: 131,
  OP_AND: 132,
  OP_OR: 133,
  OP_XOR: 134,
  OP_EQUAL: 135,
  OP_EQUALVERIFY: 136,
  OP_RESERVED1: 137,
  OP_RESERVED2: 138,
  // numeric
  OP_1ADD: 139,
  OP_1SUB: 140,
  OP_2MUL: 141,
  OP_2DIV: 142,
  OP_NEGATE: 143,
  OP_ABS: 144,
  OP_NOT: 145,
  OP_0NOTEQUAL: 146,
  OP_ADD: 147,
  OP_SUB: 148,
  OP_MUL: 149,
  OP_DIV: 150,
  OP_MOD: 151,
  OP_LSHIFT: 152,
  OP_RSHIFT: 153,
  OP_BOOLAND: 154,
  OP_BOOLOR: 155,
  OP_NUMEQUAL: 156,
  OP_NUMEQUALVERIFY: 157,
  OP_NUMNOTEQUAL: 158,
  OP_LESSTHAN: 159,
  OP_GREATERTHAN: 160,
  OP_LESSTHANOREQUAL: 161,
  OP_GREATERTHANOREQUAL: 162,
  OP_MIN: 163,
  OP_MAX: 164,
  OP_WITHIN: 165,
  // crypto
  OP_RIPEMD160: 166,
  OP_SHA1: 167,
  OP_SHA256: 168,
  OP_HASH160: 169,
  OP_HASH256: 170,
  OP_CODESEPARATOR: 171,
  OP_CHECKSIG: 172,
  OP_CHECKSIGVERIFY: 173,
  OP_CHECKMULTISIG: 174,
  OP_CHECKMULTISIGVERIFY: 175,
  OP_CHECKLOCKTIMEVERIFY: 177,
  // expansion
  OP_NOP1: 176,
  OP_NOP2: 177,
  OP_NOP3: 178,
  OP_NOP4: 179,
  OP_NOP5: 180,
  OP_NOP6: 181,
  OP_NOP7: 182,
  OP_NOP8: 183,
  OP_NOP9: 184,
  OP_NOP10: 185,
  // template matching params
  OP_PUBKEYHASH: 253,
  OP_PUBKEY: 254,
  OP_INVALIDOPCODE: 255
};
Opcode.reverseMap = [];
Object.keys(Opcode.map).forEach(k => {
  Opcode.reverseMap[Opcode.map[k]] = k;
}); // Easier access to opcodes

_.extend(Opcode, Opcode.map);
/**
 * @returns true if opcode is one of OP_0, OP_1, ..., OP_16
 */


Opcode.isSmallIntOp = function (opcode) {
  if (opcode instanceof Opcode) {
    opcode = opcode.toNumber();
  }

  return opcode === Opcode.map.OP_0 || opcode >= Opcode.map.OP_1 && opcode <= Opcode.map.OP_16;
};
/**
 * Will return a string formatted for the console
 *
 * @returns {string} Script opcode
 */


Opcode.prototype.inspect = function () {
  return "<Opcode: ".concat(this.toString(), ", hex: ").concat(this.toHex(), ", decimal: ").concat(this.num, ">");
};

var Signature = function Signature(r, s) {
  if (!(this instanceof Signature)) {
    return new Signature(r, s);
  }

  if (r instanceof BN) {
    this.set({
      r,
      s
    });
  } else if (r) {
    var obj = r;
    this.set(obj);
  }
};

Signature.prototype.set = function (obj) {
  this.r = obj.r || this.r || undefined;
  this.s = obj.s || this.s || undefined;
  this.i = typeof obj.i !== 'undefined' ? obj.i : this.i; // public key recovery parameter in range [0, 3]

  this.compressed = typeof obj.compressed !== 'undefined' ? obj.compressed : this.compressed; // whether the recovered pubkey is compressed

  this.nhashtype = obj.nhashtype || this.nhashtype || undefined;
  return this;
};

Signature.fromCompact = function (buf) {
  preconditions.checkArgument(BufferUtil.isBuffer(buf), 'Argument is expected to be a Buffer');
  var sig = new Signature();
  var compressed = true;
  var i = buf.slice(0, 1)[0] - 27 - 4;

  if (i < 0) {
    compressed = false;
    i += 4;
  }

  var b2 = buf.slice(1, 33);
  var b3 = buf.slice(33, 65);
  preconditions.checkArgument(i === 0 || i === 1 || i === 2 || i === 3, new Error('i must be 0, 1, 2, or 3'));
  preconditions.checkArgument(b2.length === 32, new Error('r must be 32 bytes'));
  preconditions.checkArgument(b3.length === 32, new Error('s must be 32 bytes'));
  sig.compressed = compressed;
  sig.i = i;
  sig.r = BN.fromBuffer(b2);
  sig.s = BN.fromBuffer(b3);
  return sig;
};

Signature.fromDER = function (buf, strict) {
  var obj = Signature.parseDER(buf, strict);
  var sig = new Signature();
  sig.r = obj.r;
  sig.s = obj.s;
  return sig;
};

Signature.fromBuffer = Signature.fromDER; // The format used in a tx

Signature.fromTxFormat = function (buf) {
  var nhashtype = buf.readUInt8(buf.length - 1);
  var derbuf = buf.slice(0, buf.length - 1);
  var sig = Signature.fromDER(derbuf, false);
  sig.nhashtype = nhashtype;
  return sig;
};

Signature.fromString = function (str) {
  var buf = Buffer.from(str, 'hex');
  return Signature.fromDER(buf);
};
/**
 * In order to mimic the non-strict DER encoding of OpenSSL, set strict = false.
 */


Signature.parseDER = function (buf, strict) {
  preconditions.checkArgument(BufferUtil.isBuffer(buf), 'DER formatted signature should be a buffer');

  if (_.isUndefined(strict)) {
    strict = true;
  }

  var header = buf[0];
  preconditions.checkArgument(header === 0x30, 'Header byte should be 0x30');
  var length = buf[1];
  var buflength = buf.slice(2).length;
  preconditions.checkArgument(!strict || length === buflength, 'Length byte should length of what follows');
  length = length < buflength ? length : buflength;
  var rheader = buf[2 + 0];
  preconditions.checkArgument(rheader === 0x02, 'Integer byte for r should be 0x02');
  var rlength = buf[2 + 1];
  var rbuf = buf.slice(2 + 2, 2 + 2 + rlength);
  var r = BN.fromBuffer(rbuf);
  var rneg = buf[2 + 1 + 1] === 0x00;
  preconditions.checkArgument(rlength === rbuf.length, 'Length of r incorrect');
  var sheader = buf[2 + 2 + rlength + 0];
  preconditions.checkArgument(sheader === 0x02, 'Integer byte for s should be 0x02');
  var slength = buf[2 + 2 + rlength + 1];
  var sbuf = buf.slice(2 + 2 + rlength + 2, 2 + 2 + rlength + 2 + slength);
  var s = BN.fromBuffer(sbuf);
  var sneg = buf[2 + 2 + rlength + 2 + 2] === 0x00;
  preconditions.checkArgument(slength === sbuf.length, 'Length of s incorrect');
  var sumlength = 2 + 2 + rlength + 2 + slength;
  preconditions.checkArgument(length === sumlength - 2, 'Length of signature incorrect');
  var obj = {
    header,
    length,
    rheader,
    rlength,
    rneg,
    rbuf,
    r,
    sheader,
    slength,
    sneg,
    sbuf,
    s
  };
  return obj;
};

Signature.prototype.toCompact = function (i, compressed) {
  i = typeof i === 'number' ? i : this.i;
  compressed = typeof compressed === 'boolean' ? compressed : this.compressed;

  if (!(i === 0 || i === 1 || i === 2 || i === 3)) {
    throw new Error('i must be equal to 0, 1, 2, or 3');
  }

  var val = i + 27 + 4;

  if (compressed === false) {
    val -= 4;
  }

  var b1 = Buffer.from([val]);
  var b2 = this.r.toBuffer({
    size: 32
  });
  var b3 = this.s.toBuffer({
    size: 32
  });
  return Buffer.concat([b1, b2, b3]);
};

Signature.prototype.toBuffer = function () {
  var rnbuf = this.r.toBuffer();
  var snbuf = this.s.toBuffer();
  var rneg = !!(rnbuf[0] & 0x80);
  var sneg = !!(snbuf[0] & 0x80);
  var rbuf = rneg ? Buffer.concat([Buffer.from([0x00]), rnbuf]) : rnbuf;
  var sbuf = sneg ? Buffer.concat([Buffer.from([0x00]), snbuf]) : snbuf;
  var rlength = rbuf.length;
  var slength = sbuf.length;
  var length = 2 + rlength + 2 + slength;
  var rheader = 0x02;
  var sheader = 0x02;
  var header = 0x30;
  var der = Buffer.concat([Buffer.from([header, length, rheader, rlength]), rbuf, Buffer.from([sheader, slength]), sbuf]);
  return der;
};

Signature.prototype.toDER = Signature.prototype.toBuffer;

Signature.prototype.toString = function () {
  var buf = this.toDER();
  return buf.toString('hex');
};
/**
 * This function is translated from bitcoind's IsDERSignature and is used in
 * the script interpreter.  This "DER" format actually includes an extra byte,
 * the nhashtype, at the end. It is really the tx format, not DER format.
 *
 * A canonical signature exists of: [30] [total len] [02] [len R] [R] [02] [len S] [S] [hashtype]
 * Where R and S are not negative (their first byte has its highest bit not set), and not
 * excessively padded (do not start with a 0 byte, unless an otherwise negative number follows,
 * in which case a single 0 byte is necessary and even required).
 *
 * See https://bitcointalk.org/index.php?topic=8392.msg127623#msg127623
 */


Signature.isTxDER = function (buf) {
  if (buf.length < 9) {
    //  Non-canonical signature: too short
    return false;
  }

  if (buf.length > 73) {
    // Non-canonical signature: too long
    return false;
  }

  if (buf[0] !== 0x30) {
    //  Non-canonical signature: wrong type
    return false;
  }

  if (buf[1] !== buf.length - 3) {
    //  Non-canonical signature: wrong length marker
    return false;
  }

  var nLenR = buf[3];

  if (5 + nLenR >= buf.length) {
    //  Non-canonical signature: S length misplaced
    return false;
  }

  var nLenS = buf[5 + nLenR];

  if (nLenR + nLenS + 7 !== buf.length) {
    //  Non-canonical signature: R+S length mismatch
    return false;
  }

  var R = buf.slice(4);

  if (buf[4 - 2] !== 0x02) {
    //  Non-canonical signature: R value type mismatch
    return false;
  }

  if (nLenR === 0) {
    //  Non-canonical signature: R length is zero
    return false;
  }

  if (R[0] & 0x80) {
    //  Non-canonical signature: R value negative
    return false;
  }

  if (nLenR > 1 && R[0] === 0x00 && !(R[1] & 0x80)) {
    //  Non-canonical signature: R value excessively padded
    return false;
  }

  var S = buf.slice(6 + nLenR);

  if (buf[6 + nLenR - 2] !== 0x02) {
    //  Non-canonical signature: S value type mismatch
    return false;
  }

  if (nLenS === 0) {
    //  Non-canonical signature: S length is zero
    return false;
  }

  if (S[0] & 0x80) {
    //  Non-canonical signature: S value negative
    return false;
  }

  if (nLenS > 1 && S[0] === 0x00 && !(S[1] & 0x80)) {
    //  Non-canonical signature: S value excessively padded
    return false;
  }

  return true;
};
/**
 * Compares to bitcoind's IsLowDERSignature
 * See also ECDSA signature algorithm which enforces this.
 * See also BIP 62, "low S values in signatures"
 */


Signature.prototype.hasLowS = function () {
  if (this.s.lt(new BN(1)) || this.s.gt(new BN('7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0', 'hex'))) {
    return false;
  }

  return true;
};
/**
 * @returns true if the nhashtype is exactly equal to one of the standard options
 * or combinations thereof. Translated from bitcoind's IsDefinedHashtypeSignature
 */


Signature.prototype.hasDefinedHashtype = function () {
  if (!JSUtil.isNaturalNumber(this.nhashtype)) {
    return false;
  } // accept with or without Signature.SIGHASH_ANYONECANPAY by ignoring the bit


  var temp = this.nhashtype & ~Signature.SIGHASH_ANYONECANPAY;

  if (temp < Signature.SIGHASH_ALL || temp > Signature.SIGHASH_SINGLE) {
    return false;
  }

  return true;
};

Signature.prototype.toTxFormat = function () {
  var derbuf = this.toDER();
  var buf = Buffer.alloc(1);
  buf.writeUInt8(this.nhashtype, 0);
  return Buffer.concat([derbuf, buf]);
};

Signature.SIGHASH_ALL = 0x01;
Signature.SIGHASH_NONE = 0x02;
Signature.SIGHASH_SINGLE = 0x03;
Signature.SIGHASH_FORKID = 0x40;
Signature.SIGHASH_ANYONECANPAY = 0x80;

/**
 * A bitcoin transaction script. Each transaction's inputs and outputs
 * has a script that is evaluated to validate it's spending.
 *
 * See https://en.bitcoin.it/wiki/Script
 *
 * @constructor
 * @param {Object|string|Buffer=} from optional data to populate script
 */

var Script = function Script(from) {
  if (!(this instanceof Script)) {
    return new Script(from);
  }

  this.chunks = [];

  if (BufferUtil.isBuffer(from)) {
    return Script.fromBuffer(from);
  }

  if (from instanceof Address) {
    return Script.fromAddress(from);
  }

  if (from instanceof Script) {
    return Script.fromBuffer(from.toBuffer());
  }

  if (typeof from === 'string') {
    return Script.fromString(from);
  }

  if (typeof from !== 'undefined') {
    this.set(from);
  }
};

Script.prototype.set = function (obj) {
  this.chunks = obj.chunks || this.chunks;
  return this;
};

Script.fromBuffer = function (origBuffer) {
  var script = new Script();
  script.chunks = [];
  var br = new BufferReader(origBuffer);

  while (!br.finished()) {
    try {
      var opcodenum = br.readUInt8();
      var len = void 0;
      var buf = void 0;

      if (opcodenum > 0 && opcodenum < Opcode.OP_PUSHDATA1) {
        len = opcodenum;
        script.chunks.push({
          buf: br.read(len),
          len,
          opcodenum
        });
      } else if (opcodenum === Opcode.OP_PUSHDATA1) {
        len = br.readUInt8();
        buf = br.read(len);
        script.chunks.push({
          buf,
          len,
          opcodenum
        });
      } else if (opcodenum === Opcode.OP_PUSHDATA2) {
        len = br.readUInt16LE();
        buf = br.read(len);
        script.chunks.push({
          buf,
          len,
          opcodenum
        });
      } else if (opcodenum === Opcode.OP_PUSHDATA4) {
        len = br.readUInt32LE();
        buf = br.read(len);
        script.chunks.push({
          buf,
          len,
          opcodenum
        });
      } else {
        script.chunks.push({
          opcodenum
        });
      }
    } catch (e) {
      if (e instanceof RangeError) {
        throw new errors.Script.InvalidBuffer(origBuffer.toString('hex'));
      }

      throw e;
    }
  }

  return script;
};

Script.prototype.toBuffer = function () {
  return this.chunks.reduce((bw, chunk) => {
    bw.writeUInt8(chunk.opcodenum);

    if (chunk.buf) {
      if (chunk.opcodenum < Opcode.OP_PUSHDATA1) {
        bw.write(chunk.buf);
      } else if (chunk.opcodenum === Opcode.OP_PUSHDATA1) {
        bw.writeUInt8(chunk.len);
        bw.write(chunk.buf);
      } else if (chunk.opcodenum === Opcode.OP_PUSHDATA2) {
        bw.writeUInt16LE(chunk.len);
        bw.write(chunk.buf);
      } else if (chunk.opcodenum === Opcode.OP_PUSHDATA4) {
        bw.writeUInt32LE(chunk.len);
        bw.write(chunk.buf);
      }
    }

    return bw;
  }, new BufferWriter()).concat();
};

Script.fromASM = function (str) {
  var script = new Script();
  script.chunks = [];
  var tokens = str.split(' ');
  var i = 0;

  while (i < tokens.length) {
    var token = tokens[i];
    var opcode = Opcode(token);
    var opcodenum = opcode.toNumber();

    if (opcodenum === undefined) {
      var buf = Buffer.from(tokens[i], 'hex');
      script.chunks.push({
        buf,
        len: buf.length,
        opcodenum: buf.length
      });
      i += 1;
    } else if (opcodenum === Opcode.OP_PUSHDATA1 || opcodenum === Opcode.OP_PUSHDATA2 || opcodenum === Opcode.OP_PUSHDATA4) {
      script.chunks.push({
        buf: Buffer.from(tokens[i + 2], 'hex'),
        len: parseInt(tokens[i + 1], 16),
        opcodenum
      });
      i += 3;
    } else {
      script.chunks.push({
        opcodenum
      });
      i += 1;
    }
  }

  return script;
};

Script.fromHex = function (str) {
  return new this(Buffer.from(str, 'hex'));
};

Script.fromString = function (str) {
  if (JSUtil.isHexa(str) || str.length === 0) {
    return new this(Buffer.from(str, 'hex'));
  }

  var script = new this();
  script.chunks = [];
  var tokens = str.split(' ');
  var i = 0;

  while (i < tokens.length) {
    var token = tokens[i];
    var opcode = Opcode(token);
    var opcodenum = opcode.toNumber();

    if (_.isUndefined(opcodenum)) {
      // #weirdstuff
      if (token.startsWith('0x')) {
        opcodenum = parseInt(token, 16);
      } else {
        opcodenum = parseInt(token, 10);
      }

      if (opcodenum > 0 && opcodenum < Opcode.OP_PUSHDATA1) {
        script.chunks.push({
          buf: Buffer.from(tokens[i + 1].slice(2), 'hex'),
          len: opcodenum,
          opcodenum
        });
        i += 2;
      } else {
        throw new Error("Invalid script: ".concat(JSON.stringify(str)));
      }
    } else if (opcodenum === Opcode.OP_PUSHDATA1 || opcodenum === Opcode.OP_PUSHDATA2 || opcodenum === Opcode.OP_PUSHDATA4) {
      if (tokens[i + 2].slice(0, 2) !== '0x') {
        throw new Error('Pushdata data must start with 0x');
      }

      script.chunks.push({
        buf: Buffer.from(tokens[i + 2].slice(2), 'hex'),
        len: parseInt(tokens[i + 1], 10),
        opcodenum
      });
      i += 3;
    } else {
      script.chunks.push({
        opcodenum
      });
      i += 1;
    }
  }

  return script;
};

Script.prototype._chunkToString = function (chunk, type) {
  var {
    opcodenum
  } = chunk;
  var asm = type === 'asm';
  var str = '';

  if (!chunk.buf) {
    // no data chunk
    if (typeof Opcode.reverseMap[opcodenum] !== 'undefined') {
      str = "".concat(str, " ").concat(Opcode(opcodenum).toString());
    } else {
      var numstr = opcodenum.toString(16);

      if (numstr.length % 2 !== 0) {
        numstr = "0".concat(numstr);
      }

      if (asm) {
        str = "".concat(str, " ").concat(numstr);
      } else {
        str = "".concat(str, " 0x").concat(numstr);
      }
    }
  } else {
    // data chunk
    if (opcodenum === Opcode.OP_PUSHDATA1 || opcodenum === Opcode.OP_PUSHDATA2 || opcodenum === Opcode.OP_PUSHDATA4) {
      str = "".concat(str, " ").concat(Opcode(opcodenum).toString());
    }

    if (chunk.len > 0) {
      if (asm) {
        str = "".concat(str, " ").concat(chunk.buf.toString('hex'));
      } else {
        str = "".concat(str, " ").concat(chunk.len, " 0x").concat(chunk.buf.toString('hex'));
      }
    }
  }

  return str;
};

Script.prototype.toASM = function () {
  return this.chunks.reduce((acc, chunk) => acc + this._chunkToString(chunk, 'asm'), '').substr(1);
};

Script.prototype.toString = function () {
  return this.chunks.reduce((acc, chunk) => acc + this._chunkToString(chunk), '').substr(1);
};

Script.prototype.toHex = function () {
  return this.toBuffer().toString('hex');
};

Script.prototype.inspect = function () {
  return "<Script: ".concat(this.toString(), ">");
}; // script classification methods

/**
 * @returns {boolean} if this is a pay to pubkey hash output script
 */


Script.prototype.isPublicKeyHashOut = function () {
  return !!(this.chunks.length === 5 && this.chunks[0].opcodenum === Opcode.OP_DUP && this.chunks[1].opcodenum === Opcode.OP_HASH160 && this.chunks[2].buf && this.chunks[2].buf.length === 20 && this.chunks[3].opcodenum === Opcode.OP_EQUALVERIFY && this.chunks[4].opcodenum === Opcode.OP_CHECKSIG);
};
/**
 * @returns {boolean} if this is a pay to public key hash input script
 */


Script.prototype.isPublicKeyHashIn = function () {
  if (this.chunks.length === 2) {
    var signatureBuf = this.chunks[0].buf;
    var pubkeyBuf = this.chunks[1].buf;

    if (signatureBuf && signatureBuf.length && signatureBuf[0] === 0x30 && pubkeyBuf && pubkeyBuf.length) {
      var version = pubkeyBuf[0];

      if ((version === 0x04 || version === 0x06 || version === 0x07) && pubkeyBuf.length === 65) {
        return true;
      }

      if ((version === 0x03 || version === 0x02) && pubkeyBuf.length === 33) {
        return true;
      }
    }
  }

  return false;
};

Script.prototype.getPublicKey = function () {
  preconditions.checkState(this.isPublicKeyOut(), "Can't retrieve PublicKey from a non-PublicKey output");
  return this.chunks[0].buf;
};

Script.prototype.getPublicKeyHash = function () {
  preconditions.checkState(this.isPublicKeyHashOut(), "Can't retrieve PublicKeyHash from a non-PublicKeyHash output");
  return this.chunks[2].buf;
};
/**
 * @returns {boolean} if this is a public key output script
 */


Script.prototype.isPublicKeyOut = function () {
  if (this.chunks.length === 2 && this.chunks[0].buf && this.chunks[0].buf.length && this.chunks[1].opcodenum === Opcode.OP_CHECKSIG) {
    var pubkeyBuf = this.chunks[0].buf;
    var version = pubkeyBuf[0];
    var isVersion = false;

    if ((version === 0x04 || version === 0x06 || version === 0x07) && pubkeyBuf.length === 65) {
      isVersion = true;
    } else if ((version === 0x03 || version === 0x02) && pubkeyBuf.length === 33) {
      isVersion = true;
    }

    if (isVersion) {
      return PublicKey.isValid(pubkeyBuf);
    }
  }

  return false;
};
/**
 * @returns {boolean} if this is a pay to public key input script
 */


Script.prototype.isPublicKeyIn = function () {
  if (this.chunks.length === 1) {
    var signatureBuf = this.chunks[0].buf;

    if (signatureBuf && signatureBuf.length && signatureBuf[0] === 0x30) {
      return true;
    }
  }

  return false;
};
/**
 * @returns {boolean} if this is a p2sh output script
 */


Script.prototype.isScriptHashOut = function () {
  var buf = this.toBuffer();
  return buf.length === 23 && buf[0] === Opcode.OP_HASH160 && buf[1] === 0x14 && buf[buf.length - 1] === Opcode.OP_EQUAL;
};
/**
 * @returns {boolean} if this is a p2sh input script
 * Note that these are frequently indistinguishable from pubkeyhashin
 */


Script.prototype.isScriptHashIn = function () {
  if (this.chunks.length <= 1) {
    return false;
  }

  var redeemChunk = this.chunks[this.chunks.length - 1];
  var redeemBuf = redeemChunk.buf;

  if (!redeemBuf) {
    return false;
  }

  var redeemScript;

  try {
    redeemScript = Script.fromBuffer(redeemBuf);
  } catch (e) {
    if (e instanceof errors.Script.InvalidBuffer) {
      return false;
    }

    throw e;
  }

  var type = redeemScript.classify();
  return type !== Script.types.UNKNOWN;
};
/**
 * @returns {boolean} if this is a mutlsig output script
 */


Script.prototype.isMultisigOut = function () {
  return this.chunks.length > 3 && Opcode.isSmallIntOp(this.chunks[0].opcodenum) && this.chunks.slice(1, this.chunks.length - 2).every(obj => obj.buf && BufferUtil.isBuffer(obj.buf)) && Opcode.isSmallIntOp(this.chunks[this.chunks.length - 2].opcodenum) && this.chunks[this.chunks.length - 1].opcodenum === Opcode.OP_CHECKMULTISIG;
};
/**
 * @returns {boolean} if this is a multisig input script
 */


Script.prototype.isMultisigIn = function () {
  return this.chunks.length >= 2 && this.chunks[0].opcodenum === 0 && this.chunks.slice(1, this.chunks.length).every(obj => obj.buf && BufferUtil.isBuffer(obj.buf) && Signature.isTxDER(obj.buf));
};
/**
 * @returns {boolean} true if this is a valid standard OP_RETURN output
 */


Script.prototype.isDataOut = function () {
  return this.chunks.length >= 1 && this.chunks[0].opcodenum === Opcode.OP_RETURN && (this.chunks.length === 1 || this.chunks.length === 2 && this.chunks[1].buf && this.chunks[1].buf.length <= Script.OP_RETURN_STANDARD_SIZE && this.chunks[1].length === this.chunks.len);
};
/**
 * Retrieve the associated data for this script.
 * In the case of a pay to public key hash or P2SH, return the hash.
 * In the case of a standard OP_RETURN, return the data
 * @returns {Buffer}
 */


Script.prototype.getData = function () {
  if (this.isDataOut() || this.isScriptHashOut()) {
    // #weirdstuff
    if (this.chunks[1] === undefined) {
      return Buffer.alloc(0);
    }

    return Buffer.from(this.chunks[1].buf);
  }

  if (this.isPublicKeyHashOut()) {
    return Buffer.from(this.chunks[2].buf);
  }

  throw new Error('Unrecognized script type to get data from');
};
/**
 * @returns {boolean} if the script is only composed of data pushing
 * opcodes or small int opcodes (OP_0, OP_1, ..., OP_16)
 */


Script.prototype.isPushOnly = function () {
  return this.chunks.every(chunk => chunk.opcodenum <= Opcode.OP_16);
};

Script.types = {};
Script.types.UNKNOWN = 'Unknown';
Script.types.PUBKEY_OUT = 'Pay to public key';
Script.types.PUBKEY_IN = 'Spend from public key';
Script.types.PUBKEYHASH_OUT = 'Pay to public key hash';
Script.types.PUBKEYHASH_IN = 'Spend from public key hash';
Script.types.SCRIPTHASH_OUT = 'Pay to script hash';
Script.types.SCRIPTHASH_IN = 'Spend from script hash';
Script.types.MULTISIG_OUT = 'Pay to multisig';
Script.types.MULTISIG_IN = 'Spend from multisig';
Script.types.DATA_OUT = 'Data push';
Script.OP_RETURN_STANDARD_SIZE = 80;
/**
 * @returns {object} The Script type if it is a known form,
 * or Script.UNKNOWN if it isn't
 */

Script.prototype.classify = function () {
  if (this._isInput) {
    return this.classifyInput();
  }

  if (this._isOutput) {
    return this.classifyOutput();
  }

  var outputType = this.classifyOutput();
  return outputType !== Script.types.UNKNOWN ? outputType : this.classifyInput();
};

Script.outputIdentifiers = {};
Script.outputIdentifiers.PUBKEY_OUT = Script.prototype.isPublicKeyOut;
Script.outputIdentifiers.PUBKEYHASH_OUT = Script.prototype.isPublicKeyHashOut;
Script.outputIdentifiers.MULTISIG_OUT = Script.prototype.isMultisigOut;
Script.outputIdentifiers.SCRIPTHASH_OUT = Script.prototype.isScriptHashOut;
Script.outputIdentifiers.DATA_OUT = Script.prototype.isDataOut;
/**
 * @returns {object} The Script type if it is a known form,
 * or Script.UNKNOWN if it isn't
 */

Script.prototype.classifyOutput = function () {
  var keys = Object.keys(Script.outputIdentifiers);

  for (var i = 0; i < keys.length; i += 1) {
    if (Script.outputIdentifiers[keys[i]].bind(this)()) {
      return Script.types[keys[i]];
    }
  }

  return Script.types.UNKNOWN;
};

Script.inputIdentifiers = {};
Script.inputIdentifiers.PUBKEY_IN = Script.prototype.isPublicKeyIn;
Script.inputIdentifiers.PUBKEYHASH_IN = Script.prototype.isPublicKeyHashIn;
Script.inputIdentifiers.MULTISIG_IN = Script.prototype.isMultisigIn;
Script.inputIdentifiers.SCRIPTHASH_IN = Script.prototype.isScriptHashIn;
/**
 * @returns {object} The Script type if it is a known form,
 * or Script.UNKNOWN if it isn't
 */

Script.prototype.classifyInput = function () {
  var keys = Object.keys(Script.inputIdentifiers);

  for (var i = 0; i < keys.length; i += 1) {
    if (Script.inputIdentifiers[keys[i]].bind(this)()) {
      return Script.types[keys[i]];
    }
  }

  return Script.types.UNKNOWN;
};
/**
 * @returns {boolean} if script is one of the known types
 */


Script.prototype.isStandard = function () {
  // TODO: Add BIP62 compliance
  return this.classify() !== Script.types.UNKNOWN;
}; // Script construction methods

/**
 * Adds a script element at the start of the script.
 * @param {*} obj a string, number, Opcode, Buffer, or object to add
 * @returns {Script} this script instance
 */


Script.prototype.prepend = function (obj) {
  this._addByType(obj, true);

  return this;
};
/**
 * Compares a script with another script
 */


Script.prototype.equals = function (script) {
  preconditions.checkState(script instanceof Script, 'Must provide another script');

  if (this.chunks.length !== script.chunks.length) {
    return false;
  }

  var i;

  for (i = 0; i < this.chunks.length; i += 1) {
    if (BufferUtil.isBuffer(this.chunks[i].buf) && !BufferUtil.isBuffer(script.chunks[i].buf)) {
      return false;
    }

    if (BufferUtil.isBuffer(this.chunks[i].buf) && !BufferUtil.equals(this.chunks[i].buf, script.chunks[i].buf)) {
      return false;
    }

    if (this.chunks[i].opcodenum !== script.chunks[i].opcodenum) {
      return false;
    }
  }

  return true;
};
/**
 * Adds a script element to the end of the script.
 *
 * @param {*} obj a string, number, Opcode, Buffer, or object to add
 * @returns {Script} this script instance
 *
 */


Script.prototype.add = function (obj) {
  this._addByType(obj, false);

  return this;
};

Script.prototype._addByType = function (obj, prepend) {
  if (typeof obj === 'string') {
    this._addOpcode(obj, prepend);
  } else if (typeof obj === 'number') {
    this._addOpcode(obj, prepend);
  } else if (obj instanceof Opcode) {
    this._addOpcode(obj, prepend);
  } else if (BufferUtil.isBuffer(obj)) {
    this._addBuffer(obj, prepend);
  } else if (obj instanceof Script) {
    this.chunks = this.chunks.concat(obj.chunks);
  } else if (typeof obj === 'object') {
    this._insertAtPosition(obj, prepend);
  } else {
    throw new Error('Invalid script chunk');
  }
};

Script.prototype._insertAtPosition = function (op, prepend) {
  if (prepend) {
    this.chunks.unshift(op);
  } else {
    this.chunks.push(op);
  }
};

Script.prototype._addOpcode = function (opcode, prepend) {
  var op;

  if (typeof opcode === 'number') {
    op = opcode;
  } else if (opcode instanceof Opcode) {
    op = opcode.toNumber();
  } else {
    op = Opcode(opcode).toNumber();
  }

  this._insertAtPosition({
    opcodenum: op
  }, prepend);

  return this;
};

Script.prototype._addBuffer = function (buf, prepend) {
  var opcodenum;
  var len = buf.length;

  if (len >= 0 && len < Opcode.OP_PUSHDATA1) {
    opcodenum = len;
  } else if (len < 2 ** 8) {
    opcodenum = Opcode.OP_PUSHDATA1;
  } else if (len < 2 ** 16) {
    opcodenum = Opcode.OP_PUSHDATA2;
  } else if (len < 2 ** 32) {
    opcodenum = Opcode.OP_PUSHDATA4;
  } else {
    throw new Error("You can't push that much data");
  }

  this._insertAtPosition({
    buf,
    len,
    opcodenum
  }, prepend);

  return this;
};

Script.prototype.removeCodeseparators = function () {
  this.chunks = this.chunks.filter(chunk => chunk.opcodenum !== Opcode.OP_CODESEPARATOR);
  return this;
}; // high level script builder methods

/**
 * @returns {Script} a new Multisig output script for given public keys,
 * requiring m of those public keys to spend
 * @param {PublicKey[]} publicKeys - list of all public keys controlling the output
 * @param {number} threshold - amount of required signatures to spend the output
 * @param {Object=} opts - Several options:
 *        - noSorting: defaults to false, if true, don't sort the given
 *                      public keys before creating the script
 */


Script.buildMultisigOut = function (publicKeys, threshold, opts) {
  preconditions.checkArgument(threshold <= publicKeys.length, 'Number of required signatures must be less than or equal to the number of public keys');
  opts = opts || {};
  var script = new this();
  script.add(Opcode.smallInt(threshold));
  publicKeys = publicKeys.map(PublicKey);
  var sorted = publicKeys;

  if (!opts.noSorting) {
    sorted = _.sortBy(publicKeys, publicKey => publicKey.toString('hex'));
  }

  sorted.forEach(pKey => script.add(pKey.toBuffer()));
  script.add(Opcode.smallInt(publicKeys.length));
  script.add(Opcode.OP_CHECKMULTISIG);
  return script;
};
/**
 * A new Multisig input script for the given public keys, requiring m of those public keys to spend
 *
 * @param {PublicKey[]} pubkeys list of all public keys controlling the output
 * @param {number} threshold amount of required signatures to spend the output
 * @param {Array} signatures and array of signature buffers to append to the script
 * @param {Object=} opts
 * @param {boolean=} opts.noSorting don't sort the given public keys before creating the script
 *   (false by default)
 * @param {Script=} opts.cachedMultisig don't recalculate the redeemScript
 *
 * @returns {Script}
 */
// #weirdstuff - "opts" is never used in the function, but if we remove it tests go red. We should
// look into this in more detail and try to figure out what is happening.
// eslint-disable-next-line no-unused-vars


Script.buildMultisigIn = function (pubkeys, threshold, signatures, opts) {
  preconditions.checkArgument(_.isArray(pubkeys));
  preconditions.checkArgument(_.isNumber(threshold));
  preconditions.checkArgument(_.isArray(signatures));
  var s = new this();
  s.add(Opcode.OP_0);
  signatures.forEach(signature => {
    preconditions.checkArgument(BufferUtil.isBuffer(signature), 'Signatures must be an array of Buffers'); // TODO: allow signatures to be an array of Signature objects

    s.add(signature);
  });
  return s;
};
/**
 * A new P2SH Multisig input script for the given public keys, requiring m of those public keys to
 * spend.
 *
 * @param {PublicKey[]} pubkeys list of all public keys controlling the output
 * @param {number} threshold amount of required signatures to spend the output
 * @param {Array} signatures and array of signature buffers to append to the script
 * @param {Object=} opts
 * @param {boolean=} opts.noSorting don't sort the given public keys before creating the script
 *   (false by default)
 * @param {Script=} opts.cachedMultisig don't recalculate the redeemScript
 *
 * @returns {Script}
 */


Script.buildP2SHMultisigIn = function (pubkeys, threshold, signatures, opts) {
  preconditions.checkArgument(_.isArray(pubkeys));
  preconditions.checkArgument(_.isNumber(threshold));
  preconditions.checkArgument(_.isArray(signatures));
  opts = opts || {};
  var s = new this();
  s.add(Opcode.OP_0);
  signatures.forEach(signature => {
    preconditions.checkArgument(BufferUtil.isBuffer(signature), 'Signatures must be an array of Buffers'); // TODO: allow signatures to be an array of Signature objects

    s.add(signature);
  });
  s.add((opts.cachedMultisig || Script.buildMultisigOut(pubkeys, threshold, opts)).toBuffer());
  return s;
};
/**
 * @returns {Script} a new pay to public key hash output for the given
 * address or public key
 * @param {(Address|PublicKey)} to - destination address or public key
 */


Script.buildPublicKeyHashOut = function (to) {
  preconditions.checkArgument(!_.isUndefined(to));
  preconditions.checkArgument(to instanceof PublicKey || to instanceof Address || _.isString(to));

  if (to instanceof PublicKey) {
    to = to.toAddress();
  } else if (_.isString(to)) {
    to = new Address(to);
  }

  var s = new this();
  s.add(Opcode.OP_DUP).add(Opcode.OP_HASH160).add(to.hashBuffer).add(Opcode.OP_EQUALVERIFY).add(Opcode.OP_CHECKSIG);
  s._network = to.network;
  return s;
};
/**
 * @returns {Script} a new pay to public key output for the given
 *  public key
 */


Script.buildPublicKeyOut = function (pubkey) {
  preconditions.checkArgument(pubkey instanceof PublicKey);
  var s = new this();
  s.add(pubkey.toBuffer()).add(Opcode.OP_CHECKSIG);
  return s;
};
/**
 * @returns {Script} a new OP_RETURN script with data
 * @param {(string|Buffer)} data - the data to embed in the output
 * @param {(string)} encoding - the type of encoding of the string
 */


Script.buildDataOut = function (data, encoding) {
  preconditions.checkArgument(_.isUndefined(data) || _.isString(data) || BufferUtil.isBuffer(data));

  if (_.isString(data)) {
    data = Buffer.from(data, encoding);
  }

  var s = new this();
  s.add(Opcode.OP_RETURN);

  if (!_.isUndefined(data)) {
    s.add(data);
  }

  return s;
};
/**
 * @param {Script|Address} script - the redeemScript for the new p2sh output.
 *    It can also be a p2sh address
 * @returns {Script} new pay to script hash script for given script
 */


Script.buildScriptHashOut = function (script) {
  preconditions.checkArgument(script instanceof Script || script instanceof Address && script.isPayToScriptHash());
  var s = new this().add(Opcode.OP_HASH160).add(script instanceof Address ? script.hashBuffer : Hash.sha256ripemd160(script.toBuffer())).add(Opcode.OP_EQUAL);
  s._network = script._network || script.network;
  return s;
};
/**
 * Builds a scriptSig (a script for an input) that signs a public key output script.
 *
 * @param {Signature|Buffer} signature - a Signature object, or the signature in DER canonical
 *   encoding
 * @param {number=} sigtype - the type of the signature (defaults to SIGHASH_ALL)
 */


Script.buildPublicKeyIn = function (signature, sigtype) {
  preconditions.checkArgument(signature instanceof Signature || BufferUtil.isBuffer(signature));
  preconditions.checkArgument(_.isUndefined(sigtype) || _.isNumber(sigtype));

  if (signature instanceof Signature) {
    signature = signature.toBuffer();
  }

  var script = new this();
  script.add(BufferUtil.concat([signature, BufferUtil.integerAsSingleByteBuffer(sigtype || Signature.SIGHASH_ALL)]));
  return script;
};
/**
 * Builds a scriptSig (a script for an input) that signs a public key hash
 * output script.
 *
 * @param {Buffer|string|PublicKey} publicKey
 * @param {Signature|Buffer} signature - a Signature object, or the signature in DER canonical
 *   encoding
 * @param {number=} sigtype - the type of the signature (defaults to SIGHASH_ALL)
 */


Script.buildPublicKeyHashIn = function (publicKey, signature, sigtype) {
  preconditions.checkArgument(signature instanceof Signature || BufferUtil.isBuffer(signature));
  preconditions.checkArgument(_.isUndefined(sigtype) || _.isNumber(sigtype));

  if (signature instanceof Signature) {
    signature = signature.toBuffer();
  }

  var script = new this().add(BufferUtil.concat([signature, BufferUtil.integerAsSingleByteBuffer(sigtype || Signature.SIGHASH_ALL)])).add(new PublicKey(publicKey).toBuffer());
  return script;
};
/**
 * @returns {Script} an empty script
 */


Script.empty = function () {
  return new this();
};
/**
 * @returns {Script} a new pay to script hash script that pays to this script
 */


Script.prototype.toScriptHashOut = function () {
  return Script.buildScriptHashOut(this);
};
/**
 * @return {Script} an output script built from the address
 */


Script.fromAddress = function (address) {
  address = new Address(address);

  if (address.isPayToScriptHash()) {
    return Script.buildScriptHashOut(address);
  }

  if (address.isPayToPublicKeyHash()) {
    return Script.buildPublicKeyHashOut(address);
  }

  throw new errors.Script.UnrecognizedAddress(address);
};
/**
 * Will return the associated address information object
 * @return {Address|boolean}
 */


Script.prototype.getAddressInfo = function () {
  if (this._isInput) {
    return this._getInputAddressInfo();
  }

  if (this._isOutput) {
    return this._getOutputAddressInfo();
  }

  var info = this._getOutputAddressInfo();

  if (!info) {
    return this._getInputAddressInfo();
  }

  return info;
};
/**
 * Will return the associated output scriptPubKey address information object
 * @return {Address|boolean}
 * @private
 */


Script.prototype._getOutputAddressInfo = function () {
  var info = {};

  if (this.isScriptHashOut()) {
    info.hashBuffer = this.getData();
    info.type = Address.PayToScriptHash;
  } else if (this.isPublicKeyHashOut()) {
    info.hashBuffer = this.getData();
    info.type = Address.PayToPublicKeyHash;
  } else {
    return false;
  }

  return info;
};
/**
 * Will return the associated input scriptSig address information object
 * @return {Address|boolean}
 * @private
 */


Script.prototype._getInputAddressInfo = function () {
  var info = {};

  if (this.isPublicKeyHashIn()) {
    // hash the publickey found in the scriptSig
    info.hashBuffer = Hash.sha256ripemd160(this.chunks[1].buf);
    info.type = Address.PayToPublicKeyHash;
  } else if (this.isScriptHashIn()) {
    // hash the redeemscript found at the end of the scriptSig
    info.hashBuffer = Hash.sha256ripemd160(this.chunks[this.chunks.length - 1].buf);
    info.type = Address.PayToScriptHash;
  } else {
    return false;
  }

  return info;
};
/**
 * @param {Network=} network
 * @return {Address|boolean} the associated address for this script if possible, or false
 */


Script.prototype.toAddress = function (network) {
  var info = this.getAddressInfo();

  if (!info) {
    return false;
  }

  info.network = Networks.get(network) || this._network || Networks.defaultNetwork;
  return new Address(info);
};
/**
 * Analogous to bitcoind's FindAndDelete. Find and delete equivalent chunks,
 * typically used with push data chunks.  Note that this will find and delete
 * not just the same data, but the same data with the same push data op as
 * produced by default. i.e., if a pushdata in a tx does not use the minimal
 * pushdata op, then when you try to remove the data it is pushing, it will not
 * be removed, because they do not use the same pushdata op.
 */


Script.prototype.findAndDelete = function (script) {
  var buf = script.toBuffer();
  var hex = buf.toString('hex');

  for (var i = 0; i < this.chunks.length; i += 1) {
    var script2 = Script({
      chunks: [this.chunks[i]]
    });
    var buf2 = script2.toBuffer();
    var hex2 = buf2.toString('hex');

    if (hex === hex2) {
      this.chunks.splice(i, 1);
    }
  }

  return this;
};
/**
 * Comes from bitcoind's script interpreter CheckMinimalPush function
 * @returns {boolean} if the chunk {i} is the smallest way to push that particular data.
 */


Script.prototype.checkMinimalPush = function (i) {
  var chunk = this.chunks[i];
  var {
    buf
  } = chunk;
  var {
    opcodenum
  } = chunk;

  if (!buf) {
    return true;
  }

  if (buf.length === 0) {
    // Could have used OP_0.
    return opcodenum === Opcode.OP_0;
  }

  if (buf.length === 1 && buf[0] >= 1 && buf[0] <= 16) {
    // Could have used OP_1 .. OP_16.
    return opcodenum === Opcode.OP_1 + (buf[0] - 1);
  }

  if (buf.length === 1 && buf[0] === 0x81) {
    // Could have used OP_1NEGATE
    return opcodenum === Opcode.OP_1NEGATE;
  }

  if (buf.length <= 75) {
    // Could have used a direct push (opcode indicating number of bytes pushed + those bytes).
    return opcodenum === buf.length;
  }

  if (buf.length <= 255) {
    // Could have used OP_PUSHDATA.
    return opcodenum === Opcode.OP_PUSHDATA1;
  }

  if (buf.length <= 65535) {
    // Could have used OP_PUSHDATA2.
    return opcodenum === Opcode.OP_PUSHDATA2;
  }

  return true;
};
/**
 * Comes from bitcoind's script DecodeOP_N function
 * @param {number} opcode
 * @returns {number} numeric value in range of 0 to 16
 */


Script.prototype._decodeOP_N = function (opcode) {
  if (opcode === Opcode.OP_0) {
    return 0;
  }

  if (opcode >= Opcode.OP_1 && opcode <= Opcode.OP_16) {
    return opcode - (Opcode.OP_1 - 1);
  }

  throw new Error("Invalid opcode: ".concat(JSON.stringify(opcode)));
};
/**
 * Comes from bitcoind's script GetSigOpCount(boolean) function
 * @param {boolean} use current (true) or pre-version-0.6 (false) logic
 * @returns {number} number of signature operations required by this script
 */


Script.prototype.getSignatureOperationsCount = function (accurate) {
  accurate = _.isUndefined(accurate) ? true : accurate;
  var self = this;
  var n = 0;
  var lastOpcode = Opcode.OP_INVALIDOPCODE;
  self.chunks.forEach(chunk => {
    var opcode = chunk.opcodenum;

    if (opcode === Opcode.OP_CHECKSIG || opcode === Opcode.OP_CHECKSIGVERIFY) {
      n += 1;
    } else if (opcode === Opcode.OP_CHECKMULTISIG || opcode === Opcode.OP_CHECKMULTISIGVERIFY) {
      if (accurate && lastOpcode >= Opcode.OP_1 && lastOpcode <= Opcode.OP_16) {
        n += self._decodeOP_N(lastOpcode);
      } else {
        n += 20;
      }
    }

    lastOpcode = opcode;
  });
  return n;
};

var BITPAY_P2PKH_VERSION_BYTE = 28;
var BITPAY_P2SH_VERSION_BYTE = 40;
/**
 * Instantiate an address from an address String or Buffer, a public key or
 * script hash Buffer, or an instance of {@link PublicKey} or {@link Script}.
 *
 * This is an immutable class, and if the first parameter provided to this
 * constructor is an `Address` instance, the same argument will be returned.
 *
 * An address has two key properties: `network` and `type`. The type is either
 * `Address.PayToPublicKeyHash` (value is the `'pubkeyhash'` string) or
 * `Address.PayToScriptHash` (the string `'scripthash'`). The network is an
 * instance of {@link Network}. You can quickly check whether an address is of a
 * given kind by using the methods `isPayToPublicKeyHash` and
 * `isPayToScriptHash`
 *
 * @example
 * ```javascript
 * // validate that an input field is valid
 * var error = Address.getValidationError(input, 'testnet');
 * if (!error) {
 *   var address = Address(input, 'testnet');
 * } else {
 *   // invalid network or checksum (typo?)
 *   var message = error.messsage;
 * }
 *
 * // get an address from a public key
 * var address = Address(publicKey, 'testnet').toString();
 * ```
 *
 * @param {*} data - The encoded data in various formats
 * @param {Network|String|number=} network - The network: 'livenet' or 'testnet'
 * @param {string=} type - The type of address: 'script' or 'pubkey'
 * @returns {Address} A new valid and frozen instance of an Address
 * @constructor
 */

class Address {
  constructor(data, network, type) {
    if (!(this instanceof Address)) {
      return new Address(data, network, type);
    }

    if (_.isArray(data) && _.isNumber(network)) {
      return Address.createMultisig(data, network, type);
    }

    if (data instanceof Address) {
      // Immutable instance
      return data;
    }

    preconditions.checkArgument(data, 'Address data required in first argument.', 'guide/address.html');

    if (network && !Networks.get(network)) {
      throw new TypeError('Second argument must be "livenet" or "testnet".');
    }

    if (type && type !== Address.PayToPublicKeyHash && type !== Address.PayToScriptHash) {
      throw new TypeError('Third argument must be "pubkeyhash" or "scripthash".');
    }

    var info = Address._classifyArguments(data, network, type); // set defaults if not set


    info.network = info.network || Networks.get(network) || Networks.defaultNetwork;
    info.type = info.type || type || Address.PayToPublicKeyHash;
    JSUtil.defineImmutable(this, {
      hashBuffer: info.hashBuffer,
      network: info.network,
      type: info.type
    });
  }
  /**
   * Internal function used to split different kinds of arguments of the constructor
   * @param {*} data - The encoded data in various formats
   * @param {Network|String|number=} network - The network: 'livenet' or 'testnet'
   * @param {string=} type - The type of address: 'script' or 'pubkey'
   * @returns {Object} An "info" object with "type", "network", and "hashBuffer"
   */


  static _classifyArguments(data, network, type) {
    // transform and validate input data
    if ((data instanceof Buffer || data instanceof Uint8Array) && data.length === 20) {
      return Address._transformHash(data);
    }

    if ((data instanceof Buffer || data instanceof Uint8Array) && data.length === 21) {
      return Address._transformBuffer(data, network, type);
    }

    if (data instanceof PublicKey) {
      return Address._transformPublicKey(data);
    } // eslint-disable-next-line no-use-before-define


    if (data instanceof Script) {
      return Address._transformScript(data, network);
    }

    if (typeof data === 'string') {
      return Address._transformString(data, network, type, Address.DefaultFormat);
    }

    if (_.isObject(data)) {
      return Address._transformObject(data);
    }

    throw new TypeError('First argument is an unrecognized data format.');
  }
  /**
   * @param {Buffer} hash - An instance of a hash Buffer
   * @returns {Object} An object with keys: hashBuffer
   * @private
   */


  static _transformHash(hash) {
    var info = {};

    if (!(hash instanceof Buffer) && !(hash instanceof Uint8Array)) {
      throw new TypeError('Address supplied is not a buffer.');
    }

    if (hash.length !== 20) {
      throw new TypeError('Address hashbuffers must be exactly 20 bytes.');
    }

    info.hashBuffer = hash;
    return info;
  }
  /**
   * Deserializes an address serialized through `Address#toObject()`
   * @param {Object} data
   * @param {string} data.hash - the hash that this address encodes
   * @param {string} data.type - either 'pubkeyhash' or 'scripthash'
   * @param {Network=} data.network - the name of the network associated
   * @return {Address}
   */


  static _transformObject(data) {
    preconditions.checkArgument(data.hash || data.hashBuffer, 'Must provide a `hash` or `hashBuffer` property');
    preconditions.checkArgument(data.type, 'Must provide a `type` property');
    return {
      hashBuffer: data.hash ? Buffer.from(data.hash, 'hex') : data.hashBuffer,
      network: Networks.get(data.network) || Networks.defaultNetwork,
      type: data.type
    };
  }
  /**
   * Internal function to discover the network and type based on the first data byte
   *
   * @param {Buffer} buffer - An instance of a hex encoded address Buffer
   * @returns {Object} An object with keys: network and type
   * @private
   */


  static _classifyFromVersion(buffer) {
    var version = {};
    var pubkeyhashNetwork = Networks.get(buffer[0], 'pubkeyhash');
    var scripthashNetwork = Networks.get(buffer[0], 'scripthash');

    if (pubkeyhashNetwork) {
      version.network = pubkeyhashNetwork;
      version.type = this.PayToPublicKeyHash;
    } else if (scripthashNetwork) {
      version.network = scripthashNetwork;
      version.type = this.PayToScriptHash;
    }

    return version;
  }
  /**
   * Internal function to transform a bitcoin address buffer
   *
   * @param {Buffer} buffer - An instance of a hex encoded address Buffer
   * @param {string=} network - The network: 'livenet' or 'testnet'
   * @param {string=} type - The type: 'pubkeyhash' or 'scripthash'
   * @returns {Object} An object with keys: hashBuffer, network and type
   * @private
   */


  static _transformBuffer(buffer, network, type) {
    var info = {};

    if (!(buffer instanceof Buffer) && !(buffer instanceof Uint8Array)) {
      throw new TypeError('Address supplied is not a buffer.');
    }

    if (buffer.length !== 1 + 20) {
      throw new TypeError('Address buffers must be exactly 21 bytes.');
    }

    network = Networks.get(network);

    var bufferVersion = Address._classifyFromVersion(buffer);

    if (!bufferVersion.network || network && network !== bufferVersion.network) {
      throw new TypeError('Address has mismatched network type.');
    }

    if (!bufferVersion.type || type && type !== bufferVersion.type) {
      throw new TypeError('Address has mismatched type.');
    }

    info.hashBuffer = buffer.slice(1);
    info.network = bufferVersion.network;
    info.type = bufferVersion.type;
    return info;
  }
  /**
   * Internal function to transform a {@link PublicKey}
   *
   * @param {PublicKey} pubkey - An instance of PublicKey
   * @returns {Object} An object with keys: hashBuffer, type
   * @private
   */


  static _transformPublicKey(pubkey) {
    var info = {};

    if (!(pubkey instanceof PublicKey)) {
      throw new TypeError('Address must be an instance of PublicKey.');
    }

    info.hashBuffer = Hash.sha256ripemd160(pubkey.toBuffer());
    info.type = this.PayToPublicKeyHash;
    return info;
  }
  /**
   * Internal function to transform a {@link Script} into a `info` object.
   *
   * @param {Script} script - An instance of Script
   * @returns {Object} An object with keys: hashBuffer, type
   * @private
   */


  static _transformScript(script, network) {
    // eslint-disable-next-line no-use-before-define
    preconditions.checkArgument(script instanceof Script, 'script must be a Script instance');
    var info = script.getAddressInfo(network);

    if (!info) {
      throw new errors.Script.CantDeriveAddress(script);
    }

    return info;
  }
  /**
   * Creates a P2SH address from a set of public keys and a threshold.
   *
   * The addresses will be sorted lexicographically, as that is the trend in bitcoin.
   * To create an address from unsorted public keys, use the {@link Script#buildMultisigOut}
   * interface.
   *
   * @param {Array} publicKeys - a set of public keys to create an address
   * @param {number} threshold - the number of signatures needed to release the funds
   * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
   * @return {Address}
   */


  static createMultisig(publicKeys, threshold, network) {
    network = network || publicKeys[0].network || Networks.defaultNetwork; // eslint-disable-next-line no-use-before-define

    return Address.payingTo(Script.buildMultisigOut(publicKeys, threshold), network);
  }
  /**
   * Internal function to transform a bitcoin address string
   *
   * @param {string} data
   * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
   * @param {string=} type - The type: 'pubkeyhash' or 'scripthash'
   * @param {string} format - The format: 'legacy', 'bitpay' or 'cashaddr'
   * @returns {Object} An object with keys: hashBuffer, network and type
   * @private
   */


  static _transformString(data, network, type, format) {
    if (typeof data !== 'string') {
      throw new TypeError('data parameter supplied is not a string.');
    }

    data = data.trim();

    if (format === this.LegacyFormat) {
      return this._transformStringLegacy(data, network, type);
    }

    if (format === this.BitpayFormat) {
      return this._transformStringBitpay(data, network, type);
    }

    if (format === this.CashAddrFormat) {
      return this._transformStringCashAddr(data, network, type);
    }

    throw new TypeError('Unrecognized address format.');
  }
  /**
   * Internal function to transform a bitcoin address string in legacy format
   *
   * @param {string} data
   * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
   * @param {string=} type - The type: 'pubkeyhash' or 'scripthash'
   * @returns {Object} An object with keys: hashBuffer, network and type
   * @private
   */


  static _transformStringLegacy(data, network, type) {
    var addressBuffer = Base58Check.decode(data);
    return this._transformBuffer(addressBuffer, network, type);
  }
  /**
   * Internal function to transform a bitcoin address string in Bitpay format
   *
   * @param {string} data
   * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
   * @param {string=} type - The type: 'pubkeyhash' or 'scripthash'
   * @returns {Object} An object with keys: hashBuffer, network and type
   * @private
   */


  static _transformStringBitpay(data, network, type) {
    var addressBuffer = Base58Check.decode(data);

    if (addressBuffer[0] === BITPAY_P2PKH_VERSION_BYTE) {
      addressBuffer[0] = 0;
    } else if (addressBuffer[0] === BITPAY_P2SH_VERSION_BYTE) {
      addressBuffer[0] = 5;
    }

    return this._transformBuffer(addressBuffer, network, type);
  }
  /**
   * Internal function to transform a bitcoin address string in CashAddr format
   *
   * @param {string} data
   * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
   * @param {string=} type - The type: 'pubkeyhash' or 'scripthash'
   * @returns {Object} An object with keys: hashBuffer, network and type
   * @private
   */


  static _transformStringCashAddr(data, network, type) {
    if (!(typeof network === 'string')) {
      network = network.toString();
    }

    var decoded = cashaddr.decode(data);
    preconditions.checkArgument(!network || network === 'livenet' && decoded.prefix === 'bitcoincash' || network === 'testnet' && decoded.prefix === 'bchtest', 'Invalid network.');
    preconditions.checkArgument(!type || type === this.PayToPublicKeyHash && decoded.type === 'P2PKH' || type === this.PayToScriptHash && decoded.type === 'P2SH', 'Invalid type.');
    network = Networks.get(network || (decoded.prefix === 'bitcoincash' ? 'livenet' : 'testnet'));
    type = type || (decoded.type === 'P2PKH' ? this.PayToPublicKeyHash : this.PayToScriptHash);
    var version = Buffer.from([network[type]]);
    var hashBuffer = Buffer.from(decoded.hash);
    var addressBuffer = Buffer.concat([version, hashBuffer]);
    return this._transformBuffer(addressBuffer, network, type);
  }
  /**
   * Instantiate an address from a PublicKey instance
   *
   * @param {PublicKey} data
   * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
   * @returns {Address} A new valid and frozen instance of an Address
   */


  static fromPublicKey(data, network) {
    var info = this._transformPublicKey(data);

    network = network || Networks.defaultNetwork;
    return new Address(info.hashBuffer, network, info.type);
  }
  /**
   * Instantiate an address from a ripemd160 public key hash
   *
   * @param {Buffer} hash - An instance of buffer of the hash
   * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
   * @returns {Address} A new valid and frozen instance of an Address
   */


  static fromPublicKeyHash(hash, network) {
    var info = this._transformHash(hash);

    return new Address(info.hashBuffer, network, this.PayToPublicKeyHash);
  }
  /**
   * Instantiate an address from a ripemd160 script hash
   *
   * @param {Buffer} hash - An instance of buffer of the hash
   * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
   * @returns {Address} A new valid and frozen instance of an Address
   */


  static fromScriptHash(hash, network) {
    preconditions.checkArgument(hash, 'hash parameter is required');

    var info = this._transformHash(hash);

    return new Address(info.hashBuffer, network, this.PayToScriptHash);
  }
  /**
   * Builds a p2sh address paying to script. This will hash the script and
   * use that to create the address.
   * If you want to extract an address associated with a script instead,
   * see {{Address#fromScript}}
   *
   * @param {Script} script - An instance of Script
   * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
   * @returns {Address} A new valid and frozen instance of an Address
   */


  static payingTo(script, network) {
    preconditions.checkArgument(script, 'script is required'); // eslint-disable-next-line no-use-before-define

    preconditions.checkArgument(script instanceof Script, 'script must be instance of Script');
    return this.fromScriptHash(Hash.sha256ripemd160(script.toBuffer()), network);
  }
  /**
   * Extract address from a Script. The script must be of one
   * of the following types: p2pkh input, p2pkh output, p2sh input
   * or p2sh output.
   * This will analyze the script and extract address information from it.
   * If you want to transform any script to a p2sh Address paying
   * to that script's hash instead, use {{Address#payingTo}}
   *
   * @param {Script} script - An instance of Script
   * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
   * @returns {Address} A new valid and frozen instance of an Address
   */


  static fromScript(script, network) {
    // eslint-disable-next-line no-use-before-define
    preconditions.checkArgument(script instanceof Script, 'script must be a Script instance');

    var info = this._transformScript(script, network);

    return new Address(info.hashBuffer, network, info.type);
  }
  /**
   * Instantiate an address from a buffer of the address
   *
   * @param {Buffer} buffer - An instance of buffer of the address
   * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
   * @param {string=} type - The type of address: 'script' or 'pubkey'
   * @returns {Address} A new valid and frozen instance of an Address
   */


  static fromBuffer(buffer, network, type) {
    var info = this._transformBuffer(buffer, network, type);

    return new Address(info.hashBuffer, info.network, info.type);
  }
  /**
   * Instantiate an address from an address string
   *
   * @param {string} str - An string of the bitcoin address
   * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
   * @param {string=} type - The type of address: 'script' or 'pubkey'
   * @param {string=} format - The format: 'legacy', 'bitpay' or 'cashaddr'
   * @returns {Address} A new valid and frozen instance of an Address
   */


  static fromString(str, network, type, format) {
    format = format || this.DefaultFormat;

    var info = this._transformString(str, network, type, format);

    return new Address(info.hashBuffer, info.network, info.type);
  }
  /**
   * Instantiate an address from an Object
   *
   * @param {string} json - An JSON string or Object with keys: hash, network and type
   * @returns {Address} A new valid instance of an Address
   */


  static fromObject(obj) {
    preconditions.checkState(JSUtil.isHexa(obj.hash), "Unexpected hash, \"".concat(obj.hash, "\", expected to be hex."));
    var hashBuffer = Buffer.from(obj.hash, 'hex');
    return new Address(hashBuffer, obj.network, obj.type);
  }
  /**
   * Will return a validation error if exists
   *
   * @example
   * ```javascript
   * // a network mismatch error
   * var error = this.getValidationError('15vkcKf7gB23wLAnZLmbVuMiiVDc1Nm4a2', 'testnet');
   * ```
   *
   * @param {string} data - The encoded data
   * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
   * @param {string} type - The type of address: 'script' or 'pubkey'
   * @returns {null|Error} The corresponding error message
   */


  static getValidationError(data, network, type) {
    var error;

    try {
      // eslint-disable-next-line no-new
      new Address(data, network, type);
    } catch (e) {
      error = e;
    }

    return error;
  }
  /**
   * Will return a boolean if an address is valid
   *
   * @example
   * ```javascript
   * assert(this.isValid('15vkcKf7gB23wLAnZLmbVuMiiVDc1Nm4a2', 'livenet'));
   * ```
   *
   * @param {string} data - The encoded data
   * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
   * @param {string} type - The type of address: 'script' or 'pubkey'
   * @returns {boolean} The corresponding error message
   */


  static isValid(data, network, type) {
    return !this.getValidationError(data, network, type);
  }
  /**
   * Returns true if an address is of pay to public key hash type
   * @return boolean
   */


  isPayToPublicKeyHash() {
    return this.type === Address.PayToPublicKeyHash;
  }
  /**
   * Returns true if an address is of pay to script hash type
   * @return boolean
   */


  isPayToScriptHash() {
    return this.type === Address.PayToScriptHash;
  }
  /**
   * Will return a buffer representation of the address
   *
   * @returns {Buffer} Bitcoin address buffer
   */


  toBuffer() {
    var version = Buffer.from([this.network[this.type]]);
    var buf = Buffer.concat([version, this.hashBuffer]);
    return buf;
  }
  /**
   * @returns {Object} A plain object with the address information
   */


  toObject() {
    return {
      hash: this.hashBuffer.toString('hex'),
      type: this.type,
      network: this.network.toString()
    };
  }

  toJSON() {
    return this.toObject();
  }
  /**
   * Will return a the string representation of the address
   *
   * @param {string=} format - The format: 'legacy', 'bitpay' or 'cashaddr'
   * @returns {string} Bitcoin address
   */


  toString(format) {
    format = format || Address.DefaultFormat;

    if (format === Address.LegacyFormat) {
      return this._toStringLegacy();
    }

    if (format === Address.BitpayFormat) {
      return this._toStringBitpay();
    }

    if (format === Address.CashAddrFormat) {
      return this._toStringCashAddr();
    }

    throw new TypeError('Unrecognized address format.');
  }
  /**
   * Will return a the string representation of the address in legacy format
   *
   * @returns {string} Bitcoin address
   */


  _toStringLegacy() {
    return Base58Check.encode(this.toBuffer());
  }
  /**
   * Will return a the string representation of the address in Bitpay format
   *
   * @returns {string} Bitcoin address
   */


  _toStringBitpay() {
    var buffer = this.toBuffer();

    if (this.network.toString() === 'livenet') {
      if (this.type === Address.PayToPublicKeyHash) {
        buffer[0] = BITPAY_P2PKH_VERSION_BYTE;
      } else if (this.type === Address.PayToScriptHash) {
        buffer[0] = BITPAY_P2SH_VERSION_BYTE;
      }
    }

    return Base58Check.encode(buffer);
  }
  /**
   * Will return a the string representation of the address in CashAddr format
   *
   * @returns {string} Bitcoin address
   */


  _toStringCashAddr() {
    var prefix = this.network.toString() === 'livenet' ? 'bitcoincash' : 'bchtest';
    var type = this.type === Address.PayToPublicKeyHash ? 'P2PKH' : 'P2SH';
    return cashaddr.encode(prefix, type, this.hashBuffer);
  }
  /**
   * Will return a string formatted for the console
   *
   * @returns {string} Bitcoin address
   */


  inspect() {
    return "<Address: ".concat(this.toString(), ", type: ").concat(this.type, ", network: ").concat(this.network, ">");
  }

}

Address.LegacyFormat = 'legacy';
Address.BitpayFormat = 'bitpay';
Address.CashAddrFormat = 'cashaddr';
Address.DefaultFormat = Address.LegacyFormat;
Address.PayToPublicKeyHash = 'pubkeyhash';
Address.PayToScriptHash = 'scripthash';

var GENESIS_BITS = 0x1d00ffff;
/**
 * Instantiate a BlockHeader from a Buffer, JSON object, or Object with
 * the properties of the BlockHeader
 *
 * @param {*} - A Buffer, JSON string, or Object
 * @returns {BlockHeader} - An instance of block header
 * @constructor
 */

class BlockHeader {
  constructor(arg) {
    if (!(this instanceof BlockHeader)) {
      return new BlockHeader(arg);
    }

    var info = BlockHeader._from(arg);

    this.version = info.version;
    this.prevHash = info.prevHash;
    this.merkleRoot = info.merkleRoot;
    this.time = info.time;
    this.timestamp = info.time;
    this.bits = info.bits;
    this.nonce = info.nonce;

    if (info.hash) {
      preconditions.checkState(this.hash === info.hash, 'Argument object hash does not match block hash.');
    }

    return this;
  }
  /**
   * @param {*} - A Buffer, JSON string or Object
   * @returns {Object} - An object representing block header data
   * @throws {TypeError} - If the argument was not recognized
   * @private
   */


  static _from(arg) {
    var info = {};

    if (BufferUtil.isBuffer(arg)) {
      info = BlockHeader._fromBufferReader(BufferReader(arg));
    } else if (_.isObject(arg)) {
      info = BlockHeader._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for BlockHeader');
    }

    return info;
  }
  /**
   * @param {Object} - A JSON string
   * @returns {Object} - An object representing block header data
   * @private
   */


  static _fromObject(data) {
    preconditions.checkArgument(data, 'data is required');
    var {
      prevHash
    } = data;
    var {
      merkleRoot
    } = data;

    if (_.isString(data.prevHash)) {
      prevHash = BufferUtil.reverse(Buffer.from(data.prevHash, 'hex'));
    }

    if (_.isString(data.merkleRoot)) {
      merkleRoot = BufferUtil.reverse(Buffer.from(data.merkleRoot, 'hex'));
    }

    var info = {
      hash: data.hash,
      version: data.version,
      prevHash,
      merkleRoot,
      time: data.time,
      timestamp: data.time,
      bits: data.bits,
      nonce: data.nonce
    };
    return info;
  }
  /**
   * @param {Object} - A plain JavaScript object
   * @returns {BlockHeader} - An instance of block header
   */


  static fromObject(obj) {
    var info = this._fromObject(obj);

    return new BlockHeader(info);
  }
  /**
   * @param {Binary} - Raw block binary data or buffer
   * @returns {BlockHeader} - An instance of block header
   */


  static fromRawBlock(data) {
    if (!BufferUtil.isBuffer(data)) {
      data = Buffer.from(data, 'binary');
    }

    var br = BufferReader(data);
    br.pos = BlockHeader.Constants.START_OF_HEADER;

    var info = this._fromBufferReader(br);

    return new BlockHeader(info);
  }
  /**
   * @param {Buffer} - A buffer of the block header
   * @returns {BlockHeader} - An instance of block header
   */


  static fromBuffer(buf) {
    var info = this._fromBufferReader(BufferReader(buf));

    return new BlockHeader(info);
  }
  /**
   * @param {string} - A hex encoded buffer of the block header
   * @returns {BlockHeader} - An instance of block header
   */


  static fromString(str) {
    var buf = Buffer.from(str, 'hex');
    return this.fromBuffer(buf);
  }
  /**
   * @param {BufferReader} - A BufferReader of the block header
   * @returns {Object} - An object representing block header data
   * @private
   */


  static _fromBufferReader(br) {
    var info = {};
    info.version = br.readInt32LE();
    info.prevHash = br.read(32);
    info.merkleRoot = br.read(32);
    info.time = br.readUInt32LE();
    info.bits = br.readUInt32LE();
    info.nonce = br.readUInt32LE();
    return info;
  }
  /**
   * @param {BufferReader} - A BufferReader of the block header
   * @returns {BlockHeader} - An instance of block header
   */


  static fromBufferReader(br) {
    var info = this._fromBufferReader(br);

    return new BlockHeader(info);
  }
  /**
   * @returns {Object} - A plain object of the BlockHeader
   */


  toJSON() {
    return {
      hash: this.hash,
      version: this.version,
      prevHash: BufferUtil.reverse(this.prevHash).toString('hex'),
      merkleRoot: BufferUtil.reverse(this.merkleRoot).toString('hex'),
      time: this.time,
      bits: this.bits,
      nonce: this.nonce
    };
  }

  toObject() {
    return this.toJSON();
  }
  /**
   * @returns {Buffer} - A Buffer of the BlockHeader
   */


  toBuffer() {
    return this.toBufferWriter().concat();
  }
  /**
   * @returns {string} - A hex encoded string of the BlockHeader
   */


  toString() {
    return this.toBuffer().toString('hex');
  }
  /**
   * @param {BufferWriter} - An existing instance BufferWriter
   * @returns {BufferWriter} - An instance of BufferWriter representation of the BlockHeader
   */


  toBufferWriter(bw) {
    if (!bw) {
      bw = new BufferWriter();
    }

    bw.writeInt32LE(this.version);
    bw.write(this.prevHash);
    bw.write(this.merkleRoot);
    bw.writeUInt32LE(this.time);
    bw.writeUInt32LE(this.bits);
    bw.writeUInt32LE(this.nonce);
    return bw;
  }
  /**
   * Returns the target difficulty for this block
   * @param {Number} bits
   * @returns {BN} An instance of BN with the decoded difficulty bits
   */


  getTargetDifficulty(bits) {
    bits = bits || this.bits;
    var target = new BN(bits & 0xffffff);
    var mov = 8 * ((bits >>> 24) - 3);

    while (mov > 0) {
      target = target.mul(new BN(2));
      mov -= 1;
    }

    return target;
  }
  /**
   * @link https://en.bitcoin.it/wiki/Difficulty
   * @return {Number}
   */


  getDifficulty() {
    var difficulty1TargetBN = this.getTargetDifficulty(GENESIS_BITS).mul(new BN(10 ** 8));
    var currentTargetBN = this.getTargetDifficulty();
    var difficultyString = difficulty1TargetBN.div(currentTargetBN).toString(10);
    var decimalPos = difficultyString.length - 8;
    var leftOfDecimal = "".concat(difficultyString.slice(0, decimalPos));
    var rightOfDecimal = "".concat(difficultyString.slice(decimalPos));
    difficultyString = "".concat(leftOfDecimal, ".").concat(rightOfDecimal);
    return parseFloat(difficultyString);
  }
  /**
   * @returns {Buffer} - The little endian hash buffer of the header
   */


  _getHash() {
    var buf = this.toBuffer();
    return Hash.sha256sha256(buf);
  }
  /**
   * @returns {Boolean} - If timestamp is not too far in the future
   */


  validTimestamp() {
    var currentTime = Math.round(new Date().getTime() / 1000);

    if (this.time > currentTime + BlockHeader.Constants.MAX_TIME_OFFSET) {
      return false;
    }

    return true;
  }
  /**
   * @returns {Boolean} - If the proof-of-work hash satisfies the target difficulty
   */


  validProofOfWork() {
    var pow = new BN(this.id, 'hex');
    var target = this.getTargetDifficulty();

    if (pow.cmp(target) > 0) {
      return false;
    }

    return true;
  }
  /**
   * @returns {string} - A string formatted for the console
   */


  inspect() {
    return "<BlockHeader ".concat(this.id, ">");
  }

}

var idProperty = {
  configurable: false,
  enumerable: true,

  /**
   * @returns {string} - The big endian hash buffer of the header
   */
  get() {
    if (!this._id) {
      this._id = BufferReader(this._getHash()).readReverse().toString('hex');
    }

    return this._id;
  },

  set: _.noop
};
Object.defineProperty(BlockHeader.prototype, 'id', idProperty);
Object.defineProperty(BlockHeader.prototype, 'hash', idProperty);
BlockHeader.Constants = {
  START_OF_HEADER: 8,
  // Start buffer position in raw block data
  MAX_TIME_OFFSET: 2 * 60 * 60,
  // The max a timestamp can be in the future
  LARGEST_HASH: new BN('10000000000000000000000000000000000000000000000000000000000000000', 'hex')
};

var MAX_SAFE_INTEGER = 0x1fffffffffffff;

class Output {
  constructor(args) {
    if (_.isObject(args)) {
      this.satoshis = args.satoshis;

      if (BufferUtil.isBuffer(args.script)) {
        this._scriptBuffer = args.script;
      } else {
        var script;

        if (_.isString(args.script) && JSUtil.isHexa(args.script)) {
          script = Buffer.from(args.script, 'hex');
        } else {
          ({
            script
          } = args);
        }

        this.setScript(script);
      }
    } else {
      throw new TypeError('Unrecognized argument for Output');
    }
  }

  get script() {
    if (this._script) {
      return this._script;
    }

    this.setScriptFromBuffer(this._scriptBuffer);
    return this._script;
  }

  get satoshis() {
    return this._satoshis;
  }

  set satoshis(num) {
    if (num instanceof BN) {
      this._satoshisBN = num;
      this._satoshis = num.toNumber();
    } else if (_.isString(num)) {
      this._satoshis = parseInt(num, 10);
      this._satoshisBN = BN.fromNumber(this._satoshis);
    } else {
      preconditions.checkArgument(JSUtil.isNaturalNumber(num), 'Output satoshis is not a natural number');
      this._satoshisBN = BN.fromNumber(num);
      this._satoshis = num;
    }

    preconditions.checkState(JSUtil.isNaturalNumber(this._satoshis), 'Output satoshis is not a natural number');
  }

  get satoshisBN() {
    return this._satoshisBN;
  }

  set satoshisBN(num) {
    this._satoshisBN = num;
    this._satoshis = num.toNumber();
    preconditions.checkState(JSUtil.isNaturalNumber(this._satoshis), 'Output satoshis is not a natural number');
  }

  static fromObject(data) {
    return new Output(data);
  }

  static fromBufferReader(br) {
    var obj = {};
    obj.satoshis = br.readUInt64LEBN();
    var size = br.readVarintNum();

    if (size !== 0) {
      obj.script = br.read(size);
    } else {
      obj.script = Buffer.from([]);
    }

    return new Output(obj);
  }

  invalidSatoshis() {
    if (this._satoshis > MAX_SAFE_INTEGER) {
      return 'transaction txout satoshis greater than max safe integer';
    }

    if (this._satoshis !== this._satoshisBN.toNumber()) {
      return 'transaction txout satoshis has corrupted value';
    }

    if (this._satoshis < 0) {
      return 'transaction txout negative';
    }

    return false;
  }

  toJSON() {
    var obj = {
      satoshis: this.satoshis
    };
    obj.script = this._scriptBuffer.toString('hex');
    return obj;
  }

  toObject() {
    return this.toJSON();
  }

  setScriptFromBuffer(buff) {
    this._scriptBuffer = buff;

    try {
      this._script = Script.fromBuffer(this._scriptBuffer);
      this._script._isOutput = true;
    } catch (e) {
      if (e instanceof errors.Script.InvalidBuffer) {
        this._script = null;
      } else {
        throw e;
      }
    }
  }

  setScript(script) {
    if (script instanceof Script) {
      this._scriptBuffer = script.toBuffer();
      this._script = script;
      this._script._isOutput = true;
    } else if (_.isString(script)) {
      this._script = Script.fromString(script);
      this._scriptBuffer = this._script.toBuffer();
      this._script._isOutput = true;
    } else if (BufferUtil.isBuffer(script)) {
      this.setScriptFromBuffer(script);
    } else {
      throw new TypeError('Invalid argument type: script');
    }

    return this;
  }

  inspect() {
    var scriptStr;

    if (this.script) {
      scriptStr = this.script.inspect();
    } else {
      scriptStr = this._scriptBuffer.toString('hex');
    }

    return "<Output (".concat(this.satoshis, " sats) ").concat(scriptStr, ">");
  }

  toBufferWriter(writer) {
    if (!writer) {
      writer = new BufferWriter();
    }

    writer.writeUInt64LEBN(this._satoshisBN);
    var script = this._scriptBuffer;
    writer.writeVarintNum(script.length);
    writer.write(script);
    return writer;
  }

}

var ECDSA = function ECDSA(obj) {
  if (!(this instanceof ECDSA)) {
    return new ECDSA(obj);
  }

  if (obj) {
    this.set(obj);
  }
};

ECDSA.prototype.set = function (obj) {
  this.hashbuf = obj.hashbuf || this.hashbuf;
  this.endian = obj.endian || this.endian; // the endianness of hashbuf

  this.privkey = obj.privkey || this.privkey;
  this.pubkey = obj.pubkey || (this.privkey ? this.privkey.publicKey : this.pubkey);
  this.sig = obj.sig || this.sig;
  this.k = obj.k || this.k;
  this.verified = obj.verified || this.verified;
  return this;
};

ECDSA.prototype.privkey2pubkey = function () {
  this.pubkey = this.privkey.toPublicKey();
};

ECDSA.prototype.calci = function () {
  for (var i = 0; i < 4; i += 1) {
    this.sig.i = i;
    var Qprime = void 0;

    try {
      Qprime = this.toPublicKey();

      if (Qprime.point.eq(this.pubkey.point)) {
        this.sig.compressed = this.pubkey.compressed;
        return this;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  this.sig.i = undefined;
  throw new Error('Unable to find valid recovery factor');
};

ECDSA.fromString = function (str) {
  var obj = JSON.parse(str);
  return new ECDSA(obj);
};

ECDSA.prototype.randomK = function () {
  var N = Point.getN();
  var k;

  do {
    k = BN.fromBuffer(Random.getRandomBuffer(32));
  } while (!(k.lt(N) && k.gt(BN.Zero)));

  this.k = k;
  return this;
}; // https://tools.ietf.org/html/rfc6979#section-3.2


ECDSA.prototype.deterministicK = function (badrs) {
  // if r or s were invalid when this function was used in signing,
  // we do not want to actually compute r, s here for efficiency, so,
  // we can increment badrs. explained at end of RFC 6979 section 3.2
  if (_.isUndefined(badrs)) {
    badrs = 0;
  }

  var v = Buffer.alloc(32);
  v.fill(0x01);
  var k = Buffer.alloc(32);
  k.fill(0x00);
  var x = this.privkey.bn.toBuffer({
    size: 32
  });
  var hashbuf = this.endian === 'little' ? BufferUtil.reverse(this.hashbuf) : this.hashbuf;
  k = Hash.sha256hmac(Buffer.concat([v, Buffer.from([0x00]), x, hashbuf]), k);
  v = Hash.sha256hmac(v, k);
  k = Hash.sha256hmac(Buffer.concat([v, Buffer.from([0x01]), x, hashbuf]), k);
  v = Hash.sha256hmac(v, k);
  v = Hash.sha256hmac(v, k);
  var T = BN.fromBuffer(v);
  var N = Point.getN(); // also explained in 3.2, we must ensure T is in the proper range (0, N)

  for (var i = 0; i < badrs || !(T.lt(N) && T.gt(BN.Zero)); i += 1) {
    k = Hash.sha256hmac(Buffer.concat([v, Buffer.from([0x00])]), k);
    v = Hash.sha256hmac(v, k);
    v = Hash.sha256hmac(v, k);
    T = BN.fromBuffer(v);
  }

  this.k = T;
  return this;
}; // Information about public key recovery:
// https://bitcointalk.org/index.php?topic=6430.0
// http://stackoverflow.com/questions/19665491/how-do-i-get-an-ecdsa-public-key-from-just-a-bitcoin-signature-sec1-4-1-6-k


ECDSA.prototype.toPublicKey = function () {
  var {
    i
  } = this.sig;
  preconditions.checkArgument(i === 0 || i === 1 || i === 2 || i === 3, 'i must be equal to 0, 1, 2, or 3');
  var e = BN.fromBuffer(this.hashbuf);
  var {
    r
  } = this.sig;
  var {
    s
  } = this.sig; // A set LSB signifies that the y-coordinate is odd

  var isYOdd = i & 1; // The more significant bit specifies whether we should use the
  // first or second candidate key.

  var isSecondKey = i >> 1;
  var n = Point.getN();
  var G = Point.getG(); // 1.1 Let x = r + jn

  var x = isSecondKey ? r.add(n) : r;
  var R = Point.fromX(isYOdd, x); // 1.4 Check that nR is at infinity

  var nR = R.mul(n);

  if (!nR.isInfinity()) {
    throw new Error('nR is not a valid curve point');
  } // Compute -e from e


  var eNeg = e.neg().umod(n); // 1.6.1 Compute Q = r^-1 (sR - eG)
  // Q = r^-1 (sR + -eG)

  var rInv = r.invm(n); // var Q = R.multiplyTwo(s, G, eNeg).mul(rInv);

  var Q = R.mul(s).add(G.mul(eNeg)).mul(rInv);
  var pubkey = PublicKey.fromPoint(Q, this.sig.compressed);
  return pubkey;
};

ECDSA.prototype.sigError = function () {
  if (!BufferUtil.isBuffer(this.hashbuf) || this.hashbuf.length !== 32) {
    return 'hashbuf must be a 32 byte buffer';
  }

  var {
    r
  } = this.sig;
  var {
    s
  } = this.sig;

  if (!(r.gt(BN.Zero) && r.lt(Point.getN())) || !(s.gt(BN.Zero) && s.lt(Point.getN()))) {
    return 'r and s not in range';
  }

  var e = BN.fromBuffer(this.hashbuf, this.endian ? {
    endian: this.endian
  } : undefined);
  var n = Point.getN();
  var sinv = s.invm(n);
  var u1 = sinv.mul(e).umod(n);
  var u2 = sinv.mul(r).umod(n);
  var p = Point.getG().mulAdd(u1, this.pubkey.point, u2);

  if (p.isInfinity()) {
    return 'p is infinity';
  }

  if (p.getX().umod(n).cmp(r) !== 0) {
    return 'Invalid signature';
  }

  return false;
};

ECDSA.toLowS = function (s) {
  // enforce low s
  // see BIP 62, "low S values in signatures"
  var maxS = '7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0';

  if (s.gt(BN.fromBuffer(Buffer.from(maxS, 'hex')))) {
    s = Point.getN().sub(s);
  }

  return s;
};

ECDSA.prototype._findSignature = function (d, e) {
  var N = Point.getN();
  var G = Point.getG(); // try different values of k until r, s are valid

  var badrs = 0;
  var Q;
  var r;
  var s;

  do {
    if (!this.k || badrs > 0) {
      this.deterministicK(badrs);
    }

    badrs += 1;
    var {
      k
    } = this;
    Q = G.mul(k);
    r = Q.x.umod(N);
    s = k.invm(N).mul(e.add(d.mul(r))).umod(N);
  } while (r.cmp(BN.Zero) <= 0 || s.cmp(BN.Zero) <= 0);

  s = ECDSA.toLowS(s);
  return {
    s,
    r
  };
};

ECDSA.prototype.sign = function () {
  var {
    hashbuf
  } = this;
  var {
    privkey
  } = this;
  var d = privkey.bn;
  preconditions.checkState(hashbuf && privkey && d, 'invalid parameters');
  preconditions.checkState(BufferUtil.isBuffer(hashbuf), 'hashbuf must be a buffer');
  preconditions.checkState(hashbuf.length === 32, 'hashbuf must be 32 bytes');
  var e = BN.fromBuffer(hashbuf, this.endian ? {
    endian: this.endian
  } : undefined);

  var obj = this._findSignature(d, e);

  obj.compressed = this.pubkey.compressed;
  this.sig = new Signature(obj);
  return this;
};

ECDSA.prototype.signRandomK = function () {
  this.randomK();
  return this.sign();
};

ECDSA.prototype.toString = function () {
  var obj = {};

  if (this.hashbuf) {
    obj.hashbuf = this.hashbuf.toString('hex');
  }

  if (this.privkey) {
    obj.privkey = this.privkey.toString();
  }

  if (this.pubkey) {
    obj.pubkey = this.pubkey.toString();
  }

  if (this.sig) {
    obj.sig = this.sig.toString();
  }

  if (this.k) {
    obj.k = this.k.toString();
  }

  return JSON.stringify(obj);
};

ECDSA.prototype.verify = function () {
  if (!this.sigError()) {
    this.verified = true;
  } else {
    this.verified = false;
  }

  return this;
};

ECDSA.sign = function (hashbuf, privkey, endian) {
  return ECDSA().set({
    hashbuf,
    endian,
    privkey
  }).sign().sig;
};

ECDSA.verify = function (hashbuf, sig, pubkey, endian) {
  return ECDSA().set({
    hashbuf,
    endian,
    sig,
    pubkey
  }).verify().verified;
};

var SIGHASH_SINGLE_BUG = '0000000000000000000000000000000000000000000000000000000000000001';
var BITS_64_ON = 'ffffffffffffffff';
var ENABLE_SIGHASH_FORKID = true;

class Sighash {
  static sighashForForkId(transaction, sighashType, inputNumber, subscript, satoshisBN) {
    var input = transaction.inputs[inputNumber];
    preconditions.checkArgument(satoshisBN instanceof BN, 'For ForkId=0 signatures, satoshis or complete input must be provided');

    function GetPrevoutHash(tx) {
      var writer = new BufferWriter();

      _.each(tx.inputs, txIn => {
        writer.writeReverse(txIn.prevTxId);
        writer.writeUInt32LE(txIn.outputIndex);
      });

      var buf = writer.toBuffer();
      var ret = Hash.sha256sha256(buf);
      return ret;
    }

    function GetSequenceHash(tx) {
      var writer = new BufferWriter();

      _.each(tx.inputs, txIn => {
        writer.writeUInt32LE(txIn.sequenceNumber);
      });

      var buf = writer.toBuffer();
      var ret = Hash.sha256sha256(buf);
      return ret;
    }

    function GetOutputsHash(tx, n) {
      var writer = new BufferWriter();

      if (_.isUndefined(n)) {
        _.each(tx.outputs, output => {
          output.toBufferWriter(writer);
        });
      } else {
        tx.outputs[n].toBufferWriter(writer);
      }

      var buf = writer.toBuffer();
      var ret = Hash.sha256sha256(buf);
      return ret;
    }

    var hashPrevouts = BufferUtil.emptyBuffer(32);
    var hashSequence = BufferUtil.emptyBuffer(32);
    var hashOutputs = BufferUtil.emptyBuffer(32);

    if (!(sighashType & Signature.SIGHASH_ANYONECANPAY)) {
      hashPrevouts = GetPrevoutHash(transaction);
    }

    if (!(sighashType & Signature.SIGHASH_ANYONECANPAY) && (sighashType & 31) !== Signature.SIGHASH_SINGLE && (sighashType & 31) !== Signature.SIGHASH_NONE) {
      hashSequence = GetSequenceHash(transaction);
    }

    if ((sighashType & 31) !== Signature.SIGHASH_SINGLE && (sighashType & 31) !== Signature.SIGHASH_NONE) {
      hashOutputs = GetOutputsHash(transaction);
    } else if ((sighashType & 31) === Signature.SIGHASH_SINGLE && inputNumber < transaction.outputs.length) {
      hashOutputs = GetOutputsHash(transaction, inputNumber);
    }

    var writer = new BufferWriter(); // Version

    writer.writeInt32LE(transaction.version); // Input prevouts/nSequence (none/all, depending on flags)

    writer.write(hashPrevouts);
    writer.write(hashSequence); //  outpoint (32-byte hash + 4-byte little endian)

    writer.writeReverse(input.prevTxId);
    writer.writeUInt32LE(input.outputIndex); // scriptCode of the input (serialized as scripts inside CTxOuts)

    writer.writeVarintNum(subscript.toBuffer().length);
    writer.write(subscript.toBuffer()); // value of the output spent by this input (8-byte little endian)

    writer.writeUInt64LEBN(satoshisBN); // nSequence of the input (4-byte little endian)

    var {
      sequenceNumber
    } = input;
    writer.writeUInt32LE(sequenceNumber); // Outputs (none/one/all, depending on flags)

    writer.write(hashOutputs); // Locktime

    writer.writeUInt32LE(transaction.nLockTime); // sighashType

    writer.writeUInt32LE(sighashType >>> 0);
    var buf = writer.toBuffer();
    var ret = Hash.sha256sha256(buf);
    ret = new BufferReader(ret).readReverse();
    return ret;
  }
  /**
   * Returns a buffer of length 32 bytes with the hash that needs to be signed
   * for OP_CHECKSIG.
   *
   * @name Signing.sighash
   * @param {Transaction} transaction the transaction to sign
   * @param {number} sighashType the type of the hash
   * @param {number} inputNumber the input index for the signature
   * @param {Script} subscript the script that will be signed
   * @param {satoshisBN} sed in ForkId signatures. If not provided, outputs's amount is used.
   *
   */


  static sighash(transaction, sighashType, inputNumber, subscript, satoshisBN) {
    // Copy transaction
    var txcopy = Transaction.shallowCopy(transaction); // Copy script

    subscript = new Script(subscript);

    if (sighashType & Signature.SIGHASH_FORKID && ENABLE_SIGHASH_FORKID) {
      return Sighash.sighashForForkId(txcopy, sighashType, inputNumber, subscript, satoshisBN);
    } // For no ForkId sighash, separators need to be removed.


    subscript.removeCodeseparators();
    var i;

    for (i = 0; i < txcopy.inputs.length; i += 1) {
      // Blank signatures for other inputs
      txcopy.inputs[i] = new Input(txcopy.inputs[i]).setScript(Script.empty());
    }

    txcopy.inputs[inputNumber] = new Input(txcopy.inputs[inputNumber]).setScript(subscript);

    if ((sighashType & 31) === Signature.SIGHASH_NONE || (sighashType & 31) === Signature.SIGHASH_SINGLE) {
      // clear all sequenceNumbers
      for (i = 0; i < txcopy.inputs.length; i += 1) {
        if (i !== inputNumber) {
          txcopy.inputs[i].sequenceNumber = 0;
        }
      }
    }

    if ((sighashType & 31) === Signature.SIGHASH_NONE) {
      txcopy.outputs = [];
    } else if ((sighashType & 31) === Signature.SIGHASH_SINGLE) {
      // The SIGHASH_SINGLE bug.
      // https://bitcointalk.org/index.php?topic=260595.0
      if (inputNumber >= txcopy.outputs.length) {
        return Buffer.from(SIGHASH_SINGLE_BUG, 'hex');
      }

      txcopy.outputs.length = inputNumber + 1;

      for (i = 0; i < inputNumber; i += 1) {
        txcopy.outputs[i] = new Output({
          satoshis: BN.fromBuffer(Buffer.from(BITS_64_ON, 'hex')),
          script: Script.empty()
        });
      }
    }

    if (sighashType & Signature.SIGHASH_ANYONECANPAY) {
      txcopy.inputs = [txcopy.inputs[inputNumber]];
    }

    var buf = new BufferWriter().write(txcopy.toBuffer()).writeInt32LE(sighashType).toBuffer();
    var ret = Hash.sha256sha256(buf);
    ret = new BufferReader(ret).readReverse();
    return ret;
  }
  /**
   * Create a signature
   *
   * @name Signing.sign
   * @param {Transaction} transaction
   * @param {PrivateKey} privateKey
   * @param {number} sighash
   * @param {number} inputIndex
   * @param {Script} subscript
   * @param {satoshisBN} input's amount
   * @return {Signature}
   */


  static sign(transaction, privateKey, sighashType, inputIndex, subscript, satoshisBN) {
    var hashbuf = Sighash.sighash(transaction, sighashType, inputIndex, subscript, satoshisBN);
    var sig = ECDSA.sign(hashbuf, privateKey, 'little').set({
      nhashtype: sighashType
    });
    return sig;
  }
  /**
   * Verify a signature
   *
   * @name Signing.verify
   * @param {Transaction} transaction
   * @param {Signature} signature
   * @param {PublicKey} publicKey
   * @param {number} inputIndex
   * @param {Script} subscript
   * @param {satoshisBN} input's amount
   * @return {boolean}
   */


  static verify(transaction, signature, publicKey, inputIndex, subscript, satoshisBN) {
    preconditions.checkArgument(!_.isUndefined(transaction));
    preconditions.checkArgument(!_.isUndefined(signature) && !_.isUndefined(signature.nhashtype));
    var hashbuf = Sighash.sighash(transaction, signature.nhashtype, inputIndex, subscript, satoshisBN);
    return ECDSA.verify(hashbuf, signature, publicKey, 'little');
  }

}

var MAXINT = 0xffffffff; // Math.pow(2, 32) - 1;

var DEFAULT_RBF_SEQNUMBER = MAXINT - 2;
var DEFAULT_SEQNUMBER = MAXINT;
var DEFAULT_LOCKTIME_SEQNUMBER = MAXINT - 1;

class Input {
  constructor(params) {
    if (!(this instanceof Input)) {
      return new Input(params);
    }

    if (params) {
      return this._fromObject(params);
    }
  }

  get script() {
    if (this.isNull()) {
      return null;
    }

    if (!this._script) {
      this._script = new Script(this._scriptBuffer);
      this._script._isInput = true;
    }

    return this._script;
  }

  static fromObject(obj) {
    preconditions.checkArgument(obj !== null && typeof obj === 'object');
    return new Input()._fromObject(obj);
  }

  _fromObject(params) {
    if (params.script === undefined && params.scriptBuffer === undefined) {
      throw new errors.Transaction.Input.MissingScript();
    }

    this.prevTxId = typeof params.prevTxId === 'string' && JSUtil.isHexa(params.prevTxId) ? Buffer.from(params.prevTxId, 'hex') : params.prevTxId;

    if (params.output) {
      this.output = params.output instanceof Output ? params.output : new Output(params.output);
    }

    this.outputIndex = params.outputIndex === undefined ? params.txoutnum : params.outputIndex;

    if (params.sequenceNumber !== undefined) {
      this.sequenceNumber = params.sequenceNumber;
    } else if (params.seqnum !== undefined) {
      this.sequenceNumber = params.seqnum;
    } else {
      this.sequenceNumber = DEFAULT_SEQNUMBER;
    }

    this.setScript(params.scriptBuffer || params.script);
    return this;
  }

  toJSON() {
    var obj = {
      prevTxId: this.prevTxId.toString('hex'),
      outputIndex: this.outputIndex,
      sequenceNumber: this.sequenceNumber,
      script: this._scriptBuffer.toString('hex')
    }; // add human readable form if input contains valid script

    if (this.script) {
      obj.scriptString = this.script.toString();
    }

    if (this.output) {
      obj.output = this.output.toObject();
    }

    return obj;
  }

  toObject() {
    return this.toJSON();
  }

  static fromBufferReader(br) {
    var input = new Input();
    input.prevTxId = br.readReverse(32);
    input.outputIndex = br.readUInt32LE();
    input._scriptBuffer = br.readVarLengthBuffer();
    input.sequenceNumber = br.readUInt32LE(); // TODO: return different classes according to which input it is
    // e.g: CoinbaseInput, PublicKeyHashInput, MultiSigScriptHashInput, etc.

    return input;
  }

  toBufferWriter(writer) {
    writer = writer || new BufferWriter();
    writer.writeReverse(this.prevTxId);
    writer.writeUInt32LE(this.outputIndex);
    var script = this._scriptBuffer;
    writer.writeVarintNum(script.length);
    writer.write(script);
    writer.writeUInt32LE(this.sequenceNumber);
    return writer;
  }

  setScript(script) {
    this._script = null;

    if (script instanceof Script) {
      this._script = script;
      this._script._isInput = true;
      this._scriptBuffer = script.toBuffer();
    } else if (JSUtil.isHexa(script)) {
      // hex string script
      this._scriptBuffer = Buffer.from(script, 'hex');
    } else if (typeof script === 'string') {
      // human readable string script
      this._script = new Script(script);
      this._script._isInput = true;
      this._scriptBuffer = this._script.toBuffer();
    } else if (BufferUtil.isBuffer(script)) {
      // buffer script
      this._scriptBuffer = Buffer.from(script);
    } else {
      throw new TypeError('Invalid argument type: script');
    }

    return this;
  }
  /**
   * Retrieve signatures for the provided PrivateKey.
   *
   * @param {Transaction} transaction - the transaction to be signed
   * @param {PrivateKey} privateKey - the private key to use when signing
   * @param {number} inputIndex - the index of this input in the provided transaction
   * @param {number} sigType - defaults to Signature.SIGHASH_ALL
   * @param {Buffer} addressHash - if provided, don't calculate the hash of the
   *     public key associated with the private key provided
   * @abstract
   */


  getSignatures() {
    throw new errors.AbstractMethodInvoked("".concat('Trying to sign unsupported output type (only P2PKH and P2SH multisig inputs are supported)' + ' for input: ').concat(JSON.stringify(this)));
  }

  isFullySigned() {
    throw new errors.AbstractMethodInvoked('Input#isFullySigned');
  }

  isFinal() {
    return this.sequenceNumber !== 4294967295;
  }

  addSignature() {
    throw new errors.AbstractMethodInvoked('Input#addSignature');
  }

  clearSignatures() {
    throw new errors.AbstractMethodInvoked('Input#clearSignatures');
  }

  isValidSignature(transaction, signature) {
    // FIXME: Refactor signature so this is not necessary
    signature.signature.nhashtype = signature.sigtype;
    return Sighash.verify(transaction, signature.signature, signature.publicKey, signature.inputIndex, this.output.script, this.output.satoshisBN);
  }
  /**
   * @returns true if this is a coinbase input (represents no input)
   */


  isNull() {
    return this.prevTxId.toString('hex') === '0000000000000000000000000000000000000000000000000000000000000000' && this.outputIndex === 0xffffffff;
  }

  _estimateSize() {
    return this.toBufferWriter().toBuffer().length;
  }

}

Input.MAXINT = MAXINT;
Input.DEFAULT_SEQNUMBER = DEFAULT_SEQNUMBER;
Input.DEFAULT_LOCKTIME_SEQNUMBER = DEFAULT_LOCKTIME_SEQNUMBER;
Input.DEFAULT_RBF_SEQNUMBER = DEFAULT_RBF_SEQNUMBER;

/**
 * @desc
 * Wrapper around Signature with fields related to signing a transaction specifically
 *
 * @param {Object|string|TransactionSignature} arg
 * @constructor
 */

class TransactionSignature extends Signature {
  constructor(arg) {
    super(arg);

    if (arg instanceof TransactionSignature) {
      return arg;
    }

    if (_.isObject(arg)) {
      return this._fromObject(arg);
    }

    throw new errors.InvalidArgument('TransactionSignatures must be instantiated from an object');
  }

  _fromObject(arg) {
    TransactionSignature._checkObjectArgs(arg);

    this.publicKey = new PublicKey(arg.publicKey);
    this.prevTxId = BufferUtil.isBuffer(arg.prevTxId) ? arg.prevTxId : Buffer.from(arg.prevTxId, 'hex');
    this.outputIndex = arg.outputIndex;
    this.inputIndex = arg.inputIndex;

    if (arg.signature instanceof Signature) {
      this.signature = arg.signature;
    } else if (BufferUtil.isBuffer(arg.signature)) {
      this.signature = Signature.fromBuffer(arg.signature);
    } else {
      this.signature = Signature.fromString(arg.signature);
    }

    this.sigtype = arg.sigtype;
    return this;
  }

  static _checkObjectArgs(arg) {
    preconditions.checkArgument(PublicKey(arg.publicKey), 'publicKey');
    preconditions.checkArgument(!_.isUndefined(arg.inputIndex), 'inputIndex');
    preconditions.checkArgument(!_.isUndefined(arg.outputIndex), 'outputIndex');
    preconditions.checkState(_.isNumber(arg.inputIndex), 'inputIndex must be a number');
    preconditions.checkState(_.isNumber(arg.outputIndex), 'outputIndex must be a number');
    preconditions.checkArgument(arg.signature, 'signature');
    preconditions.checkArgument(arg.prevTxId, 'prevTxId');
    preconditions.checkState(arg.signature instanceof Signature || BufferUtil.isBuffer(arg.signature) || JSUtil.isHexa(arg.signature), 'signature must be a buffer or hexa value');
    preconditions.checkState(BufferUtil.isBuffer(arg.prevTxId) || JSUtil.isHexa(arg.prevTxId), 'prevTxId must be a buffer or hexa value');
    preconditions.checkArgument(arg.sigtype, 'sigtype');
    preconditions.checkState(_.isNumber(arg.sigtype), 'sigtype must be a number');
  }
  /**
   * Serializes a transaction to a plain JS object
   * @return {Object}
   */


  toJSON() {
    return {
      publicKey: this.publicKey.toString(),
      prevTxId: this.prevTxId.toString('hex'),
      outputIndex: this.outputIndex,
      inputIndex: this.inputIndex,
      signature: this.signature.toString(),
      sigtype: this.sigtype
    };
  }

  toObject() {
    return this.toJSON();
  }
  /**
   * Builds a TransactionSignature from an object
   * @param {Object} object
   * @return {TransactionSignature}
   */


  static fromObject(object) {
    preconditions.checkArgument(object);
    return new TransactionSignature(object);
  }

}

class MultiSigScriptHashInput extends Input {
  constructor(input, pubkeys, threshold, signatures, redeemScript) {
    super(input, pubkeys, threshold, signatures, redeemScript);
    var self = this;
    pubkeys = pubkeys || input.publicKeys;
    this.threshold = threshold || input.threshold;
    signatures = signatures || input.signatures;
    this.publicKeys = _.sortBy(pubkeys, publicKey => publicKey.toString('hex'));
    this.redeemScript = redeemScript || Script.buildMultisigOut(this.publicKeys, this.threshold); // $.checkState(
    //   Script.buildScriptHashOut(this.redeemScript).equals(this.output.script),
    //   'RedeemScript does not hash to the provided output'
    // )

    this.publicKeyIndex = {};
    this.publicKeys.forEach((publicKey, index) => {
      self.publicKeyIndex[publicKey.toString()] = index;
    }); // Empty array of signatures

    this.signatures = signatures ? this._deserializeSignatures(signatures) : new Array(this.publicKeys.length);
  }

  toObject() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var obj = Input.prototype.toObject.apply(this, args);
    obj.threshold = this.threshold;
    obj.publicKeys = this.publicKeys.map(publicKey => publicKey.toString());
    obj.signatures = this._serializeSignatures();
    return obj;
  }

  _deserializeSignatures(signatures) {
    return signatures.map(signature => signature ? new TransactionSignature(signature) : undefined);
  }

  _serializeSignatures() {
    return this.signatures.map(signature => signature ? signature.toObject() : undefined);
  } // eslint-disable-next-line max-len


  getSignatures(transaction, privateKey, index, sigtype) {
    preconditions.checkState(this.output instanceof Output, 'Malformed output found when signing transaction');
    sigtype = sigtype || Signature.SIGHASH_ALL | Signature.SIGHASH_FORKID;
    var publicKeysForPrivateKey = this.publicKeys.filter(publicKey => publicKey.toString() === privateKey.publicKey.toString());
    return publicKeysForPrivateKey.map(publicKey => new TransactionSignature({
      publicKey,
      prevTxId: this.prevTxId,
      outputIndex: this.outputIndex,
      inputIndex: index,
      signature: Sighash.sign(transaction, privateKey, sigtype, index, this.redeemScript, this.output.satoshisBN),
      sigtype
    }));
  }

  addSignature(transaction, signature) {
    preconditions.checkState(!this.isFullySigned(), 'All needed signatures have already been added');
    preconditions.checkArgument(this.publicKeyIndex[signature.publicKey.toString()] !== undefined, 'Signature has no matching public key');
    preconditions.checkState(this.isValidSignature(transaction, signature), 'Signature invalid');
    this.signatures[this.publicKeyIndex[signature.publicKey.toString()]] = signature;

    this._updateScript();

    return this;
  }

  _updateScript() {
    this.setScript(Script.buildP2SHMultisigIn(this.publicKeys, this.threshold, this._createSignatures(), {
      cachedMultisig: this.redeemScript
    }));
    return this;
  }

  _createSignatures() {
    var definedSignatures = this.signatures.filter(signature => signature !== undefined);
    return definedSignatures.map(signature => BufferUtil.concat([signature.signature.toDER(), BufferUtil.integerAsSingleByteBuffer(signature.sigtype)]));
  }

  clearSignatures() {
    this.signatures = new Array(this.publicKeys.length);

    this._updateScript();
  }

  isFullySigned() {
    return this.countSignatures() === this.threshold;
  }

  countMissingSignatures() {
    return this.threshold - this.countSignatures();
  }

  countSignatures() {
    return this.signatures.reduce((sum, signature) => sum + !!signature, 0);
  }

  publicKeysWithoutSignature() {
    return this.publicKeys.filter(publicKey => !this.signatures[this.publicKeyIndex[publicKey.toString()]]);
  }

  isValidSignature(transaction, signature) {
    // FIXME: Refactor signature so this is not necessary
    signature.signature.nhashtype = signature.sigtype;
    return Sighash.verify(transaction, signature.signature, signature.publicKey, signature.inputIndex, this.redeemScript, this.output.satoshisBN);
  }

  _estimateSize() {
    return MultiSigScriptHashInput.OPCODES_SIZE + this.threshold * MultiSigScriptHashInput.SIGNATURE_SIZE + this.publicKeys.length * MultiSigScriptHashInput.PUBKEY_SIZE;
  }

}

MultiSigScriptHashInput.OPCODES_SIZE = 7; // serialized size (<=3) + 0 .. N .. M OP_CHECKMULTISIG

MultiSigScriptHashInput.SIGNATURE_SIZE = 74; // size (1) + DER (<=72) + sighash (1)

MultiSigScriptHashInput.PUBKEY_SIZE = 34; // size (1) + DER (<=33)

class MultiSigInput extends Input {
  constructor(input, pubkeys, threshold, signatures) {
    super(input, pubkeys, threshold, signatures);
    pubkeys = pubkeys || input.publicKeys;
    this.threshold = threshold || input.threshold;
    signatures = signatures || input.signatures;
    this.publicKeys = _.sortBy(pubkeys, publicKey => publicKey.toString('hex')); // $.checkState(
    //   Script.buildMultisigOut(this.publicKeys, this.threshold).equals(this.output.script),
    //   "Provided public keys don't match to the provided output script"
    // )

    this.publicKeyIndex = {};
    this.publicKeys.forEach((publicKey, index) => {
      this.publicKeyIndex[publicKey.toString()] = index;
    }); // Empty array of signatures

    this.signatures = signatures ? this._deserializeSignatures(signatures) : new Array(this.publicKeys.length);
  }

  toObject() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var obj = Input.prototype.toObject.apply(this, args);
    obj.threshold = this.threshold;
    obj.publicKeys = this.publicKeys.map(publicKey => publicKey.toString());
    obj.signatures = this._serializeSignatures();
    return obj;
  }

  _deserializeSignatures(signatures) {
    return signatures.map(signature => signature ? new TransactionSignature(signature) : undefined);
  }

  _serializeSignatures() {
    return this.signatures.map(signature => signature ? signature.toObject() : undefined);
  }

  getSignatures(transaction, privateKey, index, sigtype) {
    preconditions.checkState(this.output instanceof Output, 'Malformed output found when signing transaction');
    sigtype = sigtype || Signature.SIGHASH_ALL | Signature.SIGHASH_FORKID;
    var publicKeysForPrivateKey = this.publicKeys.filter(publicKey => publicKey.toString() === privateKey.publicKey.toString());
    return publicKeysForPrivateKey.map(publicKey => new TransactionSignature({
      publicKey,
      prevTxId: this.prevTxId,
      outputIndex: this.outputIndex,
      inputIndex: index,
      signature: Sighash.sign(transaction, privateKey, sigtype, index, this.output.script, this.output.satoshisBN),
      sigtype
    }));
  }

  addSignature(transaction, signature) {
    preconditions.checkState(!this.isFullySigned(), 'All needed signatures have already been added');
    preconditions.checkArgument(this.publicKeyIndex[signature.publicKey.toString()] !== undefined, 'Signature has no matching public key');
    preconditions.checkState(this.isValidSignature(transaction, signature), 'Signature invalid');
    this.signatures[this.publicKeyIndex[signature.publicKey.toString()]] = signature;

    this._updateScript();

    return this;
  }

  _updateScript() {
    this.setScript(Script.buildMultisigIn(this.publicKeys, this.threshold, this._createSignatures()));
    return this;
  }

  _createSignatures() {
    var definedSignatures = this.signatures.filter(signature => signature !== undefined);
    return definedSignatures.map(signature => BufferUtil.concat([signature.signature.toDER(), BufferUtil.integerAsSingleByteBuffer(signature.sigtype)]));
  }

  clearSignatures() {
    this.signatures = new Array(this.publicKeys.length);

    this._updateScript();
  }

  isFullySigned() {
    return this.countSignatures() === this.threshold;
  }

  countMissingSignatures() {
    return this.threshold - this.countSignatures();
  }

  countSignatures() {
    return this.signatures.reduce((sum, signature) => sum + !!signature, 0);
  }

  publicKeysWithoutSignature() {
    return this.publicKeys.filter(publicKey => !this.signatures[this.publicKeyIndex[publicKey.toString()]]);
  }

  isValidSignature(transaction, signature) {
    // FIXME: Refactor signature so this is not necessary
    signature.signature.nhashtype = signature.sigtype;
    return Sighash.verify(transaction, signature.signature, signature.publicKey, signature.inputIndex, this.output.script, this.output.satoshisBN);
  }
  /**
   * @param {Buffer[]} signatures
   * @param {PublicKey[]} publicKeys
   * @param {Transaction} transaction
   * @param {Integer} inputIndex
   * @param {Input} input
   * @returns {TransactionSignature[]}
   */
  // eslint-disable-next-line max-len


  static normalizeSignatures(transaction, input, inputIndex, signatures, publicKeys) {
    return publicKeys.map(pubKey => {
      var signatureMatch = null;
      signatures = signatures.filter(signatureBuffer => {
        if (signatureMatch) {
          return true;
        }

        var signature = new TransactionSignature({
          signature: Signature.fromTxFormat(signatureBuffer),
          publicKey: pubKey,
          prevTxId: input.prevTxId,
          outputIndex: input.outputIndex,
          inputIndex,
          sigtype: Signature.SIGHASH_ALL
        });
        signature.signature.nhashtype = signature.sigtype;
        var isMatch = Sighash.verify(transaction, signature.signature, signature.publicKey, signature.inputIndex, input.output.script);

        if (isMatch) {
          signatureMatch = signature;
          return false;
        }

        return true;
      });
      return signatureMatch || null;
    });
  }

  _estimateSize() {
    return MultiSigInput.OPCODES_SIZE + this.threshold * MultiSigInput.SIGNATURE_SIZE;
  }

}

MultiSigInput.OPCODES_SIZE = 1; // 0

MultiSigInput.SIGNATURE_SIZE = 73; // size (1) + DER (<=72)

/**
 * Represents a special kind of input of PayToPublicKey kind.
 */

class PublicKeyInput extends Input {
  /**
   * @param {Transaction} transaction - the transaction to be signed
   * @param {PrivateKey} privateKey - the private key with which to sign the transaction
   * @param {number} index - the index of the input in the transaction input vector
   * @param {number=} sigtype - the type of signature, defaults to Signature.SIGHASH_ALL
   * @return {Array} of objects that can be
   */
  getSignatures(transaction, privateKey, index, sigtype) {
    preconditions.checkState(this.output instanceof Output, 'Malformed output found when signing transaction');
    sigtype = sigtype || Signature.SIGHASH_ALL | Signature.SIGHASH_FORKID;
    var publicKey = privateKey.toPublicKey();

    if (publicKey.toString() === this.output.script.getPublicKey().toString('hex')) {
      return [new TransactionSignature({
        publicKey,
        prevTxId: this.prevTxId,
        outputIndex: this.outputIndex,
        inputIndex: index,
        signature: Sighash.sign(transaction, privateKey, sigtype, index, this.output.script, this.output.satoshisBN),
        sigtype
      })];
    }

    return [];
  }
  /**
   * Add the provided signature
   *
   * @param {Object} signature
   * @param {PublicKey} signature.publicKey
   * @param {Signature} signature.signature
   * @param {number=} signature.sigtype
   * @return {PublicKeyInput} this, for chaining
   */


  addSignature(transaction, signature) {
    preconditions.checkState(this.isValidSignature(transaction, signature), 'Signature invalid');
    this.setScript(Script.buildPublicKeyIn(signature.signature.toDER(), signature.sigtype));
    return this;
  }
  /**
   * Clear the input's signature
   * @return {PublicKeyHashInput} this, for chaining
   */


  clearSignatures() {
    this.setScript(Script.empty());
    return this;
  }
  /**
   * Query whether the input is signed
   * @return {boolean}
   */


  isFullySigned() {
    return this.script.isPublicKeyIn();
  }

  _estimateSize() {
    return PublicKeyInput.SCRIPT_MAX_SIZE;
  }

}

PublicKeyInput.SCRIPT_MAX_SIZE = 73; // sigsize (1 + 72)

/**
 * Represents a special kind of input of PayToPublicKeyHash kind.
 */

class PublicKeyHashInput extends Input {
  /**
   * @param {Transaction} transaction - the transaction to be signed
   * @param {PrivateKey} privateKey - the private key with which to sign the transaction
   * @param {number} index - the index of the input in the transaction input vector
   * @param {number=} sigtype - the type of signature, defaults to Signature.SIGHASH_ALL
   * @param {Buffer=} hashData - the precalculated hash of the public key associated with the
   *   privateKey provided
   * @return {Array} of objects that can be
   */
  // eslint-disable-next-line max-len
  getSignatures(transaction, privateKey, index, sigtype, hashData) {
    preconditions.checkState(this.output instanceof Output, 'Malformed output found when signing transaction');
    hashData = hashData || Hash.sha256ripemd160(privateKey.publicKey.toBuffer());
    sigtype = sigtype || Signature.SIGHASH_ALL | Signature.SIGHASH_FORKID;

    if (BufferUtil.equals(hashData, this.output.script.getPublicKeyHash())) {
      return [new TransactionSignature({
        publicKey: privateKey.toPublicKey(),
        prevTxId: this.prevTxId,
        outputIndex: this.outputIndex,
        inputIndex: index,
        signature: Sighash.sign(transaction, privateKey, sigtype, index, this.output.script, this.output.satoshisBN),
        sigtype
      })];
    }

    return [];
  }
  /**
   * Add the provided signature
   *
   * @param {Object} signature
   * @param {PublicKey} signature.publicKey
   * @param {Signature} signature.signature
   * @param {number=} signature.sigtype
   * @return {PublicKeyHashInput} this, for chaining
   */


  addSignature(transaction, signature) {
    preconditions.checkState(this.isValidSignature(transaction, signature), 'Signature invalid');
    var script = Script.buildPublicKeyHashIn(signature.publicKey, signature.signature.toDER(), signature.sigtype);
    this.setScript(script);
    return this;
  }
  /**
   * Clear the input's signature
   * @return {PublicKeyHashInput} this, for chaining
   */


  clearSignatures() {
    this.setScript(Script.empty());
    return this;
  }
  /**
   * Query whether the input is signed
   * @return {boolean}
   */


  isFullySigned() {
    return this.script.isPublicKeyHashIn();
  }

  _estimateSize() {
    return PublicKeyHashInput.SCRIPT_MAX_SIZE;
  }

}

PublicKeyHashInput.SCRIPT_MAX_SIZE = 73 + 34; // sigsize (1 + 72) + pubkey (1 + 33)

var UNITS = {
  BTC: [1e8, 8],
  mBTC: [1e5, 5],
  uBTC: [1e2, 2],
  bits: [1e2, 2],
  satoshis: [1, 0]
};
/**
 * Utility for handling and converting bitcoins units. The supported units are
 * BTC, mBTC, bits (also named uBTC) and satoshis. A unit instance can be created with an
 * amount and a unit code, or alternatively using static methods like {fromBTC}.
 * It also allows to be created from a fiat amount and the exchange rate, or
 * alternatively using the {fromFiat} static method.
 * You can consult for different representation of a unit instance using it's
 * {to} method, the fixed unit methods like {toSatoshis} or alternatively using
 * the unit accessors. It also can be converted to a fiat amount by providing the
 * corresponding BTC/fiat exchange rate.
 *
 * @example
 * ```javascript
 * var sats = Unit.fromBTC(1.3).toSatoshis();
 * var mili = Unit.fromBits(1.3).to(Unit.mBTC);
 * var bits = Unit.fromFiat(1.3, 350).bits;
 * var btc = new Unit(1.3, Unit.bits).BTC;
 * ```
 *
 * @param {Number} amount - The amount to be represented
 * @param {String|Number} code - The unit of the amount or the exchange rate
 * @returns {Unit} A new instance of an Unit
 * @constructor
 */

function Unit(amount, code) {
  if (!(this instanceof Unit)) {
    return new Unit(amount, code);
  } // convert fiat to BTC


  if (_.isNumber(code)) {
    if (code <= 0) {
      throw new errors.Unit.InvalidRate(code);
    }

    amount /= code;
    code = Unit.BTC;
  }

  this._value = this._from(amount, code);
  var self = this;

  var defineAccesor = function defineAccesor(key) {
    Object.defineProperty(self, key, {
      get() {
        return self.to(key);
      },

      enumerable: true
    });
  };

  Object.keys(UNITS).forEach(defineAccesor);
}

Object.keys(UNITS).forEach(key => {
  Unit[key] = key;
});
/**
 * Returns a Unit instance created from JSON string or object
 *
 * @param {String|Object} json - JSON with keys: amount and code
 * @returns {Unit} A Unit instance
 */

Unit.fromObject = function fromObject(data) {
  preconditions.checkArgument(_.isObject(data), 'Argument is expected to be an object');
  return new Unit(data.amount, data.code);
};
/**
 * Returns a Unit instance created from an amount in BTC
 *
 * @param {Number} amount - The amount in BTC
 * @returns {Unit} A Unit instance
 */


Unit.fromBTC = function (amount) {
  return new Unit(amount, Unit.BTC);
};
/**
 * Returns a Unit instance created from an amount in mBTC
 *
 * @param {Number} amount - The amount in mBTC
 * @returns {Unit} A Unit instance
 */


Unit.fromMilis = function (amount) {
  return new Unit(amount, Unit.mBTC);
};

Unit.fromMillis = Unit.fromMilis;
/**
 * Returns a Unit instance created from an amount in bits
 *
 * @param {Number} amount - The amount in bits
 * @returns {Unit} A Unit instance
 */

Unit.fromBits = function (amount) {
  return new Unit(amount, Unit.bits);
};

Unit.fromMicros = Unit.fromBits;
/**
 * Returns a Unit instance created from an amount in satoshis
 *
 * @param {Number} amount - The amount in satoshis
 * @returns {Unit} A Unit instance
 */

Unit.fromSatoshis = function (amount) {
  return new Unit(amount, Unit.satoshis);
};
/**
 * Returns a Unit instance created from a fiat amount and exchange rate.
 *
 * @param {Number} amount - The amount in fiat
 * @param {Number} rate - The exchange rate BTC/fiat
 * @returns {Unit} A Unit instance
 */


Unit.fromFiat = function (amount, rate) {
  return new Unit(amount, rate);
};

Unit.prototype._from = function (amount, code) {
  if (!UNITS[code]) {
    throw new errors.Unit.UnknownCode(code);
  }

  return parseInt((amount * UNITS[code][0]).toFixed(), 10);
};
/**
 * Returns the value represented in the specified unit
 *
 * @param {String|Number} code - The unit code or exchange rate
 * @returns {Number} The converted value
 */


Unit.prototype.to = function (code) {
  if (_.isNumber(code)) {
    if (code <= 0) {
      throw new errors.Unit.InvalidRate(code);
    }

    return parseFloat((this.BTC * code).toFixed(2));
  }

  if (!UNITS[code]) {
    throw new errors.Unit.UnknownCode(code);
  }

  var value = this._value / UNITS[code][0];
  return parseFloat(value.toFixed(UNITS[code][1]));
};
/**
 * Returns the value represented in BTC
 *
 * @returns {Number} The value converted to BTC
 */


Unit.prototype.toBTC = function () {
  return this.to(Unit.BTC);
};
/**
 * Returns the value represented in mBTC
 *
 * @returns {Number} The value converted to mBTC
 */


Unit.prototype.toMilis = function () {
  return this.to(Unit.mBTC);
};

Unit.prototype.toMillis = Unit.prototype.toMilis;
/**
 * Returns the value represented in bits
 *
 * @returns {Number} The value converted to bits
 */

Unit.prototype.toBits = function () {
  return this.to(Unit.bits);
};

Unit.prototype.toMicros = Unit.prototype.toBits;
/**
 * Returns the value represented in satoshis
 *
 * @returns {Number} The value converted to satoshis
 */

Unit.prototype.toSatoshis = function () {
  return this.to(Unit.satoshis);
};
/**
 * Returns the value represented in fiat
 *
 * @param {string} rate - The exchange rate between BTC/currency
 * @returns {Number} The value converted to satoshis
 */


Unit.prototype.atRate = function (rate) {
  return this.to(rate);
};
/**
 * Returns a the string representation of the value in satoshis
 *
 * @returns {string} the value in satoshis
 */


Unit.prototype.toString = function () {
  return "".concat(this.satoshis, " satoshis");
};
/**
 * Returns a plain object representation of the Unit
 *
 * @returns {Object} An object with the keys: amount and code
 */


Unit.prototype.toJSON = function toObject() {
  return {
    amount: this.BTC,
    code: Unit.BTC
  };
};

Unit.prototype.toObject = Unit.prototype.toJSON;
/**
 * Returns a string formatted for the console
 *
 * @returns {string} the value in satoshis
 */

Unit.prototype.inspect = function () {
  return "<Unit: ".concat(this.toString(), ">");
};

/**
 * Represents an unspent output information: its script, associated amount and address,
 * transaction id and output index.
 *
 * @constructor
 * @param {object} data
 * @param {string} data.txid the previous transaction id
 * @param {string=} data.txId alias for `txid`
 * @param {number} data.vout the index in the transaction
 * @param {number=} data.outputIndex alias for `vout`
 * @param {string|Script} data.scriptPubKey the script that must be resolved to release the funds
 * @param {string|Script=} data.script alias for `scriptPubKey`
 * @param {number} data.amount amount of bitcoins associated
 * @param {number=} data.satoshis alias for `amount`, but expressed in satoshis
 *   (1 BTC = 1e8 satoshis)
 * @param {string|Address=} data.address the associated address to the script, if provided
 */

class UnspentOutput {
  constructor(data) {
    preconditions.checkArgument(_.isObject(data), 'Must provide an object from where to extract data');
    var address = data.address ? new Address(data.address) : undefined;
    var txId = data.txid ? data.txid : data.txId;

    if (!txId || !JSUtil.isHexaString(txId) || txId.length > 64) {
      // TODO: Use the errors library
      throw new Error('Invalid TXID in object', data);
    }

    var outputIndex = _.isUndefined(data.vout) ? data.outputIndex : data.vout;

    if (!_.isNumber(outputIndex)) {
      throw new Error("Invalid outputIndex, received ".concat(outputIndex));
    }

    preconditions.checkArgument(!_.isUndefined(data.scriptPubKey) || !_.isUndefined(data.script), 'Must provide the scriptPubKey for that output!');
    var script = new Script(data.scriptPubKey || data.script);
    preconditions.checkArgument(!_.isUndefined(data.amount) || !_.isUndefined(data.satoshis), 'Must provide an amount for the output');
    var amount = !_.isUndefined(data.amount) ? Unit.fromBTC(data.amount).toSatoshis() : data.satoshis;
    preconditions.checkArgument(_.isNumber(amount), 'Amount must be a number');
    JSUtil.defineImmutable(this, {
      address,
      txId,
      outputIndex,
      script,
      satoshis: amount
    });
  }
  /**
   * Provide an informative output when displaying this object in the console
   * @returns string
   */


  inspect() {
    var unspent = "UnspentOutput: ".concat(this.txId, ":").concat(this.outputIndex);
    var satoshis = "satoshis: ".concat(this.satoshis);
    var address = "address: ".concat(this.address);
    return "<".concat(unspent, ", ").concat(satoshis, ", ").concat(address, ">");
  }
  /**
   * String representation: just "txid:index"
   * @returns string
   */


  toString() {
    return "".concat(this.txId, ":").concat(this.outputIndex);
  }
  /**
   * Deserialize an UnspentOutput from an object
   * @param {object|string} data
   * @return UnspentOutput
   */


  static fromObject(data) {
    return new UnspentOutput(data);
  }
  /**
   * Returns a plain object (no prototype or methods) with the associated info for this output
   * @return {object}
   */


  toJSON() {
    return {
      address: this.address ? this.address.toString() : undefined,
      txid: this.txId,
      vout: this.outputIndex,
      scriptPubKey: this.script.toBuffer().toString('hex'),
      amount: Unit.fromSatoshis(this.satoshis).toBTC()
    };
  }

  toObject() {
    return this.toJSON();
  }

}

var compare = Buffer.compare || bufferCompare;
var CURRENT_VERSION = 1;
var DEFAULT_NLOCKTIME = 0;
var MAX_BLOCK_SIZE = 1000000;
/**
 * Represents a transaction, a set of inputs and outputs to change ownership of tokens
 *
 * @param {*} serialized
 * @constructor
 */

class Transaction {
  constructor(serialized) {
    this.inputs = [];
    this.outputs = [];
    this._inputAmount = undefined;
    this._outputAmount = undefined;

    if (serialized) {
      if (serialized instanceof Transaction) {
        return Transaction.shallowCopy(serialized);
      }

      if (JSUtil.isHexa(serialized)) {
        this.fromString(serialized);
      } else if (BufferUtil.isBuffer(serialized)) {
        this.fromBuffer(serialized);
      } else if (_.isObject(serialized)) {
        this.fromObject(serialized);
      } else {
        throw new errors.InvalidArgument('Must provide an object or string to deserialize a transaction');
      }
    } else {
      this._newTransaction();
    }
  }

  get hash() {
    return new BufferReader(this._getHash()).readReverse().toString('hex');
  }

  get id() {
    return new BufferReader(this._getHash()).readReverse().toString('hex');
  }

  get inputAmount() {
    return this._getInputAmount();
  }

  get outputAmount() {
    return this._getOutputAmount();
  }
  /**
   * Retrieve the little endian hash of the transaction (used for serialization)
   * @return {Buffer}
   */


  _getHash() {
    return Hash.sha256sha256(this.toBuffer());
  }
  /**
   * Retrieve a hexa string that can be used with bitcoind's CLI interface
   * (decoderawtransaction, sendrawtransaction)
   *
   * @param {Object|boolean=} unsafe if true, skip all tests. if it's an object,
   *   it's expected to contain a set of flags to skip certain tests:
   * * `disableAll`: disable all checks
   * * `disableSmallFees`: disable checking for fees that are too small
   * * `disableLargeFees`: disable checking for fees that are too large
   * * `disableIsFullySigned`: disable checking if all inputs are fully signed
   * * `disableDustOutputs`: disable checking if there are no outputs that are dust amounts
   * * `disableMoreOutputThanInput`: disable checking if the transaction spends more bitcoins than
   *    the sum of the input amounts
   * @return {string}
   */


  serialize(unsafe) {
    if (unsafe === true || unsafe && unsafe.disableAll) {
      return this.uncheckedSerialize();
    }

    return this.checkedSerialize(unsafe);
  }

  toString() {
    return this.toBuffer().toString('hex');
  }

  uncheckedSerialize() {
    return this.toString();
  }
  /**
   * Retrieve a hexa string that can be used with bitcoind's CLI interface
   * (decoderawtransaction, sendrawtransaction)
   *
   * @param {Object} opts allows to skip certain tests. {@see Transaction#serialize}
   * @return {string}
   */


  checkedSerialize(opts) {
    var serializationError = this.getSerializationError(opts);

    if (serializationError) {
      serializationError.message += ' - For more information please see: https://bitcore.io/api/lib/transaction#serialization-checks';
      throw serializationError;
    }

    return this.uncheckedSerialize();
  }

  invalidSatoshis() {
    return this.outputs.some(output => output.invalidSatoshis());
  }
  /**
   * Retrieve a possible error that could appear when trying to serialize and
   * broadcast this transaction.
   *
   * @param {Object} opts allows to skip certain tests. {@see Transaction#serialize}
   * @return {bitcore.Error}
   */


  getSerializationError() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (this.invalidSatoshis()) {
      return new errors.Transaction.InvalidSatoshis();
    }

    var unspent = this._getUnspentValue();

    var unspentError;

    if (unspent < 0) {
      if (!opts.disableMoreOutputThanInput) {
        unspentError = new errors.Transaction.InvalidOutputAmountSum();
      }
    } else {
      unspentError = this._hasFeeError(opts, unspent);
    }

    return unspentError || this._hasDustOutputs(opts) || this._isMissingSignatures(opts);
  }

  _hasFeeError(opts, unspent) {
    if (this._fee !== undefined && this._fee !== unspent) {
      return new errors.Transaction.FeeError.Different("Unspent value is ".concat(unspent, " but specified fee is ").concat(this._fee));
    }

    if (!opts.disableLargeFees) {
      var maximumFee = Math.floor(Transaction.FEE_SECURITY_MARGIN * this._estimateFee());

      if (unspent > maximumFee) {
        if (this._missingChange()) {
          return new errors.Transaction.ChangeAddressMissing('Fee is too large and no change address was provided');
        }

        return new errors.Transaction.FeeError.TooLarge("expected less than ".concat(maximumFee, " but got ").concat(unspent));
      }
    }

    if (!opts.disableSmallFees) {
      var minimumFee = Math.ceil(this._estimateFee() / Transaction.FEE_SECURITY_MARGIN);

      if (unspent < minimumFee) {
        return new errors.Transaction.FeeError.TooSmall("expected more than ".concat(minimumFee, " but got ").concat(unspent));
      }
    }

    return undefined;
  }

  _missingChange() {
    return !this._changeScript;
  }

  _hasDustOutputs(opts) {
    if (!opts.disableDustOutputs) {
      // eslint-disable-next-line max-len
      var dustOutputs = this.outputs.filter(output => output.satoshis < Transaction.DUST_AMOUNT && !output.script.isDataOut());

      if (dustOutputs.length > 0) {
        return new errors.Transaction.DustOutputs();
      }
    }

    return undefined;
  }

  _isMissingSignatures(opts) {
    if (!opts.disableIsFullySigned && !this.isFullySigned()) {
      return new errors.Transaction.MissingSignatures();
    }

    return undefined;
  }

  inspect() {
    return "<Transaction: ".concat(this.uncheckedSerialize(), ">");
  }

  toBuffer() {
    var writer = new BufferWriter();
    return this.toBufferWriter(writer).toBuffer();
  }

  toBufferWriter(writer) {
    writer.writeInt32LE(this.version);
    writer.writeVarintNum(this.inputs.length);
    this.inputs.forEach(input => input.toBufferWriter(writer));
    writer.writeVarintNum(this.outputs.length);
    this.outputs.forEach(output => output.toBufferWriter(writer));
    writer.writeUInt32LE(this.nLockTime);
    return writer;
  }

  fromBuffer(buffer) {
    var reader = new BufferReader(buffer);
    return this.fromBufferReader(reader);
  }

  fromBufferReader(reader) {
    preconditions.checkArgument(!reader.finished(), 'No transaction data received when creating transaction from buffer');
    var i;
    this.version = reader.readInt32LE();
    var sizeTxIns = reader.readVarintNum();

    for (i = 0; i < sizeTxIns; i += 1) {
      var input = Input.fromBufferReader(reader);
      this.inputs.push(input);
    }

    var sizeTxOuts = reader.readVarintNum();

    for (i = 0; i < sizeTxOuts; i += 1) {
      this.outputs.push(Output.fromBufferReader(reader));
    }

    this.nLockTime = reader.readUInt32LE();
    return this;
  }

  toJSON() {
    var inputs = this.inputs.map(input => input.toObject());
    var outputs = this.outputs.map(output => output.toObject());
    var obj = {
      hash: this.hash,
      version: this.version,
      inputs,
      outputs,
      nLockTime: this.nLockTime
    };

    if (this._changeScript) {
      obj.changeScript = this._changeScript.toString();
    }

    if (this._changeIndex !== undefined) {
      obj.changeIndex = this._changeIndex;
    }

    if (this._fee !== undefined) {
      obj.fee = this._fee;
    }

    if (this._dataInputs !== undefined) {
      obj.dataInputs = this._dataInputs;
    }

    if (this._dataOutputs !== undefined) {
      obj.dataOutputs = this._dataOutputs;
    }

    return obj;
  }

  toObject() {
    return this.toJSON();
  }

  fromObject(arg) {
    preconditions.checkArgument(_.isObject(arg) || arg instanceof Transaction);
    var transaction = arg instanceof Transaction ? arg.toObject() : arg;
    transaction.inputs.forEach(input => {
      if (!input.output || !input.output.script) {
        this.uncheckedAddInput(new Input(input));
        return;
      }

      var script = new Script(input.output.script);
      var txin;

      if (script.isPublicKeyHashOut()) {
        txin = new PublicKeyHashInput(input);
      } else if (script.isScriptHashOut() && input.publicKeys && input.threshold) {
        txin = new MultiSigScriptHashInput(input, input.publicKeys, input.threshold, input.signatures);
      } else if (script.isPublicKeyOut()) {
        txin = new PublicKeyInput(input);
      } else {
        throw new errors.Transaction.Input.UnsupportedScript(input.output.script);
      }

      this.addInput(txin);
    });
    transaction.outputs.forEach(output => this.addOutput(new Output(output)));

    if (transaction.changeIndex) {
      this._changeIndex = transaction.changeIndex;
    }

    if (transaction.changeScript) {
      this._changeScript = new Script(transaction.changeScript);
    }

    if (transaction.fee) {
      this._fee = transaction.fee;
    }

    this.nLockTime = transaction.nLockTime;
    this.version = transaction.version;

    this._checkConsistency(arg);

    return this;
  }

  _checkConsistency(arg) {
    if (this._changeIndex !== undefined) {
      preconditions.checkState(this._changeScript, 'Change script missing');
      preconditions.checkState(this.outputs[this._changeIndex], 'Change output missing');
      preconditions.checkState(this.outputs[this._changeIndex].script.toString() === this._changeScript.toString(), 'Script in argument does not match script in transaction');
    }

    if (arg && arg.hash) {
      preconditions.checkState(arg.hash === this.hash, 'Hash in argument does not match transaction hash');
    }
  }
  /**
   * Sets nLockTime so that transaction is not valid until the desired date(a
   * timestamp in seconds since UNIX epoch is also accepted)
   *
   * @param {Date | Number} time
   * @return {Transaction} this
   */


  lockUntilDate(time) {
    preconditions.checkArgument(time);

    if (_.isNumber(time) && time < Transaction.NLOCKTIME_BLOCKHEIGHT_LIMIT) {
      throw new errors.Transaction.LockTimeTooEarly();
    }

    if (_.isDate(time)) {
      time = time.getTime() / 1000;
    }

    this.inputs.forEach(input => {
      if (input.sequenceNumber === Input.DEFAULT_SEQNUMBER) {
        input.sequenceNumber = Input.DEFAULT_LOCKTIME_SEQNUMBER;
      }
    });
    this.nLockTime = time;
    return this;
  }
  /**
   * Sets nLockTime so that transaction is not valid until the desired block
   * height.
   *
   * @param {Number} height
   * @return {Transaction} this
   */


  lockUntilBlockHeight(height) {
    preconditions.checkArgument(_.isNumber(height), 'Block height must be a number');

    if (height >= Transaction.NLOCKTIME_BLOCKHEIGHT_LIMIT) {
      throw new errors.Transaction.BlockHeightTooHigh();
    }

    if (height < 0) {
      throw new errors.Transaction.NLockTimeOutOfRange();
    }

    this.inputs.forEach(input => {
      if (input.sequenceNumber === Input.DEFAULT_SEQNUMBER) {
        input.sequenceNumber = Input.DEFAULT_LOCKTIME_SEQNUMBER;
      }
    });
    this.nLockTime = height;
    return this;
  }
  /**
   *  Returns a semantic version of the transaction's nLockTime.
   *  @return {Number|Date}
   *  If nLockTime is 0, it returns null,
   *  if it is < 500000000, it returns a block height (number)
   *  else it returns a Date object.
   */


  getLockTime() {
    if (!this.nLockTime) {
      return null;
    }

    if (this.nLockTime < Transaction.NLOCKTIME_BLOCKHEIGHT_LIMIT) {
      return this.nLockTime;
    }

    return new Date(1000 * this.nLockTime);
  }

  fromString(string) {
    this.fromBuffer(Buffer.from(string, 'hex'));
  }

  _newTransaction() {
    this.version = CURRENT_VERSION;
    this.nLockTime = DEFAULT_NLOCKTIME;
  }
  /**
   * Add an input to this transaction. This is a high level interface
   * to add an input, for more control, use @{link Transaction#addInput}.
   *
   * Can receive, as output information, the output of bitcoind's `listunspent` command,
   * and a slightly fancier format recognized by bitcore:
   *
   * ```
   * {
   *  address: 'mszYqVnqKoQx4jcTdJXxwKAissE3Jbrrc1',
   *  txId: 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
   *  outputIndex: 0,
   *  script: Script.empty(),
   *  satoshis: 1020000
   * }
   * ```
   * Where `address` can be either a string or a bitcore Address object. The
   * same is true for `script`, which can be a string or a bitcore Script.
   *
   * Beware that this resets all the signatures for inputs (in further versions,
   * SIGHASH_SINGLE or SIGHASH_NONE signatures will not be reset).
   *
   * @example
   * ```javascript
   * var transaction = new Transaction();
   *
   * // From a pay to public key hash output from bitcoind's listunspent
   * transaction.from({'txid': '0000...', vout: 0, amount: 0.1, scriptPubKey: 'OP_DUP ...'});
   *
   * // From a pay to public key hash output
   * transaction.from({'txId': '0000...', outputIndex: 0, satoshis: 1000, script: 'OP_DUP ...'});
   *
   * // From a multisig P2SH output
   * transaction.from({'txId': '0000...', inputIndex: 0, satoshis: 1000, script: '... OP_HASH'},
   *                  ['03000...', '02000...'], 2);
   * ```
   *
   * @param {(Array.<Transaction~fromObject>|Transaction~fromObject)} txs
   * @param {Array=} pubkeys
   * @param {number=} threshold
   */


  from(txs, pubkeys, threshold) {
    if (Array.isArray(txs)) {
      txs.forEach(tx => this.from(tx, pubkeys, threshold));
      return this;
    } // TODO: Maybe prevTxId should be a string? Or defined as read only property?
    // Check if the utxo has already been added as an input


    var utxoExists = this.inputs.some(input => input.prevTxId.toString('hex') === txs.txId && input.outputIndex === txs.outputIndex);
    var Clazz;
    var utxo = new UnspentOutput(txs);

    if (utxoExists) {
      return this; // P2SH case
    }

    if (pubkeys && threshold) {
      preconditions.checkArgument(threshold <= pubkeys.length, 'Number of signatures must be greater than the number of public keys');

      if (utxo.script.isMultisigOut()) {
        Clazz = MultiSigInput;
      } else if (utxo.script.isScriptHashOut()) {
        Clazz = MultiSigScriptHashInput;
      } else {
        Clazz = MultiSigInput;
      } // non P2SH case

    } else if (utxo.script.isPublicKeyHashOut()) {
      Clazz = PublicKeyHashInput;
    } else if (utxo.script.isPublicKeyOut()) {
      Clazz = PublicKeyInput;
    } else {
      Clazz = Input;
    }

    var input = new Clazz({
      output: new Output({
        script: utxo.script,
        satoshis: utxo.satoshis
      }),
      prevTxId: utxo.txId,
      outputIndex: utxo.outputIndex,
      script: Script.empty()
    }, pubkeys, threshold);
    this.addInput(input);
    return this;
  }
  /**
   * Add an input to this transaction. The input must be an instance of the `Input` class.
   * It should have information about the Output that it's spending, but if it's not already
   * set, two additional parameters, `outputScript` and `satoshis` can be provided.
   *
   * @param {Input} input
   * @param {String|Script} outputScript
   * @param {number} satoshis
   * @return Transaction this, for chaining
   */


  addInput(input, outputScript, satoshis) {
    preconditions.checkArgumentType(input, Input, 'Trying to add input of type other than input');

    if (!input.output && (outputScript === undefined || satoshis === undefined)) {
      throw new errors.Transaction.NeedMoreInfo('Need information about the UTXO script and satoshis');
    }

    if (!input.output && outputScript && satoshis !== undefined) {
      outputScript = outputScript instanceof Script ? outputScript : new Script(outputScript);
      preconditions.checkArgumentType(satoshis, 'number', 'Satoshis must be a number when adding input');
      input.output = new Output({
        script: outputScript,
        satoshis
      });
    }

    return this.uncheckedAddInput(input);
  }
  /**
   * Add an input to this transaction, without checking that the input has information about
   * the output that it's spending.
   *
   * @param {Input} input
   * @return Transaction this, for chaining
   */


  uncheckedAddInput(input) {
    preconditions.checkArgumentType(input, Input, 'Trying to add input of type other than input');
    this.inputs.push(input);
    this._inputAmount = undefined;

    this._updateChangeOutput();

    return this;
  }
  /**
   * Returns true if the transaction has enough info on all inputs to be correctly validated
   *
   * @return {boolean}
   */


  hasAllUtxoInfo() {
    return this.inputs.map(input => !!input.output);
  }
  /**
   * Manually set the fee for this transaction. Beware that this resets all the signatures
   * for inputs (in further versions, SIGHASH_SINGLE or SIGHASH_NONE signatures will not
   * be reset).
   *
   * @param {number} amount satoshis to be sent
   * @return {Transaction} this, for chaining
   */


  fee(amount) {
    preconditions.checkArgument(_.isNumber(amount), 'Amount must be a number');
    this._fee = amount;

    this._updateChangeOutput();

    return this;
  }
  /**
   * Manually set the fee per KB for this transaction. Beware that this resets all the signatures
   * for inputs (in further versions, SIGHASH_SINGLE or SIGHASH_NONE signatures will not
   * be reset).
   *
   * @param {number} amount satoshis per KB to be sent
   * @return {Transaction} this, for chaining
   */


  feePerKb(amount) {
    preconditions.checkArgument(_.isNumber(amount), 'Amount must be a number');
    this._feePerKb = amount;

    this._updateChangeOutput();

    return this;
  }
  /**
   * Set the change address for this transaction
   *
   * Beware that this resets all the signatures for inputs (in further versions,
   * SIGHASH_SINGLE or SIGHASH_NONE signatures will not be reset).
   *
   * @param {Address} address An address for change to be sent to.
   * @return {Transaction} this, for chaining
   */


  change(address) {
    preconditions.checkArgument(address, 'Address is required');
    this._changeScript = Script.fromAddress(address);

    this._updateChangeOutput();

    return this;
  }
  /**
   * @return {Output} change output, if it exists
   */


  getChangeOutput() {
    if (this._changeIndex !== undefined) {
      return this.outputs[this._changeIndex];
    }

    return null;
  }
  /**
   * Add an output to the transaction.
   *
   * Beware that this resets all the signatures for inputs (in further versions,
   * SIGHASH_SINGLE or SIGHASH_NONE signatures will not be reset).
   *
   * @param {(string|Address|Array.<Transaction~toObject>)} address
   * @param {number} amount in satoshis
   * @return {Transaction} this, for chaining
   */


  to(address, amount) {
    if (Array.isArray(address)) {
      var self = this;
      address.forEach(to => self.to(to.address, to.satoshis));
      return this;
    }

    preconditions.checkArgument(JSUtil.isNaturalNumber(amount), 'Amount is expected to be a positive integer');
    this.addOutput(new Output({
      script: Script(new Address(address)),
      satoshis: amount
    }));
    return this;
  }
  /**
   * Add an OP_RETURN output to the transaction.
   *
   * Beware that this resets all the signatures for inputs (in further versions,
   * SIGHASH_SINGLE or SIGHASH_NONE signatures will not be reset).
   *
   * @param {Buffer|string} value the data to be stored in the OP_RETURN output.
   *    In case of a string, the UTF-8 representation will be stored
   * @return {Transaction} this, for chaining
   */


  addData(value) {
    this.addOutput(new Output({
      script: Script.buildDataOut(value),
      satoshis: 0
    }));
    return this;
  }
  /**
   * Add an output to the transaction.
   *
   * @param {Output} output the output to add.
   * @return {Transaction} this, for chaining
   */


  addOutput(output) {
    preconditions.checkArgumentType(output, Output, 'Output needs to be of type output');

    this._addOutput(output);

    this._updateChangeOutput();

    return this;
  }
  /**
   * Remove all outputs from the transaction.
   *
   * @return {Transaction} this, for chaining
   */


  clearOutputs() {
    this.outputs = [];

    this._clearSignatures();

    this._outputAmount = undefined;
    this._changeIndex = undefined;

    this._updateChangeOutput();

    return this;
  }

  _addOutput(output) {
    this.outputs.push(output);
    this._outputAmount = undefined;
  }
  /**
   * Calculates or gets the total output amount in satoshis
   *
   * @return {Number} the transaction total output amount
   */


  _getOutputAmount() {
    if (this._outputAmount === undefined) {
      this._outputAmount = this.outputs.reduce((acc, output) => acc + output.satoshis, 0);
    }

    return this._outputAmount;
  }
  /**
   * Calculates or gets the total input amount in satoshis
   *
   * @return {Number} the transaction total input amount
   */


  _getInputAmount() {
    if (this._inputAmount === undefined) {
      var self = this;
      this._inputAmount = 0;
      this.inputs.forEach(input => {
        if (input.output === undefined) {
          throw new errors.Transaction.Input.MissingPreviousOutput();
        }

        self._inputAmount += input.output.satoshis;
      });
    }

    return this._inputAmount;
  }

  _updateChangeOutput() {
    if (!this._changeScript) {
      return;
    }

    this._clearSignatures();

    if (this._changeIndex !== undefined) {
      this._removeOutput(this._changeIndex);
    }

    var available = this._getUnspentValue();

    var fee = this.getFee();
    var changeAmount = available - fee;

    if (changeAmount > 0) {
      this._changeIndex = this.outputs.length;

      this._addOutput(new Output({
        script: this._changeScript,
        satoshis: changeAmount
      }));
    } else {
      this._changeIndex = undefined;
    }
  }
  /**
   * Calculates the fee of the transaction.
   *
   * If there's a fixed fee set, return that.
   *
   * If there is no change output set, the fee is the
   * total value of the outputs minus inputs. Note that
   * a serialized transaction only specifies the value
   * of its outputs. (The value of inputs are recorded
   * in the previous transaction outputs being spent.)
   * This method therefore raises a "MissingPreviousOutput"
   * error when called on a serialized transaction.
   *
   * If there's no fee set and no change address,
   * estimate the fee based on size.
   *
   * @return {Number} fee of this transaction in satoshis
   */


  getFee() {
    if (this.isCoinbase()) {
      return 0;
    }

    if (this._fee !== undefined) {
      return this._fee;
    } // if no change output is set, fees should equal all the unspent amount


    if (!this._changeScript) {
      return this._getUnspentValue();
    }

    return this._estimateFee();
  }
  /**
   * Estimates fee from serialized transaction size in bytes.
   */


  _estimateFee() {
    var estimatedSize = this._estimateSize();

    var available = this._getUnspentValue();

    return Transaction._estimateFee(estimatedSize, available, this._feePerKb);
  }

  _getUnspentValue() {
    return this._getInputAmount() - this._getOutputAmount();
  }

  _clearSignatures() {
    this.inputs.forEach(input => input.clearSignatures());
  }

  _estimateSize() {
    var result = this.inputs.reduce((acc, input) => acc + input._estimateSize(), Transaction.MAXIMUM_EXTRA_SIZE);
    result = this.outputs.reduce((acc, output) => acc + output.script.toBuffer().length + 9, result);
    return result;
  }

  _removeOutput(index) {
    var output = this.outputs[index];
    this.outputs = this.outputs.filter(val => val !== output);
    this._outputAmount = undefined;
  }

  removeOutput(index) {
    this._removeOutput(index);

    this._updateChangeOutput();
  }
  /**
   * Sort a transaction's inputs and outputs according to BIP69
   *
   * @see {https://github.com/bitcoin/bips/blob/master/bip-0069.mediawiki}
   * @return {Transaction} this
   */


  sort() {
    /* eslint-disable max-len */
    this.sortInputs(inputs => {
      var copy = Array.prototype.concat.apply([], inputs);
      copy.sort((first, second) => compare(first.prevTxId, second.prevTxId) || first.outputIndex - second.outputIndex);
      return copy;
    });
    this.sortOutputs(outputs => {
      var copy = Array.prototype.concat.apply([], outputs);
      copy.sort((first, second) => first.satoshis - second.satoshis || compare(first.script.toBuffer(), second.script.toBuffer()));
      return copy;
    });
    /* eslint-enable max-len */

    return this;
  }
  /**
   * Randomize this transaction's outputs ordering. The shuffling algorithm is a
   * version of the Fisher-Yates shuffle, provided by lodash's _.shuffle().
   *
   * @return {Transaction} this
   */


  shuffleOutputs() {
    return this.sortOutputs(_.shuffle);
  }
  /**
   * Sort this transaction's outputs, according to a given sorting function that
   * takes an array as argument and returns a new array, with the same elements
   * but with a different order. The argument function MUST NOT modify the order
   * of the original array
   *
   * @param {Function} sortingFunction
   * @return {Transaction} this
   */


  sortOutputs(sortingFunction) {
    var outs = sortingFunction(this.outputs);
    return this._newOutputOrder(outs);
  }
  /**
   * Sort this transaction's inputs, according to a given sorting function that
   * takes an array as argument and returns a new array, with the same elements
   * but with a different order.
   *
   * @param {Function} sortingFunction
   * @return {Transaction} this
   */


  sortInputs(sortingFunction) {
    this.inputs = sortingFunction(this.inputs);

    this._clearSignatures();

    return this;
  }

  _newOutputOrder(newOutputs) {
    var isInvalidSorting = this.outputs.length !== newOutputs.length || _.difference(this.outputs, newOutputs).length !== 0;

    if (isInvalidSorting) {
      throw new errors.Transaction.InvalidSorting();
    }

    if (this._changeIndex !== undefined) {
      var changeOutput = this.outputs[this._changeIndex];
      this._changeIndex = _.findIndex(newOutputs, changeOutput);
    }

    this.outputs = newOutputs;
    return this;
  }

  removeInput(txId, outputIndex) {
    var index;

    if (!outputIndex && _.isNumber(txId)) {
      index = txId;
    } else {
      index = _.findIndex(this.inputs, input => input.prevTxId.toString('hex') === txId && input.outputIndex === outputIndex);
    }

    if (index < 0 || index >= this.inputs.length) {
      throw new errors.Transaction.InvalidIndex(index, this.inputs.length);
    }

    var input = this.inputs[index];
    this.inputs = _.without(this.inputs, input);
    this._inputAmount = undefined;

    this._updateChangeOutput();
  }
  /**
   * Sign the transaction using one or more private keys.
   *
   * It tries to sign each input, verifying that the signature will be valid
   * (matches a public key).
   *
   * @param {Array|String|PrivateKey} privateKeys
   * @param {number} sigtype
   * @return {Transaction} this, for chaining
   */


  sign(privateKeys, sigtype) {
    preconditions.checkState(this.hasAllUtxoInfo(), 'Cannot sign because an input is not defined');
    var self = this;

    if (Array.isArray(privateKeys)) {
      privateKeys.forEach(privateKey => self.sign(privateKey, sigtype));
      return this;
    }

    var signatures = this.getSignatures(privateKeys, sigtype);
    signatures.forEach(signature => self.applySignature(signature));
    return this;
  }

  getSignatures(privKey, sigtype) {
    privKey = new PrivateKey(privKey); // By default, signs using ALL|FORKID

    sigtype = sigtype || Signature.SIGHASH_ALL | Signature.SIGHASH_FORKID;
    var transaction = this;
    var results = [];
    var hashData = Hash.sha256ripemd160(privKey.publicKey.toBuffer());
    this.inputs.forEach((input, index) => {
      var signatures = input.getSignatures(transaction, privKey, index, sigtype, hashData);
      signatures.forEach(signature => results.push(signature));
    });
    return results;
  }
  /**
   * Add a signature to the transaction
   *
   * @param {Object} signature
   * @param {number} signature.inputIndex
   * @param {number} signature.sigtype
   * @param {PublicKey} signature.publicKey
   * @param {Signature} signature.signature
   * @return {Transaction} this, for chaining
   */


  applySignature(signature) {
    this.inputs[signature.inputIndex].addSignature(this, signature);
    return this;
  }

  isFullySigned() {
    this.inputs.forEach(input => {
      if (input.isFullySigned === Input.prototype.isFullySigned) {
        throw new errors.Transaction.UnableToVerifySignature('Unrecognized script kind, or not enough information to execute script.' + 'This usually happens when creating a transaction from a serialized transaction');
      }
    });
    return this.inputs.map(input => input.isFullySigned()).every(x => x);
  }

  isValidSignature(signature) {
    var self = this;

    if (this.inputs[signature.inputIndex].isValidSignature === Input.prototype.isValidSignature) {
      throw new errors.Transaction.UnableToVerifySignature('Unrecognized script kind, or not enough information to execute script.' + 'This usually happens when creating a transaction from a serialized transaction');
    }

    return this.inputs[signature.inputIndex].isValidSignature(self, signature);
  }
  /**
   * @returns {bool} whether the signature is valid for this transaction input
   */


  verifySignature(sig, pubkey, nin, subscript) {
    return Sighash.verify(this, sig, pubkey, nin, subscript);
  }
  /**
   * Check that a transaction passes basic sanity tests. If not, return a string
   * describing the error. This function contains the same logic as
   * CheckTransaction in bitcoin core.
   */


  verify() {
    var i; // Basic checks that don't depend on any context

    if (this.inputs.length === 0) {
      return 'transaction txins empty';
    }

    if (this.outputs.length === 0) {
      return 'transaction txouts empty';
    } // Check for negative or overflow output values


    var valueoutbn = new BN(0);

    for (i = 0; i < this.outputs.length; i += 1) {
      if (this.outputs[i].invalidSatoshis()) {
        return 'Transaction output contains invalid amount';
      }

      if (this.outputs[i]._satoshisBN.gt(new BN(Transaction.MAX_MONEY, 10))) {
        return 'Transaction output contains too high satoshi amount';
      }

      valueoutbn = valueoutbn.add(this.outputs[i]._satoshisBN);

      if (valueoutbn.gt(new BN(Transaction.MAX_MONEY))) {
        return 'Transaction output contains too high satoshi amount';
      }
    } // Size limits


    if (this.toBuffer().length > MAX_BLOCK_SIZE) {
      return 'Transaction over the maximum block size';
    } // Check for duplicate inputs


    var txinmap = {};

    for (i = 0; i < this.inputs.length; i += 1) {
      var inputid = "".concat(this.inputs[i].prevTxId, ":").concat(this.inputs[i].outputIndex);

      if (txinmap[inputid] !== undefined) {
        return 'Transaction contains duplicate input';
      }

      txinmap[inputid] = true;
    }

    var isCoinbase = this.isCoinbase();

    if (isCoinbase) {
      var buf = this.inputs[0]._scriptBuffer;

      if (buf.length < 2 || buf.length > 100) {
        return 'Coinbase transaction script size invalid';
      }
    } else if (this.inputs.filter(input => input.isNull()).length > 0) {
      return 'Transaction has null input';
    }

    return true;
  }
  /**
   * Analogous to bitcoind's IsCoinBase function in transaction.h
   */


  isCoinbase() {
    return this.inputs.length === 1 && this.inputs[0].isNull();
  }
  /**
   * Determines if this transaction can be replaced in the mempool with another
   * transaction that provides a sufficiently higher fee (RBF).
   */


  isRBF() {
    return this.inputs.some(input => input.sequenceNumber < Input.MAXINT - 1);
  }
  /**
   * Enable this transaction to be replaced in the mempool (RBF) if a transaction
   * includes a sufficiently higher fee. It will set the sequenceNumber to
   * DEFAULT_RBF_SEQNUMBER for all inputs if the sequence number does not
   * already enable RBF.
   */


  enableRBF() {
    this.inputs = this.inputs.map(input => {
      if (input.sequenceNumber >= Input.MAXINT - 1) {
        input.sequenceNumber = Input.DEFAULT_RBF_SEQNUMBER;
      }

      return input;
    });
    return this;
  }
  /**
   * Create a 'shallow' copy of the transaction, by serializing and deserializing
   * it dropping any additional information that inputs and outputs may have hold
   *
   * @param {Transaction} transaction
   * @return {Transaction}
   */


  static shallowCopy(transaction) {
    return new Transaction(transaction.toBuffer());
  }

  static _estimateFee(size, amountAvailable, feePerKb) {
    var fee = Math.ceil(size / 1000 * (feePerKb || Transaction.FEE_PER_KB));

    if (amountAvailable > fee) {
      size += Transaction.CHANGE_OUTPUT_MAX_SIZE;
    }

    return Math.ceil(size / 1000 * (feePerKb || Transaction.FEE_PER_KB));
  }

} // Minimum amount for an output for it not to be considered a dust output


Transaction.DUST_AMOUNT = 546; // Margin of error to allow fees in the vecinity of the expected value but doesn't allow a big
// difference.

Transaction.FEE_SECURITY_MARGIN = 150; // max amount of satoshis in circulation

Transaction.MAX_MONEY = 21000000 * 1e8; // nlocktime limit to be considered block height rather than a timestamp

Transaction.NLOCKTIME_BLOCKHEIGHT_LIMIT = 5e8; // Max value for an unsigned 32 bit value

Transaction.NLOCKTIME_MAX_VALUE = 4294967295; // Value used for fee estimation (satoshis per kilobyte)

Transaction.FEE_PER_KB = 20000; // Safe upper bound for change address script size in bytes

Transaction.CHANGE_OUTPUT_MAX_SIZE = 20 + 4 + 34 + 4;
Transaction.MAXIMUM_EXTRA_SIZE = 4 + 9 + 9 + 4;

/**
 * Instantiate a Block from a Buffer, JSON object, or Object with
 * the properties of the Block
 *
 * @param {*} - A Buffer, JSON string, or Object
 * @returns {Block}
 * @constructor
 */

class Block {
  constructor(arg) {
    if (!(this instanceof Block)) {
      return new Block(arg);
    }

    _.extend(this, Block._from(arg));

    return this;
  }
  /**
   * @param {*} - A Buffer, JSON string or Object
   * @returns {Object} - An object representing block data
   * @throws {TypeError} - If the argument was not recognized
   * @private
   */


  static _from(arg) {
    var info = {};

    if (BufferUtil.isBuffer(arg)) {
      info = Block._fromBufferReader(BufferReader(arg));
    } else if (_.isObject(arg)) {
      info = Block._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for Block');
    }

    return info;
  }
  /**
   * @param {Object} - A plain JavaScript object
   * @returns {Object} - An object representing block data
   * @private
   */


  static _fromObject(data) {
    var transactions = [];
    data.transactions.forEach(tx => {
      if (tx instanceof Transaction) {
        transactions.push(tx);
      } else {
        transactions.push(new Transaction().fromObject(tx));
      }
    });
    var info = {
      header: BlockHeader.fromObject(data.header),
      transactions
    };
    return info;
  }
  /**
   * @param {Object} - A plain JavaScript object
   * @returns {Block} - An instance of block
   */


  static fromObject(obj) {
    var info = Block._fromObject(obj);

    return new Block(info);
  }
  /**
   * @param {BufferReader} - Block data
   * @returns {Object} - An object representing the block data
   * @private
   */


  static _fromBufferReader(br) {
    var info = {};
    preconditions.checkState(!br.finished(), 'No block data received');
    info.header = BlockHeader.fromBufferReader(br);
    var transactions = br.readVarintNum();
    info.transactions = [];

    for (var i = 0; i < transactions; i += 1) {
      info.transactions.push(new Transaction().fromBufferReader(br));
    }

    return info;
  }
  /**
   * @param {BufferReader} - A buffer reader of the block
   * @returns {Block} - An instance of block
   */


  static fromBufferReader(br) {
    preconditions.checkArgument(br, 'br is required');

    var info = Block._fromBufferReader(br);

    return new Block(info);
  }
  /**
   * @param {Buffer} - A buffer of the block
   * @returns {Block} - An instance of block
   */


  static fromBuffer(buf) {
    return Block.fromBufferReader(new BufferReader(buf));
  }
  /**
   * @param {string} - str - A hex encoded string of the block
   * @returns {Block} - A hex encoded string of the block
   */


  static fromString(str) {
    var buf = Buffer.from(str, 'hex');
    return Block.fromBuffer(buf);
  }
  /**
   * @param {Binary} - Raw block binary data or buffer
   * @returns {Block} - An instance of block
   */


  static fromRawBlock(data) {
    if (!BufferUtil.isBuffer(data)) {
      data = Buffer.from(data, 'binary');
    }

    var br = BufferReader(data);
    br.pos = Block.Values.START_OF_BLOCK;

    var info = Block._fromBufferReader(br);

    return new Block(info);
  }
  /**
   * @returns {Object} - A plain object with the block properties
   */


  toJSON() {
    var transactions = [];
    this.transactions.forEach(tx => {
      transactions.push(tx.toObject());
    });
    return {
      header: this.header.toObject(),
      transactions
    };
  }

  toObject() {
    return this.toJSON();
  }
  /**
   * @returns {Buffer} - A buffer of the block
   */


  toBuffer() {
    return this.toBufferWriter().concat();
  }
  /**
   * @returns {string} - A hex encoded string of the block
   */


  toString() {
    return this.toBuffer().toString('hex');
  }
  /**
   * @param {BufferWriter} - An existing instance of BufferWriter
   * @returns {BufferWriter} - An instance of BufferWriter representation of the Block
   */


  toBufferWriter(bw) {
    if (!bw) {
      bw = new BufferWriter();
    }

    bw.write(this.header.toBuffer());
    bw.writeVarintNum(this.transactions.length);

    for (var i = 0; i < this.transactions.length; i += 1) {
      this.transactions[i].toBufferWriter(bw);
    }

    return bw;
  }
  /**
   * Will iterate through each transaction and return an array of hashes
   * @returns {Array} - An array with transaction hashes
   */


  getTransactionHashes() {
    var hashes = [];

    if (this.transactions.length === 0) {
      return [Block.Values.NULL_HASH];
    }

    for (var t = 0; t < this.transactions.length; t += 1) {
      hashes.push(this.transactions[t]._getHash());
    }

    return hashes;
  }
  /**
   * Will build a merkle tree of all the transactions, ultimately arriving at
   * a single point, the merkle root.
   * @link https://en.bitcoin.it/wiki/Protocol_specification#Merkle_Trees
   * @returns {Array} - An array with each level of the tree after the other.
   */


  getMerkleTree() {
    var tree = this.getTransactionHashes();
    var j = 0;

    for (var size = this.transactions.length; size > 1; size = Math.floor((size + 1) / 2)) {
      for (var i = 0; i < size; i += 2) {
        var i2 = Math.min(i + 1, size - 1);
        var buf = Buffer.concat([tree[j + i], tree[j + i2]]);
        tree.push(Hash.sha256sha256(buf));
      }

      j += size;
    }

    return tree;
  }
  /**
   * Calculates the merkleRoot from the transactions.
   * @returns {Buffer} - A buffer of the merkle root hash
   */


  getMerkleRoot() {
    var tree = this.getMerkleTree();
    return tree[tree.length - 1];
  }
  /**
   * Verifies that the transactions in the block match the header merkle root
   * @returns {Boolean} - If the merkle roots match
   */


  validMerkleRoot() {
    var h = new BN(this.header.merkleRoot.toString('hex'), 'hex');
    var c = new BN(this.getMerkleRoot().toString('hex'), 'hex');

    if (h.cmp(c) !== 0) {
      return false;
    }

    return true;
  }
  /**
   * @returns {Buffer} - The little endian hash buffer of the header
   */


  _getHash() {
    return this.header._getHash();
  }
  /**
   * @returns {string} - A string formatted for the console
   */


  inspect() {
    return "<Block ".concat(this.id, ">");
  }

} // https://github.com/bitcoin/bitcoin/blob/b5fa132329f0377d787a4a21c1686609c2bfaece/src/primitives/block.h#L14


Block.MAX_BLOCK_SIZE = 1000000;
var idProperty$1 = {
  configurable: false,
  enumerable: true,

  /**
   * @returns {string} - The big endian hash buffer of the header
   */
  get() {
    if (!this._id) {
      this._id = this.header.id;
    }

    return this._id;
  },

  set: _.noop
};
Object.defineProperty(Block.prototype, 'id', idProperty$1);
Object.defineProperty(Block.prototype, 'hash', idProperty$1);
Block.Values = {
  START_OF_BLOCK: 8,
  // Start of block in raw block data
  NULL_HASH: Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex')
}; // refactor progress

var hdErrors = errors.HDPublicKey;
/**
 * The representation of an hierarchically derived public key.
 *
 * See https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
 *
 * @constructor
 * @param {Object|string|Buffer} arg
 */

function HDPublicKey(arg) {
  if (arg instanceof HDPublicKey) {
    return arg;
  }

  if (!(this instanceof HDPublicKey)) {
    return new HDPublicKey(arg);
  }

  if (arg) {
    if (_.isString(arg) || BufferUtil.isBuffer(arg)) {
      var error = HDPublicKey.getSerializedError(arg);

      if (!error) {
        return this._buildFromSerialized(arg);
      }

      if (BufferUtil.isBuffer(arg) && !HDPublicKey.getSerializedError(arg.toString())) {
        return this._buildFromSerialized(arg.toString());
      }

      if (error instanceof hdErrors.ArgumentIsPrivateExtended) {
        return new HDPrivateKey(arg).hdPublicKey;
      }

      throw error;
    } else {
      if (_.isObject(arg)) {
        if (arg instanceof HDPrivateKey) {
          return this._buildFromPrivate(arg);
        }

        return this._buildFromObject(arg);
      }

      throw new hdErrors.UnrecognizedArgument(arg);
    }
  } else {
    throw new hdErrors.MustSupplyArgument();
  }
}
/**
 * Verifies that a given path is valid.
 *
 * @param {string|number} arg
 * @return {boolean}
 */


HDPublicKey.isValidPath = function (arg) {
  if (_.isString(arg)) {
    var indexes = HDPrivateKey._getDerivationIndexes(arg);

    return indexes !== null && _.every(indexes, HDPublicKey.isValidPath);
  }

  if (_.isNumber(arg)) {
    return arg >= 0 && arg < HDPublicKey.Hardened;
  }

  return false;
};
/**
 * WARNING: This method is deprecated. Use deriveChild instead.
 *
 *
 * Get a derivated child based on a string or number.
 *
 * If the first argument is a string, it's parsed as the full path of
 * derivation. Valid values for this argument include "m" (which returns the
 * same public key), "m/0/1/40/2/1000".
 *
 * Note that hardened keys can't be derived from a public extended key.
 *
 * If the first argument is a number, the child with that index will be
 * derived. See the example usage for clarification.
 *
 * @example
 * ```javascript
 * var parent = new HDPublicKey('xpub...');
 * var child_0_1_2 = parent.derive(0).derive(1).derive(2);
 * var copy_of_child_0_1_2 = parent.derive("m/0/1/2");
 * assert(child_0_1_2.xprivkey === copy_of_child_0_1_2);
 * ```
 *
 * @param {string|number} arg
 */


HDPublicKey.prototype.derive = function (arg, hardened) {
  return this.deriveChild(arg, hardened);
};
/**
 * WARNING: This method will not be officially supported until v1.0.0.
 *
 *
 * Get a derivated child based on a string or number.
 *
 * If the first argument is a string, it's parsed as the full path of
 * derivation. Valid values for this argument include "m" (which returns the
 * same public key), "m/0/1/40/2/1000".
 *
 * Note that hardened keys can't be derived from a public extended key.
 *
 * If the first argument is a number, the child with that index will be
 * derived. See the example usage for clarification.
 *
 * @example
 * ```javascript
 * var parent = new HDPublicKey('xpub...');
 * var child_0_1_2 = parent.deriveChild(0).deriveChild(1).deriveChild(2);
 * var copy_of_child_0_1_2 = parent.deriveChild("m/0/1/2");
 * assert(child_0_1_2.xprivkey === copy_of_child_0_1_2);
 * ```
 *
 * @param {string|number} arg
 */


HDPublicKey.prototype.deriveChild = function (arg, hardened) {
  if (_.isNumber(arg)) {
    return this._deriveWithNumber(arg, hardened);
  }

  if (_.isString(arg)) {
    return this._deriveFromString(arg);
  }

  throw new hdErrors.InvalidDerivationArgument(arg);
};

HDPublicKey.prototype._deriveWithNumber = function (index, hardened) {
  if (index >= HDPublicKey.Hardened || hardened) {
    throw new hdErrors.InvalidIndexCantDeriveHardened();
  }

  if (index < 0) {
    throw new hdErrors.InvalidPath(index);
  }

  var indexBuffer = BufferUtil.integerAsBuffer(index);
  var data = BufferUtil.concat([this.publicKey.toBuffer(), indexBuffer]);
  var hash = Hash.sha512hmac(data, this._buffers.chainCode);
  var leftPart = BN.fromBuffer(hash.slice(0, 32), {
    size: 32
  });
  var chainCode = hash.slice(32, 64);
  var publicKey;

  try {
    publicKey = PublicKey.fromPoint(Point.getG().mul(leftPart).add(this.publicKey.point));
  } catch (e) {
    return this._deriveWithNumber(index + 1);
  }

  var derived = new HDPublicKey({
    network: this.network,
    depth: this.depth + 1,
    parentFingerPrint: this.fingerPrint,
    childIndex: index,
    chainCode,
    publicKey
  });
  return derived;
};

HDPublicKey.prototype._deriveFromString = function (path) {
  if (_.includes(path, "'")) {
    throw new hdErrors.InvalidIndexCantDeriveHardened();
  } else if (!HDPublicKey.isValidPath(path)) {
    throw new hdErrors.InvalidPath(path);
  }

  var indexes = HDPrivateKey._getDerivationIndexes(path);

  var derived = indexes.reduce((prev, index) => prev._deriveWithNumber(index), this);
  return derived;
};
/**
 * Verifies that a given serialized public key in base58 with checksum format
 * is valid.
 *
 * @param {string|Buffer} data - the serialized public key
 * @param {string|Network=} network - optional, if present, checks that the
 *     network provided matches the network serialized.
 * @return {boolean}
 */


HDPublicKey.isValidSerialized = function (data, network) {
  return _.isNull(HDPublicKey.getSerializedError(data, network));
};
/**
 * Checks what's the error that causes the validation of a serialized public key
 * in base58 with checksum to fail.
 *
 * @param {string|Buffer} data - the serialized public key
 * @param {string|Network=} network - optional, if present, checks that the
 *     network provided matches the network serialized.
 * @return {errors|null}
 */


HDPublicKey.getSerializedError = function (data, network) {
  if (!(_.isString(data) || BufferUtil.isBuffer(data))) {
    return new hdErrors.UnrecognizedArgument('expected buffer or string');
  }

  if (!Base58.validCharacters(data)) {
    return new errors.InvalidB58Char('(unknown)', data);
  }

  try {
    data = Base58Check.decode(data);
  } catch (e) {
    return new errors.InvalidB58Checksum(data);
  }

  if (data.length !== HDPublicKey.DataSize) {
    return new hdErrors.InvalidLength(data);
  }

  if (!_.isUndefined(network)) {
    var error = HDPublicKey._validateNetwork(data, network);

    if (error) {
      return error;
    }
  }

  var version = BufferUtil.integerFromBuffer(data.slice(0, 4));

  if (version === Networks.livenet.xprivkey || version === Networks.testnet.xprivkey) {
    return new hdErrors.ArgumentIsPrivateExtended();
  }

  return null;
};

HDPublicKey._validateNetwork = function (data, networkArg) {
  var network = Networks.get(networkArg);

  if (!network) {
    return new errors.InvalidNetworkArgument(networkArg);
  }

  var version = data.slice(HDPublicKey.VersionStart, HDPublicKey.VersionEnd);

  if (BufferUtil.integerFromBuffer(version) !== network.xpubkey) {
    return new errors.InvalidNetwork(version);
  }

  return null;
};

HDPublicKey.prototype._buildFromPrivate = function (arg) {
  var args = _.clone(arg._buffers);

  var point = Point.getG().mul(BN.fromBuffer(args.privateKey));
  args.publicKey = Point.pointToCompressed(point);
  args.version = BufferUtil.integerAsBuffer(Networks.get(BufferUtil.integerFromBuffer(args.version)).xpubkey);
  args.privateKey = undefined;
  args.checksum = undefined;
  args.xprivkey = undefined;
  return this._buildFromBuffers(args);
};

HDPublicKey.prototype._buildFromObject = function (arg) {
  // TODO: Type validation
  var publicKey;

  if (_.isString(arg.publicKey)) {
    publicKey = BufferUtil.hexToBuffer(arg.publicKey);
  } else if (BufferUtil.isBuffer(arg.publicKey)) {
    ({
      publicKey
    } = arg);
  } else {
    publicKey = arg.publicKey.toBuffer();
  }

  var buffers = {
    version: arg.network ? BufferUtil.integerAsBuffer(Networks.get(arg.network).xpubkey) : arg.version,
    depth: _.isNumber(arg.depth) ? BufferUtil.integerAsSingleByteBuffer(arg.depth) : arg.depth,
    parentFingerPrint: _.isNumber(arg.parentFingerPrint) ? BufferUtil.integerAsBuffer(arg.parentFingerPrint) : arg.parentFingerPrint,
    childIndex: _.isNumber(arg.childIndex) ? BufferUtil.integerAsBuffer(arg.childIndex) : arg.childIndex,
    chainCode: _.isString(arg.chainCode) ? BufferUtil.hexToBuffer(arg.chainCode) : arg.chainCode,
    publicKey,
    checksum: _.isNumber(arg.checksum) ? BufferUtil.integerAsBuffer(arg.checksum) : arg.checksum
  };
  return this._buildFromBuffers(buffers);
};

HDPublicKey.prototype._buildFromSerialized = function (arg) {
  var decoded = Base58Check.decode(arg);
  var buffers = {
    version: decoded.slice(HDPublicKey.VersionStart, HDPublicKey.VersionEnd),
    depth: decoded.slice(HDPublicKey.DepthStart, HDPublicKey.DepthEnd),
    parentFingerPrint: decoded.slice(HDPublicKey.ParentFingerPrintStart, HDPublicKey.ParentFingerPrintEnd),
    childIndex: decoded.slice(HDPublicKey.ChildIndexStart, HDPublicKey.ChildIndexEnd),
    chainCode: decoded.slice(HDPublicKey.ChainCodeStart, HDPublicKey.ChainCodeEnd),
    publicKey: decoded.slice(HDPublicKey.PublicKeyStart, HDPublicKey.PublicKeyEnd),
    checksum: decoded.slice(HDPublicKey.ChecksumStart, HDPublicKey.ChecksumEnd),
    xpubkey: arg
  };
  return this._buildFromBuffers(buffers);
};
/**
 * Receives a object with buffers in all the properties and populates the
 * internal structure
 *
 * @param {Object} arg
 * @param {Buffer} arg.version
 * @param {Buffer} arg.depth
 * @param {Buffer} arg.parentFingerPrint
 * @param {Buffer} arg.childIndex
 * @param {Buffer} arg.chainCode
 * @param {Buffer} arg.publicKey
 * @param {Buffer} arg.checksum
 * @param {string=} arg.xpubkey - if set, don't recalculate the base58
 *      representation
 * @return {HDPublicKey} this
 */


HDPublicKey.prototype._buildFromBuffers = function (arg) {
  HDPublicKey._validateBufferArguments(arg);

  JSUtil.defineImmutable(this, {
    _buffers: arg
  });
  var sequence = [arg.version, arg.depth, arg.parentFingerPrint, arg.childIndex, arg.chainCode, arg.publicKey];
  var concat = BufferUtil.concat(sequence);
  var checksum = Base58Check.checksum(concat);

  if (!arg.checksum || !arg.checksum.length) {
    arg.checksum = checksum;
  } else if (arg.checksum.toString('hex') !== checksum.toString('hex')) {
    throw new errors.InvalidB58Checksum(concat, checksum);
  }

  var network = Networks.get(BufferUtil.integerFromBuffer(arg.version));
  var xpubkey = Base58Check.encode(BufferUtil.concat(sequence));
  arg.xpubkey = Buffer.from(xpubkey);
  var publicKey = new PublicKey(arg.publicKey, {
    network
  });
  var size = HDPublicKey.ParentFingerPrintSize;
  var fingerPrint = Hash.sha256ripemd160(publicKey.toBuffer()).slice(0, size);
  JSUtil.defineImmutable(this, {
    xpubkey,
    network,
    depth: BufferUtil.integerFromSingleByteBuffer(arg.depth),
    publicKey,
    fingerPrint
  });
  return this;
};

HDPublicKey._validateBufferArguments = function (arg) {
  var checkBuffer = function checkBuffer(name, size) {
    var buff = arg[name];
    assert(BufferUtil.isBuffer(buff), "".concat(name, " argument is not a buffer, it's ").concat(typeof buff));
    assert(buff.length === size, "".concat(name, " size unexpected: found ").concat(buff.length, ", expected ").concat(size));
  };

  checkBuffer('version', HDPublicKey.VersionSize);
  checkBuffer('depth', HDPublicKey.DepthSize);
  checkBuffer('parentFingerPrint', HDPublicKey.ParentFingerPrintSize);
  checkBuffer('childIndex', HDPublicKey.ChildIndexSize);
  checkBuffer('chainCode', HDPublicKey.ChainCodeSize);
  checkBuffer('publicKey', HDPublicKey.PublicKeySize);

  if (arg.checksum && arg.checksum.length) {
    checkBuffer('checksum', HDPublicKey.CheckSumSize);
  }
};

HDPublicKey.fromString = function (arg) {
  preconditions.checkArgument(_.isString(arg), 'No valid string was provided');
  return new HDPublicKey(arg);
};

HDPublicKey.fromObject = function (arg) {
  preconditions.checkArgument(_.isObject(arg), 'No valid argument was provided');
  return new HDPublicKey(arg);
};
/**
 * Returns the base58 checked representation of the public key
 * @return {string} a string starting with "xpub..." in livenet
 */


HDPublicKey.prototype.toString = function () {
  return this.xpubkey;
};
/**
 * Returns the console representation of this extended public key.
 * @return string
 */


HDPublicKey.prototype.inspect = function () {
  return "<HDPublicKey: ".concat(this.xpubkey, ">");
};
/**
 * Returns a plain JavaScript object with information to reconstruct a key.
 *
 * Fields are: <ul>
 *  <li> network: 'livenet' or 'testnet'
 *  <li> depth: a number from 0 to 255, the depth to the master extended key
 *  <li> fingerPrint: a number of 32 bits taken from the hash of the public key
 *  <li> fingerPrint: a number of 32 bits taken from the hash of this key's
 *  <li>     parent's public key
 *  <li> childIndex: index with which this key was derived
 *  <li> chainCode: string in hexa encoding used for derivation
 *  <li> publicKey: string, hexa encoded, in compressed key format
 *  <li> checksum: BufferUtil.integerFromBuffer(this._buffers.checksum),
 *  <li> xpubkey: the string with the base58 representation of this extended key
 *  <li> checksum: the base58 checksum of xpubkey
 * </ul>
 */


HDPublicKey.prototype.toJSON = function toObject() {
  return {
    network: Networks.get(BufferUtil.integerFromBuffer(this._buffers.version)).name,
    depth: BufferUtil.integerFromSingleByteBuffer(this._buffers.depth),
    fingerPrint: BufferUtil.integerFromBuffer(this.fingerPrint),
    parentFingerPrint: BufferUtil.integerFromBuffer(this._buffers.parentFingerPrint),
    childIndex: BufferUtil.integerFromBuffer(this._buffers.childIndex),
    chainCode: BufferUtil.bufferToHex(this._buffers.chainCode),
    publicKey: this.publicKey.toString(),
    checksum: BufferUtil.integerFromBuffer(this._buffers.checksum),
    xpubkey: this.xpubkey
  };
};

HDPublicKey.prototype.toObject = HDPublicKey.prototype.toJSON;
/**
 * Create a HDPublicKey from a buffer argument
 *
 * @param {Buffer} arg
 * @return {HDPublicKey}
 */

HDPublicKey.fromBuffer = function (arg) {
  return new HDPublicKey(arg);
};
/**
 * Return a buffer representation of the xpubkey
 *
 * @return {Buffer}
 */


HDPublicKey.prototype.toBuffer = function () {
  return BufferUtil.copy(this._buffers.xpubkey);
};

HDPublicKey.Hardened = 0x80000000;
HDPublicKey.RootElementAlias = ['m', 'M'];
HDPublicKey.VersionSize = 4;
HDPublicKey.DepthSize = 1;
HDPublicKey.ParentFingerPrintSize = 4;
HDPublicKey.ChildIndexSize = 4;
HDPublicKey.ChainCodeSize = 32;
HDPublicKey.PublicKeySize = 33;
HDPublicKey.CheckSumSize = 4;
HDPublicKey.DataSize = 78;
HDPublicKey.SerializedByteSize = 82;
HDPublicKey.VersionStart = 0;
HDPublicKey.VersionEnd = HDPublicKey.VersionStart + HDPublicKey.VersionSize;
HDPublicKey.DepthStart = HDPublicKey.VersionEnd;
HDPublicKey.DepthEnd = HDPublicKey.DepthStart + HDPublicKey.DepthSize;
HDPublicKey.ParentFingerPrintStart = HDPublicKey.DepthEnd;
HDPublicKey.ParentFingerPrintEnd = HDPublicKey.ParentFingerPrintStart + HDPublicKey.ParentFingerPrintSize;
HDPublicKey.ChildIndexStart = HDPublicKey.ParentFingerPrintEnd;
HDPublicKey.ChildIndexEnd = HDPublicKey.ChildIndexStart + HDPublicKey.ChildIndexSize;
HDPublicKey.ChainCodeStart = HDPublicKey.ChildIndexEnd;
HDPublicKey.ChainCodeEnd = HDPublicKey.ChainCodeStart + HDPublicKey.ChainCodeSize;
HDPublicKey.PublicKeyStart = HDPublicKey.ChainCodeEnd;
HDPublicKey.PublicKeyEnd = HDPublicKey.PublicKeyStart + HDPublicKey.PublicKeySize;
HDPublicKey.ChecksumStart = HDPublicKey.PublicKeyEnd;
HDPublicKey.ChecksumEnd = HDPublicKey.ChecksumStart + HDPublicKey.CheckSumSize;
assert(HDPublicKey.PublicKeyEnd === HDPublicKey.DataSize);
assert(HDPublicKey.ChecksumEnd === HDPublicKey.SerializedByteSize);

var hdErrors$1 = errors.HDPrivateKey;
var MINIMUM_ENTROPY_BITS = 128;
var BITS_TO_BYTES = 1 / 8;
var MAXIMUM_ENTROPY_BITS = 512;
/**
 * Represents an instance of an hierarchically derived private key.
 *
 * More info on https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
 *
 * @constructor
 * @param {string|Buffer|Object} arg
 */

function HDPrivateKey(arg) {
  if (arg instanceof HDPrivateKey) {
    return arg;
  }

  if (!(this instanceof HDPrivateKey)) {
    return new HDPrivateKey(arg);
  }

  if (!arg) {
    return this._generateRandomly();
  }

  if (Networks.get(arg)) {
    return this._generateRandomly(arg);
  }

  if (_.isString(arg) || BufferUtil.isBuffer(arg)) {
    if (HDPrivateKey.isValidSerialized(arg)) {
      this._buildFromSerialized(arg);
    } else if (JSUtil.isValidJSON(arg)) {
      this._buildFromJSON(arg);
    } else if (BufferUtil.isBuffer(arg) && HDPrivateKey.isValidSerialized(arg.toString())) {
      this._buildFromSerialized(arg.toString());
    } else {
      throw HDPrivateKey.getSerializedError(arg);
    }
  } else if (_.isObject(arg)) {
    this._buildFromObject(arg);
  } else {
    throw new hdErrors$1.UnrecognizedArgument(arg);
  }
}
/**
 * Verifies that a given path is valid.
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 * @return {boolean}
 */


HDPrivateKey.isValidPath = function (arg, hardened) {
  if (_.isString(arg)) {
    var indexes = HDPrivateKey._getDerivationIndexes(arg);

    return indexes !== null && _.every(indexes, HDPrivateKey.isValidPath);
  }

  if (_.isNumber(arg)) {
    if (arg < HDPrivateKey.Hardened && hardened === true) {
      arg += HDPrivateKey.Hardened;
    }

    return arg >= 0 && arg < HDPrivateKey.MaxIndex;
  }

  return false;
};
/**
 * Internal function that splits a string path into a derivation index array.
 * It will return null if the string path is malformed.
 * It does not validate if indexes are in bounds.
 *
 * @param {string} path
 * @return {Array}
 */


HDPrivateKey._getDerivationIndexes = function (path) {
  var steps = path.split('/'); // Special cases:

  if (_.includes(HDPrivateKey.RootElementAlias, path)) {
    return [];
  }

  if (!_.includes(HDPrivateKey.RootElementAlias, steps[0])) {
    return null;
  }

  var indexes = steps.slice(1).map(step => {
    var isHardened = step.slice(-1) === "'";

    if (isHardened) {
      step = step.slice(0, -1);
    }

    if (!step || step[0] === '-') {
      return NaN;
    }

    var index = +step; // cast to number

    if (isHardened) {
      index += HDPrivateKey.Hardened;
    }

    return index;
  });
  return _.some(indexes, Number.isNaN) ? null : indexes;
};
/**
 * WARNING: This method is deprecated. Use deriveChild or deriveNonCompliantChild instead.
 * This is not BIP32 compliant.
 *
 *
 * Get a derived child based on a string or number.
 *
 * If the first argument is a string, it's parsed as the full path of
 * derivation. Valid values for this argument include "m" (which returns the
 * same private key), "m/0/1/40/2'/1000", where the ' quote means a hardened
 * derivation.
 *
 * If the first argument is a number, the child with that index will be
 * derived. If the second argument is truthy, the hardened version will be
 * derived. See the example usage for clarification.
 *
 * @example
 * ```javascript
 * var parent = new HDPrivateKey('xprv...');
 * var child_0_1_2h = parent.derive(0).derive(1).derive(2, true);
 * var copy_of_child_0_1_2h = parent.derive("m/0/1/2'");
 * assert(child_0_1_2h.xprivkey === copy_of_child_0_1_2h);
 * ```
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 */


HDPrivateKey.prototype.derive = function (arg, hardened) {
  return this.deriveNonCompliantChild(arg, hardened);
};
/**
 * WARNING: This method will not be officially supported until v1.0.0.
 *
 *
 * Get a derived child based on a string or number.
 *
 * If the first argument is a string, it's parsed as the full path of
 * derivation. Valid values for this argument include "m" (which returns the
 * same private key), "m/0/1/40/2'/1000", where the ' quote means a hardened
 * derivation.
 *
 * If the first argument is a number, the child with that index will be
 * derived. If the second argument is truthy, the hardened version will be
 * derived. See the example usage for clarification.
 *
 * WARNING: The `nonCompliant` option should NOT be used, except for older implementation
 * that used a derivation strategy that used a non-zero padded private key.
 *
 * @example
 * ```javascript
 * var parent = new HDPrivateKey('xprv...');
 * var child_0_1_2h = parent.deriveChild(0).deriveChild(1).deriveChild(2, true);
 * var copy_of_child_0_1_2h = parent.deriveChild("m/0/1/2'");
 * assert(child_0_1_2h.xprivkey === copy_of_child_0_1_2h);
 * ```
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 */


HDPrivateKey.prototype.deriveChild = function (arg, hardened) {
  if (_.isNumber(arg)) {
    return this._deriveWithNumber(arg, hardened);
  }

  if (_.isString(arg)) {
    return this._deriveFromString(arg);
  }

  throw new hdErrors$1.InvalidDerivationArgument(arg);
};
/**
 * WARNING: This method will not be officially supported until v1.0.0
 *
 *
 * WARNING: If this is a new implementation you should NOT use this method, you should be using
 * `derive` instead.
 *
 * This method is explicitly for use and compatibility with an implementation that
 * was not compliant with BIP32 regarding the derivation algorithm. The private key
 * must be 32 bytes hashing, and this implementation will use the non-zero padded
 * serialization of a private key, such that it's still possible to derive the privateKey
 * to recover those funds.
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 */


HDPrivateKey.prototype.deriveNonCompliantChild = function (arg, hardened) {
  if (_.isNumber(arg)) {
    return this._deriveWithNumber(arg, hardened, true);
  }

  if (_.isString(arg)) {
    return this._deriveFromString(arg, true);
  }

  throw new hdErrors$1.InvalidDerivationArgument(arg);
};

HDPrivateKey.prototype._deriveWithNumber = function (index, hardened, nonCompliant) {
  if (!HDPrivateKey.isValidPath(index, hardened)) {
    throw new hdErrors$1.InvalidPath(index);
  }

  hardened = index >= HDPrivateKey.Hardened ? true : hardened;

  if (index < HDPrivateKey.Hardened && hardened === true) {
    index += HDPrivateKey.Hardened;
  }

  var indexBuffer = BufferUtil.integerAsBuffer(index);
  var data;

  if (hardened && nonCompliant) {
    // The private key serialization in this case will not be exactly 32 bytes and can be
    // any value less, and the value is not zero-padded.
    var nonZeroPadded = this.privateKey.bn.toBuffer();
    data = BufferUtil.concat([Buffer.from([0]), nonZeroPadded, indexBuffer]);
  } else if (hardened) {
    // This will use a 32 byte zero padded serialization of the private key
    var privateKeyBuffer = this.privateKey.bn.toBuffer({
      size: 32
    });
    assert(privateKeyBuffer.length === 32, 'private key buffer is expected to be 32 bytes');
    data = BufferUtil.concat([Buffer.from([0]), privateKeyBuffer, indexBuffer]);
  } else {
    data = BufferUtil.concat([this.publicKey.toBuffer(), indexBuffer]);
  }

  var hash = Hash.sha512hmac(data, this._buffers.chainCode);
  var leftPart = BN.fromBuffer(hash.slice(0, 32), {
    size: 32
  });
  var chainCode = hash.slice(32, 64);
  var privateKey = leftPart.add(this.privateKey.toBigNumber()).umod(Point.getN()).toBuffer({
    size: 32
  });

  if (!PrivateKey.isValid(privateKey)) {
    // Index at this point is already hardened, we can pass null as the hardened arg
    return this._deriveWithNumber(index + 1, null, nonCompliant);
  }

  var derived = new HDPrivateKey({
    network: this.network,
    depth: this.depth + 1,
    parentFingerPrint: this.fingerPrint,
    childIndex: index,
    chainCode,
    privateKey
  });
  return derived;
};

HDPrivateKey.prototype._deriveFromString = function (path, nonCompliant) {
  if (!HDPrivateKey.isValidPath(path)) {
    throw new hdErrors$1.InvalidPath(path);
  }

  var indexes = HDPrivateKey._getDerivationIndexes(path);

  var derived = indexes.reduce((prev, index) => prev._deriveWithNumber(index, null, nonCompliant), this);
  return derived;
};
/**
 * Verifies that a given serialized private key in base58 with checksum format
 * is valid.
 *
 * @param {string|Buffer} data - the serialized private key
 * @param {string|Network=} network - optional, if present, checks that the
 *     network provided matches the network serialized.
 * @return {boolean}
 */


HDPrivateKey.isValidSerialized = function (data, network) {
  return !HDPrivateKey.getSerializedError(data, network);
};
/**
 * Checks what's the error that causes the validation of a serialized private key
 * in base58 with checksum to fail.
 *
 * @param {string|Buffer} data - the serialized private key
 * @param {string|Network=} network - optional, if present, checks that the
 *     network provided matches the network serialized.
 * @return {errors.InvalidArgument|null}
 */


HDPrivateKey.getSerializedError = function (data, network) {
  if (!(_.isString(data) || BufferUtil.isBuffer(data))) {
    return new hdErrors$1.UnrecognizedArgument('Expected string or buffer');
  }

  if (!Base58.validCharacters(data)) {
    return new errors.InvalidB58Char('(unknown)', data);
  }

  try {
    data = Base58Check.decode(data);
  } catch (e) {
    return new errors.InvalidB58Checksum(data);
  }

  if (data.length !== HDPrivateKey.DataLength) {
    return new hdErrors$1.InvalidLength(data);
  }

  if (!_.isUndefined(network)) {
    var error = HDPrivateKey._validateNetwork(data, network);

    if (error) {
      return error;
    }
  }

  return null;
};

HDPrivateKey._validateNetwork = function (data, networkArg) {
  var network = Networks.get(networkArg);

  if (!network) {
    return new errors.InvalidNetworkArgument(networkArg);
  }

  var version = data.slice(0, 4);

  if (BufferUtil.integerFromBuffer(version) !== network.xprivkey) {
    return new errors.InvalidNetwork(version);
  }

  return null;
};

HDPrivateKey.fromString = function (arg) {
  preconditions.checkArgument(_.isString(arg), 'No valid string was provided');
  return new HDPrivateKey(arg);
};

HDPrivateKey.fromObject = function (arg) {
  preconditions.checkArgument(_.isObject(arg), 'No valid argument was provided');
  return new HDPrivateKey(arg);
};

HDPrivateKey.prototype._buildFromJSON = function (arg) {
  return this._buildFromObject(JSON.parse(arg));
};

HDPrivateKey.prototype._buildFromObject = function (arg) {
  // TODO: Type validation
  var checksum;

  if (arg.checksum) {
    if (arg.checksum.length) {
      ({
        checksum
      } = arg);
    } else {
      checksum = BufferUtil.integerAsBuffer(arg.checksum);
    }
  }

  var buffers = {
    version: arg.network ? BufferUtil.integerAsBuffer(Networks.get(arg.network).xprivkey) : arg.version,
    depth: _.isNumber(arg.depth) ? BufferUtil.integerAsSingleByteBuffer(arg.depth) : arg.depth,
    parentFingerPrint: _.isNumber(arg.parentFingerPrint) ? BufferUtil.integerAsBuffer(arg.parentFingerPrint) : arg.parentFingerPrint,
    childIndex: _.isNumber(arg.childIndex) ? BufferUtil.integerAsBuffer(arg.childIndex) : arg.childIndex,
    chainCode: _.isString(arg.chainCode) ? BufferUtil.hexToBuffer(arg.chainCode) : arg.chainCode,
    privateKey: _.isString(arg.privateKey) && JSUtil.isHexa(arg.privateKey) ? BufferUtil.hexToBuffer(arg.privateKey) : arg.privateKey,
    checksum
  };
  return this._buildFromBuffers(buffers);
};

HDPrivateKey.prototype._buildFromSerialized = function (arg) {
  var decoded = Base58Check.decode(arg);
  var buffers = {
    version: decoded.slice(HDPrivateKey.VersionStart, HDPrivateKey.VersionEnd),
    depth: decoded.slice(HDPrivateKey.DepthStart, HDPrivateKey.DepthEnd),
    parentFingerPrint: decoded.slice(HDPrivateKey.ParentFingerPrintStart, HDPrivateKey.ParentFingerPrintEnd),
    childIndex: decoded.slice(HDPrivateKey.ChildIndexStart, HDPrivateKey.ChildIndexEnd),
    chainCode: decoded.slice(HDPrivateKey.ChainCodeStart, HDPrivateKey.ChainCodeEnd),
    privateKey: decoded.slice(HDPrivateKey.PrivateKeyStart, HDPrivateKey.PrivateKeyEnd),
    checksum: decoded.slice(HDPrivateKey.ChecksumStart, HDPrivateKey.ChecksumEnd),
    xprivkey: arg
  };
  return this._buildFromBuffers(buffers);
};

HDPrivateKey.prototype._generateRandomly = function (network) {
  return HDPrivateKey.fromSeed(Random.getRandomBuffer(64), network);
};
/**
 * Generate a private key from a seed, as described in BIP32
 *
 * @param {string|Buffer} hexa
 * @param {*} network
 * @return HDPrivateKey
 */


HDPrivateKey.fromSeed = function (hexa, network) {
  if (JSUtil.isHexaString(hexa)) {
    hexa = BufferUtil.hexToBuffer(hexa);
  }

  if (!Buffer.isBuffer(hexa)) {
    throw new hdErrors$1.InvalidEntropyArgument(hexa);
  }

  if (hexa.length < MINIMUM_ENTROPY_BITS * BITS_TO_BYTES) {
    throw new hdErrors$1.InvalidEntropyArgument.NotEnoughEntropy(hexa);
  }

  if (hexa.length > MAXIMUM_ENTROPY_BITS * BITS_TO_BYTES) {
    throw new hdErrors$1.InvalidEntropyArgument.TooMuchEntropy(hexa);
  }

  var hash = Hash.sha512hmac(hexa, Buffer.from('Bitcoin seed'));
  return new HDPrivateKey({
    network: Networks.get(network) || Networks.defaultNetwork,
    depth: 0,
    parentFingerPrint: 0,
    childIndex: 0,
    privateKey: hash.slice(0, 32),
    chainCode: hash.slice(32, 64)
  });
};

HDPrivateKey.prototype._calcHDPublicKey = function () {
  if (!this._hdPublicKey) {
    this._hdPublicKey = new HDPublicKey(this);
  }
};
/**
 * Receives a object with buffers in all the properties and populates the
 * internal structure
 *
 * @param {Object} arg
 * @param {Buffer} arg.version
 * @param {Buffer} arg.depth
 * @param {Buffer} arg.parentFingerPrint
 * @param {Buffer} arg.childIndex
 * @param {Buffer} arg.chainCode
 * @param {Buffer} arg.privateKey
 * @param {Buffer} arg.checksum
 * @param {string=} arg.xprivkey - if set, don't recalculate the base58
 *      representation
 * @return {HDPrivateKey} this
 */


HDPrivateKey.prototype._buildFromBuffers = function (arg) {
  HDPrivateKey._validateBufferArguments(arg);

  JSUtil.defineImmutable(this, {
    _buffers: arg
  });
  var sequence = [arg.version, arg.depth, arg.parentFingerPrint, arg.childIndex, arg.chainCode, BufferUtil.emptyBuffer(1), arg.privateKey];
  var concat = Buffer.concat(sequence);

  if (!arg.checksum || !arg.checksum.length) {
    arg.checksum = Base58Check.checksum(concat);
  } else if (arg.checksum.toString() !== Base58Check.checksum(concat).toString()) {
    throw new errors.InvalidB58Checksum(concat);
  }

  var network = Networks.get(BufferUtil.integerFromBuffer(arg.version));
  var xprivkey = Base58Check.encode(Buffer.concat(sequence));
  arg.xprivkey = Buffer.from(xprivkey);
  var privateKey = new PrivateKey(BN.fromBuffer(arg.privateKey), network);
  var publicKey = privateKey.toPublicKey();
  var size = HDPrivateKey.ParentFingerPrintSize;
  var fingerPrint = Hash.sha256ripemd160(publicKey.toBuffer()).slice(0, size);
  JSUtil.defineImmutable(this, {
    xprivkey,
    network,
    depth: BufferUtil.integerFromSingleByteBuffer(arg.depth),
    privateKey,
    publicKey,
    fingerPrint
  });
  this._hdPublicKey = null;
  Object.defineProperty(this, 'hdPublicKey', {
    configurable: false,
    enumerable: true,

    get() {
      this._calcHDPublicKey();

      return this._hdPublicKey;
    }

  });
  Object.defineProperty(this, 'xpubkey', {
    configurable: false,
    enumerable: true,

    get() {
      this._calcHDPublicKey();

      return this._hdPublicKey.xpubkey;
    }

  });
  return this;
};

HDPrivateKey._validateBufferArguments = function (arg) {
  var checkBuffer = function checkBuffer(name, size) {
    var buff = arg[name];
    assert(BufferUtil.isBuffer(buff), "".concat(name, " argument is not a buffer"));
    assert(buff.length === size, "".concat(name, " size unexpected: found ").concat(buff.length, ", expected ").concat(size));
  };

  checkBuffer('version', HDPrivateKey.VersionSize);
  checkBuffer('depth', HDPrivateKey.DepthSize);
  checkBuffer('parentFingerPrint', HDPrivateKey.ParentFingerPrintSize);
  checkBuffer('childIndex', HDPrivateKey.ChildIndexSize);
  checkBuffer('chainCode', HDPrivateKey.ChainCodeSize);
  checkBuffer('privateKey', HDPrivateKey.PrivateKeySize);

  if (arg.checksum && arg.checksum.length) {
    checkBuffer('checksum', HDPrivateKey.CheckSumSize);
  }
};
/**
 * Returns the string representation of this private key (a string starting
 * with "xprv..."
 *
 * @return string
 */


HDPrivateKey.prototype.toString = function () {
  return this.xprivkey;
};
/**
 * Returns a plain object with a representation of this private key.
 *
 * Fields include:<ul>
 * <li> network: either 'livenet' or 'testnet'
 * <li> depth: a number ranging from 0 to 255
 * <li> fingerPrint: a number ranging from 0 to 2^32-1, taken from the hash of the
 * <li>     associated public key
 * <li> parentFingerPrint: a number ranging from 0 to 2^32-1, taken from the hash
 * <li>     of this parent's associated public key or zero.
 * <li> childIndex: the index from which this child was derived (or zero)
 * <li> chainCode: an hexa string representing a number used in the derivation
 * <li> privateKey: the private key associated, in hexa representation
 * <li> xprivkey: the representation of this extended private key in checksum
 * <li>     base58 format
 * <li> checksum: the base58 checksum of xprivkey
 * </ul>
 *  @return {Object}
 */


HDPrivateKey.prototype.toJSON = function toObject() {
  return {
    network: Networks.get(BufferUtil.integerFromBuffer(this._buffers.version), 'xprivkey').name,
    depth: BufferUtil.integerFromSingleByteBuffer(this._buffers.depth),
    fingerPrint: BufferUtil.integerFromBuffer(this.fingerPrint),
    parentFingerPrint: BufferUtil.integerFromBuffer(this._buffers.parentFingerPrint),
    childIndex: BufferUtil.integerFromBuffer(this._buffers.childIndex),
    chainCode: BufferUtil.bufferToHex(this._buffers.chainCode),
    privateKey: this.privateKey.toBuffer().toString('hex'),
    checksum: BufferUtil.integerFromBuffer(this._buffers.checksum),
    xprivkey: this.xprivkey
  };
};

HDPrivateKey.prototype.toObject = HDPrivateKey.prototype.toJSON;
/**
 * Build a HDPrivateKey from a buffer
 *
 * @param {Buffer} arg
 * @return {HDPrivateKey}
 */

HDPrivateKey.fromBuffer = function (arg) {
  return new HDPrivateKey(arg.toString());
};
/**
 * Returns a buffer representation of the HDPrivateKey
 *
 * @return {string}
 */


HDPrivateKey.prototype.toBuffer = function () {
  return BufferUtil.copy(this._buffers.xprivkey);
};

HDPrivateKey.DefaultDepth = 0;
HDPrivateKey.DefaultFingerprint = 0;
HDPrivateKey.DefaultChildIndex = 0;
HDPrivateKey.Hardened = 0x80000000;
HDPrivateKey.MaxIndex = 2 * HDPrivateKey.Hardened;
HDPrivateKey.RootElementAlias = ['m', 'M', "m'", "M'"];
HDPrivateKey.VersionSize = 4;
HDPrivateKey.DepthSize = 1;
HDPrivateKey.ParentFingerPrintSize = 4;
HDPrivateKey.ChildIndexSize = 4;
HDPrivateKey.ChainCodeSize = 32;
HDPrivateKey.PrivateKeySize = 32;
HDPrivateKey.CheckSumSize = 4;
HDPrivateKey.DataLength = 78;
HDPrivateKey.SerializedByteSize = 82;
HDPrivateKey.VersionStart = 0;
HDPrivateKey.VersionEnd = HDPrivateKey.VersionStart + HDPrivateKey.VersionSize;
HDPrivateKey.DepthStart = HDPrivateKey.VersionEnd;
HDPrivateKey.DepthEnd = HDPrivateKey.DepthStart + HDPrivateKey.DepthSize;
HDPrivateKey.ParentFingerPrintStart = HDPrivateKey.DepthEnd;
HDPrivateKey.ParentFingerPrintEnd = HDPrivateKey.ParentFingerPrintStart + HDPrivateKey.ParentFingerPrintSize;
HDPrivateKey.ChildIndexStart = HDPrivateKey.ParentFingerPrintEnd;
HDPrivateKey.ChildIndexEnd = HDPrivateKey.ChildIndexStart + HDPrivateKey.ChildIndexSize;
HDPrivateKey.ChainCodeStart = HDPrivateKey.ChildIndexEnd;
HDPrivateKey.ChainCodeEnd = HDPrivateKey.ChainCodeStart + HDPrivateKey.ChainCodeSize;
HDPrivateKey.PrivateKeyStart = HDPrivateKey.ChainCodeEnd + 1;
HDPrivateKey.PrivateKeyEnd = HDPrivateKey.PrivateKeyStart + HDPrivateKey.PrivateKeySize;
HDPrivateKey.ChecksumStart = HDPrivateKey.PrivateKeyEnd;
HDPrivateKey.ChecksumEnd = HDPrivateKey.ChecksumStart + HDPrivateKey.CheckSumSize;
assert(HDPrivateKey.ChecksumEnd === HDPrivateKey.SerializedByteSize);

/**
 * Instantiate a MerkleBlock from a Buffer, JSON object, or Object with
 * the properties of the Block
 *
 * @param {*} - A Buffer, JSON string, or Object representing a MerkleBlock
 * @returns {MerkleBlock}
 * @constructor
 */

class MerkleBlock {
  constructor(arg) {
    if (!(this instanceof MerkleBlock)) {
      return new MerkleBlock(arg);
    }

    var info = {};

    if (BufferUtil.isBuffer(arg)) {
      info = MerkleBlock._fromBufferReader(BufferReader(arg));
    } else if (_.isObject(arg)) {
      var header;

      if (arg.header instanceof BlockHeader) {
        ({
          header
        } = arg);
      } else {
        header = BlockHeader.fromObject(arg.header);
      }

      info = {
        /**
         * @name MerkleBlock#header
         * @type {BlockHeader}
         */
        header,

        /**
         * @name MerkleBlock#numTransactions
         * @type {Number}
         */
        numTransactions: arg.numTransactions,

        /**
         * @name MerkleBlock#hashes
         * @type {String[]}
         */
        hashes: arg.hashes,

        /**
         * @name MerkleBlock#flags
         * @type {Number[]}
         */
        flags: arg.flags
      };
    } else {
      throw new TypeError('Unrecognized argument for MerkleBlock');
    }

    _.extend(this, info);

    this._flagBitsUsed = 0;
    this._hashesUsed = 0;
    return this;
  }
  /**
   * @param {Buffer} - MerkleBlock data in a Buffer object
   * @returns {MerkleBlock} - A MerkleBlock object
   */


  static fromBuffer(buf) {
    return MerkleBlock.fromBufferReader(BufferReader(buf));
  }
  /**
   * @param {BufferReader} - MerkleBlock data in a BufferReader object
   * @returns {MerkleBlock} - A MerkleBlock object
   */


  static fromBufferReader(br) {
    return new MerkleBlock(MerkleBlock._fromBufferReader(br));
  }
  /**
   * @returns {Buffer} - A buffer of the block
   */


  toBuffer() {
    return this.toBufferWriter().concat();
  }
  /**
   * @param {BufferWriter} - An existing instance of BufferWriter
   * @returns {BufferWriter} - An instance of BufferWriter representation of the MerkleBlock
   */


  toBufferWriter(bw) {
    var i;

    if (!bw) {
      bw = new BufferWriter();
    }

    bw.write(this.header.toBuffer());
    bw.writeUInt32LE(this.numTransactions);
    bw.writeVarintNum(this.hashes.length);

    for (i = 0; i < this.hashes.length; i += 1) {
      bw.write(Buffer.from(this.hashes[i], 'hex'));
    }

    bw.writeVarintNum(this.flags.length);

    for (i = 0; i < this.flags.length; i += 1) {
      bw.writeUInt8(this.flags[i]);
    }

    return bw;
  }
  /**
   * @returns {Object} - A plain object with the MerkleBlock properties
   */


  toJSON() {
    return {
      header: this.header.toObject(),
      numTransactions: this.numTransactions,
      hashes: this.hashes,
      flags: this.flags
    };
  }

  toObject() {
    return this.toJSON();
  }
  /**
   * Verify that the MerkleBlock is valid
   * @returns {Boolean} - True/False whether this MerkleBlock is Valid
   */


  validMerkleTree() {
    preconditions.checkState(_.isArray(this.flags), 'MerkleBlock flags is not an array');
    preconditions.checkState(_.isArray(this.hashes), 'MerkleBlock hashes is not an array'); // Can't have more hashes than numTransactions

    if (this.hashes.length > this.numTransactions) {
      return false;
    } // Can't have more flag bits than num hashes


    if (this.flags.length * 8 < this.hashes.length) {
      return false;
    }

    var height = this._calcTreeHeight();

    var opts = {
      hashesUsed: 0,
      flagBitsUsed: 0
    };

    var root = this._traverseMerkleTree(height, 0, opts);

    if (opts.hashesUsed !== this.hashes.length) {
      return false;
    }

    return BufferUtil.equals(root, this.header.merkleRoot);
  }
  /**
   * Traverse a the tree in this MerkleBlock, validating it along the way
   * Modeled after Bitcoin Core merkleblock.cpp TraverseAndExtract()
   * @param {Number} - depth - Current height
   * @param {Number} - pos - Current position in the tree
   * @param {Object} - opts - Object with values that need to be mutated throughout the traversal
   * @param {Number} - opts.flagBitsUsed - Number of flag bits used, should start at 0
   * @param {Number} - opts.hashesUsed - Number of hashes used, should start at 0
   * @param {Array} - opts.txs - Will finish populated by transactions found during traversal
   * @returns {Buffer|null} - Buffer containing the Merkle Hash for that height
   * @private
   */


  _traverseMerkleTree(depth, pos, opts) {
    opts = opts || {};
    opts.txs = opts.txs || [];
    opts.flagBitsUsed = opts.flagBitsUsed || 0;
    opts.hashesUsed = opts.hashesUsed || 0;

    if (opts.flagBitsUsed > this.flags.length * 8) {
      return null;
    }

    var isParentOfMatch = this.flags[opts.flagBitsUsed >> 3] >>> (opts.flagBitsUsed & 7) & 1;
    opts.flagBitsUsed += 1;

    if (depth === 0 || !isParentOfMatch) {
      if (opts.hashesUsed >= this.hashes.length) {
        return null;
      }

      var hash = this.hashes[opts.hashesUsed];
      opts.hashesUsed += 1;

      if (depth === 0 && isParentOfMatch) {
        opts.txs.push(hash);
      }

      return Buffer.from(hash, 'hex');
    }

    var left = this._traverseMerkleTree(depth - 1, pos * 2, opts);

    var right = left;

    if (pos * 2 + 1 < this._calcTreeWidth(depth - 1)) {
      right = this._traverseMerkleTree(depth - 1, pos * 2 + 1, opts);
    }

    return Hash.sha256sha256(Buffer.concat([left, right]));
  }
  /** Calculates the width of a merkle tree at a given height.
   *  Modeled after Bitcoin Core merkleblock.h CalcTreeWidth()
   * @param {Number} - Height at which we want the tree width
   * @returns {Number} - Width of the tree at a given height
   * @private
   */


  _calcTreeWidth(height) {
    return this.numTransactions + (1 << height) - 1 >> height;
  }
  /** Calculates the height of the merkle tree in this MerkleBlock
   * @param {Number} - Height at which we want the tree width
   * @returns {Number} - Height of the merkle tree in this MerkleBlock
   * @private
   */


  _calcTreeHeight() {
    var height = 0;

    while (this._calcTreeWidth(height) > 1) {
      height += 1;
    }

    return height;
  }
  /**
   * @param {Transaction|String} - Transaction or Transaction ID Hash
   * @returns {Boolean} - return true/false if this MerkleBlock has the TX or not
   * @private
   */


  hasTransaction(tx) {
    preconditions.checkArgument(!_.isUndefined(tx), 'tx cannot be undefined');
    preconditions.checkArgument(tx instanceof Transaction || typeof tx === 'string', 'Invalid tx given, tx must be a "string" or "Transaction"');
    var hash = tx;

    if (tx instanceof Transaction) {
      // We need to reverse the id hash for the lookup
      hash = BufferUtil.reverse(Buffer.from(tx.id, 'hex')).toString('hex');
    }

    var txs = [];

    var height = this._calcTreeHeight();

    this._traverseMerkleTree(height, 0, {
      txs
    });

    return txs.indexOf(hash) !== -1;
  }
  /**
   * @param {Buffer} - MerkleBlock data
   * @returns {Object} - An Object representing merkleblock data
   * @private
   */


  static _fromBufferReader(br) {
    var i;
    preconditions.checkState(!br.finished(), 'No merkleblock data received');
    var info = {};
    info.header = BlockHeader.fromBufferReader(br);
    info.numTransactions = br.readUInt32LE();
    var numHashes = br.readVarintNum();
    info.hashes = [];

    for (i = 0; i < numHashes; i += 1) {
      info.hashes.push(br.read(32).toString('hex'));
    }

    var numFlags = br.readVarintNum();
    info.flags = [];

    for (i = 0; i < numFlags; i += 1) {
      info.flags.push(br.readUInt8());
    }

    return info;
  }
  /**
   * @param {Object} - A plain JavaScript object
   * @returns {Block} - An instance of block
   */


  static fromObject(obj) {
    return new MerkleBlock(obj);
  }

}

/**
 * constructs a new message to sign and verify.
 *
 * @param {String} message
 * @returns {Message}
 */

class Message {
  constructor(message) {
    preconditions.checkArgument(_.isString(message), 'First argument should be a string');
    this.message = message;
    return this;
  }

  magicHash() {
    var prefix1 = BufferWriter.varintBufNum(Message.MAGIC_BYTES.length);
    var messageBuffer = Buffer.from(this.message);
    var prefix2 = BufferWriter.varintBufNum(messageBuffer.length);
    var buf = Buffer.concat([prefix1, Message.MAGIC_BYTES, prefix2, messageBuffer]);
    var hash = Hash.sha256sha256(buf);
    return hash;
  }

  _sign(privateKey) {
    preconditions.checkArgument(privateKey instanceof PrivateKey, 'First argument should be a PrivateKey');
    var hash = this.magicHash();
    var ecdsa = new ECDSA();
    ecdsa.hashbuf = hash;
    ecdsa.privkey = privateKey;
    ecdsa.pubkey = privateKey.toPublicKey();
    ecdsa.signRandomK();
    ecdsa.calci();
    return ecdsa.sig;
  }
  /**
   * Will sign a message with a given bitcoin private key.
   *
   * @param {PrivateKey} privateKey - An instance of PrivateKey
   * @returns {String} A base64 encoded compact signature
   */


  sign(privateKey) {
    var signature = this._sign(privateKey);

    return signature.toCompact().toString('base64');
  }

  _verify(publicKey, signature) {
    preconditions.checkArgument(publicKey instanceof PublicKey, 'First argument should be a PublicKey');
    preconditions.checkArgument(signature instanceof Signature, 'Second argument should be a Signature');
    var hash = this.magicHash();
    var verified = ECDSA.verify(hash, signature, publicKey);

    if (!verified) {
      this.error = 'The signature was invalid';
    }

    return verified;
  }
  /**
   * Will return a boolean if the signature is valid for a given bitcoin address.
   * If it isn't the specific reason is accessible via the "error" member.
   *
   * @param {Address|String} bitcoinAddress - A bitcoin address
   * @param {String} signatureString - A base64 encoded compact signature
   * @returns {Boolean}
   */


  verify(bitcoinAddress, signatureString) {
    preconditions.checkArgument(bitcoinAddress);
    preconditions.checkArgument(signatureString && _.isString(signatureString));

    if (_.isString(bitcoinAddress)) {
      bitcoinAddress = Address.fromString(bitcoinAddress);
    }

    var signature = Signature.fromCompact(Buffer.from(signatureString, 'base64')); // recover the public key

    var ecdsa = new ECDSA();
    ecdsa.hashbuf = this.magicHash();
    ecdsa.sig = signature;
    var publicKey = ecdsa.toPublicKey();
    var signatureAddress = Address.fromPublicKey(publicKey, bitcoinAddress.network); // check that the recovered address and specified address match

    if (bitcoinAddress.toString() !== signatureAddress.toString()) {
      this.error = 'The signature did not match the message digest';
      return false;
    }

    return this._verify(publicKey, signature);
  }
  /**
   * Instantiate a message from a message string
   *
   * @param {String} str - A string of the message
   * @returns {Message} A new instance of a Message
   */


  static fromString(str) {
    return new Message(str);
  }
  /**
   * Instantiate a message from JSON
   *
   * @param {String} json - An JSON string or Object with keys: message
   * @returns {Message} A new instance of a Message
   */


  static fromJSON(json) {
    if (JSUtil.isValidJSON(json)) {
      json = JSON.parse(json);
    }

    return new Message(json.message);
  }
  /**
   * @returns {Object} A plain object with the message information
   */


  toObject() {
    return {
      message: this.message
    };
  }
  /**
   * @returns {String} A JSON representation of the message information
   */


  toJSON() {
    return JSON.stringify(this.toObject());
  }
  /**
   * Will return a the string representation of the message
   *
   * @returns {String} Message
   */


  toString() {
    return this.message;
  }
  /**
   * Will return a string formatted for the console
   *
   * @returns {String} Message
   */


  inspect() {
    return "<Message: ".concat(this.toString(), ">");
  }

}

Message.MAGIC_BYTES = Buffer.from('Bitcoin Signed Message:\n');

/**
 * PDKBF2
 * Credit to: https://github.com/stayradiated/pbkdf2-sha512
 * Copyright (c) 2014, JP Richardson Copyright (c) 2010-2011 Intalio Pte, All Rights Reserved
 */

function pbkdf2(key, salt, iterations, dkLen) {
  var hLen = 64; // SHA512 Mac length

  if (dkLen > (2 ** 32 - 1) * hLen) {
    throw Error('Requested key length too long');
  }

  if (typeof key !== 'string' && !Buffer.isBuffer(key)) {
    throw new TypeError('key must a string or Buffer');
  }

  if (typeof salt !== 'string' && !Buffer.isBuffer(salt)) {
    throw new TypeError('salt must a string or Buffer');
  }

  if (typeof key === 'string') {
    key = Buffer.from(key);
  }

  if (typeof salt === 'string') {
    salt = Buffer.from(salt);
  }

  var DK = Buffer.alloc(dkLen);
  var U = Buffer.alloc(hLen);
  var T = Buffer.alloc(hLen);
  var block1 = Buffer.alloc(salt.length + 4);
  var l = Math.ceil(dkLen / hLen);
  var r = dkLen - (l - 1) * hLen;
  salt.copy(block1, 0, 0, salt.length);

  for (var i = 1; i <= l; i += 1) {
    block1[salt.length + 0] = i >> 24 & 0xff;
    block1[salt.length + 1] = i >> 16 & 0xff;
    block1[salt.length + 2] = i >> 8 & 0xff;
    block1[salt.length + 3] = i >> 0 & 0xff;
    var digest = hash.hmac(hash.sha512, key).update(block1).digest();
    U = Buffer.from(digest);
    U.copy(T, 0, 0, hLen);

    for (var j = 1; j < iterations; j += 1) {
      var innerDigest = hash.hmac(hash.sha512, key).update(U).digest();
      U = Buffer.from(innerDigest);

      for (var k = 0; k < hLen; k += 1) {
        T[k] ^= U[k];
      }
    }

    var destPos = (i - 1) * hLen;
    var len = i === l ? r : hLen;
    T.copy(DK, destPos, 0, len);
  }

  return DK;
}

var CHINESE = ['的', '一', '是', '在', '不', '了', '有', '和', '人', '这', '中', '大', '为', '上', '个', '国', '我', '以', '要', '他', '时', '来', '用', '们', '生', '到', '作', '地', '于', '出', '就', '分', '对', '成', '会', '可', '主', '发', '年', '动', '同', '工', '也', '能', '下', '过', '子', '说', '产', '种', '面', '而', '方', '后', '多', '定', '行', '学', '法', '所', '民', '得', '经', '十', '三', '之', '进', '着', '等', '部', '度', '家', '电', '力', '里', '如', '水', '化', '高', '自', '二', '理', '起', '小', '物', '现', '实', '加', '量', '都', '两', '体', '制', '机', '当', '使', '点', '从', '业', '本', '去', '把', '性', '好', '应', '开', '它', '合', '还', '因', '由', '其', '些', '然', '前', '外', '天', '政', '四', '日', '那', '社', '义', '事', '平', '形', '相', '全', '表', '间', '样', '与', '关', '各', '重', '新', '线', '内', '数', '正', '心', '反', '你', '明', '看', '原', '又', '么', '利', '比', '或', '但', '质', '气', '第', '向', '道', '命', '此', '变', '条', '只', '没', '结', '解', '问', '意', '建', '月', '公', '无', '系', '军', '很', '情', '者', '最', '立', '代', '想', '已', '通', '并', '提', '直', '题', '党', '程', '展', '五', '果', '料', '象', '员', '革', '位', '入', '常', '文', '总', '次', '品', '式', '活', '设', '及', '管', '特', '件', '长', '求', '老', '头', '基', '资', '边', '流', '路', '级', '少', '图', '山', '统', '接', '知', '较', '将', '组', '见', '计', '别', '她', '手', '角', '期', '根', '论', '运', '农', '指', '几', '九', '区', '强', '放', '决', '西', '被', '干', '做', '必', '战', '先', '回', '则', '任', '取', '据', '处', '队', '南', '给', '色', '光', '门', '即', '保', '治', '北', '造', '百', '规', '热', '领', '七', '海', '口', '东', '导', '器', '压', '志', '世', '金', '增', '争', '济', '阶', '油', '思', '术', '极', '交', '受', '联', '什', '认', '六', '共', '权', '收', '证', '改', '清', '美', '再', '采', '转', '更', '单', '风', '切', '打', '白', '教', '速', '花', '带', '安', '场', '身', '车', '例', '真', '务', '具', '万', '每', '目', '至', '达', '走', '积', '示', '议', '声', '报', '斗', '完', '类', '八', '离', '华', '名', '确', '才', '科', '张', '信', '马', '节', '话', '米', '整', '空', '元', '况', '今', '集', '温', '传', '土', '许', '步', '群', '广', '石', '记', '需', '段', '研', '界', '拉', '林', '律', '叫', '且', '究', '观', '越', '织', '装', '影', '算', '低', '持', '音', '众', '书', '布', '复', '容', '儿', '须', '际', '商', '非', '验', '连', '断', '深', '难', '近', '矿', '千', '周', '委', '素', '技', '备', '半', '办', '青', '省', '列', '习', '响', '约', '支', '般', '史', '感', '劳', '便', '团', '往', '酸', '历', '市', '克', '何', '除', '消', '构', '府', '称', '太', '准', '精', '值', '号', '率', '族', '维', '划', '选', '标', '写', '存', '候', '毛', '亲', '快', '效', '斯', '院', '查', '江', '型', '眼', '王', '按', '格', '养', '易', '置', '派', '层', '片', '始', '却', '专', '状', '育', '厂', '京', '识', '适', '属', '圆', '包', '火', '住', '调', '满', '县', '局', '照', '参', '红', '细', '引', '听', '该', '铁', '价', '严', '首', '底', '液', '官', '德', '随', '病', '苏', '失', '尔', '死', '讲', '配', '女', '黄', '推', '显', '谈', '罪', '神', '艺', '呢', '席', '含', '企', '望', '密', '批', '营', '项', '防', '举', '球', '英', '氧', '势', '告', '李', '台', '落', '木', '帮', '轮', '破', '亚', '师', '围', '注', '远', '字', '材', '排', '供', '河', '态', '封', '另', '施', '减', '树', '溶', '怎', '止', '案', '言', '士', '均', '武', '固', '叶', '鱼', '波', '视', '仅', '费', '紧', '爱', '左', '章', '早', '朝', '害', '续', '轻', '服', '试', '食', '充', '兵', '源', '判', '护', '司', '足', '某', '练', '差', '致', '板', '田', '降', '黑', '犯', '负', '击', '范', '继', '兴', '似', '余', '坚', '曲', '输', '修', '故', '城', '夫', '够', '送', '笔', '船', '占', '右', '财', '吃', '富', '春', '职', '觉', '汉', '画', '功', '巴', '跟', '虽', '杂', '飞', '检', '吸', '助', '升', '阳', '互', '初', '创', '抗', '考', '投', '坏', '策', '古', '径', '换', '未', '跑', '留', '钢', '曾', '端', '责', '站', '简', '述', '钱', '副', '尽', '帝', '射', '草', '冲', '承', '独', '令', '限', '阿', '宣', '环', '双', '请', '超', '微', '让', '控', '州', '良', '轴', '找', '否', '纪', '益', '依', '优', '顶', '础', '载', '倒', '房', '突', '坐', '粉', '敌', '略', '客', '袁', '冷', '胜', '绝', '析', '块', '剂', '测', '丝', '协', '诉', '念', '陈', '仍', '罗', '盐', '友', '洋', '错', '苦', '夜', '刑', '移', '频', '逐', '靠', '混', '母', '短', '皮', '终', '聚', '汽', '村', '云', '哪', '既', '距', '卫', '停', '烈', '央', '察', '烧', '迅', '境', '若', '印', '洲', '刻', '括', '激', '孔', '搞', '甚', '室', '待', '核', '校', '散', '侵', '吧', '甲', '游', '久', '菜', '味', '旧', '模', '湖', '货', '损', '预', '阻', '毫', '普', '稳', '乙', '妈', '植', '息', '扩', '银', '语', '挥', '酒', '守', '拿', '序', '纸', '医', '缺', '雨', '吗', '针', '刘', '啊', '急', '唱', '误', '训', '愿', '审', '附', '获', '茶', '鲜', '粮', '斤', '孩', '脱', '硫', '肥', '善', '龙', '演', '父', '渐', '血', '欢', '械', '掌', '歌', '沙', '刚', '攻', '谓', '盾', '讨', '晚', '粒', '乱', '燃', '矛', '乎', '杀', '药', '宁', '鲁', '贵', '钟', '煤', '读', '班', '伯', '香', '介', '迫', '句', '丰', '培', '握', '兰', '担', '弦', '蛋', '沉', '假', '穿', '执', '答', '乐', '谁', '顺', '烟', '缩', '征', '脸', '喜', '松', '脚', '困', '异', '免', '背', '星', '福', '买', '染', '井', '概', '慢', '怕', '磁', '倍', '祖', '皇', '促', '静', '补', '评', '翻', '肉', '践', '尼', '衣', '宽', '扬', '棉', '希', '伤', '操', '垂', '秋', '宜', '氢', '套', '督', '振', '架', '亮', '末', '宪', '庆', '编', '牛', '触', '映', '雷', '销', '诗', '座', '居', '抓', '裂', '胞', '呼', '娘', '景', '威', '绿', '晶', '厚', '盟', '衡', '鸡', '孙', '延', '危', '胶', '屋', '乡', '临', '陆', '顾', '掉', '呀', '灯', '岁', '措', '束', '耐', '剧', '玉', '赵', '跳', '哥', '季', '课', '凯', '胡', '额', '款', '绍', '卷', '齐', '伟', '蒸', '殖', '永', '宗', '苗', '川', '炉', '岩', '弱', '零', '杨', '奏', '沿', '露', '杆', '探', '滑', '镇', '饭', '浓', '航', '怀', '赶', '库', '夺', '伊', '灵', '税', '途', '灭', '赛', '归', '召', '鼓', '播', '盘', '裁', '险', '康', '唯', '录', '菌', '纯', '借', '糖', '盖', '横', '符', '私', '努', '堂', '域', '枪', '润', '幅', '哈', '竟', '熟', '虫', '泽', '脑', '壤', '碳', '欧', '遍', '侧', '寨', '敢', '彻', '虑', '斜', '薄', '庭', '纳', '弹', '饲', '伸', '折', '麦', '湿', '暗', '荷', '瓦', '塞', '床', '筑', '恶', '户', '访', '塔', '奇', '透', '梁', '刀', '旋', '迹', '卡', '氯', '遇', '份', '毒', '泥', '退', '洗', '摆', '灰', '彩', '卖', '耗', '夏', '择', '忙', '铜', '献', '硬', '予', '繁', '圈', '雪', '函', '亦', '抽', '篇', '阵', '阴', '丁', '尺', '追', '堆', '雄', '迎', '泛', '爸', '楼', '避', '谋', '吨', '野', '猪', '旗', '累', '偏', '典', '馆', '索', '秦', '脂', '潮', '爷', '豆', '忽', '托', '惊', '塑', '遗', '愈', '朱', '替', '纤', '粗', '倾', '尚', '痛', '楚', '谢', '奋', '购', '磨', '君', '池', '旁', '碎', '骨', '监', '捕', '弟', '暴', '割', '贯', '殊', '释', '词', '亡', '壁', '顿', '宝', '午', '尘', '闻', '揭', '炮', '残', '冬', '桥', '妇', '警', '综', '招', '吴', '付', '浮', '遭', '徐', '您', '摇', '谷', '赞', '箱', '隔', '订', '男', '吹', '园', '纷', '唐', '败', '宋', '玻', '巨', '耕', '坦', '荣', '闭', '湾', '键', '凡', '驻', '锅', '救', '恩', '剥', '凝', '碱', '齿', '截', '炼', '麻', '纺', '禁', '废', '盛', '版', '缓', '净', '睛', '昌', '婚', '涉', '筒', '嘴', '插', '岸', '朗', '庄', '街', '藏', '姑', '贸', '腐', '奴', '啦', '惯', '乘', '伙', '恢', '匀', '纱', '扎', '辩', '耳', '彪', '臣', '亿', '璃', '抵', '脉', '秀', '萨', '俄', '网', '舞', '店', '喷', '纵', '寸', '汗', '挂', '洪', '贺', '闪', '柬', '爆', '烯', '津', '稻', '墙', '软', '勇', '像', '滚', '厘', '蒙', '芳', '肯', '坡', '柱', '荡', '腿', '仪', '旅', '尾', '轧', '冰', '贡', '登', '黎', '削', '钻', '勒', '逃', '障', '氨', '郭', '峰', '币', '港', '伏', '轨', '亩', '毕', '擦', '莫', '刺', '浪', '秘', '援', '株', '健', '售', '股', '岛', '甘', '泡', '睡', '童', '铸', '汤', '阀', '休', '汇', '舍', '牧', '绕', '炸', '哲', '磷', '绩', '朋', '淡', '尖', '启', '陷', '柴', '呈', '徒', '颜', '泪', '稍', '忘', '泵', '蓝', '拖', '洞', '授', '镜', '辛', '壮', '锋', '贫', '虚', '弯', '摩', '泰', '幼', '廷', '尊', '窗', '纲', '弄', '隶', '疑', '氏', '宫', '姐', '震', '瑞', '怪', '尤', '琴', '循', '描', '膜', '违', '夹', '腰', '缘', '珠', '穷', '森', '枝', '竹', '沟', '催', '绳', '忆', '邦', '剩', '幸', '浆', '栏', '拥', '牙', '贮', '礼', '滤', '钠', '纹', '罢', '拍', '咱', '喊', '袖', '埃', '勤', '罚', '焦', '潜', '伍', '墨', '欲', '缝', '姓', '刊', '饱', '仿', '奖', '铝', '鬼', '丽', '跨', '默', '挖', '链', '扫', '喝', '袋', '炭', '污', '幕', '诸', '弧', '励', '梅', '奶', '洁', '灾', '舟', '鉴', '苯', '讼', '抱', '毁', '懂', '寒', '智', '埔', '寄', '届', '跃', '渡', '挑', '丹', '艰', '贝', '碰', '拔', '爹', '戴', '码', '梦', '芽', '熔', '赤', '渔', '哭', '敬', '颗', '奔', '铅', '仲', '虎', '稀', '妹', '乏', '珍', '申', '桌', '遵', '允', '隆', '螺', '仓', '魏', '锐', '晓', '氮', '兼', '隐', '碍', '赫', '拨', '忠', '肃', '缸', '牵', '抢', '博', '巧', '壳', '兄', '杜', '讯', '诚', '碧', '祥', '柯', '页', '巡', '矩', '悲', '灌', '龄', '伦', '票', '寻', '桂', '铺', '圣', '恐', '恰', '郑', '趣', '抬', '荒', '腾', '贴', '柔', '滴', '猛', '阔', '辆', '妻', '填', '撤', '储', '签', '闹', '扰', '紫', '砂', '递', '戏', '吊', '陶', '伐', '喂', '疗', '瓶', '婆', '抚', '臂', '摸', '忍', '虾', '蜡', '邻', '胸', '巩', '挤', '偶', '弃', '槽', '劲', '乳', '邓', '吉', '仁', '烂', '砖', '租', '乌', '舰', '伴', '瓜', '浅', '丙', '暂', '燥', '橡', '柳', '迷', '暖', '牌', '秧', '胆', '详', '簧', '踏', '瓷', '谱', '呆', '宾', '糊', '洛', '辉', '愤', '竞', '隙', '怒', '粘', '乃', '绪', '肩', '籍', '敏', '涂', '熙', '皆', '侦', '悬', '掘', '享', '纠', '醒', '狂', '锁', '淀', '恨', '牲', '霸', '爬', '赏', '逆', '玩', '陵', '祝', '秒', '浙', '貌', '役', '彼', '悉', '鸭', '趋', '凤', '晨', '畜', '辈', '秩', '卵', '署', '梯', '炎', '滩', '棋', '驱', '筛', '峡', '冒', '啥', '寿', '译', '浸', '泉', '帽', '迟', '硅', '疆', '贷', '漏', '稿', '冠', '嫩', '胁', '芯', '牢', '叛', '蚀', '奥', '鸣', '岭', '羊', '凭', '串', '塘', '绘', '酵', '融', '盆', '锡', '庙', '筹', '冻', '辅', '摄', '袭', '筋', '拒', '僚', '旱', '钾', '鸟', '漆', '沈', '眉', '疏', '添', '棒', '穗', '硝', '韩', '逼', '扭', '侨', '凉', '挺', '碗', '栽', '炒', '杯', '患', '馏', '劝', '豪', '辽', '勃', '鸿', '旦', '吏', '拜', '狗', '埋', '辊', '掩', '饮', '搬', '骂', '辞', '勾', '扣', '估', '蒋', '绒', '雾', '丈', '朵', '姆', '拟', '宇', '辑', '陕', '雕', '偿', '蓄', '崇', '剪', '倡', '厅', '咬', '驶', '薯', '刷', '斥', '番', '赋', '奉', '佛', '浇', '漫', '曼', '扇', '钙', '桃', '扶', '仔', '返', '俗', '亏', '腔', '鞋', '棱', '覆', '框', '悄', '叔', '撞', '骗', '勘', '旺', '沸', '孤', '吐', '孟', '渠', '屈', '疾', '妙', '惜', '仰', '狠', '胀', '谐', '抛', '霉', '桑', '岗', '嘛', '衰', '盗', '渗', '脏', '赖', '涌', '甜', '曹', '阅', '肌', '哩', '厉', '烃', '纬', '毅', '昨', '伪', '症', '煮', '叹', '钉', '搭', '茎', '笼', '酷', '偷', '弓', '锥', '恒', '杰', '坑', '鼻', '翼', '纶', '叙', '狱', '逮', '罐', '络', '棚', '抑', '膨', '蔬', '寺', '骤', '穆', '冶', '枯', '册', '尸', '凸', '绅', '坯', '牺', '焰', '轰', '欣', '晋', '瘦', '御', '锭', '锦', '丧', '旬', '锻', '垄', '搜', '扑', '邀', '亭', '酯', '迈', '舒', '脆', '酶', '闲', '忧', '酚', '顽', '羽', '涨', '卸', '仗', '陪', '辟', '惩', '杭', '姚', '肚', '捉', '飘', '漂', '昆', '欺', '吾', '郎', '烷', '汁', '呵', '饰', '萧', '雅', '邮', '迁', '燕', '撒', '姻', '赴', '宴', '烦', '债', '帐', '斑', '铃', '旨', '醇', '董', '饼', '雏', '姿', '拌', '傅', '腹', '妥', '揉', '贤', '拆', '歪', '葡', '胺', '丢', '浩', '徽', '昂', '垫', '挡', '览', '贪', '慰', '缴', '汪', '慌', '冯', '诺', '姜', '谊', '凶', '劣', '诬', '耀', '昏', '躺', '盈', '骑', '乔', '溪', '丛', '卢', '抹', '闷', '咨', '刮', '驾', '缆', '悟', '摘', '铒', '掷', '颇', '幻', '柄', '惠', '惨', '佳', '仇', '腊', '窝', '涤', '剑', '瞧', '堡', '泼', '葱', '罩', '霍', '捞', '胎', '苍', '滨', '俩', '捅', '湘', '砍', '霞', '邵', '萄', '疯', '淮', '遂', '熊', '粪', '烘', '宿', '档', '戈', '驳', '嫂', '裕', '徙', '箭', '捐', '肠', '撑', '晒', '辨', '殿', '莲', '摊', '搅', '酱', '屏', '疫', '哀', '蔡', '堵', '沫', '皱', '畅', '叠', '阁', '莱', '敲', '辖', '钩', '痕', '坝', '巷', '饿', '祸', '丘', '玄', '溜', '曰', '逻', '彭', '尝', '卿', '妨', '艇', '吞', '韦', '怨', '矮', '歇'];

var ENGLISH = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction', 'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit', 'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology', 'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil', 'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss', 'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown', 'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet', 'bundle', 'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy', 'butter', 'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cactus', 'cage', 'cake', 'call', 'calm', 'camera', 'camp', 'can', 'canal', 'cancel', 'candy', 'cannon', 'canoe', 'canvas', 'canyon', 'capable', 'capital', 'captain', 'car', 'carbon', 'card', 'cargo', 'carpet', 'carry', 'cart', 'case', 'cash', 'casino', 'castle', 'casual', 'cat', 'catalog', 'catch', 'category', 'cattle', 'caught', 'cause', 'caution', 'cave', 'ceiling', 'celery', 'cement', 'census', 'century', 'cereal', 'certain', 'chair', 'chalk', 'champion', 'change', 'chaos', 'chapter', 'charge', 'chase', 'chat', 'cheap', 'check', 'cheese', 'chef', 'cherry', 'chest', 'chicken', 'chief', 'child', 'chimney', 'choice', 'choose', 'chronic', 'chuckle', 'chunk', 'churn', 'cigar', 'cinnamon', 'circle', 'citizen', 'city', 'civil', 'claim', 'clap', 'clarify', 'claw', 'clay', 'clean', 'clerk', 'clever', 'click', 'client', 'cliff', 'climb', 'clinic', 'clip', 'clock', 'clog', 'close', 'cloth', 'cloud', 'clown', 'club', 'clump', 'cluster', 'clutch', 'coach', 'coast', 'coconut', 'code', 'coffee', 'coil', 'coin', 'collect', 'color', 'column', 'combine', 'come', 'comfort', 'comic', 'common', 'company', 'concert', 'conduct', 'confirm', 'congress', 'connect', 'consider', 'control', 'convince', 'cook', 'cool', 'copper', 'copy', 'coral', 'core', 'corn', 'correct', 'cost', 'cotton', 'couch', 'country', 'couple', 'course', 'cousin', 'cover', 'coyote', 'crack', 'cradle', 'craft', 'cram', 'crane', 'crash', 'crater', 'crawl', 'crazy', 'cream', 'credit', 'creek', 'crew', 'cricket', 'crime', 'crisp', 'critic', 'crop', 'cross', 'crouch', 'crowd', 'crucial', 'cruel', 'cruise', 'crumble', 'crunch', 'crush', 'cry', 'crystal', 'cube', 'culture', 'cup', 'cupboard', 'curious', 'current', 'curtain', 'curve', 'cushion', 'custom', 'cute', 'cycle', 'dad', 'damage', 'damp', 'dance', 'danger', 'daring', 'dash', 'daughter', 'dawn', 'day', 'deal', 'debate', 'debris', 'decade', 'december', 'decide', 'decline', 'decorate', 'decrease', 'deer', 'defense', 'define', 'defy', 'degree', 'delay', 'deliver', 'demand', 'demise', 'denial', 'dentist', 'deny', 'depart', 'depend', 'deposit', 'depth', 'deputy', 'derive', 'describe', 'desert', 'design', 'desk', 'despair', 'destroy', 'detail', 'detect', 'develop', 'device', 'devote', 'diagram', 'dial', 'diamond', 'diary', 'dice', 'diesel', 'diet', 'differ', 'digital', 'dignity', 'dilemma', 'dinner', 'dinosaur', 'direct', 'dirt', 'disagree', 'discover', 'disease', 'dish', 'dismiss', 'disorder', 'display', 'distance', 'divert', 'divide', 'divorce', 'dizzy', 'doctor', 'document', 'dog', 'doll', 'dolphin', 'domain', 'donate', 'donkey', 'donor', 'door', 'dose', 'double', 'dove', 'draft', 'dragon', 'drama', 'drastic', 'draw', 'dream', 'dress', 'drift', 'drill', 'drink', 'drip', 'drive', 'drop', 'drum', 'dry', 'duck', 'dumb', 'dune', 'during', 'dust', 'dutch', 'duty', 'dwarf', 'dynamic', 'eager', 'eagle', 'early', 'earn', 'earth', 'easily', 'east', 'easy', 'echo', 'ecology', 'economy', 'edge', 'edit', 'educate', 'effort', 'egg', 'eight', 'either', 'elbow', 'elder', 'electric', 'elegant', 'element', 'elephant', 'elevator', 'elite', 'else', 'embark', 'embody', 'embrace', 'emerge', 'emotion', 'employ', 'empower', 'empty', 'enable', 'enact', 'end', 'endless', 'endorse', 'enemy', 'energy', 'enforce', 'engage', 'engine', 'enhance', 'enjoy', 'enlist', 'enough', 'enrich', 'enroll', 'ensure', 'enter', 'entire', 'entry', 'envelope', 'episode', 'equal', 'equip', 'era', 'erase', 'erode', 'erosion', 'error', 'erupt', 'escape', 'essay', 'essence', 'estate', 'eternal', 'ethics', 'evidence', 'evil', 'evoke', 'evolve', 'exact', 'example', 'excess', 'exchange', 'excite', 'exclude', 'excuse', 'execute', 'exercise', 'exhaust', 'exhibit', 'exile', 'exist', 'exit', 'exotic', 'expand', 'expect', 'expire', 'explain', 'expose', 'express', 'extend', 'extra', 'eye', 'eyebrow', 'fabric', 'face', 'faculty', 'fade', 'faint', 'faith', 'fall', 'false', 'fame', 'family', 'famous', 'fan', 'fancy', 'fantasy', 'farm', 'fashion', 'fat', 'fatal', 'father', 'fatigue', 'fault', 'favorite', 'feature', 'february', 'federal', 'fee', 'feed', 'feel', 'female', 'fence', 'festival', 'fetch', 'fever', 'few', 'fiber', 'fiction', 'field', 'figure', 'file', 'film', 'filter', 'final', 'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first', 'fiscal', 'fish', 'fit', 'fitness', 'fix', 'flag', 'flame', 'flash', 'flat', 'flavor', 'flee', 'flight', 'flip', 'float', 'flock', 'floor', 'flower', 'fluid', 'flush', 'fly', 'foam', 'focus', 'fog', 'foil', 'fold', 'follow', 'food', 'foot', 'force', 'forest', 'forget', 'fork', 'fortune', 'forum', 'forward', 'fossil', 'foster', 'found', 'fox', 'fragile', 'frame', 'frequent', 'fresh', 'friend', 'fringe', 'frog', 'front', 'frost', 'frown', 'frozen', 'fruit', 'fuel', 'fun', 'funny', 'furnace', 'fury', 'future', 'gadget', 'gain', 'galaxy', 'gallery', 'game', 'gap', 'garage', 'garbage', 'garden', 'garlic', 'garment', 'gas', 'gasp', 'gate', 'gather', 'gauge', 'gaze', 'general', 'genius', 'genre', 'gentle', 'genuine', 'gesture', 'ghost', 'giant', 'gift', 'giggle', 'ginger', 'giraffe', 'girl', 'give', 'glad', 'glance', 'glare', 'glass', 'glide', 'glimpse', 'globe', 'gloom', 'glory', 'glove', 'glow', 'glue', 'goat', 'goddess', 'gold', 'good', 'goose', 'gorilla', 'gospel', 'gossip', 'govern', 'gown', 'grab', 'grace', 'grain', 'grant', 'grape', 'grass', 'gravity', 'great', 'green', 'grid', 'grief', 'grit', 'grocery', 'group', 'grow', 'grunt', 'guard', 'guess', 'guide', 'guilt', 'guitar', 'gun', 'gym', 'habit', 'hair', 'half', 'hammer', 'hamster', 'hand', 'happy', 'harbor', 'hard', 'harsh', 'harvest', 'hat', 'have', 'hawk', 'hazard', 'head', 'health', 'heart', 'heavy', 'hedgehog', 'height', 'hello', 'helmet', 'help', 'hen', 'hero', 'hidden', 'high', 'hill', 'hint', 'hip', 'hire', 'history', 'hobby', 'hockey', 'hold', 'hole', 'holiday', 'hollow', 'home', 'honey', 'hood', 'hope', 'horn', 'horror', 'horse', 'hospital', 'host', 'hotel', 'hour', 'hover', 'hub', 'huge', 'human', 'humble', 'humor', 'hundred', 'hungry', 'hunt', 'hurdle', 'hurry', 'hurt', 'husband', 'hybrid', 'ice', 'icon', 'idea', 'identify', 'idle', 'ignore', 'ill', 'illegal', 'illness', 'image', 'imitate', 'immense', 'immune', 'impact', 'impose', 'improve', 'impulse', 'inch', 'include', 'income', 'increase', 'index', 'indicate', 'indoor', 'industry', 'infant', 'inflict', 'inform', 'inhale', 'inherit', 'initial', 'inject', 'injury', 'inmate', 'inner', 'innocent', 'input', 'inquiry', 'insane', 'insect', 'inside', 'inspire', 'install', 'intact', 'interest', 'into', 'invest', 'invite', 'involve', 'iron', 'island', 'isolate', 'issue', 'item', 'ivory', 'jacket', 'jaguar', 'jar', 'jazz', 'jealous', 'jeans', 'jelly', 'jewel', 'job', 'join', 'joke', 'journey', 'joy', 'judge', 'juice', 'jump', 'jungle', 'junior', 'junk', 'just', 'kangaroo', 'keen', 'keep', 'ketchup', 'key', 'kick', 'kid', 'kidney', 'kind', 'kingdom', 'kiss', 'kit', 'kitchen', 'kite', 'kitten', 'kiwi', 'knee', 'knife', 'knock', 'know', 'lab', 'label', 'labor', 'ladder', 'lady', 'lake', 'lamp', 'language', 'laptop', 'large', 'later', 'latin', 'laugh', 'laundry', 'lava', 'law', 'lawn', 'lawsuit', 'layer', 'lazy', 'leader', 'leaf', 'learn', 'leave', 'lecture', 'left', 'leg', 'legal', 'legend', 'leisure', 'lemon', 'lend', 'length', 'lens', 'leopard', 'lesson', 'letter', 'level', 'liar', 'liberty', 'library', 'license', 'life', 'lift', 'light', 'like', 'limb', 'limit', 'link', 'lion', 'liquid', 'list', 'little', 'live', 'lizard', 'load', 'loan', 'lobster', 'local', 'lock', 'logic', 'lonely', 'long', 'loop', 'lottery', 'loud', 'lounge', 'love', 'loyal', 'lucky', 'luggage', 'lumber', 'lunar', 'lunch', 'luxury', 'lyrics', 'machine', 'mad', 'magic', 'magnet', 'maid', 'mail', 'main', 'major', 'make', 'mammal', 'man', 'manage', 'mandate', 'mango', 'mansion', 'manual', 'maple', 'marble', 'march', 'margin', 'marine', 'market', 'marriage', 'mask', 'mass', 'master', 'match', 'material', 'math', 'matrix', 'matter', 'maximum', 'maze', 'meadow', 'mean', 'measure', 'meat', 'mechanic', 'medal', 'media', 'melody', 'melt', 'member', 'memory', 'mention', 'menu', 'mercy', 'merge', 'merit', 'merry', 'mesh', 'message', 'metal', 'method', 'middle', 'midnight', 'milk', 'million', 'mimic', 'mind', 'minimum', 'minor', 'minute', 'miracle', 'mirror', 'misery', 'miss', 'mistake', 'mix', 'mixed', 'mixture', 'mobile', 'model', 'modify', 'mom', 'moment', 'monitor', 'monkey', 'monster', 'month', 'moon', 'moral', 'more', 'morning', 'mosquito', 'mother', 'motion', 'motor', 'mountain', 'mouse', 'move', 'movie', 'much', 'muffin', 'mule', 'multiply', 'muscle', 'museum', 'mushroom', 'music', 'must', 'mutual', 'myself', 'mystery', 'myth', 'naive', 'name', 'napkin', 'narrow', 'nasty', 'nation', 'nature', 'near', 'neck', 'need', 'negative', 'neglect', 'neither', 'nephew', 'nerve', 'nest', 'net', 'network', 'neutral', 'never', 'news', 'next', 'nice', 'night', 'noble', 'noise', 'nominee', 'noodle', 'normal', 'north', 'nose', 'notable', 'note', 'nothing', 'notice', 'novel', 'now', 'nuclear', 'number', 'nurse', 'nut', 'oak', 'obey', 'object', 'oblige', 'obscure', 'observe', 'obtain', 'obvious', 'occur', 'ocean', 'october', 'odor', 'off', 'offer', 'office', 'often', 'oil', 'okay', 'old', 'olive', 'olympic', 'omit', 'once', 'one', 'onion', 'online', 'only', 'open', 'opera', 'opinion', 'oppose', 'option', 'orange', 'orbit', 'orchard', 'order', 'ordinary', 'organ', 'orient', 'original', 'orphan', 'ostrich', 'other', 'outdoor', 'outer', 'output', 'outside', 'oval', 'oven', 'over', 'own', 'owner', 'oxygen', 'oyster', 'ozone', 'pact', 'paddle', 'page', 'pair', 'palace', 'palm', 'panda', 'panel', 'panic', 'panther', 'paper', 'parade', 'parent', 'park', 'parrot', 'party', 'pass', 'patch', 'path', 'patient', 'patrol', 'pattern', 'pause', 'pave', 'payment', 'peace', 'peanut', 'pear', 'peasant', 'pelican', 'pen', 'penalty', 'pencil', 'people', 'pepper', 'perfect', 'permit', 'person', 'pet', 'phone', 'photo', 'phrase', 'physical', 'piano', 'picnic', 'picture', 'piece', 'pig', 'pigeon', 'pill', 'pilot', 'pink', 'pioneer', 'pipe', 'pistol', 'pitch', 'pizza', 'place', 'planet', 'plastic', 'plate', 'play', 'please', 'pledge', 'pluck', 'plug', 'plunge', 'poem', 'poet', 'point', 'polar', 'pole', 'police', 'pond', 'pony', 'pool', 'popular', 'portion', 'position', 'possible', 'post', 'potato', 'pottery', 'poverty', 'powder', 'power', 'practice', 'praise', 'predict', 'prefer', 'prepare', 'present', 'pretty', 'prevent', 'price', 'pride', 'primary', 'print', 'priority', 'prison', 'private', 'prize', 'problem', 'process', 'produce', 'profit', 'program', 'project', 'promote', 'proof', 'property', 'prosper', 'protect', 'proud', 'provide', 'public', 'pudding', 'pull', 'pulp', 'pulse', 'pumpkin', 'punch', 'pupil', 'puppy', 'purchase', 'purity', 'purpose', 'purse', 'push', 'put', 'puzzle', 'pyramid', 'quality', 'quantum', 'quarter', 'question', 'quick', 'quit', 'quiz', 'quote', 'rabbit', 'raccoon', 'race', 'rack', 'radar', 'radio', 'rail', 'rain', 'raise', 'rally', 'ramp', 'ranch', 'random', 'range', 'rapid', 'rare', 'rate', 'rather', 'raven', 'raw', 'razor', 'ready', 'real', 'reason', 'rebel', 'rebuild', 'recall', 'receive', 'recipe', 'record', 'recycle', 'reduce', 'reflect', 'reform', 'refuse', 'region', 'regret', 'regular', 'reject', 'relax', 'release', 'relief', 'rely', 'remain', 'remember', 'remind', 'remove', 'render', 'renew', 'rent', 'reopen', 'repair', 'repeat', 'replace', 'report', 'require', 'rescue', 'resemble', 'resist', 'resource', 'response', 'result', 'retire', 'retreat', 'return', 'reunion', 'reveal', 'review', 'reward', 'rhythm', 'rib', 'ribbon', 'rice', 'rich', 'ride', 'ridge', 'rifle', 'right', 'rigid', 'ring', 'riot', 'ripple', 'risk', 'ritual', 'rival', 'river', 'road', 'roast', 'robot', 'robust', 'rocket', 'romance', 'roof', 'rookie', 'room', 'rose', 'rotate', 'rough', 'round', 'route', 'royal', 'rubber', 'rude', 'rug', 'rule', 'run', 'runway', 'rural', 'sad', 'saddle', 'sadness', 'safe', 'sail', 'salad', 'salmon', 'salon', 'salt', 'salute', 'same', 'sample', 'sand', 'satisfy', 'satoshi', 'sauce', 'sausage', 'save', 'say', 'scale', 'scan', 'scare', 'scatter', 'scene', 'scheme', 'school', 'science', 'scissors', 'scorpion', 'scout', 'scrap', 'screen', 'script', 'scrub', 'sea', 'search', 'season', 'seat', 'second', 'secret', 'section', 'security', 'seed', 'seek', 'segment', 'select', 'sell', 'seminar', 'senior', 'sense', 'sentence', 'series', 'service', 'session', 'settle', 'setup', 'seven', 'shadow', 'shaft', 'shallow', 'share', 'shed', 'shell', 'sheriff', 'shield', 'shift', 'shine', 'ship', 'shiver', 'shock', 'shoe', 'shoot', 'shop', 'short', 'shoulder', 'shove', 'shrimp', 'shrug', 'shuffle', 'shy', 'sibling', 'sick', 'side', 'siege', 'sight', 'sign', 'silent', 'silk', 'silly', 'silver', 'similar', 'simple', 'since', 'sing', 'siren', 'sister', 'situate', 'six', 'size', 'skate', 'sketch', 'ski', 'skill', 'skin', 'skirt', 'skull', 'slab', 'slam', 'sleep', 'slender', 'slice', 'slide', 'slight', 'slim', 'slogan', 'slot', 'slow', 'slush', 'small', 'smart', 'smile', 'smoke', 'smooth', 'snack', 'snake', 'snap', 'sniff', 'snow', 'soap', 'soccer', 'social', 'sock', 'soda', 'soft', 'solar', 'soldier', 'solid', 'solution', 'solve', 'someone', 'song', 'soon', 'sorry', 'sort', 'soul', 'sound', 'soup', 'source', 'south', 'space', 'spare', 'spatial', 'spawn', 'speak', 'special', 'speed', 'spell', 'spend', 'sphere', 'spice', 'spider', 'spike', 'spin', 'spirit', 'split', 'spoil', 'sponsor', 'spoon', 'sport', 'spot', 'spray', 'spread', 'spring', 'spy', 'square', 'squeeze', 'squirrel', 'stable', 'stadium', 'staff', 'stage', 'stairs', 'stamp', 'stand', 'start', 'state', 'stay', 'steak', 'steel', 'stem', 'step', 'stereo', 'stick', 'still', 'sting', 'stock', 'stomach', 'stone', 'stool', 'story', 'stove', 'strategy', 'street', 'strike', 'strong', 'struggle', 'student', 'stuff', 'stumble', 'style', 'subject', 'submit', 'subway', 'success', 'such', 'sudden', 'suffer', 'sugar', 'suggest', 'suit', 'summer', 'sun', 'sunny', 'sunset', 'super', 'supply', 'supreme', 'sure', 'surface', 'surge', 'surprise', 'surround', 'survey', 'suspect', 'sustain', 'swallow', 'swamp', 'swap', 'swarm', 'swear', 'sweet', 'swift', 'swim', 'swing', 'switch', 'sword', 'symbol', 'symptom', 'syrup', 'system', 'table', 'tackle', 'tag', 'tail', 'talent', 'talk', 'tank', 'tape', 'target', 'task', 'taste', 'tattoo', 'taxi', 'teach', 'team', 'tell', 'ten', 'tenant', 'tennis', 'tent', 'term', 'test', 'text', 'thank', 'that', 'theme', 'then', 'theory', 'there', 'they', 'thing', 'this', 'thought', 'three', 'thrive', 'throw', 'thumb', 'thunder', 'ticket', 'tide', 'tiger', 'tilt', 'timber', 'time', 'tiny', 'tip', 'tired', 'tissue', 'title', 'toast', 'tobacco', 'today', 'toddler', 'toe', 'together', 'toilet', 'token', 'tomato', 'tomorrow', 'tone', 'tongue', 'tonight', 'tool', 'tooth', 'top', 'topic', 'topple', 'torch', 'tornado', 'tortoise', 'toss', 'total', 'tourist', 'toward', 'tower', 'town', 'toy', 'track', 'trade', 'traffic', 'tragic', 'train', 'transfer', 'trap', 'trash', 'travel', 'tray', 'treat', 'tree', 'trend', 'trial', 'tribe', 'trick', 'trigger', 'trim', 'trip', 'trophy', 'trouble', 'truck', 'true', 'truly', 'trumpet', 'trust', 'truth', 'try', 'tube', 'tuition', 'tumble', 'tuna', 'tunnel', 'turkey', 'turn', 'turtle', 'twelve', 'twenty', 'twice', 'twin', 'twist', 'two', 'type', 'typical', 'ugly', 'umbrella', 'unable', 'unaware', 'uncle', 'uncover', 'under', 'undo', 'unfair', 'unfold', 'unhappy', 'uniform', 'unique', 'unit', 'universe', 'unknown', 'unlock', 'until', 'unusual', 'unveil', 'update', 'upgrade', 'uphold', 'upon', 'upper', 'upset', 'urban', 'urge', 'usage', 'use', 'used', 'useful', 'useless', 'usual', 'utility', 'vacant', 'vacuum', 'vague', 'valid', 'valley', 'valve', 'van', 'vanish', 'vapor', 'various', 'vast', 'vault', 'vehicle', 'velvet', 'vendor', 'venture', 'venue', 'verb', 'verify', 'version', 'very', 'vessel', 'veteran', 'viable', 'vibrant', 'vicious', 'victory', 'video', 'view', 'village', 'vintage', 'violin', 'virtual', 'virus', 'visa', 'visit', 'visual', 'vital', 'vivid', 'vocal', 'voice', 'void', 'volcano', 'volume', 'vote', 'voyage', 'wage', 'wagon', 'wait', 'walk', 'wall', 'walnut', 'want', 'warfare', 'warm', 'warrior', 'wash', 'wasp', 'waste', 'water', 'wave', 'way', 'wealth', 'weapon', 'wear', 'weasel', 'weather', 'web', 'wedding', 'weekend', 'weird', 'welcome', 'west', 'wet', 'whale', 'what', 'wheat', 'wheel', 'when', 'where', 'whip', 'whisper', 'wide', 'width', 'wife', 'wild', 'will', 'win', 'window', 'wine', 'wing', 'wink', 'winner', 'winter', 'wire', 'wisdom', 'wise', 'wish', 'witness', 'wolf', 'woman', 'wonder', 'wood', 'wool', 'word', 'work', 'world', 'worry', 'worth', 'wrap', 'wreck', 'wrestle', 'wrist', 'write', 'wrong', 'yard', 'year', 'yellow', 'you', 'young', 'youth', 'zebra', 'zero', 'zone', 'zoo'];

var FRENCH = ['abaisser', 'abandon', 'abdiquer', 'abeille', 'abolir', 'aborder', 'aboutir', 'aboyer', 'abrasif', 'abreuver', 'abriter', 'abroger', 'abrupt', 'absence', 'absolu', 'absurde', 'abusif', 'abyssal', 'académie', 'acajou', 'acarien', 'accabler', 'accepter', 'acclamer', 'accolade', 'accroche', 'accuser', 'acerbe', 'achat', 'acheter', 'aciduler', 'acier', 'acompte', 'acquérir', 'acronyme', 'acteur', 'actif', 'actuel', 'adepte', 'adéquat', 'adhésif', 'adjectif', 'adjuger', 'admettre', 'admirer', 'adopter', 'adorer', 'adoucir', 'adresse', 'adroit', 'adulte', 'adverbe', 'aérer', 'aéronef', 'affaire', 'affecter', 'affiche', 'affreux', 'affubler', 'agacer', 'agencer', 'agile', 'agiter', 'agrafer', 'agréable', 'agrume', 'aider', 'aiguille', 'ailier', 'aimable', 'aisance', 'ajouter', 'ajuster', 'alarmer', 'alchimie', 'alerte', 'algèbre', 'algue', 'aliéner', 'aliment', 'alléger', 'alliage', 'allouer', 'allumer', 'alourdir', 'alpaga', 'altesse', 'alvéole', 'amateur', 'ambigu', 'ambre', 'aménager', 'amertume', 'amidon', 'amiral', 'amorcer', 'amour', 'amovible', 'amphibie', 'ampleur', 'amusant', 'analyse', 'anaphore', 'anarchie', 'anatomie', 'ancien', 'anéantir', 'angle', 'angoisse', 'anguleux', 'animal', 'annexer', 'annonce', 'annuel', 'anodin', 'anomalie', 'anonyme', 'anormal', 'antenne', 'antidote', 'anxieux', 'apaiser', 'apéritif', 'aplanir', 'apologie', 'appareil', 'appeler', 'apporter', 'appuyer', 'aquarium', 'aqueduc', 'arbitre', 'arbuste', 'ardeur', 'ardoise', 'argent', 'arlequin', 'armature', 'armement', 'armoire', 'armure', 'arpenter', 'arracher', 'arriver', 'arroser', 'arsenic', 'artériel', 'article', 'aspect', 'asphalte', 'aspirer', 'assaut', 'asservir', 'assiette', 'associer', 'assurer', 'asticot', 'astre', 'astuce', 'atelier', 'atome', 'atrium', 'atroce', 'attaque', 'attentif', 'attirer', 'attraper', 'aubaine', 'auberge', 'audace', 'audible', 'augurer', 'aurore', 'automne', 'autruche', 'avaler', 'avancer', 'avarice', 'avenir', 'averse', 'aveugle', 'aviateur', 'avide', 'avion', 'aviser', 'avoine', 'avouer', 'avril', 'axial', 'axiome', 'badge', 'bafouer', 'bagage', 'baguette', 'baignade', 'balancer', 'balcon', 'baleine', 'balisage', 'bambin', 'bancaire', 'bandage', 'banlieue', 'bannière', 'banquier', 'barbier', 'baril', 'baron', 'barque', 'barrage', 'bassin', 'bastion', 'bataille', 'bateau', 'batterie', 'baudrier', 'bavarder', 'belette', 'bélier', 'belote', 'bénéfice', 'berceau', 'berger', 'berline', 'bermuda', 'besace', 'besogne', 'bétail', 'beurre', 'biberon', 'bicycle', 'bidule', 'bijou', 'bilan', 'bilingue', 'billard', 'binaire', 'biologie', 'biopsie', 'biotype', 'biscuit', 'bison', 'bistouri', 'bitume', 'bizarre', 'blafard', 'blague', 'blanchir', 'blessant', 'blinder', 'blond', 'bloquer', 'blouson', 'bobard', 'bobine', 'boire', 'boiser', 'bolide', 'bonbon', 'bondir', 'bonheur', 'bonifier', 'bonus', 'bordure', 'borne', 'botte', 'boucle', 'boueux', 'bougie', 'boulon', 'bouquin', 'bourse', 'boussole', 'boutique', 'boxeur', 'branche', 'brasier', 'brave', 'brebis', 'brèche', 'breuvage', 'bricoler', 'brigade', 'brillant', 'brioche', 'brique', 'brochure', 'broder', 'bronzer', 'brousse', 'broyeur', 'brume', 'brusque', 'brutal', 'bruyant', 'buffle', 'buisson', 'bulletin', 'bureau', 'burin', 'bustier', 'butiner', 'butoir', 'buvable', 'buvette', 'cabanon', 'cabine', 'cachette', 'cadeau', 'cadre', 'caféine', 'caillou', 'caisson', 'calculer', 'calepin', 'calibre', 'calmer', 'calomnie', 'calvaire', 'camarade', 'caméra', 'camion', 'campagne', 'canal', 'caneton', 'canon', 'cantine', 'canular', 'capable', 'caporal', 'caprice', 'capsule', 'capter', 'capuche', 'carabine', 'carbone', 'caresser', 'caribou', 'carnage', 'carotte', 'carreau', 'carton', 'cascade', 'casier', 'casque', 'cassure', 'causer', 'caution', 'cavalier', 'caverne', 'caviar', 'cédille', 'ceinture', 'céleste', 'cellule', 'cendrier', 'censurer', 'central', 'cercle', 'cérébral', 'cerise', 'cerner', 'cerveau', 'cesser', 'chagrin', 'chaise', 'chaleur', 'chambre', 'chance', 'chapitre', 'charbon', 'chasseur', 'chaton', 'chausson', 'chavirer', 'chemise', 'chenille', 'chéquier', 'chercher', 'cheval', 'chien', 'chiffre', 'chignon', 'chimère', 'chiot', 'chlorure', 'chocolat', 'choisir', 'chose', 'chouette', 'chrome', 'chute', 'cigare', 'cigogne', 'cimenter', 'cinéma', 'cintrer', 'circuler', 'cirer', 'cirque', 'citerne', 'citoyen', 'citron', 'civil', 'clairon', 'clameur', 'claquer', 'classe', 'clavier', 'client', 'cligner', 'climat', 'clivage', 'cloche', 'clonage', 'cloporte', 'cobalt', 'cobra', 'cocasse', 'cocotier', 'coder', 'codifier', 'coffre', 'cogner', 'cohésion', 'coiffer', 'coincer', 'colère', 'colibri', 'colline', 'colmater', 'colonel', 'combat', 'comédie', 'commande', 'compact', 'concert', 'conduire', 'confier', 'congeler', 'connoter', 'consonne', 'contact', 'convexe', 'copain', 'copie', 'corail', 'corbeau', 'cordage', 'corniche', 'corpus', 'correct', 'cortège', 'cosmique', 'costume', 'coton', 'coude', 'coupure', 'courage', 'couteau', 'couvrir', 'coyote', 'crabe', 'crainte', 'cravate', 'crayon', 'créature', 'créditer', 'crémeux', 'creuser', 'crevette', 'cribler', 'crier', 'cristal', 'critère', 'croire', 'croquer', 'crotale', 'crucial', 'cruel', 'crypter', 'cubique', 'cueillir', 'cuillère', 'cuisine', 'cuivre', 'culminer', 'cultiver', 'cumuler', 'cupide', 'curatif', 'curseur', 'cyanure', 'cycle', 'cylindre', 'cynique', 'daigner', 'damier', 'danger', 'danseur', 'dauphin', 'débattre', 'débiter', 'déborder', 'débrider', 'débutant', 'décaler', 'décembre', 'déchirer', 'décider', 'déclarer', 'décorer', 'décrire', 'décupler', 'dédale', 'déductif', 'déesse', 'défensif', 'défiler', 'défrayer', 'dégager', 'dégivrer', 'déglutir', 'dégrafer', 'déjeuner', 'délice', 'déloger', 'demander', 'demeurer', 'démolir', 'dénicher', 'dénouer', 'dentelle', 'dénuder', 'départ', 'dépenser', 'déphaser', 'déplacer', 'déposer', 'déranger', 'dérober', 'désastre', 'descente', 'désert', 'désigner', 'désobéir', 'dessiner', 'destrier', 'détacher', 'détester', 'détourer', 'détresse', 'devancer', 'devenir', 'deviner', 'devoir', 'diable', 'dialogue', 'diamant', 'dicter', 'différer', 'digérer', 'digital', 'digne', 'diluer', 'dimanche', 'diminuer', 'dioxyde', 'directif', 'diriger', 'discuter', 'disposer', 'dissiper', 'distance', 'divertir', 'diviser', 'docile', 'docteur', 'dogme', 'doigt', 'domaine', 'domicile', 'dompter', 'donateur', 'donjon', 'donner', 'dopamine', 'dortoir', 'dorure', 'dosage', 'doseur', 'dossier', 'dotation', 'douanier', 'double', 'douceur', 'douter', 'doyen', 'dragon', 'draper', 'dresser', 'dribbler', 'droiture', 'duperie', 'duplexe', 'durable', 'durcir', 'dynastie', 'éblouir', 'écarter', 'écharpe', 'échelle', 'éclairer', 'éclipse', 'éclore', 'écluse', 'école', 'économie', 'écorce', 'écouter', 'écraser', 'écrémer', 'écrivain', 'écrou', 'écume', 'écureuil', 'édifier', 'éduquer', 'effacer', 'effectif', 'effigie', 'effort', 'effrayer', 'effusion', 'égaliser', 'égarer', 'éjecter', 'élaborer', 'élargir', 'électron', 'élégant', 'éléphant', 'élève', 'éligible', 'élitisme', 'éloge', 'élucider', 'éluder', 'emballer', 'embellir', 'embryon', 'émeraude', 'émission', 'emmener', 'émotion', 'émouvoir', 'empereur', 'employer', 'emporter', 'emprise', 'émulsion', 'encadrer', 'enchère', 'enclave', 'encoche', 'endiguer', 'endosser', 'endroit', 'enduire', 'énergie', 'enfance', 'enfermer', 'enfouir', 'engager', 'engin', 'englober', 'énigme', 'enjamber', 'enjeu', 'enlever', 'ennemi', 'ennuyeux', 'enrichir', 'enrobage', 'enseigne', 'entasser', 'entendre', 'entier', 'entourer', 'entraver', 'énumérer', 'envahir', 'enviable', 'envoyer', 'enzyme', 'éolien', 'épaissir', 'épargne', 'épatant', 'épaule', 'épicerie', 'épidémie', 'épier', 'épilogue', 'épine', 'épisode', 'épitaphe', 'époque', 'épreuve', 'éprouver', 'épuisant', 'équerre', 'équipe', 'ériger', 'érosion', 'erreur', 'éruption', 'escalier', 'espadon', 'espèce', 'espiègle', 'espoir', 'esprit', 'esquiver', 'essayer', 'essence', 'essieu', 'essorer', 'estime', 'estomac', 'estrade', 'étagère', 'étaler', 'étanche', 'étatique', 'éteindre', 'étendoir', 'éternel', 'éthanol', 'éthique', 'ethnie', 'étirer', 'étoffer', 'étoile', 'étonnant', 'étourdir', 'étrange', 'étroit', 'étude', 'euphorie', 'évaluer', 'évasion', 'éventail', 'évidence', 'éviter', 'évolutif', 'évoquer', 'exact', 'exagérer', 'exaucer', 'exceller', 'excitant', 'exclusif', 'excuse', 'exécuter', 'exemple', 'exercer', 'exhaler', 'exhorter', 'exigence', 'exiler', 'exister', 'exotique', 'expédier', 'explorer', 'exposer', 'exprimer', 'exquis', 'extensif', 'extraire', 'exulter', 'fable', 'fabuleux', 'facette', 'facile', 'facture', 'faiblir', 'falaise', 'fameux', 'famille', 'farceur', 'farfelu', 'farine', 'farouche', 'fasciner', 'fatal', 'fatigue', 'faucon', 'fautif', 'faveur', 'favori', 'fébrile', 'féconder', 'fédérer', 'félin', 'femme', 'fémur', 'fendoir', 'féodal', 'fermer', 'féroce', 'ferveur', 'festival', 'feuille', 'feutre', 'février', 'fiasco', 'ficeler', 'fictif', 'fidèle', 'figure', 'filature', 'filetage', 'filière', 'filleul', 'filmer', 'filou', 'filtrer', 'financer', 'finir', 'fiole', 'firme', 'fissure', 'fixer', 'flairer', 'flamme', 'flasque', 'flatteur', 'fléau', 'flèche', 'fleur', 'flexion', 'flocon', 'flore', 'fluctuer', 'fluide', 'fluvial', 'folie', 'fonderie', 'fongible', 'fontaine', 'forcer', 'forgeron', 'formuler', 'fortune', 'fossile', 'foudre', 'fougère', 'fouiller', 'foulure', 'fourmi', 'fragile', 'fraise', 'franchir', 'frapper', 'frayeur', 'frégate', 'freiner', 'frelon', 'frémir', 'frénésie', 'frère', 'friable', 'friction', 'frisson', 'frivole', 'froid', 'fromage', 'frontal', 'frotter', 'fruit', 'fugitif', 'fuite', 'fureur', 'furieux', 'furtif', 'fusion', 'futur', 'gagner', 'galaxie', 'galerie', 'gambader', 'garantir', 'gardien', 'garnir', 'garrigue', 'gazelle', 'gazon', 'géant', 'gélatine', 'gélule', 'gendarme', 'général', 'génie', 'genou', 'gentil', 'géologie', 'géomètre', 'géranium', 'germe', 'gestuel', 'geyser', 'gibier', 'gicler', 'girafe', 'givre', 'glace', 'glaive', 'glisser', 'globe', 'gloire', 'glorieux', 'golfeur', 'gomme', 'gonfler', 'gorge', 'gorille', 'goudron', 'gouffre', 'goulot', 'goupille', 'gourmand', 'goutte', 'graduel', 'graffiti', 'graine', 'grand', 'grappin', 'gratuit', 'gravir', 'grenat', 'griffure', 'griller', 'grimper', 'grogner', 'gronder', 'grotte', 'groupe', 'gruger', 'grutier', 'gruyère', 'guépard', 'guerrier', 'guide', 'guimauve', 'guitare', 'gustatif', 'gymnaste', 'gyrostat', 'habitude', 'hachoir', 'halte', 'hameau', 'hangar', 'hanneton', 'haricot', 'harmonie', 'harpon', 'hasard', 'hélium', 'hématome', 'herbe', 'hérisson', 'hermine', 'héron', 'hésiter', 'heureux', 'hiberner', 'hibou', 'hilarant', 'histoire', 'hiver', 'homard', 'hommage', 'homogène', 'honneur', 'honorer', 'honteux', 'horde', 'horizon', 'horloge', 'hormone', 'horrible', 'houleux', 'housse', 'hublot', 'huileux', 'humain', 'humble', 'humide', 'humour', 'hurler', 'hydromel', 'hygiène', 'hymne', 'hypnose', 'idylle', 'ignorer', 'iguane', 'illicite', 'illusion', 'image', 'imbiber', 'imiter', 'immense', 'immobile', 'immuable', 'impact', 'impérial', 'implorer', 'imposer', 'imprimer', 'imputer', 'incarner', 'incendie', 'incident', 'incliner', 'incolore', 'indexer', 'indice', 'inductif', 'inédit', 'ineptie', 'inexact', 'infini', 'infliger', 'informer', 'infusion', 'ingérer', 'inhaler', 'inhiber', 'injecter', 'injure', 'innocent', 'inoculer', 'inonder', 'inscrire', 'insecte', 'insigne', 'insolite', 'inspirer', 'instinct', 'insulter', 'intact', 'intense', 'intime', 'intrigue', 'intuitif', 'inutile', 'invasion', 'inventer', 'inviter', 'invoquer', 'ironique', 'irradier', 'irréel', 'irriter', 'isoler', 'ivoire', 'ivresse', 'jaguar', 'jaillir', 'jambe', 'janvier', 'jardin', 'jauger', 'jaune', 'javelot', 'jetable', 'jeton', 'jeudi', 'jeunesse', 'joindre', 'joncher', 'jongler', 'joueur', 'jouissif', 'journal', 'jovial', 'joyau', 'joyeux', 'jubiler', 'jugement', 'junior', 'jupon', 'juriste', 'justice', 'juteux', 'juvénile', 'kayak', 'kimono', 'kiosque', 'label', 'labial', 'labourer', 'lacérer', 'lactose', 'lagune', 'laine', 'laisser', 'laitier', 'lambeau', 'lamelle', 'lampe', 'lanceur', 'langage', 'lanterne', 'lapin', 'largeur', 'larme', 'laurier', 'lavabo', 'lavoir', 'lecture', 'légal', 'léger', 'légume', 'lessive', 'lettre', 'levier', 'lexique', 'lézard', 'liasse', 'libérer', 'libre', 'licence', 'licorne', 'liège', 'lièvre', 'ligature', 'ligoter', 'ligue', 'limer', 'limite', 'limonade', 'limpide', 'linéaire', 'lingot', 'lionceau', 'liquide', 'lisière', 'lister', 'lithium', 'litige', 'littoral', 'livreur', 'logique', 'lointain', 'loisir', 'lombric', 'loterie', 'louer', 'lourd', 'loutre', 'louve', 'loyal', 'lubie', 'lucide', 'lucratif', 'lueur', 'lugubre', 'luisant', 'lumière', 'lunaire', 'lundi', 'luron', 'lutter', 'luxueux', 'machine', 'magasin', 'magenta', 'magique', 'maigre', 'maillon', 'maintien', 'mairie', 'maison', 'majorer', 'malaxer', 'maléfice', 'malheur', 'malice', 'mallette', 'mammouth', 'mandater', 'maniable', 'manquant', 'manteau', 'manuel', 'marathon', 'marbre', 'marchand', 'mardi', 'maritime', 'marqueur', 'marron', 'marteler', 'mascotte', 'massif', 'matériel', 'matière', 'matraque', 'maudire', 'maussade', 'mauve', 'maximal', 'méchant', 'méconnu', 'médaille', 'médecin', 'méditer', 'méduse', 'meilleur', 'mélange', 'mélodie', 'membre', 'mémoire', 'menacer', 'mener', 'menhir', 'mensonge', 'mentor', 'mercredi', 'mérite', 'merle', 'messager', 'mesure', 'métal', 'météore', 'méthode', 'métier', 'meuble', 'miauler', 'microbe', 'miette', 'mignon', 'migrer', 'milieu', 'million', 'mimique', 'mince', 'minéral', 'minimal', 'minorer', 'minute', 'miracle', 'miroiter', 'missile', 'mixte', 'mobile', 'moderne', 'moelleux', 'mondial', 'moniteur', 'monnaie', 'monotone', 'monstre', 'montagne', 'monument', 'moqueur', 'morceau', 'morsure', 'mortier', 'moteur', 'motif', 'mouche', 'moufle', 'moulin', 'mousson', 'mouton', 'mouvant', 'multiple', 'munition', 'muraille', 'murène', 'murmure', 'muscle', 'muséum', 'musicien', 'mutation', 'muter', 'mutuel', 'myriade', 'myrtille', 'mystère', 'mythique', 'nageur', 'nappe', 'narquois', 'narrer', 'natation', 'nation', 'nature', 'naufrage', 'nautique', 'navire', 'nébuleux', 'nectar', 'néfaste', 'négation', 'négliger', 'négocier', 'neige', 'nerveux', 'nettoyer', 'neurone', 'neutron', 'neveu', 'niche', 'nickel', 'nitrate', 'niveau', 'noble', 'nocif', 'nocturne', 'noirceur', 'noisette', 'nomade', 'nombreux', 'nommer', 'normatif', 'notable', 'notifier', 'notoire', 'nourrir', 'nouveau', 'novateur', 'novembre', 'novice', 'nuage', 'nuancer', 'nuire', 'nuisible', 'numéro', 'nuptial', 'nuque', 'nutritif', 'obéir', 'objectif', 'obliger', 'obscur', 'observer', 'obstacle', 'obtenir', 'obturer', 'occasion', 'occuper', 'océan', 'octobre', 'octroyer', 'octupler', 'oculaire', 'odeur', 'odorant', 'offenser', 'officier', 'offrir', 'ogive', 'oiseau', 'oisillon', 'olfactif', 'olivier', 'ombrage', 'omettre', 'onctueux', 'onduler', 'onéreux', 'onirique', 'opale', 'opaque', 'opérer', 'opinion', 'opportun', 'opprimer', 'opter', 'optique', 'orageux', 'orange', 'orbite', 'ordonner', 'oreille', 'organe', 'orgueil', 'orifice', 'ornement', 'orque', 'ortie', 'osciller', 'osmose', 'ossature', 'otarie', 'ouragan', 'ourson', 'outil', 'outrager', 'ouvrage', 'ovation', 'oxyde', 'oxygène', 'ozone', 'paisible', 'palace', 'palmarès', 'palourde', 'palper', 'panache', 'panda', 'pangolin', 'paniquer', 'panneau', 'panorama', 'pantalon', 'papaye', 'papier', 'papoter', 'papyrus', 'paradoxe', 'parcelle', 'paresse', 'parfumer', 'parler', 'parole', 'parrain', 'parsemer', 'partager', 'parure', 'parvenir', 'passion', 'pastèque', 'paternel', 'patience', 'patron', 'pavillon', 'pavoiser', 'payer', 'paysage', 'peigne', 'peintre', 'pelage', 'pélican', 'pelle', 'pelouse', 'peluche', 'pendule', 'pénétrer', 'pénible', 'pensif', 'pénurie', 'pépite', 'péplum', 'perdrix', 'perforer', 'période', 'permuter', 'perplexe', 'persil', 'perte', 'peser', 'pétale', 'petit', 'pétrir', 'peuple', 'pharaon', 'phobie', 'phoque', 'photon', 'phrase', 'physique', 'piano', 'pictural', 'pièce', 'pierre', 'pieuvre', 'pilote', 'pinceau', 'pipette', 'piquer', 'pirogue', 'piscine', 'piston', 'pivoter', 'pixel', 'pizza', 'placard', 'plafond', 'plaisir', 'planer', 'plaque', 'plastron', 'plateau', 'pleurer', 'plexus', 'pliage', 'plomb', 'plonger', 'pluie', 'plumage', 'pochette', 'poésie', 'poète', 'pointe', 'poirier', 'poisson', 'poivre', 'polaire', 'policier', 'pollen', 'polygone', 'pommade', 'pompier', 'ponctuel', 'pondérer', 'poney', 'portique', 'position', 'posséder', 'posture', 'potager', 'poteau', 'potion', 'pouce', 'poulain', 'poumon', 'pourpre', 'poussin', 'pouvoir', 'prairie', 'pratique', 'précieux', 'prédire', 'préfixe', 'prélude', 'prénom', 'présence', 'prétexte', 'prévoir', 'primitif', 'prince', 'prison', 'priver', 'problème', 'procéder', 'prodige', 'profond', 'progrès', 'proie', 'projeter', 'prologue', 'promener', 'propre', 'prospère', 'protéger', 'prouesse', 'proverbe', 'prudence', 'pruneau', 'psychose', 'public', 'puceron', 'puiser', 'pulpe', 'pulsar', 'punaise', 'punitif', 'pupitre', 'purifier', 'puzzle', 'pyramide', 'quasar', 'querelle', 'question', 'quiétude', 'quitter', 'quotient', 'racine', 'raconter', 'radieux', 'ragondin', 'raideur', 'raisin', 'ralentir', 'rallonge', 'ramasser', 'rapide', 'rasage', 'ratisser', 'ravager', 'ravin', 'rayonner', 'réactif', 'réagir', 'réaliser', 'réanimer', 'recevoir', 'réciter', 'réclamer', 'récolter', 'recruter', 'reculer', 'recycler', 'rédiger', 'redouter', 'refaire', 'réflexe', 'réformer', 'refrain', 'refuge', 'régalien', 'région', 'réglage', 'régulier', 'réitérer', 'rejeter', 'rejouer', 'relatif', 'relever', 'relief', 'remarque', 'remède', 'remise', 'remonter', 'remplir', 'remuer', 'renard', 'renfort', 'renifler', 'renoncer', 'rentrer', 'renvoi', 'replier', 'reporter', 'reprise', 'reptile', 'requin', 'réserve', 'résineux', 'résoudre', 'respect', 'rester', 'résultat', 'rétablir', 'retenir', 'réticule', 'retomber', 'retracer', 'réunion', 'réussir', 'revanche', 'revivre', 'révolte', 'révulsif', 'richesse', 'rideau', 'rieur', 'rigide', 'rigoler', 'rincer', 'riposter', 'risible', 'risque', 'rituel', 'rival', 'rivière', 'rocheux', 'romance', 'rompre', 'ronce', 'rondin', 'roseau', 'rosier', 'rotatif', 'rotor', 'rotule', 'rouge', 'rouille', 'rouleau', 'routine', 'royaume', 'ruban', 'rubis', 'ruche', 'ruelle', 'rugueux', 'ruiner', 'ruisseau', 'ruser', 'rustique', 'rythme', 'sabler', 'saboter', 'sabre', 'sacoche', 'safari', 'sagesse', 'saisir', 'salade', 'salive', 'salon', 'saluer', 'samedi', 'sanction', 'sanglier', 'sarcasme', 'sardine', 'saturer', 'saugrenu', 'saumon', 'sauter', 'sauvage', 'savant', 'savonner', 'scalpel', 'scandale', 'scélérat', 'scénario', 'sceptre', 'schéma', 'science', 'scinder', 'score', 'scrutin', 'sculpter', 'séance', 'sécable', 'sécher', 'secouer', 'sécréter', 'sédatif', 'séduire', 'seigneur', 'séjour', 'sélectif', 'semaine', 'sembler', 'semence', 'séminal', 'sénateur', 'sensible', 'sentence', 'séparer', 'séquence', 'serein', 'sergent', 'sérieux', 'serrure', 'sérum', 'service', 'sésame', 'sévir', 'sevrage', 'sextuple', 'sidéral', 'siècle', 'siéger', 'siffler', 'sigle', 'signal', 'silence', 'silicium', 'simple', 'sincère', 'sinistre', 'siphon', 'sirop', 'sismique', 'situer', 'skier', 'social', 'socle', 'sodium', 'soigneux', 'soldat', 'soleil', 'solitude', 'soluble', 'sombre', 'sommeil', 'somnoler', 'sonde', 'songeur', 'sonnette', 'sonore', 'sorcier', 'sortir', 'sosie', 'sottise', 'soucieux', 'soudure', 'souffle', 'soulever', 'soupape', 'source', 'soutirer', 'souvenir', 'spacieux', 'spatial', 'spécial', 'sphère', 'spiral', 'stable', 'station', 'sternum', 'stimulus', 'stipuler', 'strict', 'studieux', 'stupeur', 'styliste', 'sublime', 'substrat', 'subtil', 'subvenir', 'succès', 'sucre', 'suffixe', 'suggérer', 'suiveur', 'sulfate', 'superbe', 'supplier', 'surface', 'suricate', 'surmener', 'surprise', 'sursaut', 'survie', 'suspect', 'syllabe', 'symbole', 'symétrie', 'synapse', 'syntaxe', 'système', 'tabac', 'tablier', 'tactile', 'tailler', 'talent', 'talisman', 'talonner', 'tambour', 'tamiser', 'tangible', 'tapis', 'taquiner', 'tarder', 'tarif', 'tartine', 'tasse', 'tatami', 'tatouage', 'taupe', 'taureau', 'taxer', 'témoin', 'temporel', 'tenaille', 'tendre', 'teneur', 'tenir', 'tension', 'terminer', 'terne', 'terrible', 'tétine', 'texte', 'thème', 'théorie', 'thérapie', 'thorax', 'tibia', 'tiède', 'timide', 'tirelire', 'tiroir', 'tissu', 'titane', 'titre', 'tituber', 'toboggan', 'tolérant', 'tomate', 'tonique', 'tonneau', 'toponyme', 'torche', 'tordre', 'tornade', 'torpille', 'torrent', 'torse', 'tortue', 'totem', 'toucher', 'tournage', 'tousser', 'toxine', 'traction', 'trafic', 'tragique', 'trahir', 'train', 'trancher', 'travail', 'trèfle', 'tremper', 'trésor', 'treuil', 'triage', 'tribunal', 'tricoter', 'trilogie', 'triomphe', 'tripler', 'triturer', 'trivial', 'trombone', 'tronc', 'tropical', 'troupeau', 'tuile', 'tulipe', 'tumulte', 'tunnel', 'turbine', 'tuteur', 'tutoyer', 'tuyau', 'tympan', 'typhon', 'typique', 'tyran', 'ubuesque', 'ultime', 'ultrason', 'unanime', 'unifier', 'union', 'unique', 'unitaire', 'univers', 'uranium', 'urbain', 'urticant', 'usage', 'usine', 'usuel', 'usure', 'utile', 'utopie', 'vacarme', 'vaccin', 'vagabond', 'vague', 'vaillant', 'vaincre', 'vaisseau', 'valable', 'valise', 'vallon', 'valve', 'vampire', 'vanille', 'vapeur', 'varier', 'vaseux', 'vassal', 'vaste', 'vecteur', 'vedette', 'végétal', 'véhicule', 'veinard', 'véloce', 'vendredi', 'vénérer', 'venger', 'venimeux', 'ventouse', 'verdure', 'vérin', 'vernir', 'verrou', 'verser', 'vertu', 'veston', 'vétéran', 'vétuste', 'vexant', 'vexer', 'viaduc', 'viande', 'victoire', 'vidange', 'vidéo', 'vignette', 'vigueur', 'vilain', 'village', 'vinaigre', 'violon', 'vipère', 'virement', 'virtuose', 'virus', 'visage', 'viseur', 'vision', 'visqueux', 'visuel', 'vital', 'vitesse', 'viticole', 'vitrine', 'vivace', 'vivipare', 'vocation', 'voguer', 'voile', 'voisin', 'voiture', 'volaille', 'volcan', 'voltiger', 'volume', 'vorace', 'vortex', 'voter', 'vouloir', 'voyage', 'voyelle', 'wagon', 'xénon', 'yacht', 'zèbre', 'zénith', 'zeste', 'zoologie'];

var ITALIAN = ['abaco', 'abbaglio', 'abbinato', 'abete', 'abisso', 'abolire', 'abrasivo', 'abrogato', 'accadere', 'accenno', 'accusato', 'acetone', 'achille', 'acido', 'acqua', 'acre', 'acrilico', 'acrobata', 'acuto', 'adagio', 'addebito', 'addome', 'adeguato', 'aderire', 'adipe', 'adottare', 'adulare', 'affabile', 'affetto', 'affisso', 'affranto', 'aforisma', 'afoso', 'africano', 'agave', 'agente', 'agevole', 'aggancio', 'agire', 'agitare', 'agonismo', 'agricolo', 'agrumeto', 'aguzzo', 'alabarda', 'alato', 'albatro', 'alberato', 'albo', 'albume', 'alce', 'alcolico', 'alettone', 'alfa', 'algebra', 'aliante', 'alibi', 'alimento', 'allagato', 'allegro', 'allievo', 'allodola', 'allusivo', 'almeno', 'alogeno', 'alpaca', 'alpestre', 'altalena', 'alterno', 'alticcio', 'altrove', 'alunno', 'alveolo', 'alzare', 'amalgama', 'amanita', 'amarena', 'ambito', 'ambrato', 'ameba', 'america', 'ametista', 'amico', 'ammasso', 'ammenda', 'ammirare', 'ammonito', 'amore', 'ampio', 'ampliare', 'amuleto', 'anacardo', 'anagrafe', 'analista', 'anarchia', 'anatra', 'anca', 'ancella', 'ancora', 'andare', 'andrea', 'anello', 'angelo', 'angolare', 'angusto', 'anima', 'annegare', 'annidato', 'anno', 'annuncio', 'anonimo', 'anticipo', 'anzi', 'apatico', 'apertura', 'apode', 'apparire', 'appetito', 'appoggio', 'approdo', 'appunto', 'aprile', 'arabica', 'arachide', 'aragosta', 'araldica', 'arancio', 'aratura', 'arazzo', 'arbitro', 'archivio', 'ardito', 'arenile', 'argento', 'argine', 'arguto', 'aria', 'armonia', 'arnese', 'arredato', 'arringa', 'arrosto', 'arsenico', 'arso', 'artefice', 'arzillo', 'asciutto', 'ascolto', 'asepsi', 'asettico', 'asfalto', 'asino', 'asola', 'aspirato', 'aspro', 'assaggio', 'asse', 'assoluto', 'assurdo', 'asta', 'astenuto', 'astice', 'astratto', 'atavico', 'ateismo', 'atomico', 'atono', 'attesa', 'attivare', 'attorno', 'attrito', 'attuale', 'ausilio', 'austria', 'autista', 'autonomo', 'autunno', 'avanzato', 'avere', 'avvenire', 'avviso', 'avvolgere', 'azione', 'azoto', 'azzimo', 'azzurro', 'babele', 'baccano', 'bacino', 'baco', 'badessa', 'badilata', 'bagnato', 'baita', 'balcone', 'baldo', 'balena', 'ballata', 'balzano', 'bambino', 'bandire', 'baraonda', 'barbaro', 'barca', 'baritono', 'barlume', 'barocco', 'basilico', 'basso', 'batosta', 'battuto', 'baule', 'bava', 'bavosa', 'becco', 'beffa', 'belgio', 'belva', 'benda', 'benevole', 'benigno', 'benzina', 'bere', 'berlina', 'beta', 'bibita', 'bici', 'bidone', 'bifido', 'biga', 'bilancia', 'bimbo', 'binocolo', 'biologo', 'bipede', 'bipolare', 'birbante', 'birra', 'biscotto', 'bisesto', 'bisnonno', 'bisonte', 'bisturi', 'bizzarro', 'blando', 'blatta', 'bollito', 'bonifico', 'bordo', 'bosco', 'botanico', 'bottino', 'bozzolo', 'braccio', 'bradipo', 'brama', 'branca', 'bravura', 'bretella', 'brevetto', 'brezza', 'briglia', 'brillante', 'brindare', 'broccolo', 'brodo', 'bronzina', 'brullo', 'bruno', 'bubbone', 'buca', 'budino', 'buffone', 'buio', 'bulbo', 'buono', 'burlone', 'burrasca', 'bussola', 'busta', 'cadetto', 'caduco', 'calamaro', 'calcolo', 'calesse', 'calibro', 'calmo', 'caloria', 'cambusa', 'camerata', 'camicia', 'cammino', 'camola', 'campale', 'canapa', 'candela', 'cane', 'canino', 'canotto', 'cantina', 'capace', 'capello', 'capitolo', 'capogiro', 'cappero', 'capra', 'capsula', 'carapace', 'carcassa', 'cardo', 'carisma', 'carovana', 'carretto', 'cartolina', 'casaccio', 'cascata', 'caserma', 'caso', 'cassone', 'castello', 'casuale', 'catasta', 'catena', 'catrame', 'cauto', 'cavillo', 'cedibile', 'cedrata', 'cefalo', 'celebre', 'cellulare', 'cena', 'cenone', 'centesimo', 'ceramica', 'cercare', 'certo', 'cerume', 'cervello', 'cesoia', 'cespo', 'ceto', 'chela', 'chiaro', 'chicca', 'chiedere', 'chimera', 'china', 'chirurgo', 'chitarra', 'ciao', 'ciclismo', 'cifrare', 'cigno', 'cilindro', 'ciottolo', 'circa', 'cirrosi', 'citrico', 'cittadino', 'ciuffo', 'civetta', 'civile', 'classico', 'clinica', 'cloro', 'cocco', 'codardo', 'codice', 'coerente', 'cognome', 'collare', 'colmato', 'colore', 'colposo', 'coltivato', 'colza', 'coma', 'cometa', 'commando', 'comodo', 'computer', 'comune', 'conciso', 'condurre', 'conferma', 'congelare', 'coniuge', 'connesso', 'conoscere', 'consumo', 'continuo', 'convegno', 'coperto', 'copione', 'coppia', 'copricapo', 'corazza', 'cordata', 'coricato', 'cornice', 'corolla', 'corpo', 'corredo', 'corsia', 'cortese', 'cosmico', 'costante', 'cottura', 'covato', 'cratere', 'cravatta', 'creato', 'credere', 'cremoso', 'crescita', 'creta', 'criceto', 'crinale', 'crisi', 'critico', 'croce', 'cronaca', 'crostata', 'cruciale', 'crusca', 'cucire', 'cuculo', 'cugino', 'cullato', 'cupola', 'curatore', 'cursore', 'curvo', 'cuscino', 'custode', 'dado', 'daino', 'dalmata', 'damerino', 'daniela', 'dannoso', 'danzare', 'datato', 'davanti', 'davvero', 'debutto', 'decennio', 'deciso', 'declino', 'decollo', 'decreto', 'dedicato', 'definito', 'deforme', 'degno', 'delegare', 'delfino', 'delirio', 'delta', 'demenza', 'denotato', 'dentro', 'deposito', 'derapata', 'derivare', 'deroga', 'descritto', 'deserto', 'desiderio', 'desumere', 'detersivo', 'devoto', 'diametro', 'dicembre', 'diedro', 'difeso', 'diffuso', 'digerire', 'digitale', 'diluvio', 'dinamico', 'dinnanzi', 'dipinto', 'diploma', 'dipolo', 'diradare', 'dire', 'dirotto', 'dirupo', 'disagio', 'discreto', 'disfare', 'disgelo', 'disposto', 'distanza', 'disumano', 'dito', 'divano', 'divelto', 'dividere', 'divorato', 'doblone', 'docente', 'doganale', 'dogma', 'dolce', 'domato', 'domenica', 'dominare', 'dondolo', 'dono', 'dormire', 'dote', 'dottore', 'dovuto', 'dozzina', 'drago', 'druido', 'dubbio', 'dubitare', 'ducale', 'duna', 'duomo', 'duplice', 'duraturo', 'ebano', 'eccesso', 'ecco', 'eclissi', 'economia', 'edera', 'edicola', 'edile', 'editoria', 'educare', 'egemonia', 'egli', 'egoismo', 'egregio', 'elaborato', 'elargire', 'elegante', 'elencato', 'eletto', 'elevare', 'elfico', 'elica', 'elmo', 'elsa', 'eluso', 'emanato', 'emblema', 'emesso', 'emiro', 'emotivo', 'emozione', 'empirico', 'emulo', 'endemico', 'enduro', 'energia', 'enfasi', 'enoteca', 'entrare', 'enzima', 'epatite', 'epilogo', 'episodio', 'epocale', 'eppure', 'equatore', 'erario', 'erba', 'erboso', 'erede', 'eremita', 'erigere', 'ermetico', 'eroe', 'erosivo', 'errante', 'esagono', 'esame', 'esanime', 'esaudire', 'esca', 'esempio', 'esercito', 'esibito', 'esigente', 'esistere', 'esito', 'esofago', 'esortato', 'esoso', 'espanso', 'espresso', 'essenza', 'esso', 'esteso', 'estimare', 'estonia', 'estroso', 'esultare', 'etilico', 'etnico', 'etrusco', 'etto', 'euclideo', 'europa', 'evaso', 'evidenza', 'evitato', 'evoluto', 'evviva', 'fabbrica', 'faccenda', 'fachiro', 'falco', 'famiglia', 'fanale', 'fanfara', 'fango', 'fantasma', 'fare', 'farfalla', 'farinoso', 'farmaco', 'fascia', 'fastoso', 'fasullo', 'faticare', 'fato', 'favoloso', 'febbre', 'fecola', 'fede', 'fegato', 'felpa', 'feltro', 'femmina', 'fendere', 'fenomeno', 'fermento', 'ferro', 'fertile', 'fessura', 'festivo', 'fetta', 'feudo', 'fiaba', 'fiducia', 'fifa', 'figurato', 'filo', 'finanza', 'finestra', 'finire', 'fiore', 'fiscale', 'fisico', 'fiume', 'flacone', 'flamenco', 'flebo', 'flemma', 'florido', 'fluente', 'fluoro', 'fobico', 'focaccia', 'focoso', 'foderato', 'foglio', 'folata', 'folclore', 'folgore', 'fondente', 'fonetico', 'fonia', 'fontana', 'forbito', 'forchetta', 'foresta', 'formica', 'fornaio', 'foro', 'fortezza', 'forzare', 'fosfato', 'fosso', 'fracasso', 'frana', 'frassino', 'fratello', 'freccetta', 'frenata', 'fresco', 'frigo', 'frollino', 'fronde', 'frugale', 'frutta', 'fucilata', 'fucsia', 'fuggente', 'fulmine', 'fulvo', 'fumante', 'fumetto', 'fumoso', 'fune', 'funzione', 'fuoco', 'furbo', 'furgone', 'furore', 'fuso', 'futile', 'gabbiano', 'gaffe', 'galateo', 'gallina', 'galoppo', 'gambero', 'gamma', 'garanzia', 'garbo', 'garofano', 'garzone', 'gasdotto', 'gasolio', 'gastrico', 'gatto', 'gaudio', 'gazebo', 'gazzella', 'geco', 'gelatina', 'gelso', 'gemello', 'gemmato', 'gene', 'genitore', 'gennaio', 'genotipo', 'gergo', 'ghepardo', 'ghiaccio', 'ghisa', 'giallo', 'gilda', 'ginepro', 'giocare', 'gioiello', 'giorno', 'giove', 'girato', 'girone', 'gittata', 'giudizio', 'giurato', 'giusto', 'globulo', 'glutine', 'gnomo', 'gobba', 'golf', 'gomito', 'gommone', 'gonfio', 'gonna', 'governo', 'gracile', 'grado', 'grafico', 'grammo', 'grande', 'grattare', 'gravoso', 'grazia', 'greca', 'gregge', 'grifone', 'grigio', 'grinza', 'grotta', 'gruppo', 'guadagno', 'guaio', 'guanto', 'guardare', 'gufo', 'guidare', 'ibernato', 'icona', 'identico', 'idillio', 'idolo', 'idra', 'idrico', 'idrogeno', 'igiene', 'ignaro', 'ignorato', 'ilare', 'illeso', 'illogico', 'illudere', 'imballo', 'imbevuto', 'imbocco', 'imbuto', 'immane', 'immerso', 'immolato', 'impacco', 'impeto', 'impiego', 'importo', 'impronta', 'inalare', 'inarcare', 'inattivo', 'incanto', 'incendio', 'inchino', 'incisivo', 'incluso', 'incontro', 'incrocio', 'incubo', 'indagine', 'india', 'indole', 'inedito', 'infatti', 'infilare', 'inflitto', 'ingaggio', 'ingegno', 'inglese', 'ingordo', 'ingrosso', 'innesco', 'inodore', 'inoltrare', 'inondato', 'insano', 'insetto', 'insieme', 'insonnia', 'insulina', 'intasato', 'intero', 'intonaco', 'intuito', 'inumidire', 'invalido', 'invece', 'invito', 'iperbole', 'ipnotico', 'ipotesi', 'ippica', 'iride', 'irlanda', 'ironico', 'irrigato', 'irrorare', 'isolato', 'isotopo', 'isterico', 'istituto', 'istrice', 'italia', 'iterare', 'labbro', 'labirinto', 'lacca', 'lacerato', 'lacrima', 'lacuna', 'laddove', 'lago', 'lampo', 'lancetta', 'lanterna', 'lardoso', 'larga', 'laringe', 'lastra', 'latenza', 'latino', 'lattuga', 'lavagna', 'lavoro', 'legale', 'leggero', 'lembo', 'lentezza', 'lenza', 'leone', 'lepre', 'lesivo', 'lessato', 'lesto', 'letterale', 'leva', 'levigato', 'libero', 'lido', 'lievito', 'lilla', 'limatura', 'limitare', 'limpido', 'lineare', 'lingua', 'liquido', 'lira', 'lirica', 'lisca', 'lite', 'litigio', 'livrea', 'locanda', 'lode', 'logica', 'lombare', 'londra', 'longevo', 'loquace', 'lorenzo', 'loto', 'lotteria', 'luce', 'lucidato', 'lumaca', 'luminoso', 'lungo', 'lupo', 'luppolo', 'lusinga', 'lusso', 'lutto', 'macabro', 'macchina', 'macero', 'macinato', 'madama', 'magico', 'maglia', 'magnete', 'magro', 'maiolica', 'malafede', 'malgrado', 'malinteso', 'malsano', 'malto', 'malumore', 'mana', 'mancia', 'mandorla', 'mangiare', 'manifesto', 'mannaro', 'manovra', 'mansarda', 'mantide', 'manubrio', 'mappa', 'maratona', 'marcire', 'maretta', 'marmo', 'marsupio', 'maschera', 'massaia', 'mastino', 'materasso', 'matricola', 'mattone', 'maturo', 'mazurca', 'meandro', 'meccanico', 'mecenate', 'medesimo', 'meditare', 'mega', 'melassa', 'melis', 'melodia', 'meninge', 'meno', 'mensola', 'mercurio', 'merenda', 'merlo', 'meschino', 'mese', 'messere', 'mestolo', 'metallo', 'metodo', 'mettere', 'miagolare', 'mica', 'micelio', 'michele', 'microbo', 'midollo', 'miele', 'migliore', 'milano', 'milite', 'mimosa', 'minerale', 'mini', 'minore', 'mirino', 'mirtillo', 'miscela', 'missiva', 'misto', 'misurare', 'mitezza', 'mitigare', 'mitra', 'mittente', 'mnemonico', 'modello', 'modifica', 'modulo', 'mogano', 'mogio', 'mole', 'molosso', 'monastero', 'monco', 'mondina', 'monetario', 'monile', 'monotono', 'monsone', 'montato', 'monviso', 'mora', 'mordere', 'morsicato', 'mostro', 'motivato', 'motosega', 'motto', 'movenza', 'movimento', 'mozzo', 'mucca', 'mucosa', 'muffa', 'mughetto', 'mugnaio', 'mulatto', 'mulinello', 'multiplo', 'mummia', 'munto', 'muovere', 'murale', 'musa', 'muscolo', 'musica', 'mutevole', 'muto', 'nababbo', 'nafta', 'nanometro', 'narciso', 'narice', 'narrato', 'nascere', 'nastrare', 'naturale', 'nautica', 'naviglio', 'nebulosa', 'necrosi', 'negativo', 'negozio', 'nemmeno', 'neofita', 'neretto', 'nervo', 'nessuno', 'nettuno', 'neutrale', 'neve', 'nevrotico', 'nicchia', 'ninfa', 'nitido', 'nobile', 'nocivo', 'nodo', 'nome', 'nomina', 'nordico', 'normale', 'norvegese', 'nostrano', 'notare', 'notizia', 'notturno', 'novella', 'nucleo', 'nulla', 'numero', 'nuovo', 'nutrire', 'nuvola', 'nuziale', 'oasi', 'obbedire', 'obbligo', 'obelisco', 'oblio', 'obolo', 'obsoleto', 'occasione', 'occhio', 'occidente', 'occorrere', 'occultare', 'ocra', 'oculato', 'odierno', 'odorare', 'offerta', 'offrire', 'offuscato', 'oggetto', 'oggi', 'ognuno', 'olandese', 'olfatto', 'oliato', 'oliva', 'ologramma', 'oltre', 'omaggio', 'ombelico', 'ombra', 'omega', 'omissione', 'ondoso', 'onere', 'onice', 'onnivoro', 'onorevole', 'onta', 'operato', 'opinione', 'opposto', 'oracolo', 'orafo', 'ordine', 'orecchino', 'orefice', 'orfano', 'organico', 'origine', 'orizzonte', 'orma', 'ormeggio', 'ornativo', 'orologio', 'orrendo', 'orribile', 'ortensia', 'ortica', 'orzata', 'orzo', 'osare', 'oscurare', 'osmosi', 'ospedale', 'ospite', 'ossa', 'ossidare', 'ostacolo', 'oste', 'otite', 'otre', 'ottagono', 'ottimo', 'ottobre', 'ovale', 'ovest', 'ovino', 'oviparo', 'ovocito', 'ovunque', 'ovviare', 'ozio', 'pacchetto', 'pace', 'pacifico', 'padella', 'padrone', 'paese', 'paga', 'pagina', 'palazzina', 'palesare', 'pallido', 'palo', 'palude', 'pandoro', 'pannello', 'paolo', 'paonazzo', 'paprica', 'parabola', 'parcella', 'parere', 'pargolo', 'pari', 'parlato', 'parola', 'partire', 'parvenza', 'parziale', 'passivo', 'pasticca', 'patacca', 'patologia', 'pattume', 'pavone', 'peccato', 'pedalare', 'pedonale', 'peggio', 'peloso', 'penare', 'pendice', 'penisola', 'pennuto', 'penombra', 'pensare', 'pentola', 'pepe', 'pepita', 'perbene', 'percorso', 'perdonato', 'perforare', 'pergamena', 'periodo', 'permesso', 'perno', 'perplesso', 'persuaso', 'pertugio', 'pervaso', 'pesatore', 'pesista', 'peso', 'pestifero', 'petalo', 'pettine', 'petulante', 'pezzo', 'piacere', 'pianta', 'piattino', 'piccino', 'picozza', 'piega', 'pietra', 'piffero', 'pigiama', 'pigolio', 'pigro', 'pila', 'pilifero', 'pillola', 'pilota', 'pimpante', 'pineta', 'pinna', 'pinolo', 'pioggia', 'piombo', 'piramide', 'piretico', 'pirite', 'pirolisi', 'pitone', 'pizzico', 'placebo', 'planare', 'plasma', 'platano', 'plenario', 'pochezza', 'poderoso', 'podismo', 'poesia', 'poggiare', 'polenta', 'poligono', 'pollice', 'polmonite', 'polpetta', 'polso', 'poltrona', 'polvere', 'pomice', 'pomodoro', 'ponte', 'popoloso', 'porfido', 'poroso', 'porpora', 'porre', 'portata', 'posa', 'positivo', 'possesso', 'postulato', 'potassio', 'potere', 'pranzo', 'prassi', 'pratica', 'precluso', 'predica', 'prefisso', 'pregiato', 'prelievo', 'premere', 'prenotare', 'preparato', 'presenza', 'pretesto', 'prevalso', 'prima', 'principe', 'privato', 'problema', 'procura', 'produrre', 'profumo', 'progetto', 'prolunga', 'promessa', 'pronome', 'proposta', 'proroga', 'proteso', 'prova', 'prudente', 'prugna', 'prurito', 'psiche', 'pubblico', 'pudica', 'pugilato', 'pugno', 'pulce', 'pulito', 'pulsante', 'puntare', 'pupazzo', 'pupilla', 'puro', 'quadro', 'qualcosa', 'quasi', 'querela', 'quota', 'raccolto', 'raddoppio', 'radicale', 'radunato', 'raffica', 'ragazzo', 'ragione', 'ragno', 'ramarro', 'ramingo', 'ramo', 'randagio', 'rantolare', 'rapato', 'rapina', 'rappreso', 'rasatura', 'raschiato', 'rasente', 'rassegna', 'rastrello', 'rata', 'ravveduto', 'reale', 'recepire', 'recinto', 'recluta', 'recondito', 'recupero', 'reddito', 'redimere', 'regalato', 'registro', 'regola', 'regresso', 'relazione', 'remare', 'remoto', 'renna', 'replica', 'reprimere', 'reputare', 'resa', 'residente', 'responso', 'restauro', 'rete', 'retina', 'retorica', 'rettifica', 'revocato', 'riassunto', 'ribadire', 'ribelle', 'ribrezzo', 'ricarica', 'ricco', 'ricevere', 'riciclato', 'ricordo', 'ricreduto', 'ridicolo', 'ridurre', 'rifasare', 'riflesso', 'riforma', 'rifugio', 'rigare', 'rigettato', 'righello', 'rilassato', 'rilevato', 'rimanere', 'rimbalzo', 'rimedio', 'rimorchio', 'rinascita', 'rincaro', 'rinforzo', 'rinnovo', 'rinomato', 'rinsavito', 'rintocco', 'rinuncia', 'rinvenire', 'riparato', 'ripetuto', 'ripieno', 'riportare', 'ripresa', 'ripulire', 'risata', 'rischio', 'riserva', 'risibile', 'riso', 'rispetto', 'ristoro', 'risultato', 'risvolto', 'ritardo', 'ritegno', 'ritmico', 'ritrovo', 'riunione', 'riva', 'riverso', 'rivincita', 'rivolto', 'rizoma', 'roba', 'robotico', 'robusto', 'roccia', 'roco', 'rodaggio', 'rodere', 'roditore', 'rogito', 'rollio', 'romantico', 'rompere', 'ronzio', 'rosolare', 'rospo', 'rotante', 'rotondo', 'rotula', 'rovescio', 'rubizzo', 'rubrica', 'ruga', 'rullino', 'rumine', 'rumoroso', 'ruolo', 'rupe', 'russare', 'rustico', 'sabato', 'sabbiare', 'sabotato', 'sagoma', 'salasso', 'saldatura', 'salgemma', 'salivare', 'salmone', 'salone', 'saltare', 'saluto', 'salvo', 'sapere', 'sapido', 'saporito', 'saraceno', 'sarcasmo', 'sarto', 'sassoso', 'satellite', 'satira', 'satollo', 'saturno', 'savana', 'savio', 'saziato', 'sbadiglio', 'sbalzo', 'sbancato', 'sbarra', 'sbattere', 'sbavare', 'sbendare', 'sbirciare', 'sbloccato', 'sbocciato', 'sbrinare', 'sbruffone', 'sbuffare', 'scabroso', 'scadenza', 'scala', 'scambiare', 'scandalo', 'scapola', 'scarso', 'scatenare', 'scavato', 'scelto', 'scenico', 'scettro', 'scheda', 'schiena', 'sciarpa', 'scienza', 'scindere', 'scippo', 'sciroppo', 'scivolo', 'sclerare', 'scodella', 'scolpito', 'scomparto', 'sconforto', 'scoprire', 'scorta', 'scossone', 'scozzese', 'scriba', 'scrollare', 'scrutinio', 'scuderia', 'scultore', 'scuola', 'scuro', 'scusare', 'sdebitare', 'sdoganare', 'seccatura', 'secondo', 'sedano', 'seggiola', 'segnalato', 'segregato', 'seguito', 'selciato', 'selettivo', 'sella', 'selvaggio', 'semaforo', 'sembrare', 'seme', 'seminato', 'sempre', 'senso', 'sentire', 'sepolto', 'sequenza', 'serata', 'serbato', 'sereno', 'serio', 'serpente', 'serraglio', 'servire', 'sestina', 'setola', 'settimana', 'sfacelo', 'sfaldare', 'sfamato', 'sfarzoso', 'sfaticato', 'sfera', 'sfida', 'sfilato', 'sfinge', 'sfocato', 'sfoderare', 'sfogo', 'sfoltire', 'sforzato', 'sfratto', 'sfruttato', 'sfuggito', 'sfumare', 'sfuso', 'sgabello', 'sgarbato', 'sgonfiare', 'sgorbio', 'sgrassato', 'sguardo', 'sibilo', 'siccome', 'sierra', 'sigla', 'signore', 'silenzio', 'sillaba', 'simbolo', 'simpatico', 'simulato', 'sinfonia', 'singolo', 'sinistro', 'sino', 'sintesi', 'sinusoide', 'sipario', 'sisma', 'sistole', 'situato', 'slitta', 'slogatura', 'sloveno', 'smarrito', 'smemorato', 'smentito', 'smeraldo', 'smilzo', 'smontare', 'smottato', 'smussato', 'snellire', 'snervato', 'snodo', 'sobbalzo', 'sobrio', 'soccorso', 'sociale', 'sodale', 'soffitto', 'sogno', 'soldato', 'solenne', 'solido', 'sollazzo', 'solo', 'solubile', 'solvente', 'somatico', 'somma', 'sonda', 'sonetto', 'sonnifero', 'sopire', 'soppeso', 'sopra', 'sorgere', 'sorpasso', 'sorriso', 'sorso', 'sorteggio', 'sorvolato', 'sospiro', 'sosta', 'sottile', 'spada', 'spalla', 'spargere', 'spatola', 'spavento', 'spazzola', 'specie', 'spedire', 'spegnere', 'spelatura', 'speranza', 'spessore', 'spettrale', 'spezzato', 'spia', 'spigoloso', 'spillato', 'spinoso', 'spirale', 'splendido', 'sportivo', 'sposo', 'spranga', 'sprecare', 'spronato', 'spruzzo', 'spuntino', 'squillo', 'sradicare', 'srotolato', 'stabile', 'stacco', 'staffa', 'stagnare', 'stampato', 'stantio', 'starnuto', 'stasera', 'statuto', 'stelo', 'steppa', 'sterzo', 'stiletto', 'stima', 'stirpe', 'stivale', 'stizzoso', 'stonato', 'storico', 'strappo', 'stregato', 'stridulo', 'strozzare', 'strutto', 'stuccare', 'stufo', 'stupendo', 'subentro', 'succoso', 'sudore', 'suggerito', 'sugo', 'sultano', 'suonare', 'superbo', 'supporto', 'surgelato', 'surrogato', 'sussurro', 'sutura', 'svagare', 'svedese', 'sveglio', 'svelare', 'svenuto', 'svezia', 'sviluppo', 'svista', 'svizzera', 'svolta', 'svuotare', 'tabacco', 'tabulato', 'tacciare', 'taciturno', 'tale', 'talismano', 'tampone', 'tannino', 'tara', 'tardivo', 'targato', 'tariffa', 'tarpare', 'tartaruga', 'tasto', 'tattico', 'taverna', 'tavolata', 'tazza', 'teca', 'tecnico', 'telefono', 'temerario', 'tempo', 'temuto', 'tendone', 'tenero', 'tensione', 'tentacolo', 'teorema', 'terme', 'terrazzo', 'terzetto', 'tesi', 'tesserato', 'testato', 'tetro', 'tettoia', 'tifare', 'tigella', 'timbro', 'tinto', 'tipico', 'tipografo', 'tiraggio', 'tiro', 'titanio', 'titolo', 'titubante', 'tizio', 'tizzone', 'toccare', 'tollerare', 'tolto', 'tombola', 'tomo', 'tonfo', 'tonsilla', 'topazio', 'topologia', 'toppa', 'torba', 'tornare', 'torrone', 'tortora', 'toscano', 'tossire', 'tostatura', 'totano', 'trabocco', 'trachea', 'trafila', 'tragedia', 'tralcio', 'tramonto', 'transito', 'trapano', 'trarre', 'trasloco', 'trattato', 'trave', 'treccia', 'tremolio', 'trespolo', 'tributo', 'tricheco', 'trifoglio', 'trillo', 'trincea', 'trio', 'tristezza', 'triturato', 'trivella', 'tromba', 'trono', 'troppo', 'trottola', 'trovare', 'truccato', 'tubatura', 'tuffato', 'tulipano', 'tumulto', 'tunisia', 'turbare', 'turchino', 'tuta', 'tutela', 'ubicato', 'uccello', 'uccisore', 'udire', 'uditivo', 'uffa', 'ufficio', 'uguale', 'ulisse', 'ultimato', 'umano', 'umile', 'umorismo', 'uncinetto', 'ungere', 'ungherese', 'unicorno', 'unificato', 'unisono', 'unitario', 'unte', 'uovo', 'upupa', 'uragano', 'urgenza', 'urlo', 'usanza', 'usato', 'uscito', 'usignolo', 'usuraio', 'utensile', 'utilizzo', 'utopia', 'vacante', 'vaccinato', 'vagabondo', 'vagliato', 'valanga', 'valgo', 'valico', 'valletta', 'valoroso', 'valutare', 'valvola', 'vampata', 'vangare', 'vanitoso', 'vano', 'vantaggio', 'vanvera', 'vapore', 'varano', 'varcato', 'variante', 'vasca', 'vedetta', 'vedova', 'veduto', 'vegetale', 'veicolo', 'velcro', 'velina', 'velluto', 'veloce', 'venato', 'vendemmia', 'vento', 'verace', 'verbale', 'vergogna', 'verifica', 'vero', 'verruca', 'verticale', 'vescica', 'vessillo', 'vestale', 'veterano', 'vetrina', 'vetusto', 'viandante', 'vibrante', 'vicenda', 'vichingo', 'vicinanza', 'vidimare', 'vigilia', 'vigneto', 'vigore', 'vile', 'villano', 'vimini', 'vincitore', 'viola', 'vipera', 'virgola', 'virologo', 'virulento', 'viscoso', 'visione', 'vispo', 'vissuto', 'visura', 'vita', 'vitello', 'vittima', 'vivanda', 'vivido', 'viziare', 'voce', 'voga', 'volatile', 'volere', 'volpe', 'voragine', 'vulcano', 'zampogna', 'zanna', 'zappato', 'zattera', 'zavorra', 'zefiro', 'zelante', 'zelo', 'zenzero', 'zerbino', 'zibetto', 'zinco', 'zircone', 'zitto', 'zolla', 'zotico', 'zucchero', 'zufolo', 'zulu', 'zuppa'];

var JAPANESE = ['あいこくしん', 'あいさつ', 'あいだ', 'あおぞら', 'あかちゃん', 'あきる', 'あけがた', 'あける', 'あこがれる', 'あさい', 'あさひ', 'あしあと', 'あじわう', 'あずかる', 'あずき', 'あそぶ', 'あたえる', 'あたためる', 'あたりまえ', 'あたる', 'あつい', 'あつかう', 'あっしゅく', 'あつまり', 'あつめる', 'あてな', 'あてはまる', 'あひる', 'あぶら', 'あぶる', 'あふれる', 'あまい', 'あまど', 'あまやかす', 'あまり', 'あみもの', 'あめりか', 'あやまる', 'あゆむ', 'あらいぐま', 'あらし', 'あらすじ', 'あらためる', 'あらゆる', 'あらわす', 'ありがとう', 'あわせる', 'あわてる', 'あんい', 'あんがい', 'あんこ', 'あんぜん', 'あんてい', 'あんない', 'あんまり', 'いいだす', 'いおん', 'いがい', 'いがく', 'いきおい', 'いきなり', 'いきもの', 'いきる', 'いくじ', 'いくぶん', 'いけばな', 'いけん', 'いこう', 'いこく', 'いこつ', 'いさましい', 'いさん', 'いしき', 'いじゅう', 'いじょう', 'いじわる', 'いずみ', 'いずれ', 'いせい', 'いせえび', 'いせかい', 'いせき', 'いぜん', 'いそうろう', 'いそがしい', 'いだい', 'いだく', 'いたずら', 'いたみ', 'いたりあ', 'いちおう', 'いちじ', 'いちど', 'いちば', 'いちぶ', 'いちりゅう', 'いつか', 'いっしゅん', 'いっせい', 'いっそう', 'いったん', 'いっち', 'いってい', 'いっぽう', 'いてざ', 'いてん', 'いどう', 'いとこ', 'いない', 'いなか', 'いねむり', 'いのち', 'いのる', 'いはつ', 'いばる', 'いはん', 'いびき', 'いひん', 'いふく', 'いへん', 'いほう', 'いみん', 'いもうと', 'いもたれ', 'いもり', 'いやがる', 'いやす', 'いよかん', 'いよく', 'いらい', 'いらすと', 'いりぐち', 'いりょう', 'いれい', 'いれもの', 'いれる', 'いろえんぴつ', 'いわい', 'いわう', 'いわかん', 'いわば', 'いわゆる', 'いんげんまめ', 'いんさつ', 'いんしょう', 'いんよう', 'うえき', 'うえる', 'うおざ', 'うがい', 'うかぶ', 'うかべる', 'うきわ', 'うくらいな', 'うくれれ', 'うけたまわる', 'うけつけ', 'うけとる', 'うけもつ', 'うける', 'うごかす', 'うごく', 'うこん', 'うさぎ', 'うしなう', 'うしろがみ', 'うすい', 'うすぎ', 'うすぐらい', 'うすめる', 'うせつ', 'うちあわせ', 'うちがわ', 'うちき', 'うちゅう', 'うっかり', 'うつくしい', 'うったえる', 'うつる', 'うどん', 'うなぎ', 'うなじ', 'うなずく', 'うなる', 'うねる', 'うのう', 'うぶげ', 'うぶごえ', 'うまれる', 'うめる', 'うもう', 'うやまう', 'うよく', 'うらがえす', 'うらぐち', 'うらない', 'うりあげ', 'うりきれ', 'うるさい', 'うれしい', 'うれゆき', 'うれる', 'うろこ', 'うわき', 'うわさ', 'うんこう', 'うんちん', 'うんてん', 'うんどう', 'えいえん', 'えいが', 'えいきょう', 'えいご', 'えいせい', 'えいぶん', 'えいよう', 'えいわ', 'えおり', 'えがお', 'えがく', 'えきたい', 'えくせる', 'えしゃく', 'えすて', 'えつらん', 'えのぐ', 'えほうまき', 'えほん', 'えまき', 'えもじ', 'えもの', 'えらい', 'えらぶ', 'えりあ', 'えんえん', 'えんかい', 'えんぎ', 'えんげき', 'えんしゅう', 'えんぜつ', 'えんそく', 'えんちょう', 'えんとつ', 'おいかける', 'おいこす', 'おいしい', 'おいつく', 'おうえん', 'おうさま', 'おうじ', 'おうせつ', 'おうたい', 'おうふく', 'おうべい', 'おうよう', 'おえる', 'おおい', 'おおう', 'おおどおり', 'おおや', 'おおよそ', 'おかえり', 'おかず', 'おがむ', 'おかわり', 'おぎなう', 'おきる', 'おくさま', 'おくじょう', 'おくりがな', 'おくる', 'おくれる', 'おこす', 'おこなう', 'おこる', 'おさえる', 'おさない', 'おさめる', 'おしいれ', 'おしえる', 'おじぎ', 'おじさん', 'おしゃれ', 'おそらく', 'おそわる', 'おたがい', 'おたく', 'おだやか', 'おちつく', 'おっと', 'おつり', 'おでかけ', 'おとしもの', 'おとなしい', 'おどり', 'おどろかす', 'おばさん', 'おまいり', 'おめでとう', 'おもいで', 'おもう', 'おもたい', 'おもちゃ', 'おやつ', 'おやゆび', 'およぼす', 'おらんだ', 'おろす', 'おんがく', 'おんけい', 'おんしゃ', 'おんせん', 'おんだん', 'おんちゅう', 'おんどけい', 'かあつ', 'かいが', 'がいき', 'がいけん', 'がいこう', 'かいさつ', 'かいしゃ', 'かいすいよく', 'かいぜん', 'かいぞうど', 'かいつう', 'かいてん', 'かいとう', 'かいふく', 'がいへき', 'かいほう', 'かいよう', 'がいらい', 'かいわ', 'かえる', 'かおり', 'かかえる', 'かがく', 'かがし', 'かがみ', 'かくご', 'かくとく', 'かざる', 'がぞう', 'かたい', 'かたち', 'がちょう', 'がっきゅう', 'がっこう', 'がっさん', 'がっしょう', 'かなざわし', 'かのう', 'がはく', 'かぶか', 'かほう', 'かほご', 'かまう', 'かまぼこ', 'かめれおん', 'かゆい', 'かようび', 'からい', 'かるい', 'かろう', 'かわく', 'かわら', 'がんか', 'かんけい', 'かんこう', 'かんしゃ', 'かんそう', 'かんたん', 'かんち', 'がんばる', 'きあい', 'きあつ', 'きいろ', 'ぎいん', 'きうい', 'きうん', 'きえる', 'きおう', 'きおく', 'きおち', 'きおん', 'きかい', 'きかく', 'きかんしゃ', 'ききて', 'きくばり', 'きくらげ', 'きけんせい', 'きこう', 'きこえる', 'きこく', 'きさい', 'きさく', 'きさま', 'きさらぎ', 'ぎじかがく', 'ぎしき', 'ぎじたいけん', 'ぎじにってい', 'ぎじゅつしゃ', 'きすう', 'きせい', 'きせき', 'きせつ', 'きそう', 'きぞく', 'きぞん', 'きたえる', 'きちょう', 'きつえん', 'ぎっちり', 'きつつき', 'きつね', 'きてい', 'きどう', 'きどく', 'きない', 'きなが', 'きなこ', 'きぬごし', 'きねん', 'きのう', 'きのした', 'きはく', 'きびしい', 'きひん', 'きふく', 'きぶん', 'きぼう', 'きほん', 'きまる', 'きみつ', 'きむずかしい', 'きめる', 'きもだめし', 'きもち', 'きもの', 'きゃく', 'きやく', 'ぎゅうにく', 'きよう', 'きょうりゅう', 'きらい', 'きらく', 'きりん', 'きれい', 'きれつ', 'きろく', 'ぎろん', 'きわめる', 'ぎんいろ', 'きんかくじ', 'きんじょ', 'きんようび', 'ぐあい', 'くいず', 'くうかん', 'くうき', 'くうぐん', 'くうこう', 'ぐうせい', 'くうそう', 'ぐうたら', 'くうふく', 'くうぼ', 'くかん', 'くきょう', 'くげん', 'ぐこう', 'くさい', 'くさき', 'くさばな', 'くさる', 'くしゃみ', 'くしょう', 'くすのき', 'くすりゆび', 'くせげ', 'くせん', 'ぐたいてき', 'くださる', 'くたびれる', 'くちこみ', 'くちさき', 'くつした', 'ぐっすり', 'くつろぐ', 'くとうてん', 'くどく', 'くなん', 'くねくね', 'くのう', 'くふう', 'くみあわせ', 'くみたてる', 'くめる', 'くやくしょ', 'くらす', 'くらべる', 'くるま', 'くれる', 'くろう', 'くわしい', 'ぐんかん', 'ぐんしょく', 'ぐんたい', 'ぐんて', 'けあな', 'けいかく', 'けいけん', 'けいこ', 'けいさつ', 'げいじゅつ', 'けいたい', 'げいのうじん', 'けいれき', 'けいろ', 'けおとす', 'けおりもの', 'げきか', 'げきげん', 'げきだん', 'げきちん', 'げきとつ', 'げきは', 'げきやく', 'げこう', 'げこくじょう', 'げざい', 'けさき', 'げざん', 'けしき', 'けしごむ', 'けしょう', 'げすと', 'けたば', 'けちゃっぷ', 'けちらす', 'けつあつ', 'けつい', 'けつえき', 'けっこん', 'けつじょ', 'けっせき', 'けってい', 'けつまつ', 'げつようび', 'げつれい', 'けつろん', 'げどく', 'けとばす', 'けとる', 'けなげ', 'けなす', 'けなみ', 'けぬき', 'げねつ', 'けねん', 'けはい', 'げひん', 'けぶかい', 'げぼく', 'けまり', 'けみかる', 'けむし', 'けむり', 'けもの', 'けらい', 'けろけろ', 'けわしい', 'けんい', 'けんえつ', 'けんお', 'けんか', 'げんき', 'けんげん', 'けんこう', 'けんさく', 'けんしゅう', 'けんすう', 'げんそう', 'けんちく', 'けんてい', 'けんとう', 'けんない', 'けんにん', 'げんぶつ', 'けんま', 'けんみん', 'けんめい', 'けんらん', 'けんり', 'こあくま', 'こいぬ', 'こいびと', 'ごうい', 'こうえん', 'こうおん', 'こうかん', 'ごうきゅう', 'ごうけい', 'こうこう', 'こうさい', 'こうじ', 'こうすい', 'ごうせい', 'こうそく', 'こうたい', 'こうちゃ', 'こうつう', 'こうてい', 'こうどう', 'こうない', 'こうはい', 'ごうほう', 'ごうまん', 'こうもく', 'こうりつ', 'こえる', 'こおり', 'ごかい', 'ごがつ', 'ごかん', 'こくご', 'こくさい', 'こくとう', 'こくない', 'こくはく', 'こぐま', 'こけい', 'こける', 'ここのか', 'こころ', 'こさめ', 'こしつ', 'こすう', 'こせい', 'こせき', 'こぜん', 'こそだて', 'こたい', 'こたえる', 'こたつ', 'こちょう', 'こっか', 'こつこつ', 'こつばん', 'こつぶ', 'こてい', 'こてん', 'ことがら', 'ことし', 'ことば', 'ことり', 'こなごな', 'こねこね', 'このまま', 'このみ', 'このよ', 'ごはん', 'こひつじ', 'こふう', 'こふん', 'こぼれる', 'ごまあぶら', 'こまかい', 'ごますり', 'こまつな', 'こまる', 'こむぎこ', 'こもじ', 'こもち', 'こもの', 'こもん', 'こやく', 'こやま', 'こゆう', 'こゆび', 'こよい', 'こよう', 'こりる', 'これくしょん', 'ころっけ', 'こわもて', 'こわれる', 'こんいん', 'こんかい', 'こんき', 'こんしゅう', 'こんすい', 'こんだて', 'こんとん', 'こんなん', 'こんびに', 'こんぽん', 'こんまけ', 'こんや', 'こんれい', 'こんわく', 'ざいえき', 'さいかい', 'さいきん', 'ざいげん', 'ざいこ', 'さいしょ', 'さいせい', 'ざいたく', 'ざいちゅう', 'さいてき', 'ざいりょう', 'さうな', 'さかいし', 'さがす', 'さかな', 'さかみち', 'さがる', 'さぎょう', 'さくし', 'さくひん', 'さくら', 'さこく', 'さこつ', 'さずかる', 'ざせき', 'さたん', 'さつえい', 'ざつおん', 'ざっか', 'ざつがく', 'さっきょく', 'ざっし', 'さつじん', 'ざっそう', 'さつたば', 'さつまいも', 'さてい', 'さといも', 'さとう', 'さとおや', 'さとし', 'さとる', 'さのう', 'さばく', 'さびしい', 'さべつ', 'さほう', 'さほど', 'さます', 'さみしい', 'さみだれ', 'さむけ', 'さめる', 'さやえんどう', 'さゆう', 'さよう', 'さよく', 'さらだ', 'ざるそば', 'さわやか', 'さわる', 'さんいん', 'さんか', 'さんきゃく', 'さんこう', 'さんさい', 'ざんしょ', 'さんすう', 'さんせい', 'さんそ', 'さんち', 'さんま', 'さんみ', 'さんらん', 'しあい', 'しあげ', 'しあさって', 'しあわせ', 'しいく', 'しいん', 'しうち', 'しえい', 'しおけ', 'しかい', 'しかく', 'じかん', 'しごと', 'しすう', 'じだい', 'したうけ', 'したぎ', 'したて', 'したみ', 'しちょう', 'しちりん', 'しっかり', 'しつじ', 'しつもん', 'してい', 'してき', 'してつ', 'じてん', 'じどう', 'しなぎれ', 'しなもの', 'しなん', 'しねま', 'しねん', 'しのぐ', 'しのぶ', 'しはい', 'しばかり', 'しはつ', 'しはらい', 'しはん', 'しひょう', 'しふく', 'じぶん', 'しへい', 'しほう', 'しほん', 'しまう', 'しまる', 'しみん', 'しむける', 'じむしょ', 'しめい', 'しめる', 'しもん', 'しゃいん', 'しゃうん', 'しゃおん', 'じゃがいも', 'しやくしょ', 'しゃくほう', 'しゃけん', 'しゃこ', 'しゃざい', 'しゃしん', 'しゃせん', 'しゃそう', 'しゃたい', 'しゃちょう', 'しゃっきん', 'じゃま', 'しゃりん', 'しゃれい', 'じゆう', 'じゅうしょ', 'しゅくはく', 'じゅしん', 'しゅっせき', 'しゅみ', 'しゅらば', 'じゅんばん', 'しょうかい', 'しょくたく', 'しょっけん', 'しょどう', 'しょもつ', 'しらせる', 'しらべる', 'しんか', 'しんこう', 'じんじゃ', 'しんせいじ', 'しんちく', 'しんりん', 'すあげ', 'すあし', 'すあな', 'ずあん', 'すいえい', 'すいか', 'すいとう', 'ずいぶん', 'すいようび', 'すうがく', 'すうじつ', 'すうせん', 'すおどり', 'すきま', 'すくう', 'すくない', 'すける', 'すごい', 'すこし', 'ずさん', 'すずしい', 'すすむ', 'すすめる', 'すっかり', 'ずっしり', 'ずっと', 'すてき', 'すてる', 'すねる', 'すのこ', 'すはだ', 'すばらしい', 'ずひょう', 'ずぶぬれ', 'すぶり', 'すふれ', 'すべて', 'すべる', 'ずほう', 'すぼん', 'すまい', 'すめし', 'すもう', 'すやき', 'すらすら', 'するめ', 'すれちがう', 'すろっと', 'すわる', 'すんぜん', 'すんぽう', 'せあぶら', 'せいかつ', 'せいげん', 'せいじ', 'せいよう', 'せおう', 'せかいかん', 'せきにん', 'せきむ', 'せきゆ', 'せきらんうん', 'せけん', 'せこう', 'せすじ', 'せたい', 'せたけ', 'せっかく', 'せっきゃく', 'ぜっく', 'せっけん', 'せっこつ', 'せっさたくま', 'せつぞく', 'せつだん', 'せつでん', 'せっぱん', 'せつび', 'せつぶん', 'せつめい', 'せつりつ', 'せなか', 'せのび', 'せはば', 'せびろ', 'せぼね', 'せまい', 'せまる', 'せめる', 'せもたれ', 'せりふ', 'ぜんあく', 'せんい', 'せんえい', 'せんか', 'せんきょ', 'せんく', 'せんげん', 'ぜんご', 'せんさい', 'せんしゅ', 'せんすい', 'せんせい', 'せんぞ', 'せんたく', 'せんちょう', 'せんてい', 'せんとう', 'せんぬき', 'せんねん', 'せんぱい', 'ぜんぶ', 'ぜんぽう', 'せんむ', 'せんめんじょ', 'せんもん', 'せんやく', 'せんゆう', 'せんよう', 'ぜんら', 'ぜんりゃく', 'せんれい', 'せんろ', 'そあく', 'そいとげる', 'そいね', 'そうがんきょう', 'そうき', 'そうご', 'そうしん', 'そうだん', 'そうなん', 'そうび', 'そうめん', 'そうり', 'そえもの', 'そえん', 'そがい', 'そげき', 'そこう', 'そこそこ', 'そざい', 'そしな', 'そせい', 'そせん', 'そそぐ', 'そだてる', 'そつう', 'そつえん', 'そっかん', 'そつぎょう', 'そっけつ', 'そっこう', 'そっせん', 'そっと', 'そとがわ', 'そとづら', 'そなえる', 'そなた', 'そふぼ', 'そぼく', 'そぼろ', 'そまつ', 'そまる', 'そむく', 'そむりえ', 'そめる', 'そもそも', 'そよかぜ', 'そらまめ', 'そろう', 'そんかい', 'そんけい', 'そんざい', 'そんしつ', 'そんぞく', 'そんちょう', 'ぞんび', 'ぞんぶん', 'そんみん', 'たあい', 'たいいん', 'たいうん', 'たいえき', 'たいおう', 'だいがく', 'たいき', 'たいぐう', 'たいけん', 'たいこ', 'たいざい', 'だいじょうぶ', 'だいすき', 'たいせつ', 'たいそう', 'だいたい', 'たいちょう', 'たいてい', 'だいどころ', 'たいない', 'たいねつ', 'たいのう', 'たいはん', 'だいひょう', 'たいふう', 'たいへん', 'たいほ', 'たいまつばな', 'たいみんぐ', 'たいむ', 'たいめん', 'たいやき', 'たいよう', 'たいら', 'たいりょく', 'たいる', 'たいわん', 'たうえ', 'たえる', 'たおす', 'たおる', 'たおれる', 'たかい', 'たかね', 'たきび', 'たくさん', 'たこく', 'たこやき', 'たさい', 'たしざん', 'だじゃれ', 'たすける', 'たずさわる', 'たそがれ', 'たたかう', 'たたく', 'ただしい', 'たたみ', 'たちばな', 'だっかい', 'だっきゃく', 'だっこ', 'だっしゅつ', 'だったい', 'たてる', 'たとえる', 'たなばた', 'たにん', 'たぬき', 'たのしみ', 'たはつ', 'たぶん', 'たべる', 'たぼう', 'たまご', 'たまる', 'だむる', 'ためいき', 'ためす', 'ためる', 'たもつ', 'たやすい', 'たよる', 'たらす', 'たりきほんがん', 'たりょう', 'たりる', 'たると', 'たれる', 'たれんと', 'たろっと', 'たわむれる', 'だんあつ', 'たんい', 'たんおん', 'たんか', 'たんき', 'たんけん', 'たんご', 'たんさん', 'たんじょうび', 'だんせい', 'たんそく', 'たんたい', 'だんち', 'たんてい', 'たんとう', 'だんな', 'たんにん', 'だんねつ', 'たんのう', 'たんぴん', 'だんぼう', 'たんまつ', 'たんめい', 'だんれつ', 'だんろ', 'だんわ', 'ちあい', 'ちあん', 'ちいき', 'ちいさい', 'ちえん', 'ちかい', 'ちから', 'ちきゅう', 'ちきん', 'ちけいず', 'ちけん', 'ちこく', 'ちさい', 'ちしき', 'ちしりょう', 'ちせい', 'ちそう', 'ちたい', 'ちたん', 'ちちおや', 'ちつじょ', 'ちてき', 'ちてん', 'ちぬき', 'ちぬり', 'ちのう', 'ちひょう', 'ちへいせん', 'ちほう', 'ちまた', 'ちみつ', 'ちみどろ', 'ちめいど', 'ちゃんこなべ', 'ちゅうい', 'ちゆりょく', 'ちょうし', 'ちょさくけん', 'ちらし', 'ちらみ', 'ちりがみ', 'ちりょう', 'ちるど', 'ちわわ', 'ちんたい', 'ちんもく', 'ついか', 'ついたち', 'つうか', 'つうじょう', 'つうはん', 'つうわ', 'つかう', 'つかれる', 'つくね', 'つくる', 'つけね', 'つける', 'つごう', 'つたえる', 'つづく', 'つつじ', 'つつむ', 'つとめる', 'つながる', 'つなみ', 'つねづね', 'つのる', 'つぶす', 'つまらない', 'つまる', 'つみき', 'つめたい', 'つもり', 'つもる', 'つよい', 'つるぼ', 'つるみく', 'つわもの', 'つわり', 'てあし', 'てあて', 'てあみ', 'ていおん', 'ていか', 'ていき', 'ていけい', 'ていこく', 'ていさつ', 'ていし', 'ていせい', 'ていたい', 'ていど', 'ていねい', 'ていひょう', 'ていへん', 'ていぼう', 'てうち', 'ておくれ', 'てきとう', 'てくび', 'でこぼこ', 'てさぎょう', 'てさげ', 'てすり', 'てそう', 'てちがい', 'てちょう', 'てつがく', 'てつづき', 'でっぱ', 'てつぼう', 'てつや', 'でぬかえ', 'てぬき', 'てぬぐい', 'てのひら', 'てはい', 'てぶくろ', 'てふだ', 'てほどき', 'てほん', 'てまえ', 'てまきずし', 'てみじか', 'てみやげ', 'てらす', 'てれび', 'てわけ', 'てわたし', 'でんあつ', 'てんいん', 'てんかい', 'てんき', 'てんぐ', 'てんけん', 'てんごく', 'てんさい', 'てんし', 'てんすう', 'でんち', 'てんてき', 'てんとう', 'てんない', 'てんぷら', 'てんぼうだい', 'てんめつ', 'てんらんかい', 'でんりょく', 'でんわ', 'どあい', 'といれ', 'どうかん', 'とうきゅう', 'どうぐ', 'とうし', 'とうむぎ', 'とおい', 'とおか', 'とおく', 'とおす', 'とおる', 'とかい', 'とかす', 'ときおり', 'ときどき', 'とくい', 'とくしゅう', 'とくてん', 'とくに', 'とくべつ', 'とけい', 'とける', 'とこや', 'とさか', 'としょかん', 'とそう', 'とたん', 'とちゅう', 'とっきゅう', 'とっくん', 'とつぜん', 'とつにゅう', 'とどける', 'ととのえる', 'とない', 'となえる', 'となり', 'とのさま', 'とばす', 'どぶがわ', 'とほう', 'とまる', 'とめる', 'ともだち', 'ともる', 'どようび', 'とらえる', 'とんかつ', 'どんぶり', 'ないかく', 'ないこう', 'ないしょ', 'ないす', 'ないせん', 'ないそう', 'なおす', 'ながい', 'なくす', 'なげる', 'なこうど', 'なさけ', 'なたでここ', 'なっとう', 'なつやすみ', 'ななおし', 'なにごと', 'なにもの', 'なにわ', 'なのか', 'なふだ', 'なまいき', 'なまえ', 'なまみ', 'なみだ', 'なめらか', 'なめる', 'なやむ', 'ならう', 'ならび', 'ならぶ', 'なれる', 'なわとび', 'なわばり', 'にあう', 'にいがた', 'にうけ', 'におい', 'にかい', 'にがて', 'にきび', 'にくしみ', 'にくまん', 'にげる', 'にさんかたんそ', 'にしき', 'にせもの', 'にちじょう', 'にちようび', 'にっか', 'にっき', 'にっけい', 'にっこう', 'にっさん', 'にっしょく', 'にっすう', 'にっせき', 'にってい', 'になう', 'にほん', 'にまめ', 'にもつ', 'にやり', 'にゅういん', 'にりんしゃ', 'にわとり', 'にんい', 'にんか', 'にんき', 'にんげん', 'にんしき', 'にんずう', 'にんそう', 'にんたい', 'にんち', 'にんてい', 'にんにく', 'にんぷ', 'にんまり', 'にんむ', 'にんめい', 'にんよう', 'ぬいくぎ', 'ぬかす', 'ぬぐいとる', 'ぬぐう', 'ぬくもり', 'ぬすむ', 'ぬまえび', 'ぬめり', 'ぬらす', 'ぬんちゃく', 'ねあげ', 'ねいき', 'ねいる', 'ねいろ', 'ねぐせ', 'ねくたい', 'ねくら', 'ねこぜ', 'ねこむ', 'ねさげ', 'ねすごす', 'ねそべる', 'ねだん', 'ねつい', 'ねっしん', 'ねつぞう', 'ねったいぎょ', 'ねぶそく', 'ねふだ', 'ねぼう', 'ねほりはほり', 'ねまき', 'ねまわし', 'ねみみ', 'ねむい', 'ねむたい', 'ねもと', 'ねらう', 'ねわざ', 'ねんいり', 'ねんおし', 'ねんかん', 'ねんきん', 'ねんぐ', 'ねんざ', 'ねんし', 'ねんちゃく', 'ねんど', 'ねんぴ', 'ねんぶつ', 'ねんまつ', 'ねんりょう', 'ねんれい', 'のいず', 'のおづま', 'のがす', 'のきなみ', 'のこぎり', 'のこす', 'のこる', 'のせる', 'のぞく', 'のぞむ', 'のたまう', 'のちほど', 'のっく', 'のばす', 'のはら', 'のべる', 'のぼる', 'のみもの', 'のやま', 'のらいぬ', 'のらねこ', 'のりもの', 'のりゆき', 'のれん', 'のんき', 'ばあい', 'はあく', 'ばあさん', 'ばいか', 'ばいく', 'はいけん', 'はいご', 'はいしん', 'はいすい', 'はいせん', 'はいそう', 'はいち', 'ばいばい', 'はいれつ', 'はえる', 'はおる', 'はかい', 'ばかり', 'はかる', 'はくしゅ', 'はけん', 'はこぶ', 'はさみ', 'はさん', 'はしご', 'ばしょ', 'はしる', 'はせる', 'ぱそこん', 'はそん', 'はたん', 'はちみつ', 'はつおん', 'はっかく', 'はづき', 'はっきり', 'はっくつ', 'はっけん', 'はっこう', 'はっさん', 'はっしん', 'はったつ', 'はっちゅう', 'はってん', 'はっぴょう', 'はっぽう', 'はなす', 'はなび', 'はにかむ', 'はぶらし', 'はみがき', 'はむかう', 'はめつ', 'はやい', 'はやし', 'はらう', 'はろうぃん', 'はわい', 'はんい', 'はんえい', 'はんおん', 'はんかく', 'はんきょう', 'ばんぐみ', 'はんこ', 'はんしゃ', 'はんすう', 'はんだん', 'ぱんち', 'ぱんつ', 'はんてい', 'はんとし', 'はんのう', 'はんぱ', 'はんぶん', 'はんぺん', 'はんぼうき', 'はんめい', 'はんらん', 'はんろん', 'ひいき', 'ひうん', 'ひえる', 'ひかく', 'ひかり', 'ひかる', 'ひかん', 'ひくい', 'ひけつ', 'ひこうき', 'ひこく', 'ひさい', 'ひさしぶり', 'ひさん', 'びじゅつかん', 'ひしょ', 'ひそか', 'ひそむ', 'ひたむき', 'ひだり', 'ひたる', 'ひつぎ', 'ひっこし', 'ひっし', 'ひつじゅひん', 'ひっす', 'ひつぜん', 'ぴったり', 'ぴっちり', 'ひつよう', 'ひてい', 'ひとごみ', 'ひなまつり', 'ひなん', 'ひねる', 'ひはん', 'ひびく', 'ひひょう', 'ひほう', 'ひまわり', 'ひまん', 'ひみつ', 'ひめい', 'ひめじし', 'ひやけ', 'ひやす', 'ひよう', 'びょうき', 'ひらがな', 'ひらく', 'ひりつ', 'ひりょう', 'ひるま', 'ひるやすみ', 'ひれい', 'ひろい', 'ひろう', 'ひろき', 'ひろゆき', 'ひんかく', 'ひんけつ', 'ひんこん', 'ひんしゅ', 'ひんそう', 'ぴんち', 'ひんぱん', 'びんぼう', 'ふあん', 'ふいうち', 'ふうけい', 'ふうせん', 'ぷうたろう', 'ふうとう', 'ふうふ', 'ふえる', 'ふおん', 'ふかい', 'ふきん', 'ふくざつ', 'ふくぶくろ', 'ふこう', 'ふさい', 'ふしぎ', 'ふじみ', 'ふすま', 'ふせい', 'ふせぐ', 'ふそく', 'ぶたにく', 'ふたん', 'ふちょう', 'ふつう', 'ふつか', 'ふっかつ', 'ふっき', 'ふっこく', 'ぶどう', 'ふとる', 'ふとん', 'ふのう', 'ふはい', 'ふひょう', 'ふへん', 'ふまん', 'ふみん', 'ふめつ', 'ふめん', 'ふよう', 'ふりこ', 'ふりる', 'ふるい', 'ふんいき', 'ぶんがく', 'ぶんぐ', 'ふんしつ', 'ぶんせき', 'ふんそう', 'ぶんぽう', 'へいあん', 'へいおん', 'へいがい', 'へいき', 'へいげん', 'へいこう', 'へいさ', 'へいしゃ', 'へいせつ', 'へいそ', 'へいたく', 'へいてん', 'へいねつ', 'へいわ', 'へきが', 'へこむ', 'べにいろ', 'べにしょうが', 'へらす', 'へんかん', 'べんきょう', 'べんごし', 'へんさい', 'へんたい', 'べんり', 'ほあん', 'ほいく', 'ぼうぎょ', 'ほうこく', 'ほうそう', 'ほうほう', 'ほうもん', 'ほうりつ', 'ほえる', 'ほおん', 'ほかん', 'ほきょう', 'ぼきん', 'ほくろ', 'ほけつ', 'ほけん', 'ほこう', 'ほこる', 'ほしい', 'ほしつ', 'ほしゅ', 'ほしょう', 'ほせい', 'ほそい', 'ほそく', 'ほたて', 'ほたる', 'ぽちぶくろ', 'ほっきょく', 'ほっさ', 'ほったん', 'ほとんど', 'ほめる', 'ほんい', 'ほんき', 'ほんけ', 'ほんしつ', 'ほんやく', 'まいにち', 'まかい', 'まかせる', 'まがる', 'まける', 'まこと', 'まさつ', 'まじめ', 'ますく', 'まぜる', 'まつり', 'まとめ', 'まなぶ', 'まぬけ', 'まねく', 'まほう', 'まもる', 'まゆげ', 'まよう', 'まろやか', 'まわす', 'まわり', 'まわる', 'まんが', 'まんきつ', 'まんぞく', 'まんなか', 'みいら', 'みうち', 'みえる', 'みがく', 'みかた', 'みかん', 'みけん', 'みこん', 'みじかい', 'みすい', 'みすえる', 'みせる', 'みっか', 'みつかる', 'みつける', 'みてい', 'みとめる', 'みなと', 'みなみかさい', 'みねらる', 'みのう', 'みのがす', 'みほん', 'みもと', 'みやげ', 'みらい', 'みりょく', 'みわく', 'みんか', 'みんぞく', 'むいか', 'むえき', 'むえん', 'むかい', 'むかう', 'むかえ', 'むかし', 'むぎちゃ', 'むける', 'むげん', 'むさぼる', 'むしあつい', 'むしば', 'むじゅん', 'むしろ', 'むすう', 'むすこ', 'むすぶ', 'むすめ', 'むせる', 'むせん', 'むちゅう', 'むなしい', 'むのう', 'むやみ', 'むよう', 'むらさき', 'むりょう', 'むろん', 'めいあん', 'めいうん', 'めいえん', 'めいかく', 'めいきょく', 'めいさい', 'めいし', 'めいそう', 'めいぶつ', 'めいれい', 'めいわく', 'めぐまれる', 'めざす', 'めした', 'めずらしい', 'めだつ', 'めまい', 'めやす', 'めんきょ', 'めんせき', 'めんどう', 'もうしあげる', 'もうどうけん', 'もえる', 'もくし', 'もくてき', 'もくようび', 'もちろん', 'もどる', 'もらう', 'もんく', 'もんだい', 'やおや', 'やける', 'やさい', 'やさしい', 'やすい', 'やすたろう', 'やすみ', 'やせる', 'やそう', 'やたい', 'やちん', 'やっと', 'やっぱり', 'やぶる', 'やめる', 'ややこしい', 'やよい', 'やわらかい', 'ゆうき', 'ゆうびんきょく', 'ゆうべ', 'ゆうめい', 'ゆけつ', 'ゆしゅつ', 'ゆせん', 'ゆそう', 'ゆたか', 'ゆちゃく', 'ゆでる', 'ゆにゅう', 'ゆびわ', 'ゆらい', 'ゆれる', 'ようい', 'ようか', 'ようきゅう', 'ようじ', 'ようす', 'ようちえん', 'よかぜ', 'よかん', 'よきん', 'よくせい', 'よくぼう', 'よけい', 'よごれる', 'よさん', 'よしゅう', 'よそう', 'よそく', 'よっか', 'よてい', 'よどがわく', 'よねつ', 'よやく', 'よゆう', 'よろこぶ', 'よろしい', 'らいう', 'らくがき', 'らくご', 'らくさつ', 'らくだ', 'らしんばん', 'らせん', 'らぞく', 'らたい', 'らっか', 'られつ', 'りえき', 'りかい', 'りきさく', 'りきせつ', 'りくぐん', 'りくつ', 'りけん', 'りこう', 'りせい', 'りそう', 'りそく', 'りてん', 'りねん', 'りゆう', 'りゅうがく', 'りよう', 'りょうり', 'りょかん', 'りょくちゃ', 'りょこう', 'りりく', 'りれき', 'りろん', 'りんご', 'るいけい', 'るいさい', 'るいじ', 'るいせき', 'るすばん', 'るりがわら', 'れいかん', 'れいぎ', 'れいせい', 'れいぞうこ', 'れいとう', 'れいぼう', 'れきし', 'れきだい', 'れんあい', 'れんけい', 'れんこん', 'れんさい', 'れんしゅう', 'れんぞく', 'れんらく', 'ろうか', 'ろうご', 'ろうじん', 'ろうそく', 'ろくが', 'ろこつ', 'ろじうら', 'ろしゅつ', 'ろせん', 'ろてん', 'ろめん', 'ろれつ', 'ろんぎ', 'ろんぱ', 'ろんぶん', 'ろんり', 'わかす', 'わかめ', 'わかやま', 'わかれる', 'わしつ', 'わじまし', 'わすれもの', 'わらう', 'われる'];

var SPANISH = ['ábaco', 'abdomen', 'abeja', 'abierto', 'abogado', 'abono', 'aborto', 'abrazo', 'abrir', 'abuelo', 'abuso', 'acabar', 'academia', 'acceso', 'acción', 'aceite', 'acelga', 'acento', 'aceptar', 'ácido', 'aclarar', 'acné', 'acoger', 'acoso', 'activo', 'acto', 'actriz', 'actuar', 'acudir', 'acuerdo', 'acusar', 'adicto', 'admitir', 'adoptar', 'adorno', 'aduana', 'adulto', 'aéreo', 'afectar', 'afición', 'afinar', 'afirmar', 'ágil', 'agitar', 'agonía', 'agosto', 'agotar', 'agregar', 'agrio', 'agua', 'agudo', 'águila', 'aguja', 'ahogo', 'ahorro', 'aire', 'aislar', 'ajedrez', 'ajeno', 'ajuste', 'alacrán', 'alambre', 'alarma', 'alba', 'álbum', 'alcalde', 'aldea', 'alegre', 'alejar', 'alerta', 'aleta', 'alfiler', 'alga', 'algodón', 'aliado', 'aliento', 'alivio', 'alma', 'almeja', 'almíbar', 'altar', 'alteza', 'altivo', 'alto', 'altura', 'alumno', 'alzar', 'amable', 'amante', 'amapola', 'amargo', 'amasar', 'ámbar', 'ámbito', 'ameno', 'amigo', 'amistad', 'amor', 'amparo', 'amplio', 'ancho', 'anciano', 'ancla', 'andar', 'andén', 'anemia', 'ángulo', 'anillo', 'ánimo', 'anís', 'anotar', 'antena', 'antiguo', 'antojo', 'anual', 'anular', 'anuncio', 'añadir', 'añejo', 'año', 'apagar', 'aparato', 'apetito', 'apio', 'aplicar', 'apodo', 'aporte', 'apoyo', 'aprender', 'aprobar', 'apuesta', 'apuro', 'arado', 'araña', 'arar', 'árbitro', 'árbol', 'arbusto', 'archivo', 'arco', 'arder', 'ardilla', 'arduo', 'área', 'árido', 'aries', 'armonía', 'arnés', 'aroma', 'arpa', 'arpón', 'arreglo', 'arroz', 'arruga', 'arte', 'artista', 'asa', 'asado', 'asalto', 'ascenso', 'asegurar', 'aseo', 'asesor', 'asiento', 'asilo', 'asistir', 'asno', 'asombro', 'áspero', 'astilla', 'astro', 'astuto', 'asumir', 'asunto', 'atajo', 'ataque', 'atar', 'atento', 'ateo', 'ático', 'atleta', 'átomo', 'atraer', 'atroz', 'atún', 'audaz', 'audio', 'auge', 'aula', 'aumento', 'ausente', 'autor', 'aval', 'avance', 'avaro', 'ave', 'avellana', 'avena', 'avestruz', 'avión', 'aviso', 'ayer', 'ayuda', 'ayuno', 'azafrán', 'azar', 'azote', 'azúcar', 'azufre', 'azul', 'baba', 'babor', 'bache', 'bahía', 'baile', 'bajar', 'balanza', 'balcón', 'balde', 'bambú', 'banco', 'banda', 'baño', 'barba', 'barco', 'barniz', 'barro', 'báscula', 'bastón', 'basura', 'batalla', 'batería', 'batir', 'batuta', 'baúl', 'bazar', 'bebé', 'bebida', 'bello', 'besar', 'beso', 'bestia', 'bicho', 'bien', 'bingo', 'blanco', 'bloque', 'blusa', 'boa', 'bobina', 'bobo', 'boca', 'bocina', 'boda', 'bodega', 'boina', 'bola', 'bolero', 'bolsa', 'bomba', 'bondad', 'bonito', 'bono', 'bonsái', 'borde', 'borrar', 'bosque', 'bote', 'botín', 'bóveda', 'bozal', 'bravo', 'brazo', 'brecha', 'breve', 'brillo', 'brinco', 'brisa', 'broca', 'broma', 'bronce', 'brote', 'bruja', 'brusco', 'bruto', 'buceo', 'bucle', 'bueno', 'buey', 'bufanda', 'bufón', 'búho', 'buitre', 'bulto', 'burbuja', 'burla', 'burro', 'buscar', 'butaca', 'buzón', 'caballo', 'cabeza', 'cabina', 'cabra', 'cacao', 'cadáver', 'cadena', 'caer', 'café', 'caída', 'caimán', 'caja', 'cajón', 'cal', 'calamar', 'calcio', 'caldo', 'calidad', 'calle', 'calma', 'calor', 'calvo', 'cama', 'cambio', 'camello', 'camino', 'campo', 'cáncer', 'candil', 'canela', 'canguro', 'canica', 'canto', 'caña', 'cañón', 'caoba', 'caos', 'capaz', 'capitán', 'capote', 'captar', 'capucha', 'cara', 'carbón', 'cárcel', 'careta', 'carga', 'cariño', 'carne', 'carpeta', 'carro', 'carta', 'casa', 'casco', 'casero', 'caspa', 'castor', 'catorce', 'catre', 'caudal', 'causa', 'cazo', 'cebolla', 'ceder', 'cedro', 'celda', 'célebre', 'celoso', 'célula', 'cemento', 'ceniza', 'centro', 'cerca', 'cerdo', 'cereza', 'cero', 'cerrar', 'certeza', 'césped', 'cetro', 'chacal', 'chaleco', 'champú', 'chancla', 'chapa', 'charla', 'chico', 'chiste', 'chivo', 'choque', 'choza', 'chuleta', 'chupar', 'ciclón', 'ciego', 'cielo', 'cien', 'cierto', 'cifra', 'cigarro', 'cima', 'cinco', 'cine', 'cinta', 'ciprés', 'circo', 'ciruela', 'cisne', 'cita', 'ciudad', 'clamor', 'clan', 'claro', 'clase', 'clave', 'cliente', 'clima', 'clínica', 'cobre', 'cocción', 'cochino', 'cocina', 'coco', 'código', 'codo', 'cofre', 'coger', 'cohete', 'cojín', 'cojo', 'cola', 'colcha', 'colegio', 'colgar', 'colina', 'collar', 'colmo', 'columna', 'combate', 'comer', 'comida', 'cómodo', 'compra', 'conde', 'conejo', 'conga', 'conocer', 'consejo', 'contar', 'copa', 'copia', 'corazón', 'corbata', 'corcho', 'cordón', 'corona', 'correr', 'coser', 'cosmos', 'costa', 'cráneo', 'cráter', 'crear', 'crecer', 'creído', 'crema', 'cría', 'crimen', 'cripta', 'crisis', 'cromo', 'crónica', 'croqueta', 'crudo', 'cruz', 'cuadro', 'cuarto', 'cuatro', 'cubo', 'cubrir', 'cuchara', 'cuello', 'cuento', 'cuerda', 'cuesta', 'cueva', 'cuidar', 'culebra', 'culpa', 'culto', 'cumbre', 'cumplir', 'cuna', 'cuneta', 'cuota', 'cupón', 'cúpula', 'curar', 'curioso', 'curso', 'curva', 'cutis', 'dama', 'danza', 'dar', 'dardo', 'dátil', 'deber', 'débil', 'década', 'decir', 'dedo', 'defensa', 'definir', 'dejar', 'delfín', 'delgado', 'delito', 'demora', 'denso', 'dental', 'deporte', 'derecho', 'derrota', 'desayuno', 'deseo', 'desfile', 'desnudo', 'destino', 'desvío', 'detalle', 'detener', 'deuda', 'día', 'diablo', 'diadema', 'diamante', 'diana', 'diario', 'dibujo', 'dictar', 'diente', 'dieta', 'diez', 'difícil', 'digno', 'dilema', 'diluir', 'dinero', 'directo', 'dirigir', 'disco', 'diseño', 'disfraz', 'diva', 'divino', 'doble', 'doce', 'dolor', 'domingo', 'don', 'donar', 'dorado', 'dormir', 'dorso', 'dos', 'dosis', 'dragón', 'droga', 'ducha', 'duda', 'duelo', 'dueño', 'dulce', 'dúo', 'duque', 'durar', 'dureza', 'duro', 'ébano', 'ebrio', 'echar', 'eco', 'ecuador', 'edad', 'edición', 'edificio', 'editor', 'educar', 'efecto', 'eficaz', 'eje', 'ejemplo', 'elefante', 'elegir', 'elemento', 'elevar', 'elipse', 'élite', 'elixir', 'elogio', 'eludir', 'embudo', 'emitir', 'emoción', 'empate', 'empeño', 'empleo', 'empresa', 'enano', 'encargo', 'enchufe', 'encía', 'enemigo', 'enero', 'enfado', 'enfermo', 'engaño', 'enigma', 'enlace', 'enorme', 'enredo', 'ensayo', 'enseñar', 'entero', 'entrar', 'envase', 'envío', 'época', 'equipo', 'erizo', 'escala', 'escena', 'escolar', 'escribir', 'escudo', 'esencia', 'esfera', 'esfuerzo', 'espada', 'espejo', 'espía', 'esposa', 'espuma', 'esquí', 'estar', 'este', 'estilo', 'estufa', 'etapa', 'eterno', 'ética', 'etnia', 'evadir', 'evaluar', 'evento', 'evitar', 'exacto', 'examen', 'exceso', 'excusa', 'exento', 'exigir', 'exilio', 'existir', 'éxito', 'experto', 'explicar', 'exponer', 'extremo', 'fábrica', 'fábula', 'fachada', 'fácil', 'factor', 'faena', 'faja', 'falda', 'fallo', 'falso', 'faltar', 'fama', 'familia', 'famoso', 'faraón', 'farmacia', 'farol', 'farsa', 'fase', 'fatiga', 'fauna', 'favor', 'fax', 'febrero', 'fecha', 'feliz', 'feo', 'feria', 'feroz', 'fértil', 'fervor', 'festín', 'fiable', 'fianza', 'fiar', 'fibra', 'ficción', 'ficha', 'fideo', 'fiebre', 'fiel', 'fiera', 'fiesta', 'figura', 'fijar', 'fijo', 'fila', 'filete', 'filial', 'filtro', 'fin', 'finca', 'fingir', 'finito', 'firma', 'flaco', 'flauta', 'flecha', 'flor', 'flota', 'fluir', 'flujo', 'flúor', 'fobia', 'foca', 'fogata', 'fogón', 'folio', 'folleto', 'fondo', 'forma', 'forro', 'fortuna', 'forzar', 'fosa', 'foto', 'fracaso', 'frágil', 'franja', 'frase', 'fraude', 'freír', 'freno', 'fresa', 'frío', 'frito', 'fruta', 'fuego', 'fuente', 'fuerza', 'fuga', 'fumar', 'función', 'funda', 'furgón', 'furia', 'fusil', 'fútbol', 'futuro', 'gacela', 'gafas', 'gaita', 'gajo', 'gala', 'galería', 'gallo', 'gamba', 'ganar', 'gancho', 'ganga', 'ganso', 'garaje', 'garza', 'gasolina', 'gastar', 'gato', 'gavilán', 'gemelo', 'gemir', 'gen', 'género', 'genio', 'gente', 'geranio', 'gerente', 'germen', 'gesto', 'gigante', 'gimnasio', 'girar', 'giro', 'glaciar', 'globo', 'gloria', 'gol', 'golfo', 'goloso', 'golpe', 'goma', 'gordo', 'gorila', 'gorra', 'gota', 'goteo', 'gozar', 'grada', 'gráfico', 'grano', 'grasa', 'gratis', 'grave', 'grieta', 'grillo', 'gripe', 'gris', 'grito', 'grosor', 'grúa', 'grueso', 'grumo', 'grupo', 'guante', 'guapo', 'guardia', 'guerra', 'guía', 'guiño', 'guion', 'guiso', 'guitarra', 'gusano', 'gustar', 'haber', 'hábil', 'hablar', 'hacer', 'hacha', 'hada', 'hallar', 'hamaca', 'harina', 'haz', 'hazaña', 'hebilla', 'hebra', 'hecho', 'helado', 'helio', 'hembra', 'herir', 'hermano', 'héroe', 'hervir', 'hielo', 'hierro', 'hígado', 'higiene', 'hijo', 'himno', 'historia', 'hocico', 'hogar', 'hoguera', 'hoja', 'hombre', 'hongo', 'honor', 'honra', 'hora', 'hormiga', 'horno', 'hostil', 'hoyo', 'hueco', 'huelga', 'huerta', 'hueso', 'huevo', 'huida', 'huir', 'humano', 'húmedo', 'humilde', 'humo', 'hundir', 'huracán', 'hurto', 'icono', 'ideal', 'idioma', 'ídolo', 'iglesia', 'iglú', 'igual', 'ilegal', 'ilusión', 'imagen', 'imán', 'imitar', 'impar', 'imperio', 'imponer', 'impulso', 'incapaz', 'índice', 'inerte', 'infiel', 'informe', 'ingenio', 'inicio', 'inmenso', 'inmune', 'innato', 'insecto', 'instante', 'interés', 'íntimo', 'intuir', 'inútil', 'invierno', 'ira', 'iris', 'ironía', 'isla', 'islote', 'jabalí', 'jabón', 'jamón', 'jarabe', 'jardín', 'jarra', 'jaula', 'jazmín', 'jefe', 'jeringa', 'jinete', 'jornada', 'joroba', 'joven', 'joya', 'juerga', 'jueves', 'juez', 'jugador', 'jugo', 'juguete', 'juicio', 'junco', 'jungla', 'junio', 'juntar', 'júpiter', 'jurar', 'justo', 'juvenil', 'juzgar', 'kilo', 'koala', 'labio', 'lacio', 'lacra', 'lado', 'ladrón', 'lagarto', 'lágrima', 'laguna', 'laico', 'lamer', 'lámina', 'lámpara', 'lana', 'lancha', 'langosta', 'lanza', 'lápiz', 'largo', 'larva', 'lástima', 'lata', 'látex', 'latir', 'laurel', 'lavar', 'lazo', 'leal', 'lección', 'leche', 'lector', 'leer', 'legión', 'legumbre', 'lejano', 'lengua', 'lento', 'leña', 'león', 'leopardo', 'lesión', 'letal', 'letra', 'leve', 'leyenda', 'libertad', 'libro', 'licor', 'líder', 'lidiar', 'lienzo', 'liga', 'ligero', 'lima', 'límite', 'limón', 'limpio', 'lince', 'lindo', 'línea', 'lingote', 'lino', 'linterna', 'líquido', 'liso', 'lista', 'litera', 'litio', 'litro', 'llaga', 'llama', 'llanto', 'llave', 'llegar', 'llenar', 'llevar', 'llorar', 'llover', 'lluvia', 'lobo', 'loción', 'loco', 'locura', 'lógica', 'logro', 'lombriz', 'lomo', 'lonja', 'lote', 'lucha', 'lucir', 'lugar', 'lujo', 'luna', 'lunes', 'lupa', 'lustro', 'luto', 'luz', 'maceta', 'macho', 'madera', 'madre', 'maduro', 'maestro', 'mafia', 'magia', 'mago', 'maíz', 'maldad', 'maleta', 'malla', 'malo', 'mamá', 'mambo', 'mamut', 'manco', 'mando', 'manejar', 'manga', 'maniquí', 'manjar', 'mano', 'manso', 'manta', 'mañana', 'mapa', 'máquina', 'mar', 'marco', 'marea', 'marfil', 'margen', 'marido', 'mármol', 'marrón', 'martes', 'marzo', 'masa', 'máscara', 'masivo', 'matar', 'materia', 'matiz', 'matriz', 'máximo', 'mayor', 'mazorca', 'mecha', 'medalla', 'medio', 'médula', 'mejilla', 'mejor', 'melena', 'melón', 'memoria', 'menor', 'mensaje', 'mente', 'menú', 'mercado', 'merengue', 'mérito', 'mes', 'mesón', 'meta', 'meter', 'método', 'metro', 'mezcla', 'miedo', 'miel', 'miembro', 'miga', 'mil', 'milagro', 'militar', 'millón', 'mimo', 'mina', 'minero', 'mínimo', 'minuto', 'miope', 'mirar', 'misa', 'miseria', 'misil', 'mismo', 'mitad', 'mito', 'mochila', 'moción', 'moda', 'modelo', 'moho', 'mojar', 'molde', 'moler', 'molino', 'momento', 'momia', 'monarca', 'moneda', 'monja', 'monto', 'moño', 'morada', 'morder', 'moreno', 'morir', 'morro', 'morsa', 'mortal', 'mosca', 'mostrar', 'motivo', 'mover', 'móvil', 'mozo', 'mucho', 'mudar', 'mueble', 'muela', 'muerte', 'muestra', 'mugre', 'mujer', 'mula', 'muleta', 'multa', 'mundo', 'muñeca', 'mural', 'muro', 'músculo', 'museo', 'musgo', 'música', 'muslo', 'nácar', 'nación', 'nadar', 'naipe', 'naranja', 'nariz', 'narrar', 'nasal', 'natal', 'nativo', 'natural', 'náusea', 'naval', 'nave', 'navidad', 'necio', 'néctar', 'negar', 'negocio', 'negro', 'neón', 'nervio', 'neto', 'neutro', 'nevar', 'nevera', 'nicho', 'nido', 'niebla', 'nieto', 'niñez', 'niño', 'nítido', 'nivel', 'nobleza', 'noche', 'nómina', 'noria', 'norma', 'norte', 'nota', 'noticia', 'novato', 'novela', 'novio', 'nube', 'nuca', 'núcleo', 'nudillo', 'nudo', 'nuera', 'nueve', 'nuez', 'nulo', 'número', 'nutria', 'oasis', 'obeso', 'obispo', 'objeto', 'obra', 'obrero', 'observar', 'obtener', 'obvio', 'oca', 'ocaso', 'océano', 'ochenta', 'ocho', 'ocio', 'ocre', 'octavo', 'octubre', 'oculto', 'ocupar', 'ocurrir', 'odiar', 'odio', 'odisea', 'oeste', 'ofensa', 'oferta', 'oficio', 'ofrecer', 'ogro', 'oído', 'oír', 'ojo', 'ola', 'oleada', 'olfato', 'olivo', 'olla', 'olmo', 'olor', 'olvido', 'ombligo', 'onda', 'onza', 'opaco', 'opción', 'ópera', 'opinar', 'oponer', 'optar', 'óptica', 'opuesto', 'oración', 'orador', 'oral', 'órbita', 'orca', 'orden', 'oreja', 'órgano', 'orgía', 'orgullo', 'oriente', 'origen', 'orilla', 'oro', 'orquesta', 'oruga', 'osadía', 'oscuro', 'osezno', 'oso', 'ostra', 'otoño', 'otro', 'oveja', 'óvulo', 'óxido', 'oxígeno', 'oyente', 'ozono', 'pacto', 'padre', 'paella', 'página', 'pago', 'país', 'pájaro', 'palabra', 'palco', 'paleta', 'pálido', 'palma', 'paloma', 'palpar', 'pan', 'panal', 'pánico', 'pantera', 'pañuelo', 'papá', 'papel', 'papilla', 'paquete', 'parar', 'parcela', 'pared', 'parir', 'paro', 'párpado', 'parque', 'párrafo', 'parte', 'pasar', 'paseo', 'pasión', 'paso', 'pasta', 'pata', 'patio', 'patria', 'pausa', 'pauta', 'pavo', 'payaso', 'peatón', 'pecado', 'pecera', 'pecho', 'pedal', 'pedir', 'pegar', 'peine', 'pelar', 'peldaño', 'pelea', 'peligro', 'pellejo', 'pelo', 'peluca', 'pena', 'pensar', 'peñón', 'peón', 'peor', 'pepino', 'pequeño', 'pera', 'percha', 'perder', 'pereza', 'perfil', 'perico', 'perla', 'permiso', 'perro', 'persona', 'pesa', 'pesca', 'pésimo', 'pestaña', 'pétalo', 'petróleo', 'pez', 'pezuña', 'picar', 'pichón', 'pie', 'piedra', 'pierna', 'pieza', 'pijama', 'pilar', 'piloto', 'pimienta', 'pino', 'pintor', 'pinza', 'piña', 'piojo', 'pipa', 'pirata', 'pisar', 'piscina', 'piso', 'pista', 'pitón', 'pizca', 'placa', 'plan', 'plata', 'playa', 'plaza', 'pleito', 'pleno', 'plomo', 'pluma', 'plural', 'pobre', 'poco', 'poder', 'podio', 'poema', 'poesía', 'poeta', 'polen', 'policía', 'pollo', 'polvo', 'pomada', 'pomelo', 'pomo', 'pompa', 'poner', 'porción', 'portal', 'posada', 'poseer', 'posible', 'poste', 'potencia', 'potro', 'pozo', 'prado', 'precoz', 'pregunta', 'premio', 'prensa', 'preso', 'previo', 'primo', 'príncipe', 'prisión', 'privar', 'proa', 'probar', 'proceso', 'producto', 'proeza', 'profesor', 'programa', 'prole', 'promesa', 'pronto', 'propio', 'próximo', 'prueba', 'público', 'puchero', 'pudor', 'pueblo', 'puerta', 'puesto', 'pulga', 'pulir', 'pulmón', 'pulpo', 'pulso', 'puma', 'punto', 'puñal', 'puño', 'pupa', 'pupila', 'puré', 'quedar', 'queja', 'quemar', 'querer', 'queso', 'quieto', 'química', 'quince', 'quitar', 'rábano', 'rabia', 'rabo', 'ración', 'radical', 'raíz', 'rama', 'rampa', 'rancho', 'rango', 'rapaz', 'rápido', 'rapto', 'rasgo', 'raspa', 'rato', 'rayo', 'raza', 'razón', 'reacción', 'realidad', 'rebaño', 'rebote', 'recaer', 'receta', 'rechazo', 'recoger', 'recreo', 'recto', 'recurso', 'red', 'redondo', 'reducir', 'reflejo', 'reforma', 'refrán', 'refugio', 'regalo', 'regir', 'regla', 'regreso', 'rehén', 'reino', 'reír', 'reja', 'relato', 'relevo', 'relieve', 'relleno', 'reloj', 'remar', 'remedio', 'remo', 'rencor', 'rendir', 'renta', 'reparto', 'repetir', 'reposo', 'reptil', 'res', 'rescate', 'resina', 'respeto', 'resto', 'resumen', 'retiro', 'retorno', 'retrato', 'reunir', 'revés', 'revista', 'rey', 'rezar', 'rico', 'riego', 'rienda', 'riesgo', 'rifa', 'rígido', 'rigor', 'rincón', 'riñón', 'río', 'riqueza', 'risa', 'ritmo', 'rito', 'rizo', 'roble', 'roce', 'rociar', 'rodar', 'rodeo', 'rodilla', 'roer', 'rojizo', 'rojo', 'romero', 'romper', 'ron', 'ronco', 'ronda', 'ropa', 'ropero', 'rosa', 'rosca', 'rostro', 'rotar', 'rubí', 'rubor', 'rudo', 'rueda', 'rugir', 'ruido', 'ruina', 'ruleta', 'rulo', 'rumbo', 'rumor', 'ruptura', 'ruta', 'rutina', 'sábado', 'saber', 'sabio', 'sable', 'sacar', 'sagaz', 'sagrado', 'sala', 'saldo', 'salero', 'salir', 'salmón', 'salón', 'salsa', 'salto', 'salud', 'salvar', 'samba', 'sanción', 'sandía', 'sanear', 'sangre', 'sanidad', 'sano', 'santo', 'sapo', 'saque', 'sardina', 'sartén', 'sastre', 'satán', 'sauna', 'saxofón', 'sección', 'seco', 'secreto', 'secta', 'sed', 'seguir', 'seis', 'sello', 'selva', 'semana', 'semilla', 'senda', 'sensor', 'señal', 'señor', 'separar', 'sepia', 'sequía', 'ser', 'serie', 'sermón', 'servir', 'sesenta', 'sesión', 'seta', 'setenta', 'severo', 'sexo', 'sexto', 'sidra', 'siesta', 'siete', 'siglo', 'signo', 'sílaba', 'silbar', 'silencio', 'silla', 'símbolo', 'simio', 'sirena', 'sistema', 'sitio', 'situar', 'sobre', 'socio', 'sodio', 'sol', 'solapa', 'soldado', 'soledad', 'sólido', 'soltar', 'solución', 'sombra', 'sondeo', 'sonido', 'sonoro', 'sonrisa', 'sopa', 'soplar', 'soporte', 'sordo', 'sorpresa', 'sorteo', 'sostén', 'sótano', 'suave', 'subir', 'suceso', 'sudor', 'suegra', 'suelo', 'sueño', 'suerte', 'sufrir', 'sujeto', 'sultán', 'sumar', 'superar', 'suplir', 'suponer', 'supremo', 'sur', 'surco', 'sureño', 'surgir', 'susto', 'sutil', 'tabaco', 'tabique', 'tabla', 'tabú', 'taco', 'tacto', 'tajo', 'talar', 'talco', 'talento', 'talla', 'talón', 'tamaño', 'tambor', 'tango', 'tanque', 'tapa', 'tapete', 'tapia', 'tapón', 'taquilla', 'tarde', 'tarea', 'tarifa', 'tarjeta', 'tarot', 'tarro', 'tarta', 'tatuaje', 'tauro', 'taza', 'tazón', 'teatro', 'techo', 'tecla', 'técnica', 'tejado', 'tejer', 'tejido', 'tela', 'teléfono', 'tema', 'temor', 'templo', 'tenaz', 'tender', 'tener', 'tenis', 'tenso', 'teoría', 'terapia', 'terco', 'término', 'ternura', 'terror', 'tesis', 'tesoro', 'testigo', 'tetera', 'texto', 'tez', 'tibio', 'tiburón', 'tiempo', 'tienda', 'tierra', 'tieso', 'tigre', 'tijera', 'tilde', 'timbre', 'tímido', 'timo', 'tinta', 'tío', 'típico', 'tipo', 'tira', 'tirón', 'titán', 'títere', 'título', 'tiza', 'toalla', 'tobillo', 'tocar', 'tocino', 'todo', 'toga', 'toldo', 'tomar', 'tono', 'tonto', 'topar', 'tope', 'toque', 'tórax', 'torero', 'tormenta', 'torneo', 'toro', 'torpedo', 'torre', 'torso', 'tortuga', 'tos', 'tosco', 'toser', 'tóxico', 'trabajo', 'tractor', 'traer', 'tráfico', 'trago', 'traje', 'tramo', 'trance', 'trato', 'trauma', 'trazar', 'trébol', 'tregua', 'treinta', 'tren', 'trepar', 'tres', 'tribu', 'trigo', 'tripa', 'triste', 'triunfo', 'trofeo', 'trompa', 'tronco', 'tropa', 'trote', 'trozo', 'truco', 'trueno', 'trufa', 'tubería', 'tubo', 'tuerto', 'tumba', 'tumor', 'túnel', 'túnica', 'turbina', 'turismo', 'turno', 'tutor', 'ubicar', 'úlcera', 'umbral', 'unidad', 'unir', 'universo', 'uno', 'untar', 'uña', 'urbano', 'urbe', 'urgente', 'urna', 'usar', 'usuario', 'útil', 'utopía', 'uva', 'vaca', 'vacío', 'vacuna', 'vagar', 'vago', 'vaina', 'vajilla', 'vale', 'válido', 'valle', 'valor', 'válvula', 'vampiro', 'vara', 'variar', 'varón', 'vaso', 'vecino', 'vector', 'vehículo', 'veinte', 'vejez', 'vela', 'velero', 'veloz', 'vena', 'vencer', 'venda', 'veneno', 'vengar', 'venir', 'venta', 'venus', 'ver', 'verano', 'verbo', 'verde', 'vereda', 'verja', 'verso', 'verter', 'vía', 'viaje', 'vibrar', 'vicio', 'víctima', 'vida', 'vídeo', 'vidrio', 'viejo', 'viernes', 'vigor', 'vil', 'villa', 'vinagre', 'vino', 'viñedo', 'violín', 'viral', 'virgo', 'virtud', 'visor', 'víspera', 'vista', 'vitamina', 'viudo', 'vivaz', 'vivero', 'vivir', 'vivo', 'volcán', 'volumen', 'volver', 'voraz', 'votar', 'voto', 'voz', 'vuelo', 'vulgar', 'yacer', 'yate', 'yegua', 'yema', 'yerno', 'yeso', 'yodo', 'yoga', 'yogur', 'zafiro', 'zanja', 'zapato', 'zarza', 'zona', 'zorro', 'zumo', 'zurdo'];

var Words = {
  CHINESE,
  ENGLISH,
  FRENCH,
  ITALIAN,
  JAPANESE,
  SPANISH
};

/**
 * This is an immutable class that represents a BIP39 Mnemonic code.
 * See BIP39 specification for more info: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
 * A Mnemonic code is a a group of easy to remember words used for the generation
 * of deterministic wallets. A Mnemonic can be used to generate a seed using
 * an optional passphrase, for later generate a HDPrivateKey.
 *
 * @example
 * // generate a random mnemonic
 * var mnemonic = new Mnemonic();
 * var phrase = mnemonic.phrase;
 *
 * // use a different language
 * var mnemonic = new Mnemonic(Mnemonic.Words.SPANISH);
 * var xprivkey = mnemonic.toHDPrivateKey();
 *
 * @param {*=} data - a seed, phrase, or entropy to initialize (can be skipped)
 * @param {Array=} wordlist - the wordlist to generate mnemonics from
 * @returns {Mnemonic} A new instance of Mnemonic
 * @constructor
 */
// eslint-disable-next-line consistent-return

var Mnemonic = function Mnemonic(data, wordlist) {
  if (!(this instanceof Mnemonic)) {
    return new Mnemonic(data, wordlist);
  }

  if (_.isArray(data)) {
    wordlist = data;
    data = null;
  } // handle data overloading


  var ent;
  var phrase;
  var seed;

  if (Buffer.isBuffer(data)) {
    seed = data;
  } else if (_.isString(data)) {
    phrase = unorm.nfkd(data);
  } else if (_.isNumber(data)) {
    ent = data;
  } else if (data) {
    throw new errors.InvalidArgument('data', 'Must be a Buffer, a string or an integer');
  }

  ent = ent || 128; // check and detect wordlist

  wordlist = wordlist || Mnemonic._getDictionary(phrase);

  if (phrase && !wordlist) {
    throw new errors.UnknownWordlist(phrase);
  }

  wordlist = wordlist || Mnemonic.Words.ENGLISH;

  if (seed) {
    phrase = Mnemonic._entropy2mnemonic(seed, wordlist);
  } // validate phrase and ent


  if (phrase && !Mnemonic.isValid(phrase, wordlist)) {
    throw new errors.InvalidMnemonic(phrase);
  }

  if (ent % 32 !== 0 || ent < 128) {
    throw new errors.InvalidArgument('ENT', 'Values must be ENT > 128 and ENT % 32 == 0');
  }

  phrase = phrase || Mnemonic._mnemonic(ent, wordlist);
  Object.defineProperty(this, 'wordlist', {
    configurable: false,
    value: wordlist
  });
  Object.defineProperty(this, 'phrase', {
    configurable: false,
    value: phrase
  });
};

Mnemonic.Words = Words;
/**
 * Will return a boolean if the mnemonic is valid
 *
 * @example
 *
 * const valid = Mnemonic.isValid(
 *   'lab rescue lunch elbow recall phrase perfect donkey biology guess moment husband',
 * );
 * // true
 *
 * @param {String} mnemonic - The mnemonic string
 * @param {String} [wordlist] - The wordlist used
 * @returns {boolean}
 */

Mnemonic.isValid = function (mnemonic, wordlist) {
  var i;
  mnemonic = unorm.nfkd(mnemonic);
  wordlist = wordlist || Mnemonic._getDictionary(mnemonic);

  if (!wordlist) {
    return false;
  }

  var words = mnemonic.split(' ');
  var bin = '';

  for (i = 0; i < words.length; i += 1) {
    var ind = wordlist.indexOf(words[i]);
    if (ind < 0) return false;
    bin += "00000000000".concat(ind.toString(2)).slice(-11);
  }

  var cs = bin.length / 33;
  var hashBits = bin.slice(-cs);
  var nonhashBits = bin.slice(0, bin.length - cs);
  var buf = Buffer.alloc(nonhashBits.length / 8);

  for (i = 0; i < nonhashBits.length / 8; i += 1) {
    buf.writeUInt8(parseInt(bin.slice(i * 8, (i + 1) * 8), 2), i);
  }

  var expectedHashBits = Mnemonic._entropyChecksum(buf);

  return expectedHashBits === hashBits;
};
/**
 * Internal function to check if a mnemonic belongs to a wordlist.
 *
 * @param {String} mnemonic - The mnemonic string
 * @param {String} wordlist - The wordlist
 * @returns {boolean}
 */


Mnemonic._belongsToWordlist = function (mnemonic, wordlist) {
  var words = unorm.nfkd(mnemonic).split(' ');

  for (var i = 0; i < words.length; i += 1) {
    var ind = wordlist.indexOf(words[i]);
    if (ind < 0) return false;
  }

  return true;
};
/**
 * Internal function to detect the wordlist used to generate the mnemonic.
 *
 * @param {String} mnemonic - The mnemonic string
 * @returns {Array} the wordlist or null
 */


Mnemonic._getDictionary = function (mnemonic) {
  if (!mnemonic) return null;
  var dicts = Object.keys(Mnemonic.Words);

  for (var i = 0; i < dicts.length; i += 1) {
    var key = dicts[i];

    if (Mnemonic._belongsToWordlist(mnemonic, Mnemonic.Words[key])) {
      return Mnemonic.Words[key];
    }
  }

  return null;
};
/**
 * Will generate a seed based on the mnemonic and optional passphrase.
 *
 * @param {String} [passphrase]
 * @returns {Buffer}
 */


Mnemonic.prototype.toSeed = function (passphrase) {
  passphrase = passphrase || '';
  return Mnemonic.pbkdf2(unorm.nfkd(this.phrase), unorm.nfkd("mnemonic".concat(passphrase)), 2048, 64);
};
/**
 * Will generate a Mnemonic object based on a seed.
 *
 * @param {Buffer} [seed]
 * @param {string} [wordlist]
 * @returns {Mnemonic}
 */


Mnemonic.fromSeed = function (seed, wordlist) {
  preconditions.checkArgument(Buffer.isBuffer(seed), 'seed must be a Buffer.');
  preconditions.checkArgument(_.isArray(wordlist) || _.isString(wordlist), 'wordlist must be a string or an array.');
  return new Mnemonic(seed, wordlist);
};
/**
 *
 * Generates a HD Private Key from a Mnemonic.
 * Optionally receive a passphrase and bitcoin network.
 *
 * @param {String=} [passphrase]
 * @param {Network|String|number=} [network] - The network: 'livenet' or 'testnet'
 * @returns {HDPrivateKey}
 */


Mnemonic.prototype.toHDPrivateKey = function (passphrase, network) {
  var seed = this.toSeed(passphrase);
  return HDPrivateKey.fromSeed(seed, network);
};
/**
 * Will return a the string representation of the mnemonic
 *
 * @returns {String} Mnemonic
 */


Mnemonic.prototype.toString = function () {
  return this.phrase;
};
/**
 * Will return a string formatted for the console
 *
 * @returns {String} Mnemonic
 */


Mnemonic.prototype.inspect = function () {
  return "<Mnemonic: ".concat(this.toString(), " >");
};
/**
 * Internal function to generate a random mnemonic
 *
 * @param {Number} ENT - Entropy size, defaults to 128
 * @param {Array} wordlist - Array of words to generate the mnemonic
 * @returns {String} Mnemonic string
 */


Mnemonic._mnemonic = function (ENT, wordlist) {
  var buf = Random.getRandomBuffer(ENT / 8);
  return Mnemonic._entropy2mnemonic(buf, wordlist);
};
/**
 * Internal function to generate mnemonic based on entropy
 *
 * @param {Number} entropy - Entropy buffer
 * @param {Array} wordlist - Array of words to generate the mnemonic
 * @returns {String} Mnemonic string
 */


Mnemonic._entropy2mnemonic = function (entropy, wordlist) {
  var bin = '';
  var i;

  for (i = 0; i < entropy.length; i += 1) {
    bin += "00000000".concat(entropy[i].toString(2)).slice(-8);
  }

  bin += Mnemonic._entropyChecksum(entropy);

  if (bin.length % 11 !== 0) {
    throw new errors.InvalidEntropy(bin);
  }

  var mnemonic = [];

  for (i = 0; i < bin.length / 11; i += 1) {
    var wi = parseInt(bin.slice(i * 11, (i + 1) * 11), 2);
    mnemonic.push(wordlist[wi]);
  }

  var ret;

  if (wordlist === Mnemonic.Words.JAPANESE) {
    ret = mnemonic.join('\u3000');
  } else {
    ret = mnemonic.join(' ');
  }

  return ret;
};
/**
 * Internal function to create checksum of entropy
 *
 * @param entropy
 * @returns {string} Checksum of entropy length / 32
 * @private
 */


Mnemonic._entropyChecksum = function (entropy) {
  var hash = Hash.sha256(entropy);
  var bits = entropy.length * 8;
  var cs = bits / 32;
  var hashbits = new BN(hash.toString('hex'), 16).toString(2); // zero pad the hash bits

  while (hashbits.length % 256 !== 0) {
    hashbits = "0".concat(hashbits);
  }

  var checksum = hashbits.slice(0, cs);
  return checksum;
};

Mnemonic.pbkdf2 = pbkdf2;

var name = "bitcoinsource";
var version = "0.1.18";
var description = "A simple, safe, and powerful JavaScript Bitcoin Cash library.";
var author = "Clemens Ley <ley.clemens@gmail.com>";
var license = "MIT";
var main = "dist/bitcoinsource.common.js";
var module$1 = "dist/bitcoinsource.esm.js";
var files = [
	"dist"
];
var scripts = {
	build: "rollup -c",
	test: "mocha --recursive --timeout 7000 --require @babel/register",
	"test:cover": "nyc mocha",
	lint: "eslint src test",
	"lint:fix": "eslint src test --fix",
	flow: "flow check",
	clean: "rm -rf dist",
	docs: "mustache package.json README.tpl.md > README.md",
	preversion: "npm run clean && npm run lint && npm run flow && npm run test",
	version: "npm run build && npm run docs && git add README.md",
	postversion: "git push && git push --tags && npm publish",
	bump: "npm version patch -m 'Bump version to %s.'"
};
var keywords = [
	"bitcoin",
	"source",
	"transaction",
	"address",
	"p2p",
	"cryptocurrency",
	"blockchain",
	"payment",
	"multisig"
];
var repository = {
	type: "git",
	url: "https://github.com/bitcoin-computer/bitcoin-source"
};
var prettier = {
	printWidth: 100,
	proseWrap: "preserve",
	semi: false,
	singleQuote: true
};
var dependencies = {
	"big-integer": "^1.6.48",
	"bn.js": "^4.11.9",
	bs58: "=4.0.1",
	"buffer-compare": "=1.1.1",
	cashaddrjs: "^0.3.11",
	elliptic: "^6.5.2",
	"hash.js": "^1.1.7",
	lodash: "^4.17.15",
	randombytes: "^2.1.0",
	unorm: "^1.6.0"
};
var devDependencies = {
	"@babel/core": "^7.9.6",
	"@babel/preset-env": "^7.9.6",
	"@babel/preset-flow": "^7.9.0",
	"@babel/register": "^7.9.0",
	"babel-eslint": "^10.1.0",
	"babel-preset-minify": "^0.5.1",
	chai: "^4.2.0",
	eslint: "^7.0.0",
	"eslint-config-airbnb-base": "^14.1.0",
	"eslint-config-prettier": "^6.11.0",
	"eslint-plugin-flowtype": "^5.1.0",
	"eslint-plugin-flowtype-errors": "^4.3.0",
	"eslint-plugin-import": "^2.20.2",
	"eslint-plugin-prettier": "^3.1.3",
	"flow-bin": "^0.125.1",
	"flow-typed": "^3.1.0",
	jsdoc: "^3.6.4",
	mocha: "^7.1.2",
	mustache: "^4.0.1",
	nyc: "^15.0.1",
	prettier: "^2.0.5",
	rollup: "^2.10.5",
	"rollup-plugin-babel": "^4.4.0",
	"rollup-plugin-commonjs": "^10.1.0",
	"rollup-plugin-flow": "^1.1.1",
	"rollup-plugin-json": "^4.0.0",
	"rollup-plugin-node-builtins": "^2.1.2",
	"rollup-plugin-node-globals": "^1.4.0",
	"rollup-plugin-node-resolve": "^5.2.0",
	"rollup-plugin-terser": "^5.3.0",
	sinon: "^9.0.2"
};
var PackageInfo = {
	name: name,
	version: version,
	description: description,
	author: author,
	license: license,
	main: main,
	module: module$1,
	files: files,
	scripts: scripts,
	keywords: keywords,
	repository: repository,
	prettier: prettier,
	dependencies: dependencies,
	devDependencies: devDependencies
};

/**
 * Bitcoin transactions contain scripts. Each input has a script called the
 * scriptSig, and each output has a script called the scriptPubkey. To validate
 * an input, the input's script is concatenated with the referenced output script,
 * and the result is executed. If at the end of execution the stack contains a
 * "true" value, then the transaction is valid.
 *
 * The primary way to use this class is via the verify function.
 * e.g., Interpreter().verify( ... );
 */

var Interpreter = function Interpreter(obj) {
  if (!(this instanceof Interpreter)) {
    return new Interpreter(obj);
  }

  if (obj) {
    this.initialize();
    this.set(obj);
  } else {
    this.initialize();
  }
};
/**
 * Verifies a Script by executing it and returns true if it is valid.
 * This function needs to be provided with the scriptSig and the scriptPubkey
 * separately.
 * @param {Script} scriptSig - the script's first part (corresponding to the tx input)
 * @param {Script} scriptPubkey - the script's last part (corresponding to the tx output)
 * @param {Transaction=} tx - the Transaction containing the scriptSig in one input (used
 *    to check signature validity for some opcodes like OP_CHECKSIG)
 * @param {number} nin - index of the transaction input containing the scriptSig verified.
 * @param {number} flags - evaluation flags. See Interpreter.SCRIPT_* constants
 *
 * Translated from bitcoind's VerifyScript
 */


Interpreter.prototype.verify = function (scriptSig, scriptPubkey, tx, nin, flags) {
  if (_.isUndefined(tx)) {
    tx = new Transaction();
  }

  if (_.isUndefined(nin)) {
    nin = 0;
  }

  if (_.isUndefined(flags)) {
    flags = 0;
  }

  this.set({
    script: scriptSig,
    tx,
    nin,
    flags
  });
  var stackCopy;

  if ((flags & Interpreter.SCRIPT_VERIFY_SIGPUSHONLY) !== 0 && !scriptSig.isPushOnly()) {
    this.errstr = 'SCRIPT_ERR_SIG_PUSHONLY';
    return false;
  } // evaluate scriptSig


  if (!this.evaluate()) {
    return false;
  }

  if (flags & Interpreter.SCRIPT_VERIFY_P2SH) {
    stackCopy = this.stack.slice();
  }

  var {
    stack
  } = this;
  this.initialize();
  this.set({
    script: scriptPubkey,
    stack,
    tx,
    nin,
    flags
  }); // evaluate scriptPubkey

  if (!this.evaluate()) {
    return false;
  }

  if (this.stack.length === 0) {
    this.errstr = 'SCRIPT_ERR_EVAL_FALSE_NO_RESULT';
    return false;
  }

  var buf = this.stack[this.stack.length - 1];

  if (!Interpreter.castToBool(buf)) {
    this.errstr = 'SCRIPT_ERR_EVAL_FALSE_IN_STACK';
    return false;
  } // Additional validation for spend-to-script-hash transactions:


  if (flags & Interpreter.SCRIPT_VERIFY_P2SH && scriptPubkey.isScriptHashOut()) {
    // scriptSig must be literals-only or validation fails
    if (!scriptSig.isPushOnly()) {
      this.errstr = 'SCRIPT_ERR_SIG_PUSHONLY';
      return false;
    } // stackCopy cannot be empty here, because if it was the
    // P2SH  HASH <> EQUAL  scriptPubKey would be evaluated with
    // an empty stack and the EvalScript above would return false.


    if (stackCopy.length === 0) {
      throw new Error('internal error - stack copy empty');
    }

    var redeemScriptSerialized = stackCopy[stackCopy.length - 1];
    var redeemScript = Script.fromBuffer(redeemScriptSerialized);
    stackCopy.pop();
    this.initialize();
    this.set({
      script: redeemScript,
      stack: stackCopy,
      tx,
      nin,
      flags
    }); // evaluate redeemScript

    if (!this.evaluate()) {
      return false;
    }

    if (stackCopy.length === 0) {
      this.errstr = 'SCRIPT_ERR_EVAL_FALSE_NO_P2SH_STACK';
      return false;
    }

    if (!Interpreter.castToBool(stackCopy[stackCopy.length - 1])) {
      this.errstr = 'SCRIPT_ERR_EVAL_FALSE_IN_P2SH_STACK';
      return false;
    }

    return true;
  }

  return true;
};

Interpreter.prototype.initialize = function () {
  this.stack = [];
  this.altstack = [];
  this.pc = 0;
  this.pbegincodehash = 0;
  this.nOpCount = 0;
  this.vfExec = [];
  this.errstr = '';
  this.flags = 0;
};

Interpreter.prototype.set = function (obj) {
  this.script = obj.script || this.script;
  this.tx = obj.tx || this.tx;
  this.nin = typeof obj.nin !== 'undefined' ? obj.nin : this.nin;
  this.stack = obj.stack || this.stack;
  this.altstack = obj.altstack || this.altstack;
  this.pc = typeof obj.pc !== 'undefined' ? obj.pc : this.pc;
  this.pbegincodehash = typeof obj.pbegincodehash !== 'undefined' ? obj.pbegincodehash : this.pbegincodehash;
  this.nOpCount = typeof obj.nOpCount !== 'undefined' ? obj.nOpCount : this.nOpCount;
  this.vfExec = obj.vfExec || this.vfExec;
  this.errstr = obj.errstr || this.errstr;
  this.flags = typeof obj.flags !== 'undefined' ? obj.flags : this.flags;
};

Interpreter.true = Buffer.from([1]);
Interpreter.false = Buffer.from([]);
Interpreter.MAX_SCRIPT_ELEMENT_SIZE = 520;
Interpreter.LOCKTIME_THRESHOLD = 500000000;
Interpreter.LOCKTIME_THRESHOLD_BN = new BN(Interpreter.LOCKTIME_THRESHOLD); // flags taken from bitcoind
// bitcoind commit: b5d1b1092998bc95313856d535c632ea5a8f9104

Interpreter.SCRIPT_VERIFY_NONE = 0; // Evaluate P2SH subscripts (softfork safe, BIP16).

Interpreter.SCRIPT_VERIFY_P2SH = 1 << 0; // Passing a non-strict-DER signature or one with undefined hashtype to a checksig operation causes
// script failure. Passing a pubkey that is not (0x04 + 64 bytes) or (0x02 or 0x03 + 32 bytes) to
// checksig causes that pubkey to be skipped (not softfork safe: this flag can widen the validity
// of OP_CHECKSIG OP_NOT).

Interpreter.SCRIPT_VERIFY_STRICTENC = 1 << 1; // Passing a non-strict-DER signature to a checksig operation causes script failure (softfork safe,
// BIP62 rule 1)

Interpreter.SCRIPT_VERIFY_DERSIG = 1 << 2; // Passing a non-strict-DER signature or one with S > order/2 to a checksig operation causes script
// failure (softfork safe, BIP62 rule 5).

Interpreter.SCRIPT_VERIFY_LOW_S = 1 << 3; // verify dummy stack item consumed by CHECKMULTISIG is of zero-length (softfork safe, BIP62 rule 7)

Interpreter.SCRIPT_VERIFY_NULLDUMMY = 1 << 4; // Using a non-push operator in the scriptSig causes script failure (softfork safe, BIP62 rule 2).

Interpreter.SCRIPT_VERIFY_SIGPUSHONLY = 1 << 5; // Require minimal encodings for all push operations (OP_0... OP_16, OP_1NEGATE where possible,
// direct pushes up to 75 bytes, OP_PUSHDATA up to 255 bytes, OP_PUSHDATA2 for anything larger).
// Evaluating any other push causes the script to fail (BIP62 rule 3). In addition, whenever a
// stack element is interpreted as a number, it must be of minimal length (BIP62 rule 4).
// (softfork safe)

Interpreter.SCRIPT_VERIFY_MINIMALDATA = 1 << 6; // Discourage use of NOPs reserved for upgrades (NOP1-10)
//
// Provided so that nodes can avoid accepting or mining transactions
// containing executed NOP's whose meaning may change after a soft-fork,
// thus rendering the script invalid; with this flag set executing
// discouraged NOPs fails the script. This verification flag will never be
// a mandatory flag applied to scripts in a block. NOPs that are not
// executed, e.g.  within an unexecuted IF ENDIF block, are *not* rejected.

Interpreter.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS = 1 << 7; // CLTV See BIP65 for details.

Interpreter.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY = 1 << 9;

Interpreter.castToBool = function (buf) {
  for (var i = 0; i < buf.length; i += 1) {
    if (buf[i] !== 0) {
      // can be negative zero
      if (i === buf.length - 1 && buf[i] === 0x80) {
        return false;
      }

      return true;
    }
  }

  return false;
};
/**
 * Translated from bitcoind's CheckSignatureEncoding
 */


Interpreter.prototype.checkSignatureEncoding = function (buf) {
  var sig;

  if ((this.flags & (Interpreter.SCRIPT_VERIFY_DERSIG | Interpreter.SCRIPT_VERIFY_LOW_S | Interpreter.SCRIPT_VERIFY_STRICTENC)) !== 0 && !Signature.isTxDER(buf)) {
    this.errstr = 'SCRIPT_ERR_SIG_DER_INVALID_FORMAT';
    return false;
  }

  if ((this.flags & Interpreter.SCRIPT_VERIFY_LOW_S) !== 0) {
    sig = Signature.fromTxFormat(buf);

    if (!sig.hasLowS()) {
      this.errstr = 'SCRIPT_ERR_SIG_DER_HIGH_S';
      return false;
    }
  } else if ((this.flags & Interpreter.SCRIPT_VERIFY_STRICTENC) !== 0) {
    sig = Signature.fromTxFormat(buf);

    if (!sig.hasDefinedHashtype()) {
      this.errstr = 'SCRIPT_ERR_SIG_HASHTYPE';
      return false;
    }
  }

  return true;
};
/**
 * Translated from bitcoind's CheckPubKeyEncoding
 */


Interpreter.prototype.checkPubkeyEncoding = function (buf) {
  if ((this.flags & Interpreter.SCRIPT_VERIFY_STRICTENC) !== 0 && !PublicKey.isValid(buf)) {
    this.errstr = 'SCRIPT_ERR_PUBKEYTYPE';
    return false;
  }

  return true;
};
/**
 * Based on bitcoind's EvalScript function, with the inner loop moved to
 * Interpreter.prototype.step()
 * bitcoind commit: b5d1b1092998bc95313856d535c632ea5a8f9104
 */


Interpreter.prototype.evaluate = function () {
  if (this.script.toBuffer().length > 10000) {
    this.errstr = 'SCRIPT_ERR_SCRIPT_SIZE';
    return false;
  }

  try {
    while (this.pc < this.script.chunks.length) {
      var fSuccess = this.step();

      if (!fSuccess) {
        return false;
      }
    } // Size limits


    if (this.stack.length + this.altstack.length > 1000) {
      this.errstr = 'SCRIPT_ERR_STACK_SIZE';
      return false;
    }
  } catch (e) {
    this.errstr = "SCRIPT_ERR_UNKNOWN_ERROR: ".concat(e);
    return false;
  }

  if (this.vfExec.length > 0) {
    this.errstr = 'SCRIPT_ERR_UNBALANCED_CONDITIONAL';
    return false;
  }

  return true;
};
/**
 * Checks a locktime parameter with the transaction's locktime.
 * There are two times of nLockTime: lock-by-blockheight and lock-by-blocktime,
 * distinguished by whether nLockTime < LOCKTIME_THRESHOLD = 500000000
 *
 * See the corresponding code on bitcoin core:
 * https://github.com/bitcoin/bitcoin/blob/ffd75adce01a78b3461b3ff05bcc2b530a9ce994/src/script/interpreter.cpp#L1129
 *
 * @param {BN} nLockTime the locktime read from the script
 * @return {boolean} true if the transaction's locktime is less than or equal to
 *                   the transaction's locktime
 */


Interpreter.prototype.checkLockTime = function (nLockTime) {
  // We want to compare apples to apples, so fail the script
  // unless the type of nLockTime being tested is the same as
  // the nLockTime in the transaction.
  if (!(this.tx.nLockTime < Interpreter.LOCKTIME_THRESHOLD && nLockTime.lt(Interpreter.LOCKTIME_THRESHOLD_BN) || this.tx.nLockTime >= Interpreter.LOCKTIME_THRESHOLD && nLockTime.gte(Interpreter.LOCKTIME_THRESHOLD_BN))) {
    return false;
  } // Now that we know we're comparing apples-to-apples, the
  // comparison is a simple numeric one.


  if (nLockTime.gt(new BN(this.tx.nLockTime))) {
    return false;
  } // Finally the nLockTime feature can be disabled and thus
  // CHECKLOCKTIMEVERIFY bypassed if every txin has been
  // finalized by setting nSequence to maxint. The
  // transaction would be allowed into the blockchain, making
  // the opcode ineffective.
  //
  // Testing if this vin is not final is sufficient to
  // prevent this condition. Alternatively we could test all
  // inputs, but testing just this input minimizes the data
  // required to prove correct CHECKLOCKTIMEVERIFY execution.


  if (!this.tx.inputs[this.nin].isFinal()) {
    return false;
  }

  return true;
};
/**
 * Based on the inner loop of bitcoind's EvalScript function
 * bitcoind commit: b5d1b1092998bc95313856d535c632ea5a8f9104
 */


Interpreter.prototype.step = function () {
  var fRequireMinimal = (this.flags & Interpreter.SCRIPT_VERIFY_MINIMALDATA) !== 0; // bool fExec = !count(vfExec.begin(), vfExec.end(), false);

  var fExec = this.vfExec.indexOf(false) === -1;
  var buf;
  var buf1;
  var buf2;
  var spliced;
  var n;
  var x1;
  var x2;
  var bn;
  var bn1;
  var bn2;
  var bufSig;
  var bufPubkey;
  var subscript;
  var sig;
  var pubkey;
  var fValue;
  var fSuccess; // Read instruction

  var chunk = this.script.chunks[this.pc];
  this.pc += 1;
  var {
    opcodenum
  } = chunk;

  if (_.isUndefined(opcodenum)) {
    this.errstr = 'SCRIPT_ERR_UNDEFINED_OPCODE';
    return false;
  }

  if (chunk.buf && chunk.buf.length > Interpreter.MAX_SCRIPT_ELEMENT_SIZE) {
    this.errstr = 'SCRIPT_ERR_PUSH_SIZE';
    return false;
  } // Note how Opcode.OP_RESERVED does not count towards the opcode limit.


  if (opcodenum > Opcode.OP_16) {
    this.nOpCount += 1;

    if (this.nOpCount > 201) {
      this.errstr = 'SCRIPT_ERR_OP_COUNT';
      return false;
    }
  }

  if (opcodenum === Opcode.OP_CAT || opcodenum === Opcode.OP_SUBSTR || opcodenum === Opcode.OP_LEFT || opcodenum === Opcode.OP_RIGHT || opcodenum === Opcode.OP_INVERT || opcodenum === Opcode.OP_AND || opcodenum === Opcode.OP_OR || opcodenum === Opcode.OP_XOR || opcodenum === Opcode.OP_2MUL || opcodenum === Opcode.OP_2DIV || opcodenum === Opcode.OP_MUL || opcodenum === Opcode.OP_DIV || opcodenum === Opcode.OP_MOD || opcodenum === Opcode.OP_LSHIFT || opcodenum === Opcode.OP_RSHIFT) {
    this.errstr = 'SCRIPT_ERR_DISABLED_OPCODE';
    return false;
  }

  if (fExec && opcodenum >= 0 && opcodenum <= Opcode.OP_PUSHDATA4) {
    if (fRequireMinimal && !this.script.checkMinimalPush(this.pc - 1)) {
      this.errstr = 'SCRIPT_ERR_MINIMALDATA';
      return false;
    }

    if (!chunk.buf) {
      this.stack.push(Interpreter.false);
    } else if (chunk.len !== chunk.buf.length) {
      throw new Error('Length of push value not equal to length of data');
    } else {
      this.stack.push(chunk.buf);
    }
  } else if (fExec || Opcode.OP_IF <= opcodenum && opcodenum <= Opcode.OP_ENDIF) {
    switch (opcodenum) {
      // Push value
      case Opcode.OP_1NEGATE:
      case Opcode.OP_1:
      case Opcode.OP_2:
      case Opcode.OP_3:
      case Opcode.OP_4:
      case Opcode.OP_5:
      case Opcode.OP_6:
      case Opcode.OP_7:
      case Opcode.OP_8:
      case Opcode.OP_9:
      case Opcode.OP_10:
      case Opcode.OP_11:
      case Opcode.OP_12:
      case Opcode.OP_13:
      case Opcode.OP_14:
      case Opcode.OP_15:
      case Opcode.OP_16:
        // ( -- value)
        // ScriptNum bn((int)opcode - (int)(Opcode.OP_1 - 1));
        n = opcodenum - (Opcode.OP_1 - 1);
        buf = new BN(n).toScriptNumBuffer();
        this.stack.push(buf); // The result of these opcodes should always be the minimal way to push the data
        // they push, so no need for a CheckMinimalPush here.

        break;
      //
      // Control
      //

      case Opcode.OP_NOP:
        break;

      case Opcode.OP_NOP2:
      case Opcode.OP_CHECKLOCKTIMEVERIFY:
        {
          if (!(this.flags & Interpreter.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY)) {
            // not enabled; treat as a NOP2
            if (this.flags & Interpreter.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS) {
              this.errstr = 'SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS';
              return false;
            }

            break;
          }

          if (this.stack.length < 1) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          } // Note that elsewhere numeric opcodes are limited to
          // operands in the range -2**31+1 to 2**31-1, however it is
          // legal for opcodes to produce results exceeding that
          // range. This limitation is implemented by CScriptNum's
          // default 4-byte limit.
          //
          // If we kept to that limit we'd have a year 2038 problem,
          // even though the nLockTime field in transactions
          // themselves is uint32 which only becomes meaningless
          // after the year 2106.
          //
          // Thus as a special case we tell CScriptNum to accept up
          // to 5-byte bignums, which are good until 2**39-1, well
          // beyond the 2**32-1 limit of the nLockTime field itself.


          var nLockTime = BN.fromScriptNumBuffer(this.stack[this.stack.length - 1], fRequireMinimal, 5); // In the rare event that the argument may be < 0 due to
          // some arithmetic being done first, you can always use
          // 0 MAX CHECKLOCKTIMEVERIFY.

          if (nLockTime.lt(new BN(0))) {
            this.errstr = 'SCRIPT_ERR_NEGATIVE_LOCKTIME';
            return false;
          } // Actually compare the specified lock time with the transaction.


          if (!this.checkLockTime(nLockTime)) {
            this.errstr = 'SCRIPT_ERR_UNSATISFIED_LOCKTIME';
            return false;
          }

          break;
        }

      case Opcode.OP_NOP1:
      case Opcode.OP_NOP3:
      case Opcode.OP_NOP4:
      case Opcode.OP_NOP5:
      case Opcode.OP_NOP6:
      case Opcode.OP_NOP7:
      case Opcode.OP_NOP8:
      case Opcode.OP_NOP9:
      case Opcode.OP_NOP10:
        if (this.flags & Interpreter.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS) {
          this.errstr = 'SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS';
          return false;
        }

        break;

      case Opcode.OP_IF:
      case Opcode.OP_NOTIF:
        // <expression> if [statements] [else [statements]] endif
        // bool fValue = false;
        fValue = false;

        if (fExec) {
          if (this.stack.length < 1) {
            this.errstr = 'SCRIPT_ERR_UNBALANCED_CONDITIONAL';
            return false;
          }

          buf = this.stack.pop();
          fValue = Interpreter.castToBool(buf);

          if (opcodenum === Opcode.OP_NOTIF) {
            fValue = !fValue;
          }
        }

        this.vfExec.push(fValue);
        break;

      case Opcode.OP_ELSE:
        if (this.vfExec.length === 0) {
          this.errstr = 'SCRIPT_ERR_UNBALANCED_CONDITIONAL';
          return false;
        }

        this.vfExec[this.vfExec.length - 1] = !this.vfExec[this.vfExec.length - 1];
        break;

      case Opcode.OP_ENDIF:
        if (this.vfExec.length === 0) {
          this.errstr = 'SCRIPT_ERR_UNBALANCED_CONDITIONAL';
          return false;
        }

        this.vfExec.pop();
        break;

      case Opcode.OP_VERIFY:
        // (true -- ) or
        // (false -- false) and return
        if (this.stack.length < 1) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        buf = this.stack[this.stack.length - 1];
        fValue = Interpreter.castToBool(buf);

        if (fValue) {
          this.stack.pop();
        } else {
          this.errstr = 'SCRIPT_ERR_VERIFY';
          return false;
        }

        break;

      case Opcode.OP_RETURN:
        this.errstr = 'SCRIPT_ERR_OP_RETURN';
        return false;
      //
      // Stack ops
      //

      case Opcode.OP_TOALTSTACK:
        if (this.stack.length < 1) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        this.altstack.push(this.stack.pop());
        break;

      case Opcode.OP_FROMALTSTACK:
        if (this.altstack.length < 1) {
          this.errstr = 'SCRIPT_ERR_INVALID_ALTSTACK_OPERATION';
          return false;
        }

        this.stack.push(this.altstack.pop());
        break;

      case Opcode.OP_2DROP:
        // (x1 x2 -- )
        if (this.stack.length < 2) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        this.stack.pop();
        this.stack.pop();
        break;

      case Opcode.OP_2DUP:
        // (x1 x2 -- x1 x2 x1 x2)
        if (this.stack.length < 2) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        buf1 = this.stack[this.stack.length - 2];
        buf2 = this.stack[this.stack.length - 1];
        this.stack.push(buf1);
        this.stack.push(buf2);
        break;

      case Opcode.OP_3DUP:
        {
          // (x1 x2 x3 -- x1 x2 x3 x1 x2 x3)
          if (this.stack.length < 3) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          buf1 = this.stack[this.stack.length - 3];
          buf2 = this.stack[this.stack.length - 2];
          var buf3 = this.stack[this.stack.length - 1];
          this.stack.push(buf1);
          this.stack.push(buf2);
          this.stack.push(buf3);
        }
        break;

      case Opcode.OP_2OVER:
        // (x1 x2 x3 x4 -- x1 x2 x3 x4 x1 x2)
        if (this.stack.length < 4) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        buf1 = this.stack[this.stack.length - 4];
        buf2 = this.stack[this.stack.length - 3];
        this.stack.push(buf1);
        this.stack.push(buf2);
        break;

      case Opcode.OP_2ROT:
        // (x1 x2 x3 x4 x5 x6 -- x3 x4 x5 x6 x1 x2)
        if (this.stack.length < 6) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        spliced = this.stack.splice(this.stack.length - 6, 2);
        this.stack.push(spliced[0]);
        this.stack.push(spliced[1]);
        break;

      case Opcode.OP_2SWAP:
        // (x1 x2 x3 x4 -- x3 x4 x1 x2)
        if (this.stack.length < 4) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        spliced = this.stack.splice(this.stack.length - 4, 2);
        this.stack.push(spliced[0]);
        this.stack.push(spliced[1]);
        break;

      case Opcode.OP_IFDUP:
        // (x - 0 | x x)
        if (this.stack.length < 1) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        buf = this.stack[this.stack.length - 1];
        fValue = Interpreter.castToBool(buf);

        if (fValue) {
          this.stack.push(buf);
        }

        break;

      case Opcode.OP_DEPTH:
        // -- stacksize
        buf = new BN(this.stack.length).toScriptNumBuffer();
        this.stack.push(buf);
        break;

      case Opcode.OP_DROP:
        // (x -- )
        if (this.stack.length < 1) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        this.stack.pop();
        break;

      case Opcode.OP_DUP:
        // (x -- x x)
        if (this.stack.length < 1) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        this.stack.push(this.stack[this.stack.length - 1]);
        break;

      case Opcode.OP_NIP:
        // (x1 x2 -- x2)
        if (this.stack.length < 2) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        this.stack.splice(this.stack.length - 2, 1);
        break;

      case Opcode.OP_OVER:
        // (x1 x2 -- x1 x2 x1)
        if (this.stack.length < 2) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        this.stack.push(this.stack[this.stack.length - 2]);
        break;

      case Opcode.OP_PICK:
      case Opcode.OP_ROLL:
        // (xn ... x2 x1 x0 n - xn ... x2 x1 x0 xn)
        // (xn ... x2 x1 x0 n - ... x2 x1 x0 xn)
        if (this.stack.length < 2) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        buf = this.stack[this.stack.length - 1];
        bn = BN.fromScriptNumBuffer(buf, fRequireMinimal);
        n = bn.toNumber();
        this.stack.pop();

        if (n < 0 || n >= this.stack.length) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        buf = this.stack[this.stack.length - n - 1];

        if (opcodenum === Opcode.OP_ROLL) {
          this.stack.splice(this.stack.length - n - 1, 1);
        }

        this.stack.push(buf);
        break;

      case Opcode.OP_ROT:
        {
          // (x1 x2 x3 -- x2 x3 x1)
          //  x2 x1 x3  after first swap
          //  x2 x3 x1  after second swap
          if (this.stack.length < 3) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          x1 = this.stack[this.stack.length - 3];
          x2 = this.stack[this.stack.length - 2];
          var x3 = this.stack[this.stack.length - 1];
          this.stack[this.stack.length - 3] = x2;
          this.stack[this.stack.length - 2] = x3;
          this.stack[this.stack.length - 1] = x1;
        }
        break;

      case Opcode.OP_SWAP:
        // (x1 x2 -- x2 x1)
        if (this.stack.length < 2) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        x1 = this.stack[this.stack.length - 2];
        x2 = this.stack[this.stack.length - 1];
        this.stack[this.stack.length - 2] = x2;
        this.stack[this.stack.length - 1] = x1;
        break;

      case Opcode.OP_TUCK:
        // (x1 x2 -- x2 x1 x2)
        if (this.stack.length < 2) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        this.stack.splice(this.stack.length - 2, 0, this.stack[this.stack.length - 1]);
        break;

      case Opcode.OP_SIZE:
        // (in -- in size)
        if (this.stack.length < 1) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        bn = new BN(this.stack[this.stack.length - 1].length);
        this.stack.push(bn.toScriptNumBuffer());
        break;
      //
      // Bitwise logic
      //

      case Opcode.OP_EQUAL:
      case Opcode.OP_EQUALVERIFY:
        // case Opcode.OP_NOTEQUAL: // use Opcode.OP_NUMNOTEQUAL
        {
          // (x1 x2 - bool)
          if (this.stack.length < 2) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          buf1 = this.stack[this.stack.length - 2];
          buf2 = this.stack[this.stack.length - 1];
          var fEqual = buf1.toString('hex') === buf2.toString('hex');
          this.stack.pop();
          this.stack.pop();
          this.stack.push(fEqual ? Interpreter.true : Interpreter.false);

          if (opcodenum === Opcode.OP_EQUALVERIFY) {
            if (fEqual) {
              this.stack.pop();
            } else {
              this.errstr = 'SCRIPT_ERR_EQUALVERIFY';
              return false;
            }
          }
        }
        break;
      //
      // Numeric
      //

      case Opcode.OP_1ADD:
      case Opcode.OP_1SUB:
      case Opcode.OP_NEGATE:
      case Opcode.OP_ABS:
      case Opcode.OP_NOT:
      case Opcode.OP_0NOTEQUAL:
        // (in -- out)
        if (this.stack.length < 1) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        buf = this.stack[this.stack.length - 1];
        bn = BN.fromScriptNumBuffer(buf, fRequireMinimal);

        switch (opcodenum) {
          case Opcode.OP_1ADD:
            bn = bn.add(BN.One);
            break;

          case Opcode.OP_1SUB:
            bn = bn.sub(BN.One);
            break;

          case Opcode.OP_NEGATE:
            bn = bn.neg();
            break;

          case Opcode.OP_ABS:
            if (bn.cmp(BN.Zero) < 0) {
              bn = bn.neg();
            }

            break;

          case Opcode.OP_NOT:
            bn = new BN((bn.cmp(BN.Zero) === 0) + 0);
            break;

          case Opcode.OP_0NOTEQUAL:
            bn = new BN((bn.cmp(BN.Zero) !== 0) + 0);
            break;

          default:
            // We should really not end up in here.
            throw new Error('Ended up in a default switch statement that should never be executed.');
        }

        this.stack.pop();
        this.stack.push(bn.toScriptNumBuffer());
        break;

      case Opcode.OP_ADD:
      case Opcode.OP_SUB:
      case Opcode.OP_BOOLAND:
      case Opcode.OP_BOOLOR:
      case Opcode.OP_NUMEQUAL:
      case Opcode.OP_NUMEQUALVERIFY:
      case Opcode.OP_NUMNOTEQUAL:
      case Opcode.OP_LESSTHAN:
      case Opcode.OP_GREATERTHAN:
      case Opcode.OP_LESSTHANOREQUAL:
      case Opcode.OP_GREATERTHANOREQUAL:
      case Opcode.OP_MIN:
      case Opcode.OP_MAX:
        // (x1 x2 -- out)
        if (this.stack.length < 2) {
          this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
          return false;
        }

        bn1 = BN.fromScriptNumBuffer(this.stack[this.stack.length - 2], fRequireMinimal);
        bn2 = BN.fromScriptNumBuffer(this.stack[this.stack.length - 1], fRequireMinimal);
        bn = new BN(0);

        switch (opcodenum) {
          case Opcode.OP_ADD:
            bn = bn1.add(bn2);
            break;

          case Opcode.OP_SUB:
            bn = bn1.sub(bn2);
            break;
          // case Opcode.OP_BOOLAND:       bn = (bn1 != bnZero && bn2 != bnZero); break;

          case Opcode.OP_BOOLAND:
            bn = new BN((bn1.cmp(BN.Zero) !== 0 && bn2.cmp(BN.Zero) !== 0) + 0);
            break;
          // case Opcode.OP_BOOLOR:        bn = (bn1 != bnZero || bn2 != bnZero); break;

          case Opcode.OP_BOOLOR:
            bn = new BN((bn1.cmp(BN.Zero) !== 0 || bn2.cmp(BN.Zero) !== 0) + 0);
            break;
          // case Opcode.OP_NUMEQUAL:      bn = (bn1 == bn2); break;

          case Opcode.OP_NUMEQUAL:
            bn = new BN((bn1.cmp(bn2) === 0) + 0);
            break;
          // case Opcode.OP_NUMEQUALVERIFY:    bn = (bn1 == bn2); break;

          case Opcode.OP_NUMEQUALVERIFY:
            bn = new BN((bn1.cmp(bn2) === 0) + 0);
            break;
          // case Opcode.OP_NUMNOTEQUAL:     bn = (bn1 != bn2); break;

          case Opcode.OP_NUMNOTEQUAL:
            bn = new BN((bn1.cmp(bn2) !== 0) + 0);
            break;
          // case Opcode.OP_LESSTHAN:      bn = (bn1 < bn2); break;

          case Opcode.OP_LESSTHAN:
            bn = new BN((bn1.cmp(bn2) < 0) + 0);
            break;
          // case Opcode.OP_GREATERTHAN:     bn = (bn1 > bn2); break;

          case Opcode.OP_GREATERTHAN:
            bn = new BN((bn1.cmp(bn2) > 0) + 0);
            break;
          // case Opcode.OP_LESSTHANOREQUAL:   bn = (bn1 <= bn2); break;

          case Opcode.OP_LESSTHANOREQUAL:
            bn = new BN((bn1.cmp(bn2) <= 0) + 0);
            break;
          // case Opcode.OP_GREATERTHANOREQUAL:  bn = (bn1 >= bn2); break;

          case Opcode.OP_GREATERTHANOREQUAL:
            bn = new BN((bn1.cmp(bn2) >= 0) + 0);
            break;

          case Opcode.OP_MIN:
            bn = bn1.cmp(bn2) < 0 ? bn1 : bn2;
            break;

          case Opcode.OP_MAX:
            bn = bn1.cmp(bn2) > 0 ? bn1 : bn2;
            break;

          default:
            // We should really not end up in here.
            throw new Error('Ended up in a default switch statement that should never be executed.');
        }

        this.stack.pop();
        this.stack.pop();
        this.stack.push(bn.toScriptNumBuffer());

        if (opcodenum === Opcode.OP_NUMEQUALVERIFY) {
          // if (CastToBool(stacktop(-1)))
          if (Interpreter.castToBool(this.stack[this.stack.length - 1])) {
            this.stack.pop();
          } else {
            this.errstr = 'SCRIPT_ERR_NUMEQUALVERIFY';
            return false;
          }
        }

        break;

      case Opcode.OP_WITHIN:
        {
          // (x min max -- out)
          if (this.stack.length < 3) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          bn1 = BN.fromScriptNumBuffer(this.stack[this.stack.length - 3], fRequireMinimal);
          bn2 = BN.fromScriptNumBuffer(this.stack[this.stack.length - 2], fRequireMinimal);
          var bn3 = BN.fromScriptNumBuffer(this.stack[this.stack.length - 1], fRequireMinimal); // bool fValue = (bn2 <= bn1 && bn1 < bn3);

          fValue = bn2.cmp(bn1) <= 0 && bn1.cmp(bn3) < 0;
          this.stack.pop();
          this.stack.pop();
          this.stack.pop();
          this.stack.push(fValue ? Interpreter.true : Interpreter.false);
        }
        break;
      //
      // Crypto
      //

      case Opcode.OP_RIPEMD160:
      case Opcode.OP_SHA1:
      case Opcode.OP_SHA256:
      case Opcode.OP_HASH160:
      case Opcode.OP_HASH256:
        {
          // (in -- hash)
          if (this.stack.length < 1) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          buf = this.stack[this.stack.length - 1]; // valtype vchHash((opcode == Opcode.OP_RIPEMD160 ||
          //                 opcode == Opcode.OP_SHA1 || opcode == Opcode.OP_HASH160) ? 20 : 32);

          var bufHash;

          if (opcodenum === Opcode.OP_RIPEMD160) {
            bufHash = Hash.ripemd160(buf);
          } else if (opcodenum === Opcode.OP_SHA1) {
            bufHash = Hash.sha1(buf);
          } else if (opcodenum === Opcode.OP_SHA256) {
            bufHash = Hash.sha256(buf);
          } else if (opcodenum === Opcode.OP_HASH160) {
            bufHash = Hash.sha256ripemd160(buf);
          } else if (opcodenum === Opcode.OP_HASH256) {
            bufHash = Hash.sha256sha256(buf);
          }

          this.stack.pop();
          this.stack.push(bufHash);
        }
        break;

      case Opcode.OP_CODESEPARATOR:
        // Hash starts after the code separator
        this.pbegincodehash = this.pc;
        break;

      case Opcode.OP_CHECKSIG:
      case Opcode.OP_CHECKSIGVERIFY:
        {
          // (sig pubkey -- bool)
          if (this.stack.length < 2) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          bufSig = this.stack[this.stack.length - 2];
          bufPubkey = this.stack[this.stack.length - 1]; // Subset of script starting at the most recent codeseparator
          // CScript scriptCode(pbegincodehash, pend);

          subscript = new Script().set({
            chunks: this.script.chunks.slice(this.pbegincodehash)
          }); // Drop the signature, since there's no way for a signature to sign itself

          var tmpScript = new Script().add(bufSig);
          subscript.findAndDelete(tmpScript);

          if (!this.checkSignatureEncoding(bufSig) || !this.checkPubkeyEncoding(bufPubkey)) {
            return false;
          }

          try {
            sig = Signature.fromTxFormat(bufSig);
            pubkey = PublicKey.fromBuffer(bufPubkey, false);
            fSuccess = this.tx.verifySignature(sig, pubkey, this.nin, subscript);
          } catch (e) {
            // invalid sig or pubkey
            fSuccess = false;
          }

          this.stack.pop();
          this.stack.pop(); // stack.push_back(fSuccess ? vchTrue : vchFalse);

          this.stack.push(fSuccess ? Interpreter.true : Interpreter.false);

          if (opcodenum === Opcode.OP_CHECKSIGVERIFY) {
            if (fSuccess) {
              this.stack.pop();
            } else {
              this.errstr = 'SCRIPT_ERR_CHECKSIGVERIFY';
              return false;
            }
          }
        }
        break;

      case Opcode.OP_CHECKMULTISIG:
      case Opcode.OP_CHECKMULTISIGVERIFY:
        {
          // ([sig ...] num_of_signatures [pubkey ...] num_of_pubkeys -- bool)
          var i = 1;

          if (this.stack.length < i) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          var nKeysCount = BN.fromScriptNumBuffer(this.stack[this.stack.length - i], fRequireMinimal).toNumber();

          if (nKeysCount < 0 || nKeysCount > 20) {
            this.errstr = 'SCRIPT_ERR_PUBKEY_COUNT';
            return false;
          }

          this.nOpCount += nKeysCount;

          if (this.nOpCount > 201) {
            this.errstr = 'SCRIPT_ERR_OP_COUNT';
            return false;
          } // int ikey = ++i;


          i += 1;
          var ikey = i;
          i += nKeysCount;

          if (this.stack.length < i) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          var nSigsCount = BN.fromScriptNumBuffer(this.stack[this.stack.length - i], fRequireMinimal).toNumber();

          if (nSigsCount < 0 || nSigsCount > nKeysCount) {
            this.errstr = 'SCRIPT_ERR_SIG_COUNT';
            return false;
          } // int isig = ++i;


          i += 1;
          var isig = i;
          i += nSigsCount;

          if (this.stack.length < i) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          } // Subset of script starting at the most recent codeseparator


          subscript = new Script().set({
            chunks: this.script.chunks.slice(this.pbegincodehash)
          }); // Drop the signatures, since there's no way for a signature to sign itself

          for (var k = 0; k < nSigsCount; k += 1) {
            bufSig = this.stack[this.stack.length - isig - k];
            subscript.findAndDelete(new Script().add(bufSig));
          }

          fSuccess = true;

          while (fSuccess && nSigsCount > 0) {
            // valtype& vchSig  = stacktop(-isig);
            bufSig = this.stack[this.stack.length - isig]; // valtype& vchPubKey = stacktop(-ikey);

            bufPubkey = this.stack[this.stack.length - ikey];

            if (!this.checkSignatureEncoding(bufSig) || !this.checkPubkeyEncoding(bufPubkey)) {
              return false;
            }

            var fOk = void 0;

            try {
              sig = Signature.fromTxFormat(bufSig);
              pubkey = PublicKey.fromBuffer(bufPubkey, false);
              fOk = this.tx.verifySignature(sig, pubkey, this.nin, subscript);
            } catch (e) {
              // invalid sig or pubkey
              fOk = false;
            }

            if (fOk) {
              isig += 1;
              nSigsCount -= 1;
            }

            ikey += 1;
            nKeysCount -= 1; // If there are more signatures left than keys left,
            // then too many signatures have failed

            if (nSigsCount > nKeysCount) {
              fSuccess = false;
            }
          } // Clean up stack of actual arguments


          while (i > 1) {
            i -= 1;
            this.stack.pop();
          } // A bug causes CHECKMULTISIG to consume one extra argument
          // whose contents were not checked in any way.
          //
          // Unfortunately this is a potential source of mutability,
          // so optionally verify it is exactly equal to zero prior
          // to removing it from the stack.


          if (this.stack.length < 1) {
            this.errstr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          if (this.flags & Interpreter.SCRIPT_VERIFY_NULLDUMMY && this.stack[this.stack.length - 1].length) {
            this.errstr = 'SCRIPT_ERR_SIG_NULLDUMMY';
            return false;
          }

          this.stack.pop();
          this.stack.push(fSuccess ? Interpreter.true : Interpreter.false);

          if (opcodenum === Opcode.OP_CHECKMULTISIGVERIFY) {
            if (fSuccess) {
              this.stack.pop();
            } else {
              this.errstr = 'SCRIPT_ERR_CHECKMULTISIGVERIFY';
              return false;
            }
          }
        }
        break;

      default:
        this.errstr = 'SCRIPT_ERR_BAD_OPCODE';
        return false;
    }
  }

  return true;
};

class ScriptHashInput extends Input {
  constructor(input, pubkeys, redeemScript) {
    super(input, pubkeys, redeemScript);
    var self = this;
    this.publicKeys = pubkeys || input.publicKeys;
    this.threshold = 1;
    this.redeemScript = redeemScript;
    preconditions.checkState(Script.buildScriptHashOut(this.redeemScript).equals(this.output.script), "Provided redeemScript doesn't hash to the provided output");
    this.publicKeyIndex = {};
    this.publicKeys.forEach((publicKey, index) => {
      self.publicKeyIndex[publicKey.toString()] = index;
    }); // Empty array of signatures

    this.signatures = new Array(this.publicKeys.length);
  }

  toObject() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var obj = Input.prototype.toObject.apply(this, args);
    obj.threshold = this.threshold;
    obj.publicKeys = this.publicKeys.map(publicKey => publicKey.toString());
    obj.signatures = this._serializeSignatures();
    return obj;
  }

  _deserializeSignatures(signatures) {
    return signatures.map(signature => signature ? new TransactionSignature(signature) : undefined);
  }

  _serializeSignatures() {
    return this.signatures.map(signature => signature ? signature.toObject() : undefined);
  }

  getSignatures(transaction, privateKey, index, sigtype) {
    preconditions.checkState(this.output instanceof Output, 'Malformed output found when signing transaction');
    sigtype = sigtype || Signature.SIGHASH_ALL | Signature.SIGHASH_FORKID;
    var publicKeysForPrivateKey = this.publicKeys.filter(publicKey => publicKey.toString() === privateKey.publicKey.toString());
    return publicKeysForPrivateKey.map(publicKey => new TransactionSignature({
      publicKey,
      prevTxId: this.prevTxId,
      outputIndex: this.outputIndex,
      inputIndex: index,
      signature: Sighash.sign(transaction, privateKey, sigtype, index, this.output.script, this.output.satoshisBN),
      sigtype
    }));
  }

  addSignature(transaction, signature) {
    preconditions.checkState(!this.isFullySigned(), 'All needed signatures have already been added');
    preconditions.checkArgument(this.publicKeyIndex[signature.publicKey.toString()] !== undefined, 'Signature has no matching public key');
    preconditions.checkState(this.isValidSignature(transaction, signature));
    this.signatures[this.publicKeyIndex[signature.publicKey.toString()]] = signature;

    this._updateScript();

    return this;
  }

  _updateScript() {
    this.setScript(Script.buildP2SHMultisigIn(this.publicKeys, this.threshold, this._createSignatures(), {
      cachedMultisig: this.redeemScript
    }));
    return this;
  }

  _createSignatures() {
    var definedSignatures = this.signatures.filter(signature => signature !== undefined);
    return definedSignatures.map(signature => BufferUtil.concat([signature.signature.toDER(), BufferUtil.integerAsSingleByteBuffer(signature.sigtype)]));
  }

  clearSignatures() {
    this.signatures = new Array(this.publicKeys.length);

    this._updateScript();
  }

  isFullySigned() {
    return this.countSignatures() === this.threshold;
  }

  countMissingSignatures() {
    return this.threshold - this.countSignatures();
  }

  countSignatures() {
    return this.signatures.reduce((sum, signature) => sum + !!signature, 0);
  }

  publicKeysWithoutSignature() {
    var self = this;
    return this.publicKeys.filter(publicKey => !self.signatures[self.publicKeyIndex[publicKey.toString()]]);
  }

  isValidSignature(transaction, signature) {
    // FIXME: Refactor signature so this is not necessary
    signature.signature.nhashtype = signature.sigtype;
    return Sighash.verify(transaction, signature.signature, signature.publicKey, signature.inputIndex, this.redeemScript, this.output.satoshisBN);
  }

  _estimateSize() {
    return ScriptHashInput.OPCODES_SIZE + this.threshold * ScriptHashInput.SIGNATURE_SIZE + this.publicKeys.length * ScriptHashInput.PUBKEY_SIZE;
  }

}

ScriptHashInput.OPCODES_SIZE = 7; // serialized size (<=3) + 0 .. N .. M OP_CHECKMULTISIG

ScriptHashInput.SIGNATURE_SIZE = 74; // size (1) + DER (<=72) + sighash (1)

ScriptHashInput.PUBKEY_SIZE = 34; // size (1) + DER (<=33)

var TXID_REGEX = /[0-9A-Fa-f]{64}/;
/**
 * Output identifier for a Bitcoin transaction
 */

class OutputId {
  /**
      Creates an output id from a transaction id and output index
     * @param {string} txId Transaction id in hex format
     * @param {number} outputIndex Output index
     */
  constructor(txId, outputIndex) {
    if (!TXID_REGEX.test(txId)) throw new Error("txId not in a valid hex format: ".concat(txId));
    if (outputIndex < 0 || outputIndex > 4294967295 || Number.isNaN(outputIndex)) throw new Error("outputIndex out of range: ".concat(outputIndex));
    this.txId = txId;
    this.outputIndex = outputIndex;
  }
  /**
   * Serializes the output id into a compressed string form
   */


  toString() {
    return "".concat(this.txId, ":").concat(this.outputIndex);
  }
  /**
   * Parses the output id form its compressed string form
   * @param {string} s String to parse
   */


  static fromString(s) {
    var parts = s.split(':');
    if (parts.length !== 2) throw new Error('Invalid string format');
    return new OutputId(parts[0], parseInt(parts[1], 10));
  }
  /**
   * Get the transaction id in hex format
   */


  get txid() {
    return this.txId;
  }
  /**
   * Get the output index
   */


  get vout() {
    return this.outputIndex;
  }
  /**
   * Returns whether two OutputIds refer to the same output
   * @param {OutputId} other Other object to compare
   * @returns {bool} True if the objects refer to the same output, false if not
   */


  equals(other) {
    return this.outputIndex === other.outputIndex && this.txId.toLowerCase() === other.txId.toLowerCase();
  }

}

/**
 * Bitcore URI
 *
 * Instantiate an URI from a bitcoin cash URI String or an Object. An URI instance
 * can be created with a bitcoin cash uri string or an object. All instances of
 * URI are valid, the static method isValid allows checking before instantiation.
 *
 * All standard parameters can be found as members of the class, the address
 * is represented using an {Address} instance and the amount is represented in
 * satoshis. Any other non-standard parameters can be found under the extra member.
 *
 * @example
 * ```javascript
 *
 * var uri = new URI('bitcoincash:12A1MyfXbW6RhdRAZEqofac5jCQQjwEPBu?amount=1.2');
 * console.log(uri.address, uri.amount);
 * ```
 *
 * @param {string|Object} data - A bitcoin cash URI string or an Object
 * @param {Array.<string>=} knownParams - Required non-standard params
 * @throws {TypeError} Invalid bitcoin address
 * @throws {TypeError} Invalid amount
 * @throws {Error} Unknown required argument
 * @returns {URI} A new valid and frozen instance of URI
 * @constructor
 */
// eslint-disable-next-line consistent-return

var URI = function URI(data, knownParams) {
  // #weirdstuff refactor
  if (!(this instanceof URI)) {
    return new URI(data, knownParams);
  }

  this.extras = {};
  this.knownParams = knownParams || [];
  this.address = null;
  this.network = null;
  this.amount = null;
  this.message = null;

  if (typeof data === 'string') {
    var params = URI.parse(data);

    if (params.amount) {
      params.amount = this._parseAmount(params.amount);
    }

    this._fromObject(params);
  } else if (typeof data === 'object') {
    this._fromObject(data);
  } else {
    throw new TypeError('Unrecognized data format.');
  }
};
/**
 * Instantiate a URI from a String
 *
 * @param {string} str - JSON string or object of the URI
 * @returns {URI} A new instance of a URI
 */


URI.fromString = function fromString(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }

  return new URI(str);
};
/**
 * Instantiate a URI from an Object
 *
 * @param {Object} data - object of the URI
 * @returns {URI} A new instance of a URI
 */


URI.fromObject = function fromObject(json) {
  return new URI(json);
};
/**
 * Check if an bitcoin cash URI string is valid
 *
 * @example
 * ```javascript
 *
 * var valid = URI.isValid('bitcoincash:12A1MyfXbW6RhdRAZEqofac5jCQQjwEPBu');
 * // true
 * ```
 *
 * @param {string|Object} data - A bitcoin cash URI string or an Object
 * @param {Array.<string>=} knownParams - Required non-standard params
 * @returns {boolean} Result of uri validation
 */


URI.isValid = function (arg, knownParams) {
  try {
    // #weirdstuff refactor
    // eslint-disable-next-line no-new
    new URI(arg, knownParams);
  } catch (err) {
    return false;
  }

  return true;
};
/**
 * Convert a bitcoin cash URI string into a simple object.
 *
 * @param {string} uri - A bitcoin cash URI string
 * @throws {TypeError} Invalid bitcoin cash URI
 * @returns {Object} An object with the parsed params
 */


URI.parse = function (uri) {
  var info = URL.parse(uri, true);

  if (info.protocol !== 'bitcoincash:') {
    throw new TypeError('Invalid bitcoin cash URI');
  } // workaround to host insensitiveness


  var group = /[^:]*:\/?\/?([^?]*)/.exec(uri);
  info.query.address = group && group[1] || undefined;
  return info.query;
};

URI.Members = ['address', 'amount', 'message', 'label', 'r'];
/**
 * Internal function to load the URI instance with an object.
 *
 * @param {Object} obj - Object with the information
 * @throws {TypeError} Invalid bitcoin address
 * @throws {TypeError} Invalid amount
 * @throws {Error} Unknown required argument
 */

URI.prototype._fromObject = function (obj) {
  if (!Address.isValid(obj.address)) {
    throw new TypeError('Invalid bitcoin address');
  }

  this.address = new Address(obj.address);
  this.network = this.address.network;
  this.amount = obj.amount;
  Object.keys(obj).forEach(key => {
    if (key !== 'address' && key !== 'amount') {
      if (/^req-/.exec(key) && this.knownParams.indexOf(key) === -1) {
        throw Error("Unknown required argument ".concat(key));
      }

      var destination = URI.Members.indexOf(key) > -1 ? this : this.extras;
      destination[key] = obj[key];
    }
  });
};
/**
 * Internal function to transform a BTC string amount into satoshis
 *
 * @param {string} amount - Amount BTC string
 * @throws {TypeError} Invalid amount
 * @returns {Object} Amount represented in satoshis
 */


URI.prototype._parseAmount = function (amount) {
  amount = Number(amount);

  if (Number.isNaN(amount)) {
    throw new TypeError('Invalid amount');
  }

  return Unit.fromBTC(amount).toSatoshis();
};

URI.prototype.toJSON = function toObject() {
  var _this = this;

  var json = {};

  var _loop = function _loop(i) {
    var m = URI.Members[i];

    if (Object.keys(_this).findIndex(key => key === m) !== 1 && typeof _this[m] !== 'undefined') {
      json[m] = _this[m].toString();
    }
  };

  for (var i = 0; i < URI.Members.length; i += 1) {
    _loop(i);
  }

  _.extend(json, this.extras);

  return json;
};

URI.prototype.toObject = URI.prototype.toJSON;
/**
 * Will return a the string representation of the URI
 *
 * @returns {string} Bitcoin cash URI string
 */

URI.prototype.toString = function () {
  var query = {};

  if (this.amount) {
    query.amount = Unit.fromSatoshis(this.amount).toBTC();
  }

  if (this.message) {
    query.message = this.message;
  }

  if (this.label) {
    query.label = this.label;
  }

  if (this.r) {
    query.r = this.r;
  }

  _.extend(query, this.extras);

  return URL.format({
    protocol: 'bitcoincash:',
    host: this.address,
    query
  });
};
/**
 * Will return a string formatted for the console
 *
 * @returns {string} Bitcoin cash URI
 */


URI.prototype.inspect = function () {
  return "<URI: ".concat(this.toString(), ">");
};

var Varint = function Varint(buf) {
  if (!(this instanceof Varint)) return new Varint(buf);

  if (Buffer.isBuffer(buf)) {
    this.buf = buf;
  } else if (typeof buf === 'number') {
    var num = buf;
    this.fromNumber(num);
  } else if (buf instanceof BN) {
    var bn = buf;
    this.fromBN(bn);
  } else if (buf) {
    var obj = buf;
    this.set(obj);
  }
};

Varint.prototype.set = function (obj) {
  this.buf = obj.buf || this.buf;
  return this;
};

Varint.prototype.fromString = function (str) {
  this.set({
    buf: Buffer.from(str, 'hex')
  });
  return this;
};

Varint.prototype.toString = function () {
  return this.buf.toString('hex');
};

Varint.prototype.fromBuffer = function (buf) {
  this.buf = buf;
  return this;
};

Varint.prototype.fromBufferReader = function (br) {
  this.buf = br.readVarintBuf();
  return this;
};

Varint.prototype.fromBN = function (bn) {
  this.buf = BufferWriter().writeVarintBN(bn).concat();
  return this;
};

Varint.prototype.fromNumber = function (num) {
  this.buf = BufferWriter().writeVarintNum(num).concat();
  return this;
};

Varint.prototype.toBuffer = function () {
  return this.buf;
};

Varint.prototype.toBN = function () {
  return BufferReader(this.buf).readVarintBN();
};

Varint.prototype.toNumber = function () {
  return BufferReader(this.buf).readVarintNum();
};

var Bitcoin = {}; // module information

Bitcoin.version = "v".concat(PackageInfo.version); // eslint-disable-next-line no-unused-vars

Bitcoin.versionGuard = function (version) {// if (version !== undefined) {
  //   var message = 'More than one instance of bitcoincashjs found. ' +
  //     'Please make sure to require bitcoincashjs and check that submodules do' +
  //     ' not also include their own bitcoincashjs dependency.';
  //   throw new Error(message);
  // }
};

Bitcoin.versionGuard(global._bitcoin);
global._bitcoin = Bitcoin.version; // crypto

Bitcoin.crypto = {};
Bitcoin.crypto.BN = BN;
Bitcoin.crypto.ECDSA = ECDSA;
Bitcoin.crypto.Hash = Hash;
Bitcoin.crypto.Random = Random;
Bitcoin.crypto.Point = Point;
Bitcoin.crypto.Signature = Signature; // encoding

Bitcoin.encoding = {};
Bitcoin.encoding.Base58 = Base58;
Bitcoin.encoding.Base58Check = Base58Check;
Bitcoin.encoding.BufferReader = BufferReader;
Bitcoin.encoding.BufferWriter = BufferWriter;
Bitcoin.encoding.Varint = Varint; // utilities

Bitcoin.util = {};
Bitcoin.util.buffer = BufferUtil;
Bitcoin.util.js = JSUtil;
Bitcoin.util.preconditions = preconditions; // errors thrown by the library

Bitcoin.errors = errors; // main bitcoin library

Bitcoin.Address = Address;
Bitcoin.Block = Block;
Bitcoin.Block.BlockHeader = BlockHeader;
Bitcoin.Block.MerkleBlock = MerkleBlock;
Bitcoin.BlockHeader = BlockHeader;
Bitcoin.HDPrivateKey = HDPrivateKey;
Bitcoin.HDPublicKey = HDPublicKey;
Bitcoin.MerkleBlock = MerkleBlock;
Bitcoin.Message = Message;
Bitcoin.Mnemonic = Mnemonic;
Bitcoin.Networks = Networks;
Bitcoin.Opcode = Opcode;
Bitcoin.PrivateKey = PrivateKey;
Bitcoin.PublicKey = PublicKey;
Bitcoin.Script = Script;
Bitcoin.Script.Interpreter = Interpreter;
Bitcoin.Transaction = Transaction;
Bitcoin.Transaction.Input = Input;
Bitcoin.Transaction.Input.MultiSig = MultiSigInput;
Bitcoin.Transaction.Input.MultiSigScriptHash = MultiSigScriptHashInput;
Bitcoin.Transaction.Input.PublicKey = PublicKeyInput;
Bitcoin.Transaction.Input.PublicKeyHash = PublicKeyHashInput;
Bitcoin.Transaction.Input.ScriptHash = ScriptHashInput;
Bitcoin.Transaction.Output = Output;
Bitcoin.Transaction.OutputId = OutputId;
Bitcoin.Transaction.Sighash = Sighash;
Bitcoin.Transaction.Signature = TransactionSignature;
Bitcoin.Transaction.UnspentOutput = UnspentOutput;
Bitcoin.Unit = Unit;
Bitcoin.URI = URI; // dependencies, subject to change

Bitcoin.deps = {};
Bitcoin.deps.bnjs = BN;
Bitcoin.deps.bs58 = bs58;
Bitcoin.deps.Buffer = Buffer;
Bitcoin.deps.elliptic = elliptic;
Bitcoin.deps._ = _;

module.exports = Bitcoin;
