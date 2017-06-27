import functional from './uly.functional';

'use strict';

  /**********************************************************************
   *
   *                     Default Type safety
   *
   * Using the typeOf function through the API, a user can define his/her
   * data types
   **********************************************************************/

  // Primitives
const str  = typeOf('string'),
      num  = typeOf('number'),
      func = typeOf('function'),
      bool = typeOf('boolean');

// Object data type
const date = typeOf('Date'),
      obj  = typeOf('Object'),
      arr  = typeOf('Array');


const types = {
  str,
  num,
  bool,
  func,
  date,
  obj,
  arr,
};

/*
 * Gets a data type and returns a function that, when applied, checks if
 * the provide value is of the intended data type
 */

function typeOf(type) {
  return function(x) {
    const expected = type.toLowerCase();
    const provided = classOf(x);

    if (_toLower.call(classOf(x)) === type) {
      return x;
    } else {
      throw new TypeError(`
        Error: expected ${expected} but provided ${provided}`
        );
    }
  };
}

/**
 * Provides the actual Type of the provided object
 *
 * @param      {<type>}  obj     The object under test
 * @return     {string}  The datatype's name
 */
const classOf = function(obj) {
  if ( obj === null ) { return 'Null'; }
  if ( obj === undefined ) { return 'Undefined'; }
  return Object.prototype.toString.call(obj).slice(8, -1);
};


const exists = x => classOf(x) !== 'Null' && classOf(x) !== 'Undefined';
const notExists = x => !exists(x);



export default {
  types: { ...types },
  classOf,
  exists,
  notExists
};