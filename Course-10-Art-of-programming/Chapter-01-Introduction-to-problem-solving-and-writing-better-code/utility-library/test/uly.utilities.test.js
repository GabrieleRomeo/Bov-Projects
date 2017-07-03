'use strict';

import 'babel-polyfill';
import u from '../src/uly.utilities';

const assert = require('assert');


describe('Utilities - U', () => {

  describe('by( list, n, callback )', () => {
    it('should throw an expection when the provided list is not an Array', () => {
      assert.throws(
        () => {
          u.by(true, 2);
          u.by('test', 2);
          u.by(null, 2);
          u.by(undefined, 2);
        },
        /Error: expected ARRAY but provided/
        );
    });
    it('should throw an expection when the provided n parameter is not an Integer', () => {
      assert.throws(
        () => {
          u.by([], '2', function(){});
          u.by([], true, function(){});
          u.by([], null, function(){});
        },
        /Error: expected INTEGER but provided/
        );
    });
    it('should throw an expection when the provided callback is not a Function', () => {
      assert.throws(
        () => {
          u.by([], 2, '2');
          u.by([], 2, true);
          u.by([], 2, null);
        },
        /Error: expected FUNCTION but provided/
        );
    });
    it('should call the callback parameter for each element or property of a list at the interval specified by the n parameter', () => {
      var result = [];
      const double = (x) => result.push(x * 2);
      u.by([1, 2, 3, 4, 5, 6], 2, double);
      assert.deepEqual(result, [4, 8, 12]);
    });
    it('should not call callback on values greater than the list’s number of elements.', () => {
      var result = [];
      const double = (x) => result.push(x * 2);
      u.by([1, 2, 3, 4, 5, 6], 1, double);
      assert.notStrictEqual(result, [1, 4, 6, 8, 10, 12, 16]);
    });
  });

  describe('.keys( object )', () => {
    it('should throw an expection when the provided parameter is not an Object', () => {
      assert.throws(
        () => {
          u.keys(true);
          u.keys('test');
          u.keys(null);
          u.keys(undefined);
        },
        /Error: expected OBJECT but provided/
        );
    });
    it('should return an array of all the keys of an object', () => {
      assert.deepEqual(u.keys({count: 5, length: 10, total: 16}), ['count', 'length', 'total']);
    });
    it('should return an empty array when the object does not contain any item', () => {
      assert.deepEqual(u.keys({}), []);
    });
  });

  describe('.values( object )', () => {
    it('should throw an expection when the provided parameter is not an Object', () => {
      assert.throws(
        () => {
          u.values(true);
          u.values('test');
          u.values(null);
          u.values(undefined);
        },
        /Error: expected OBJECT but provided/
        );
    });
    it('should return an array of all the values of an object', () => {
      assert.deepEqual(u.values({count: 5, length: 10, total: 16}), [5, 10, 16]);
    });
    it('should return an empty array when the object does not contain any item', () => {
      assert.deepEqual(u.values({}), []);
    });
  });

  describe('.pairs( object )', () => {
    it('should throw an expection when the provided parameter is not an Object', () => {
      assert.throws(
        () => {
          u.pairs(true);
          u.pairs('test');
          u.pairs(null);
          u.pairs(undefined);
        },
        /Error: expected OBJECT but provided/
        );
    });
    it('should return an array of all the keys and values of an object in the order of [key, value, key, value] for as many key/value pairs as exist in the object', () => {
      assert.deepEqual(u.pairs({count: 5, length: 10, total: 16}), ['count', 5, 'length', 10, 'total', 16]);
    });
    it('should return an empty array when the object does not contain any item', () => {
      assert.deepEqual(u.pairs({}), []);
    });
  });

  describe('.shuffle( array )', () => {
    it('should throw an expection when the provided parameter is not an Array', () => {
      assert.throws(
        () => {
          u.shuffle(true);
          u.shuffle('test');
          u.shuffle(null);
          u.shuffle(undefined);
        },
        /Error: expected ARRAY but provided/
        );
    });
    it('should a randomly re-arranged copy of the elements in its parameter array', () => {
      assert.notStrictEqual(u.shuffle([1, 2, 3, 4, 5, 6]), [1, 2, 3, 4, 5, 6]);
    });
    it('should return an empty array when the object does not contain any item', () => {
      assert.deepEqual(u.shuffle([]), []);
    });
  });

  describe('.pluralize( n, word, pluralWord )', () => {
    it('should throw an expection when the provided n parameter is not an Integer', () => {
      assert.throws(
        () => {
          u.pluralize([]);
          u.pluralize(true);
          u.pluralize(123);
          u.pluralize(undefined);
          u.pluralize(null);
        },
        /Error: expected INTEGER but provided/
        );
    });
    it('should throw an expection when the provided word parameter is not a String', () => {
      assert.throws(
        () => {
          u.pluralize(1, []);
          u.pluralize(1, true);
          u.pluralize(1, 123);
          u.pluralize(1, undefined);
          u.pluralize(1, null);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should return the non-plural word when n === 1', () => {
      assert.deepEqual(u.pluralize(1, 'lion'), 'lion');
    });
    it('should return the pluralized word when n !== 1', () => {
      assert.deepEqual(u.pluralize(0, 'lion'), 'lions');
      assert.deepEqual(u.pluralize(2, 'lion'), 'lions');
      assert.deepEqual(u.pluralize(2, 'lioness'), 'lionesss');
    });
  });

  describe('.toDash( str )', () => {
    it('should throw an expection when the provided parameter is not a String', () => {
      assert.throws(
        () => {
          u.toDash([]);
          u.toDash(true);
          u.toDash(123);
          u.toDash(undefined);
          u.toDash(null);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should convert a camelCase string to a dashed string', () => {
      assert.deepEqual(u.toDash('hotDog'), 'hot-dog');
      assert.deepEqual(u.toDash('spaceStationComplex'), 'space-station-complex');
      assert.deepEqual(u.toDash('myFirstFunction'), 'my-first-function');
    });
    it('should return an empty string when the provided parameter is an empty string', () => {
      assert.deepEqual(u.toDash(''), '');
    });
  });

  describe('.toCamel( str )', () => {
    it('should throw an expection when the provided parameter is not a String', () => {
      assert.throws(
        () => {
          u.toCamel([]);
          u.toCamel(true);
          u.toCamel(123);
          u.toCamel(undefined);
          u.toCamel(null);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should convert a dashed string to a camelCase string', () => {
      assert.deepEqual(u.toCamel('hot-dog'), 'hotDog');
      assert.deepEqual(u.toCamel('space-station-complex'), 'spaceStationComplex');
      assert.deepEqual(u.toCamel('my-first-function'), 'myFirstFunction');
    });
    it('should return an empty string when the provided parameter is an empty string', () => {
      assert.deepEqual(u.toCamel(''), '');
    });
  });

  describe('.has( obj, search )', () => {
    it('should throw an expection when the obj parameter is not an Object', () => {
      assert.throws(
        () => {
          u.has([]);
          u.has(true);
          u.has(123);
          u.has(undefined);
          u.has(null);
        },
        /Error: expected OBJECT but provided/
        );
    });
    it('should pass when there exists a value which is equal to the search parameter', () => {
      assert.deepEqual(u.has({count: 5, length: 10, total: 16}, 10), true);
      assert.deepEqual(u.has({count: 5, alias: 'test', total: 16}, 'test'), true);
    });
    it('should return false when does not exists any value which is equal to the search parameter', () => {
      assert.deepEqual(u.has({count: 5, length: 10, total: 16}, 20), false);
      assert.deepEqual(u.has({count: 5, alias: 'test', total: 16}, 'Hello'), false);
    });
    it('should return false when the provided obj is an empty object', () => {
      assert.deepEqual(u.has({}, 'Hello'), false);
    });
  });

  describe('.pick( obj, keys )', () => {
    const data = {
      type: 'transformer',
      index: 19,
      siblings: 19,
      access: 'full'
    };

    it('should throw an expection when the obj parameter is not an Object', () => {
      assert.throws(
        () => {
          u.pick([]);
          u.pick(true);
          u.pick(123);
          u.pick(undefined);
          u.pick(null);
        },
        /Error: expected OBJECT but provided/
        );
    });
    it('should throw an expection when the keys parameter is not an Array', () => {
      assert.throws(
        () => {
          u.pick({}, {});
          u.pick({}, true);
          u.pick({}, 123);
          u.pick({}, undefined);
          u.pick({}, null);
        },
        /Error: expected ARRAY but provided/
        );
    });
    it('should pass when there exists a value which is equal to the search parameter', () => {
      assert.deepEqual(u.pick(data, ["type", "index"]), {type: "transformer", index: 19});
      assert.deepEqual(u.pick(data, ["siblings", "index"]), {siblings: 19, index: 19});
    });
    it('should return an empty obj when the object is empty', () => {
      assert.deepEqual(u.pick({}, ["siblings", "index"]), {});
    });
    it('should return an empty obj when the keys array is empty', () => {
      assert.deepEqual(u.pick(data, []), {});
    });
  });

  describe('.replaceAll( text, search, replace )', () => {
    it('should throw an expection when the text parameter is not a String', () => {
      assert.throws(
        () => {
          u.replaceAll([]);
          u.replaceAll(true);
          u.replaceAll(123);
          u.replaceAll(undefined);
          u.replaceAll(null);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should throw an expection when the search parameter is not a String', () => {
      assert.throws(
        () => {
          u.replaceAll('hello', []);
          u.replaceAll('hello', true);
          u.replaceAll('hello', 123);
          u.replaceAll('hello', undefined);
          u.replaceAll('hello', null);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should throw an expection when the replace parameter is not a String', () => {
      assert.throws(
        () => {
          u.replaceAll('hello', 'hello',  []);
          u.replaceAll('hello', 'hello',  true);
          u.replaceAll('hello', 'hello',  123);
          u.replaceAll('hello', 'hello',  undefined);
          u.replaceAll('hello', 'hello',  null);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should substitude the search string with the replace string within the text string', () => {
      assert.deepEqual(u.replaceAll('Hello World', 'Hello',  'This is my'), 'This is my World');
    });
    it('should substitude all the occurrencies of the search string with the replace string within the text string', () => {
      assert.deepEqual(u.replaceAll('Hello World', 'l',  '-'), 'He--o Wor-d');
    });
    it('should return the original string when text string does not contain the search string', () => {
      assert.deepEqual(u.replaceAll('Hello World', 'bye',  'This is my'), 'Hello World');
    });
    it('should return an empty string when all of the parameters are empty', () => {
      assert.deepEqual(u.replaceAll('', '',  ''), '');
    });
  });

});
