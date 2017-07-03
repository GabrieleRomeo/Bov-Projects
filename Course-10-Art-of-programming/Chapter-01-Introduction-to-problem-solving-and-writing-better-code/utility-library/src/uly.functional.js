'use strict';

const f = {};

/**********************************************************************
 *
 *                     Default Type safety
 *
 * Using the typeOf function through the API, a user can define his/her
 * data types
 **********************************************************************/

  // Primitives
const str  = typeOf('string');
const num  = typeOf('number');
const int  = typeOf('integer');
const fun  = typeOf('function');
const bool = typeOf('boolean');

// Object data type
const date = typeOf('Date');
const obj = typeOf('Object');
const arr = typeOf('Array');
const sym = typeOf('Symbol');
const regex = typeOf('RegExp');
const HTMLNode = typeOf('HtmlNode');

// Custom data type
const allowedTypes = (...types) => typeOf(types);

export const types = {
  str,
  num,
  int,
  bool,
  fun,
  date,
  obj,
  arr,
  sym,
  regex,
  HTMLNode,
  allowedTypes,
};


/******************************************************************************
 *                        Functional Library Unit
 * [Category Theory]
 *
 *  Categories ---> Sets composed from elements of the same types
 *  Morphisms  ---> Pure functions that, given a set of specific inputs,
 *                  they always return the same output
 *
 *  Functions:   1) Homomorphic - if limited to a single category
 *               2) Polymorphic - if can operate on multiple categories
 ******************************************************************************/


/**
 * Takes a Function with {N} parameters and splits it in a series of
 * functions each taking a single argument. It allows you to provide an
 * optional parameter 'n' which sets the function's arity.
 *
 * @param {Function} fn A function to be curried
 * @param {Integer}   n An optional integer representing the arity of the
 *                      fn function
 *
 * @returns {Function} It returns a series of functions each taking a
 *                     single argument.
 *
 */

f.curry = function(fn, n) {
  const arity = n || fn.length;

  return function curried(...args) {
    const context = this;

    return  args.length >= arity    ?
            fn.apply(context, args) :
            function() {
              let remain = f.toArray(arguments);
              return curried.apply(this, args.concat(remain));
            };
  };
};

/**
 * Takes a Function with {N} parameters and splits it in a series of
 * functions each taking a single argument. It allows you to provide an
 * optional parameter 'n' which sets the function's arity. Unlike curry,
 * rcurry curries a function's arguments from right to left.
 *
 * @param {Function} fn A function to be curried
 * @param {Integer}   n An optional integer representing the arity of the
 *                      fn function
 *
 * @returns {Function} It returns a series of functions each taking a
 *                     single argument.
 *
 */

f.rcurry = (fn, n) => f.curry(f.flip(fn), n);

///////////////////////// FUNCTORS /////////////////////////

// map :: (a -> b) -> [a] -> [b]
f.map = (fn, a) => arr(a).map(fun(fn));

// arrayOf :: (a -> b) -> ([a] -> [b])
f.arrayOf = (fn) => (a) => f.map(fun(fn), arr(a));

f.compose = (...args) => {
  // Checks that all the arguments are functions
  let funcs = f.arrayOf(fun)(args);

  // returns a function that applies all the provided functions
  return function(...argsOfFuncs) {
    let i = funcs.length - 1;
    let fn;

    do {
      fn = f.curry.call(this, funcs[i]);
      argsOfFuncs = [fn.apply(this, argsOfFuncs)];
      i--;
    } while(i >= 0);

    return argsOfFuncs[0];
  };
};

// toArray :: a -> [a]
f.toArray = (...a) => a;

// flip :: Function -> Function
f.flip = (fn) => (...args) => fn.apply(this, args.reverse());

// rcompose :: Function -> Function
f.rcompose = f.flip(f.compose);

// toLower :: String -> String
f.toLower = (s) => s.toLowerCase();

// toUpper :: String -> String
f.toUpper = (s) => s.toUpperCase();

// capitalize :: String -> String
f.capitalize = (s) => {
  const a = f.toArray(s);
  return f.toUpper(a[0]) + a.slice(1).join('');
};

f.unary = (fn) => {
  fn.length === 1
    ? fn
    : (arg) => fn(arg);
};

f.once = (fn) => {
  let done = false;
  return function() {
    return done ? undefined : ((done = true), fn.apply(this, arguments));
  };
};

// getWith :: String -> String
f.getWith = property => object => object[property];

f.forEachObject = (obj, fn) => {
  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      // calls the fn function with key and value as its arguments
      fn(property, obj[property]);
    }
  }
};

f.unless = (predicate, fn) => {
  if (!predicate) { fn(); }
};

// head :: Array -> Value
f.head = (a) => arr(a)[0];

// tail :: Array :: Integer -> Array
f.tail = (a, begin = 1) => arr(a).slice(int(begin), a.length);

f.sortBy = (property) => {
  return (a, b) => {
    let r = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return r;
  };
};

f.flatten = (array) => {
  let results = [];
  for (const value of array) {
    results.push.apply(results, value);
  }
  return results;
};

f.zip = (leftArray, rightArray, fn) => {
  let result = [];
  let leftLength = leftArray.length;
  let rightLength = rightArray.length;

  for (let i = 0; i < Math.min(leftLength, rightLength); i++) {
    result.push(fn(leftArray[i], rightArray[i]));
  }
  return result;
};

f.times = (times, fn) => {
  for ( let i=0; i < times; i++ ) {
    fn(i);
  }
};

f.memoized = (fn) => {
  const lookupTable = {};
  return arg => lookupTable[arg] || (lookupTable[arg] = fn(arg));
};

// not :: bool -> bool
f.not = (x) => !bool(x);

/*
 * Given a data type, it returns a function that, when applied, checks if
 * the provide value is of the intended data type
 */

function typeOf(types) {
  return function(x) {
    const HTMLTest = /HTML.*Element/i;
    const INTEGERTest = /^[0-9]*$/g;
    const expected = [].concat(types).map(f.capitalize);
    const provided = f.capitalize(f.classOf(x));

    if (expected.includes('HTMLNODE') && HTMLTest.test(provided) ||
        expected.includes('INTEGER') && f.classOf(x) === 'Number' &&  INTEGERTest.test(x) ||
        expected.includes(provided)) {
      return x;
    } else {
      throw new TypeError(`
        Error: expected ${expected.join(' OR ')} but provided ${provided}
        `);
    }
  };
}

/**
 * It calls the 'fn' function if and only if the provided parameters
 * are neither null nor undefined
 *
 * @param {Object} fn The function that could be applied
 *
 * @returns {value | void 0} The fn's evalutation or undefined
 */

f.maybe = (fn)  => {
  return function() {

    var i,
      len = arguments.length;

    if (len === 0) {
      return void 0;
    } else {

      for (i = 0; i < len; i++) {
        if (!arguments[i]) return void 0;
      }
      // If all the parameters were provided to the original function,
      // applies it
      return fn.apply(this, arguments);
    }
  };
};

/**
 * Provides the actual Type of the provided value
 *
 * @param      {value}  value  The value under test
 * @return     {string}  The datatype's name
 */
f.classOf = (value) => {
  if ( value === null ) { return 'Null'; }
  if ( value === undefined ) { return 'Undefined'; }
  return Object.prototype.toString.call(value).slice(8, -1);
};

/**
 * Check if the provided value is neither Null nor Undefined
 *
 * @param   {value}  x    The value under test
 * @return  {boolean}
 */
f.exists = x => f.classOf(x) !== 'Null' && f.classOf(x) !== 'Undefined';

/**
 * Check if the provided value is neither Null nor Undefined
 *
 * @param   {value}  x    The value under test
 * @return  {boolean}
 */
f.notExists = x => !f.exists(x);

/**
 * Check if an object contains a key
 *
 * @param   {Object}  object    The Object under test
 * @param   {String}  x    The value under test
 * @return  {String| Undefined}
 */
f.contains = (object, x) => f.exists(obj(object)[x]);

export default { ...f };
