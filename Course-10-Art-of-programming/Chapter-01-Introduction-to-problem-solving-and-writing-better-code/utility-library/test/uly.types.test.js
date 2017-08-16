'use strict';

import 'babel-polyfill';
import { types as TYPES } from '../src/uly.functional';

const assert = require('assert');

describe('Types - F', () => {

  before(function () {
    this.jsdom = require('jsdom-global')()
  });

  describe('str( x )', () => {
    it('should throw an expection when the provided parameter is not a String', () => {
      assert.throws(
        () => {
          TYPES.str(true);
          TYPES.str(null);
          TYPES.str(undefined);
          TYPES.str([]);
          TYPES.str(new Date());
        },
        /Error: expected STRING but provided/
        );
    });
    it('should pass when the provided parameter is a String', () => {
      assert.deepEqual(TYPES.str('test'), 'test');
    });
  });

  describe('num( x )', () => {
    it('should throw an expection when the provided parameter is not a NUMBER', () => {
      assert.throws(
        () => {
          TYPES.num(true);
          TYPES.num(null);
          TYPES.num(undefined);
          TYPES.num([]);
          TYPES.num(new Date());
        },
        /Error: expected NUMBER but provided/
        );
    });
    it('should pass when the provided parameter is a Number', () => {
      assert.deepEqual(TYPES.num(4), 4);
      assert.deepEqual(TYPES.num(1.5), 1.5);
      assert.deepEqual(TYPES.num(123e-5), 0.00123);
    });
  });

  describe('int( x )', () => {
    it('should throw an expection when the provided parameter is not an INTEGER', () => {
      assert.throws(
        () => {
          TYPES.int(1.5);
          TYPES.int(null);
          TYPES.int(undefined);
          TYPES.int([]);
          TYPES.int(new Date());
          TYPES.int(123e-5);
        },
        /Error: expected INTEGER but provided/
        );
    });
    it('should pass when the provided parameter is an INTEGER', () => {
      assert.deepEqual(TYPES.int(4), 4);
      assert.deepEqual(TYPES.int(10000), 10000);
    });
  });

  describe('bool( x )', () => {
    it('should throw an expection when the provided parameter is not a Boolean', () => {
      assert.throws(
        () => {
          TYPES.bool(1.5);
          TYPES.bool(null);
          TYPES.bool(undefined);
          TYPES.bool([]);
          TYPES.bool(new Date());
          TYPES.bool(123e-5);
        },
        /Error: expected BOOLEAN but provided/
        );
    });
    it('should pass when the provided parameter is a Boolean', () => {
      assert.deepEqual(TYPES.bool(true), true);
      assert.deepEqual(TYPES.bool(false), false);
    });
  });

  describe('fun( x )', () => {
    it('should throw an expection when the provided parameter is not a Function', () => {
      assert.throws(
        () => {
          TYPES.fun(1.5);
          TYPES.fun(null);
          TYPES.fun(undefined);
          TYPES.fun([]);
          TYPES.fun(new Date());
          TYPES.fun(123e-5);
        },
        /Error: expected FUNCTION but provided/
        );
    });
    it('should pass when the provided parameter is a Function', () => {
      const func = () => {};
      assert.deepEqual(TYPES.fun(func), func);
    });
  });

  describe('date( x )', () => {
    it('should throw an expection when the provided parameter is not a Date', () => {
      assert.throws(
        () => {
          TYPES.date(1.5);
          TYPES.date(null);
          TYPES.date(undefined);
          TYPES.date([]);
          TYPES.date(123e-5);
        },
        /Error: expected DATE but provided/
        );
    });
    it('should pass when the provided parameter is a Date', () => {
      const date = new Date();
      const date2 = new Date('01-01-1999');
      assert.deepEqual(TYPES.date(date), date);
      assert.deepEqual(TYPES.date(date2), date2);
    });
  });

  describe('obj( x )', () => {
    it('should throw an expection when the provided parameter is not an Object', () => {
      assert.throws(
        () => {
          TYPES.obj(1.5);
          TYPES.obj(null);
          TYPES.obj(undefined);
          TYPES.obj([]);
          TYPES.obj(123e-5);
        },
        /Error: expected OBJECT but provided/
        );
    });
    it('should pass when the provided parameter is an Object', () => {
      const obj = {};
      assert.deepEqual(TYPES.obj(obj), obj);
    });
  });

  describe('arr( x )', () => {
    it('should throw an expection when the provided parameter is not an ARRAY', () => {
      assert.throws(
        () => {
          TYPES.arr(1.5);
          TYPES.arr(null);
          TYPES.arr(undefined);
          TYPES.arr(new Date());
          TYPES.arr(123e-5);
        },
        /Error: expected ARRAY but provided/
        );
    });
    it('should pass when the provided parameter is an ARRAY', () => {
      const arr = [1, 2, 3, 4];
      assert.deepEqual(TYPES.arr(arr), arr);
    });
  });

  describe('sym( x )', () => {
    it('should throw an expection when the provided parameter is not a Symbol', () => {
      assert.throws(
        () => {
          TYPES.sym(1.5);
          TYPES.sym(null);
          TYPES.sym(undefined);
          TYPES.sym(new Date());
          TYPES.sym(123e-5);
        },
        /Error: expected SYMBOL but provided/
        );
    });
    it('should pass when the provided parameter is a Symbol', () => {
      const sym = Symbol('foo');
      assert.deepEqual(TYPES.sym(sym), sym);
    });
  });

  describe('regex( x )', () => {
    it('should throw an expection when the provided parameter is not a REGEX', () => {
      assert.throws(
        () => {
          TYPES.regex(1.5);
          TYPES.regex(null);
          TYPES.regex(undefined);
          TYPES.regex(new Date());
          TYPES.regex(123e-5);
        },
        /Error: expected REGEXP but provided/
        );
    });
    it('should pass when the provided parameter is a REGEX', () => {
      const reg = /abc/ig;
      assert.deepEqual(TYPES.regex(reg), reg);
      assert.deepEqual(TYPES.regex(new RegExp('abc')), new RegExp('abc'));
    });
  });

  describe('HTMLNode( x )', () => {
    it('should throw an expection when the provided parameter is not an HTMLNode', () => {
      assert.throws(
        () => {
          TYPES.HTMLNode(1.5);
          TYPES.HTMLNode(null);
          TYPES.HTMLNode(undefined);
          TYPES.HTMLNode(new Date());
          TYPES.HTMLNode(123e-5);
        },
        /Error: expected HTMLNODE but provided/
        );
    });
    it('should pass when the provided parameter is an HTMLNode', () => {
      const node = document.createElement('DIV');
      assert.deepEqual(TYPES.HTMLNode(node), node);
    });
  });

  describe('allowedTypes( ...types )', () => {
    it('should throw an expection when the provided parameter are not the allowed ones', () => {
      const customType = TYPES.allowedTypes('String', 'Date');
      assert.throws(
        () => {
          customType(1.5);
          customType(null);
          customType(undefined);
          customType(new Date());
          customType(123e-5);
        },
        /Error: expected STRING OR DATE but provided/
        );
    });
    it('should pass when the provided parameter is one of the allowed ones', () => {
      const customType = TYPES.allowedTypes('Array', 'Date');
      const date = new Date();
      const arr = [1, 2, 3];
      assert.deepEqual(customType(date), date);
      assert.deepEqual(customType(arr), arr);
    });
  });

});
