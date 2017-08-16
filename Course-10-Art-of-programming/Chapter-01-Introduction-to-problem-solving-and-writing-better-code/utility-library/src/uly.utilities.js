
import { types as TYPES } from './uly.functional';
import ULYF from './uly.functional';

'use strict';

const u = {};
const math = Math;
const mathRound = math.round;
const mathFloor = math.floor;
const mathCeil = math.ceil;
const mathRnd = math.random;

/**
 * Checks if the provided parameter is an Array
 *
 * @param {Array} arr An Array
 *
 * @returns {Boolean} True | False
 *
 */

u.isArray = Array.isArray || function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

/**
 * Checks if the provided parameter is a Function
 *
 * @param {Fun} fn A Function
 *
 * @returns {Boolean} True | False
 *
 */

u.isFunc = fn => typeof fn === 'function';

/**
 * Checks if the provided parameter is a String
 *
 * @param {str} str A String
 *
 * @returns {Boolean} True | False
 *
 */

u.isString = str => typeof str === 'string';

/**
 * Checks if the provided parameter is a Number
 *
 * @param {Number} num A Number
 *
 * @returns {Boolean} True | False
 *
 */

u.isNumber = num => !isNaN(parseFloat(num)) && isFinite(num);

/**
 * Checks if the provided parameter is an Integer
 *
 * @param {Number} num A Number
 *
 * @returns {Boolean} True | False
 *
 */

u.isInt = num => u.isNumber(num) && (parseFloat(num) === parseInt(num, 10));

/**
 * Iterates and calls the callback parameter for each element or property
 * of a list at the interval specified by the n parameter.
 * It does not call callback on values greater than the list’s number
 *
 * @param {Array} list The list of values
 * @param {int} n An interval used as step of the iteration
 * @param {Func} n A callback function applied on the elements within the
 *                 step
 *
 * @returns {void}
 */

u.by = (list, n, callback) => {
  list = TYPES.arr(list);
  callback = TYPES.fun(callback);

  if (ULYF.notExists(n)) {
    n = 1;
  }

  n = TYPES.int(n);

  let len = list.length;
  let i;

  for (i = 0; i < len; i++) {
    if (n <= len && ((i + 1) % n === 0)) {
      callback(list[i], i, list);
    }
  }
};

const _objExtract = (object, value) => {
  object = TYPES.obj(object);
  const list = Object.keys(object);
  return list.map((v) => value === 'value' ? object[v] : v);
};

/**
 * Creates an array of all the keys of an object
 *
 * @param {Object} object The object used as a template
 *
 * @returns {Array} An Array containing all the keys of the provided object
 */

u.keys = object => _objExtract(object, 'key');

/**
 * Creates an array of all the value of an object
 *
 * @param {Object} object The object used as a template
 *
 * @returns {Array} An Array containing all the values of the provided
 *                  object
 */

u.values = object => _objExtract(object, 'value');

/**
 * Creates an array of all keys and values of an object in the order of
 * [key, value, key, value] for as many key/value pairs as exist in the
 * object.
 *
 * @param {Object} object The object used as a template
 *
 * @returns {Array} An Array containing all keys and values pairs of the provided
 *                  object
 * @example pairs({count: 5, length: 10, total: 16});
 * // returns ["count", 5, "length", 10, "total", 16]
 */

u.pairs = function(object) {
  const list = Object.keys(TYPES.obj(object));
  return ULYF.flatten(list.map(v => [v, object[v]]));
};

/**
 * Returns a randomly re-arranged copy of the elements in its parameter
 * array.
 *
 * @param {Array} object The Array used as a template
 * @returns {Array} A randomly re-arranged copy of the original Array
 *
 *  @example var arr = [1,2,3,4,5];
 *           utilities.shuffle(arr);
 *  // will output something like: [2,4,5,3,1]
 */

u.shuffle = function(array) {
  let result = Array.from(TYPES.arr(array));
  for (let i = result.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [result[i - 1], result[j]] = [result[j], result[i - 1]];
  }
  return result;
};

/**
 * Returns the plural of a word depending on the value of the n parameter.
 * If n is 1, return the non-plural word (parameter word);
 * otherwise, add an “s” to the plural word.
 * If the pluralWord parameter is provided, instead of adding an “s,”
 * return the pluralWord.
 *
 * @param {int} n The number of "s"
 * @param {String} word A non-plural word
 * @param {String} pluralWord An optional plural word
 *
 * @returns {String} A pluralized string
 *
 * @example utilities.pluralize(1, "lion");
 *  // returns "lion"
 * @example utilities.pluralize(2, "lion");
 *  // returns "lions"
 * @example utilities.pluralize(5, "lion");
 *  // returns "lions"
 * @example utilities.pluralize(0, "lion");
 *  // returns "lions"
 * @example utilities.pluralize(1, "lioness");
 *  // returns "lioness"
 * @example utilities.pluralize(2, "lioness");
 *  // returns "lionesss"
 * @example utilities.pluralize(2, "lioness", "lionesses);
 *  // "lionesses"
 */

u.pluralize = function(n, word, pluralWord) {
  n = TYPES.int(n);
  word = TYPES.str(word);

  if (pluralWord) { return pluralWord };
  if (n === 1) { return word; }

  return word + 's';
}


/**
 * Converts a camelCase string to a dashed string.
 * Camel case presents words with no spaces separating them and with
 * each word’s first letter capitalized except the first word,
 * which is lower case.
 *
 * @param {string} str A camelCase string
 *
 * @returns {String} A dashed string
 *
 * @example toDash(hotDog), toDash(spaceStationComplex), toDash(myFirstFunction)
 * // returs hot-dog, space-station-complex, my-first-function
 *
 */

u.toDash = function(str) {
  let chars = TYPES.str(str).split('');

  return chars.map(function(item) {
    if (item === item.toUpperCase()) {
      return '-' + item.toLowerCase();
    }
    return item;
  }).join('');
};

/**
 * Converts a dashed string to a camel case string.
 *
 * @param {string} str A dashed string
 *
 * @returns {String} A camelCase string
 *
 * @example toCamel(hot-dog), toCamel(space-station-complex)
 * // returs hotDog, spaceStationComplex
 */

u.toCamel = function(str) {
  let chars = TYPES.str(str).split('-');
  const head = ULYF.head(chars).toLowerCase();

  let remaining = ULYF.tail(chars).map(function(item) {
    return item.charAt(0).toUpperCase() + item.substr(1);
  }).join('');

  return head + remaining;
};

/**
 * Searches all values of the parameter obj and returns “true” if any are
 * equal to the search parameter.
 * Otherwise it returns “false.”
 *
 * @param {Object} obj An object
 * @param {string} search The string you are looking for
 *
 * @returns {Boolean} True | False
 *
 */

u.has = ULYF.maybe(function(object, search) {
  object = TYPES.obj(object);

  for (let prop in object) {
    if (object.hasOwnProperty(prop) && object[prop] === search) {
      return true;
    }
  }

  return false;
});

/**
 * Returns a new object by picking all key/value pairs from the parameter
 * obj.
 * The keys that are picked will be determined by the array parameter keys.
 *
 * @param {Object} obj An object
 * @param {Array} keys A list of keys
 *
 * @returns {Object} An object composed of the provided keys
 *
 *  var data = {
      type: "transformer",
      index: 19,
      siblings: 19,
      access: "full"
    };

  * @example utilities.pick(data, ["type", "index"]);
    // returns {type: "transformer", index: 19};
  * @example utilities.pick(data, ["siblings", "index"]);
    // returns {siblings: 19, index: 19};
  * @example utilities.pick(data, ["access", "animals"]);
    // returns {access: "full"};
 */

u.pick = ULYF.maybe(function(obj, keys) {
  obj  = TYPES.obj(obj);
  keys = TYPES.arr(keys);

  return keys.reduce(function(result, key) {
    if (ULYF.exists(obj[key])) {
      result[key] = obj[key];
    }
    return result;
  }, {});

});

/**
 * Replaces all occurencies of a particular search string with another
 * string
 *
 * @param {String} text A string used as a base for the search
 * @param {String} search A string you are looking for the replace
 * @param {String} replace A string used as replacing
 *
 * @returns {String} A new string with all occurrencies replaced
 *
 */

u.replaceAll = (text, search, replace) => TYPES.str(text)
                                               .split(TYPES.str(search))
                                               .join(TYPES.str(replace));

/**
 * Get a random integer
 * @param  {Number} [max]  The upper limit (defualt 10 - not included)
 * @param  {Number} [min]  The lower limit (default 0 - included)
 * @return {Number}      A random integer from min to max
 */

u.getRandomInt = (max = 10, min = 0) => {
  return mathFloor(mathRnd() * (TYPES.int(max) - TYPES.int(min))) + min;
}

/**
 * Get a random integer (inclusive)
 * @param  {Number} [max]  The upper limit (defualt 10 - included)
 * @param  {Number} [min]  The lower limit (default 0 - included)
 * @return {Number}      A random integer from min to max
 */

u.getIncRandomInt = (max = 10, min = 0) => {
  return mathFloor(mathRnd() * (TYPES.int(max) - TYPES.int(min) + 1)) + min;
}

/**
 * Retrieve the value of a particular cookie through its name
 * @param  {string}   name The cookie's name
 * @return {string || undefined}  Returns the value of the intended cookie
 *                                or undefined
 */

u.getCookie = (name) => {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');

  let cookiesMap = cookies.reduce((map, curr) => {
    const parts = curr.split('=');
    return map.set(parts[0].trim(), parts[1]);
  }, new Map());

  return cookiesMap.get(TYPES.str(name));
};

/*
 * Get an object containing all the existing cookies or a single cookie (if any)
 * @param  {string}   [name] The cookie's name
 * @return {Object}    Return an object containing all cookies, the intended
 *                      cookie (if the name argument has been provided), or
 *                      an empty object
 */

u.getCookies = (name) => {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');

  let cookieObj = cookies.reduce((prev, curr) => {
    const parts = curr.split('=');

    if (name) {
      if (parts[0].trim() === TYPES.str(name)) {
        prev[parts[0].trim()] = parts[1];
      }
    } else {
      prev[parts[0].trim()] = parts[1];
    }
    return prev;
  }, {});

  if (Object.keys(cookieObj).length === 0) {
    return null;
  }

  return cookieObj;
};


const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

/**
 * Generate a random GUID
 * @return {String}
 */
u.generateGUID = () => `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;

/**
 * Given a day number it returns the day name
 *
 * @param      {Number}  dayNumber  The day number
 * @return     {string}  The day name.
 */
u.getDayName = (dayNumber) => {
  let dayName;
  switch (TYPES.int(dayNumber)) {
  case 0:
    dayName = 'Sunday';
    break;
  case 1:
    dayName = 'Monday';
    break;
  case 2:
    dayName = 'Tuesday';
    break;
  case 3:
    dayName = 'Wednesday';
    break;
  case 4:
    dayName = 'Thursday';
    break;
  case 5:
    dayName = 'Friday';
    break;
  case 6:
    dayName = 'Saturday';
    break;
  default:
    dayName = 'Unknown';
  }
  return dayName;
};

// export public functions
export default { ...u };

