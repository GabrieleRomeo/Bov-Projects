'use strict';

import 'babel-polyfill';
import v from '../src/uly.validators';

const assert = require('assert');

const dec25_2015 = new Date('12-25-2015');
const oct31_2017 = new Date('10-31-2017');

describe('Validators - V', () => {

  describe('isEmailAddress( input )', () => {
    it('should return false when the provided value is an empty string', () => {
      assert.equal(v.isEmailAddress(''), false);
    });
    it('should throw an expection when the provided value is not a string', () => {
      assert.throws(
        () => {
          v.isEmailAddress(null);
        },
        /Error: expected STRING but provided NULL/
        );
    });
    it('should return false when the provided value is not a valid email', () => {
      assert.equal(v.isEmailAddress('test@bov.'), false);
      assert.equal(v.isEmailAddress('test@'), false);
      assert.equal(v.isEmailAddress('@bov.com'), false);
    });
    it('should pass when the provided value is a valid email', () => {
      assert.equal(v.isEmailAddress('test@bov.com'), true);
      assert.equal(v.isEmailAddress('art@artists.com'), true);
      assert.equal(v.isEmailAddress('test@bov'), true);
    });
  });

  describe('isPhoneNumber( input ) - Italian phone numbers', () => {
    it('should throw an expection when the provided value is an empty string', () => {
      assert.throws(
        () => {
          v.isPhoneNumber('');
        },
        /Invalid Phone Number/
      );
    });
    it('should throw an expection when the provided value is not a string', () => {
      assert.throws(
        () => {
          v.isPhoneNumber(null);
        },
        /Error: expected STRING but provided NULL/
      );
    });
    it('should throw an expection when the provided value does not contain a prefix', () => {
      assert.throws(
        () => {
          v.isPhoneNumber('33321');
        },
        /Invalid Phone Number/
      );
    });
    it('should throw an expection when the provided prefix is not the dash character (-)', () => {
      assert.throws(
        () => {
          v.isPhoneNumber('348/1234567');
        },
        /Invalid Phone Number/
      );
    });
    it('should throw an expection when the Italian country code is wrong', () => {
      assert.throws(
        () => {
          v.isPhoneNumber('+40348-1234567');
        },
        /Invalid country code/
      );
    });
    it('should pass when the Italian country code is correct', () => {
      assert.equal(v.isPhoneNumber('+39348-1234567'), true);
    });
    it('should throw an expection when the Internationl prefix is wrong', () => {
      assert.throws(
        () => {
          v.isPhoneNumber('00348-1234567');
        },
        /Invalid International prefix/
      );
    });
    it('should pass when the International prefix is correct', () => {
      assert.equal(v.isPhoneNumber('0039348-1234567'), true);
    });
    it('should pass when the provided value is a valid italian mobile phone number', () => {
      assert.equal(v.isPhoneNumber('348-1234567'), true);
    });
    it('should pass when the provided value is a valid italian landline phone number', () => {
      assert.equal(v.isPhoneNumber('011-1234567'), true);
    });
    it('should return false when the provided value contains an unknown distrectual prefix', () => {
      assert.equal(v.isPhoneNumber('0111-1234567'), false);
    });
    it('should pass when the provided value is an Emergency number', () => {
      assert.equal(v.isPhoneNumber('118'), true);
    });
  });

  describe('withoutSymbols( input )', () => {
    it('should return false when the provided value is an empty string', () => {
      assert.equal(v.withoutSymbols(''), false);
    });
    it('should throw an expection when the provided value is not a string', () => {
      assert.throws(
        () => {
          v.withoutSymbols(undefined);
        },
        /Error: expected STRING but provided UNDEFINED/
        );
    });
    it('should remove all symbols', () => {
      assert.deepEqual(
        v.withoutSymbols('"Hi, john.doe@live.com., is that you?/"'),
        'Hi johndoelivecom is that you');
    });
  });

  describe('isDate( input )', () => {
    it('should return false when the provided value is an empty string', () => {
      assert.equal(v.isDate(''), false);
    });
    it('should throw an expection when the provided value is not a string', () => {
      assert.throws(
        () => {
          v.isDate(undefined);
        },
        /Error: expected STRING OR DATE but provided UNDEFINED/
        );
    });
    it('should return false when the provided value is not a valid date', () => {
      assert.equal(v.isDate('test'), false);
    });
    it('should pass when the provided value is a valid date', () => {
      assert.equal(v.isDate('12-25-2017'), true);
    });
  });

  describe('isBeforeDate( input, reference )', () => {
    it('should throw an exception when the provided value is an empty string', () => {
      assert.throws(
        () => {
          v.isBeforeDate('');
        },
        /Error: expected STRING OR DATE but provided/
        );
    });
    it('should throw an expection when the provided values are neither strings nor Dates', () => {
      assert.throws(
        () => {
          v.isBeforeDate(undefined, null);
        },
        /Error: expected STRING OR DATE but provided/
        );
    });
    it('should throw an expection when the first parameter is not a valid date', () => {
      assert.throws(
        () => {
          v.isBeforeDate('test', dec25_2015);
        },
        /Invalid Date/
        );
    });
    it('should throw an expection when the second parameter is not a valid date', () => {
      assert.throws(
        () => {
          v.isBeforeDate(dec25_2015, 'test');
        },
        /Invalid Date/
        );
    });
    it('should pass when the first date comes before the second date', () => {
      assert.equal(v.isBeforeDate('10-10-2016', '10-12-2016'), true);
    });
    it('should return false if the first date doesn\'t come before the second date', () => {
      assert.equal(v.isBeforeDate('10-10-2016', '01-12-2015'), false);
    });
    it('should pass when the first date comes before the second date', () => {
      assert.equal(v.isBeforeDate(dec25_2015, oct31_2017), true);
    });
  });

  describe('isAfterDate( input, reference )', () => {
    it('should throw an exception when the provided value is an empty string', () => {
      assert.throws(
        () => {
          v.isAfterDate('');
        },
        /Error: expected STRING OR DATE but provided/
        );
    });
    it('should throw an expection when the provided values are neither strings nor Dates', () => {
      assert.throws(
        () => {
          v.isAfterDate(undefined, null);
        },
        /Error: expected STRING OR DATE but provided/
        );
    });
    it('should throw an expection when the first parameter is not a valid date', () => {
      assert.throws(
        () => {
          v.isAfterDate('test', dec25_2015);
        },
        /Invalid Date/
        );
    });
    it('should throw an expection when the second parameter is not a valid date', () => {
      assert.throws(
        () => {
          v.isAfterDate(dec25_2015, 'test');
        },
        /Invalid Date/
        );
    });
    it('should pass when the first date comes after the second date', () => {
      assert.equal(v.isAfterDate('10-10-2018', '10-12-2016'), true);
    });
    it('should return false if the first date doesn\'t come after the second date', () => {
      assert.equal(v.isAfterDate('01-01-2000', '01-12-2015'), false);
    });
    it('should pass when the first date comes after the second date', () => {
      assert.equal(v.isAfterDate(oct31_2017, dec25_2015), true);
    });
  });

  describe('isBeforeToday( input )', () => {
    it('should throw an exception when the provided value is an empty string', () => {
      assert.throws(
        () => {
          v.isBeforeToday('');
        },
        /Invalid Date/
        );
    });
    it('should throw an expection when the provided values are neither strings nor Dates', () => {
      assert.throws(
        () => {
          v.isBeforeToday(null);
        },
        /Error: expected STRING OR DATE but provided/
        );
    });
    it('should throw an expection when the passed parameter is not a valid date', () => {
      assert.throws(
        () => {
          v.isBeforeToday('test');
          v.isBeforeToday('1234');
        },
        /Invalid Date/
        );
    });
    it('should pass when the provided date comes before today', () => {
      assert.equal(v.isBeforeToday('10-10-2016'), true);
    });
    it('should return false when the provided date doesn\'t come before today', () => {
      assert.equal(v.isBeforeToday('10-10-2200'), false);
    });
  });

  describe('isAfterToday( input )', () => {
    it('should throw an exception when the provided value is an empty string', () => {
      assert.throws(
        () => {
          v.isAfterToday('');
        },
        /Invalid Date/
        );
    });
    it('should throw an expection when the provided values are neither strings nor Dates', () => {
      assert.throws(
        () => {
          v.isAfterToday(null);
        },
        /Error: expected STRING OR DATE but provided/
        );
    });
    it('should throw an expection when the passed parameter is not a valid date', () => {
      assert.throws(
        () => {
          v.isAfterToday('test');
        },
        /Invalid Date/
        );
    });
    it('should pass when the provided date comes after today', () => {
      assert.equal(v.isAfterToday('10-10-2200'), true);
    });
    it('should return false when the provided date doesn\'t come after today', () => {
      assert.equal(v.isAfterToday('10-10-1999'), false);
    });
  });

  describe('isEmpty( input )', () => {
    it('should pass when the provided value is an empty string', () => {
      assert.equal(v.isEmpty(''), true);
      assert.equal(v.isEmpty(' '), true);
      assert.equal(v.isEmpty('  '), true);
      assert.equal(v.isEmpty('      '), true);
    });
    it('should return false when the provided value is not an empty string', () => {
      assert.equal(v.isEmpty(null), false);
      assert.equal(v.isEmpty(undefined), false);
      assert.equal(v.isEmpty('test'), false);
    });
  });

  describe('contains( input, words )', () => {
    it('should throw an exception when the provided input is not a string', () => {
      assert.throws(
        () => {
          v.contains(null, []);
          v.contains(123, []);
          v.contains([], []);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should throw an exception when words is not an Array', () => {
      assert.throws(
        () => {
          v.contains('', '');
          v.contains('', null);
          v.contains('', undefined);
        },
        /Error: expected ARRAY but provided/
        );
    });
    it('should pass when the input contains one or more of the words', () => {
      assert.equal(v.contains('Visiting new places is fun.', ['new', 'place']), true);
      assert.equal(v.contains('Visiting new places is fun.', ['visiting', 'is']), true);
    });
    it('should return false when the input does not contain a word', () => {
      assert.equal(v.contains('Visiting new places is fun.', ['coconut']), false);
      assert.equal(v.contains('Visiting new places is fun.', ['well', 'true']), false);
    });
  });

  describe('lacks( input, words )', () => {
    it('should throw an exception when the provided input is not a string', () => {
      assert.throws(
        () => {
          v.lacks(null, []);
          v.lacks(123, []);
          v.lacks([], []);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should throw an exception when words is not an Array', () => {
      assert.throws(
        () => {
          v.lacks('', '');
          v.lacks('', null);
          v.lacks('', undefined);
        },
        /Error: expected ARRAY but provided/
        );
    });
    it('should return false when the input contains any of the words', () => {
      assert.equal(v.lacks('Visiting new places is fun.', ['new']), false);
      assert.equal(v.lacks('Visiting new places is fun.', ['Italy', 'is']), false);
    });
    it('should pass when input does not contain any of the words', () => {
      assert.equal(v.lacks('Visiting new places is fun.', ['coconut']), true);
      assert.equal(v.lacks('Visiting new places is fun.', ['well', 'true']), true);
    });
  });

  describe('isComposedOf( input, strings )', () => {
    it('should throw an exception when the provided input is not a string', () => {
      assert.throws(
        () => {
          v.isComposedOf(null, []);
          v.isComposedOf(123, []);
          v.isComposedOf([], []);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should throw an exception when strings is not an Array', () => {
      assert.throws(
        () => {
          v.isComposedOf('', '');
          v.isComposedOf('', null);
          v.isComposedOf('', undefined);
        },
        /Error: expected ARRAY but provided/
        );
    });
    it('should return false when the input text parameter doesn\'t contain only strings found within the strings array', () => {
      assert.equal(v.isComposedOf('10184', ['1', '0', '8']), false);
      assert.equal(v.isComposedOf('abc', ['1', '0', '8']), false);
      assert.equal(v.isComposedOf('abc', ['a', 'c', '1', true, false]), false);
      assert.equal(v.isComposedOf('10184', []), false);
    });
    it('should pass when the input text parameter contains only strings found within the strings array', () => {
      assert.equal(v.isComposedOf('10184', ['1', '2', '3', '4', '5', '6' ,'7', '8', '9', '0']), true);
      assert.equal(v.isComposedOf('I am ready', ['I', 'I\'m', 'am', 'not', 'ready']), true);
      assert.equal(v.isComposedOf('Iamnotready', ['I', 'I\'m', 'am', 'not', 'ready']), true);
    });
  });

  describe('isLength( input, n )', () => {
    it('should throw an exception when the provided input is not a string', () => {
      assert.throws(
        () => {
          v.isLength(123, 2);
          v.isLength(null, 2);
          v.isLength(undefined, 2);
          v.isLength([], 2);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should throw an exception when the n parameter is not an Integer', () => {
      assert.throws(
        () => {
          v.isLength('abc', '2');
          v.isLength('abc', []);
          v.isLength('abc', null);
          v.isLength('abc', undefined);
          v.isLength('abc', 2.3);
        },
        /Error: expected INTEGER but provided/
        );
    });
    it('should return false when the input parameter is greater than n', () => {
      assert.equal(v.isLength('abc', 0), false);
      assert.equal(v.isLength('abc', 1), false);
      assert.equal(v.isLength('abc', 2), false);
    });
    it('should pass when the input parameter\'s character count is less than or equal to the n parameter.', () => {
      assert.equal(v.isLength('123456789', 20), true);
      assert.equal(v.isLength('abc', 3), true);
      assert.equal(v.isLength('AHHHH', 25), true);
      assert.equal(v.isLength('This could be a tweet!', 140), true);
    });
  });

  describe('isOfLength( input, n )', () => {
    it('should throw an exception when the provided input is not a string', () => {
      assert.throws(
        () => {
          v.isOfLength(123, 2);
          v.isOfLength(null, 2);
          v.isOfLength(undefined, 2);
          v.isOfLength([], 2);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should throw an exception when the n parameter is not an Integer', () => {
      assert.throws(
        () => {
          v.isOfLength('abc', '2');
          v.isOfLength('abc', []);
          v.isOfLength('abc', null);
          v.isOfLength('abc', undefined);
          v.isOfLength('abc', 2.3);
        },
        /Error: expected INTEGER but provided/
        );
    });
    it('should return false when the input parameter is lesser than n', () => {
      assert.equal(v.isOfLength('abc', 10), false);
      assert.equal(v.isOfLength('abc', 5), false);
      assert.equal(v.isOfLength('abc', 4), false);
    });
    it('should pass when the input parameter\'s character count is greater than or equal to the n parameter.', () => {
      assert.equal(v.isOfLength('123456789', 6), true);
      assert.equal(v.isOfLength('abc', 2), true);
      assert.equal(v.isOfLength('AHHHH', 3), true);
      assert.equal(v.isOfLength('This could be a tweet!', 10), true);
    });
  });

  describe('countWords( input )', () => {
    it('should throw an exception when the provided input is not a string', () => {
      assert.throws(
        () => {
          v.countWords(123, 2);
          v.countWords(null, 2);
          v.countWords(undefined, 2);
          v.countWords([], 2);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should return the number of words in the input parameter.', () => {
      assert.equal(v.countWords('Hello.'), 1);
      assert.equal(v.countWords('Hard-to-type-really-fast!'), 5);
      assert.equal(v.countWords(''), 0);
      assert.equal(v.countWords('supercalifragilisticexpialidocious'), 1);
    });
  });

  describe('lessWordsThan( input, n )', () => {
    it('should throw an exception when the provided input is not a string', () => {
      assert.throws(
        () => {
          v.lessWordsThan(123, 2);
          v.lessWordsThan(null, 2);
          v.lessWordsThan(undefined, 2);
          v.lessWordsThan([], 2);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should throw an exception when the provided n parameter is not an Integer', () => {
      assert.throws(
        () => {
          v.lessWordsThan('abc', '2');
          v.lessWordsThan('abc', null);
          v.lessWordsThan('abc', undefined);
        },
        /Error: expected INTEGER but provided/
        );
    });
    it('should pass when the input parameter has a word count less than or equal to the n parameter', () => {
      assert.equal(v.lessWordsThan('Hello.', 1), true);
      assert.equal(v.lessWordsThan('Hard-to-type-really-fast!', 8), true);
      assert.equal(v.lessWordsThan('', 0), true);
      assert.equal(v.lessWordsThan('supercalifragilisticexpialidocious', 2), true);
    });
    it('should return false when the input parameter doesn\'t have a word count less than or equal to the n parameter', () => {
      assert.equal(v.lessWordsThan('Hello.', 0), false);
      assert.equal(v.lessWordsThan('Hard-to-type-really-fast!', 3), false);
      assert.equal(v.lessWordsThan('supercalifragilisticexpialidocious', 0), false);
    });
  });

  describe('moreWordsThan( input, n )', () => {
    it('should throw an exception when the provided input is not a string', () => {
      assert.throws(
        () => {
          v.moreWordsThan(123, 2);
          v.moreWordsThan(null, 2);
          v.moreWordsThan(undefined, 2);
          v.moreWordsThan([], 2);
        },
        /Error: expected STRING but provided/
        );
    });
    it('should throw an exception when the provided n parameter is not an Integer', () => {
      assert.throws(
        () => {
          v.moreWordsThan('abc', '2');
          v.moreWordsThan('abc', null);
          v.moreWordsThan('abc', undefined);
        },
        /Error: expected INTEGER but provided/
        );
    });
    it('should pass when the input parameter has a word count greater than or equal to the n parameter', () => {
      assert.equal(v.moreWordsThan('Hello.', 1), true);
      assert.equal(v.moreWordsThan('Hard-to-type-really-fast!', 4), true);
      assert.equal(v.moreWordsThan('', 0), true);
      assert.equal(v.moreWordsThan('supercalifragilisticexpialidocious', 0), true);
    });
    it('should return false when the input parameter doesn\'t have a word count greater than or equal to the n parameter', () => {
      assert.equal(v.moreWordsThan('Hello.', 2), false);
      assert.equal(v.moreWordsThan('Hard-to-type-really-fast!', 8), false);
      assert.equal(v.moreWordsThan('supercalifragilisticexpialidocious', 5), false);
    });
  });

  describe('isBetween( input, floor, ceil )', () => {
    it('should throw an exception when the provided input is neither a Number nor a String', () => {
      assert.throws(
        () => {
          v.isBetween(new Date(), 2, 2);
          v.isBetween(null, 2, 2);
          v.isBetween(undefined, 2, 2);
          v.isBetween([], 2, 2);
        },
        /Error: expected STRING OR NUMBER/
        );
    });
    it('should throw an exception when the provided floor parameter is neither a Number nor a String', () => {
      assert.throws(
        () => {
          v.isBetween('abc', new Date(), 2);
          v.isBetween('abc', null, 2);
          v.isBetween('abc', undefined, 2);
        },
        /Error: expected STRING OR NUMBER/
        );
    });
    it('should throw an exception when the provided ceil parameter is neither a Number nor a String', () => {
      assert.throws(
        () => {
          v.isBetween('abc', 2, null);
          v.isBetween('abc', 2, []);
          v.isBetween('abc', 2, undefined);
        },
        /Error: expected STRING OR NUMBER/
        );
    });
    it('should pass when the input parameter is greater than or equal to the floor parameter and it is less than or equal to the ceil parameter', () => {
      assert.equal(v.isBetween(2, 2, 3), true);
      assert.equal(v.isBetween(3, 2, 4.5), true);
      assert.equal(v.isBetween(101, 50, 200), true);
      assert.equal(v.isBetween(3.4, 2, 3.5), true);
    });
    it('should return false when the input parameter is neither greater than or equal to the floor parameter nor less than or equal to the ceil parameter', () => {
      assert.equal(v.isBetween(4, 2, 3), false);
      assert.equal(v.isBetween(1.5, 2, 4.5), false);
      assert.equal(v.isBetween(49, 50, 200), false);
      assert.equal(v.isBetween(10, 2, 3.5), false);
    });
  });

  describe('isAlphanumeric( input )', () => {
    it('should throw an exception when the provided input is not a String or a Number', () => {
      assert.throws(
        () => {
          v.isAlphanumeric(new Date());
          v.isAlphanumeric(null);
          v.isAlphanumeric(undefined);
          v.isAlphanumeric([]);
        },
        /Error: expected STRING OR INTEGER/
        );
    });
    it('should pass when the input parameter is only composed of the following characters: a—z, A—Z, or 0—9', () => {
      assert.equal(v.isAlphanumeric('Hello'), true);
      assert.equal(v.isAlphanumeric(123), true);
      assert.equal(v.isAlphanumeric('abc12s'), true);
      assert.equal(v.isAlphanumeric('supercalifragilisticexpialidocious'), true);
    });
    it('should return false when the input parameter isn\'t composed only of the following characters: a—z, A—Z, or 0—9', () => {
      assert.equal(v.isAlphanumeric('Hello&'), false);
      assert.equal(v.isAlphanumeric('ArTᴉ$ʰARd'), false);
      assert.equal(v.isAlphanumeric('Car.'), false);
    });
  });

  describe('isCreditCard( input )', () => {
    it('should throw an exception when the provided input is not a String', () => {
      assert.throws(
        () => {
          v.isCreditCard(new Date());
          v.isCreditCard(null);
          v.isCreditCard(undefined);
          v.isCreditCard([]);
        },
        /Error: expected STRING/
        );
    });
    it('should pass when the input parameter is a credit card or bank card number', () => {
      assert.equal(v.isCreditCard('1234-5678-9101-1121'), true);
      assert.equal(v.isCreditCard('1234567891011121'), true);
      assert.equal(v.isCreditCard('4427A693CF324D14'), true);
      assert.equal(v.isCreditCard('4427-A693-CF32-4D14'), true);
    });
    it('should return false when the input parameter is not a credit card or bank card number', () => {
      assert.equal(v.isCreditCard('-----'), false);
      assert.equal(v.isCreditCard('442/7A693/CF324D14'), false);
      assert.equal(v.isCreditCard('4427---A693-CF32-4D14'), false);
    });
  });

  describe('isHex( input )', () => {
    it('should throw an exception when the provided input is not a String', () => {
      assert.throws(
        () => {
          v.isHex(new Date());
          v.isHex(null);
          v.isHex(undefined);
          v.isHex([]);
        },
        /Error: expected STRING/
        );
    });
    it('should pass when the input parameter is a hexadecimal color', () => {
      assert.equal(v.isHex('#abcdef'), true);
      assert.equal(v.isHex('#bbb'), true);
      assert.equal(v.isHex('#1234a6'), true);
    });
    it('should return false when the input parameter is not a hexadecimal color', () => {
      assert.equal(v.isHex('-----'), false);
      assert.equal(v.isHex('#1234a68'), false);
      assert.equal(v.isHex('cc4488'), false);
    });
  });

  describe('isRGB( input )', () => {
    it('should throw an exception when the provided input is not a String', () => {
      assert.throws(
        () => {
          v.isRGB(new Date());
          v.isRGB(null);
          v.isRGB(undefined);
          v.isRGB([]);
        },
        /Error: expected STRING/
        );
    });
    it('should pass when the input parameter is an RGB color, such as rgb(200, 26, 131)', () => {
      assert.equal(v.isRGB('rgb(0,0,0)'), true);
      assert.equal(v.isRGB('rgb(0, 0, 0)'), true);
      assert.equal(v.isRGB('rgb(255, 255, 112)'), true);
    });
    it('should return false when the input parameter is not an RGB color', () => {
      assert.equal(v.isRGB('rgba(0,0,0, 0)'), false);
      assert.equal(v.isRGB('rgb(0,300,0)'), false);
      assert.equal(v.isRGB('rgb(0,-14,0)'), false);
    });
  });

  describe('isHSL( input )', () => {
    it('should throw an exception when the provided input is not a String', () => {
      assert.throws(
        () => {
          v.isHSL(new Date());
          v.isHSL(null);
          v.isHSL(undefined);
          v.isHSL([]);
        },
        /Error: expected STRING/
        );
    });
    it('should pass when the input parameter an HSL color, such as hsl(122, 1, 1)', () => {
      assert.equal(v.isHSL('hsl(122, 1, 1)'), true);
      assert.equal(v.isHSL('hsl(0, 0.5, 1)'), true);
      assert.equal(v.isHSL('hsl(360, 0, 0)'), true);
    });
    it('should return false when the input parameter is not an HSL color', () => {
      assert.equal(v.isHSL('hsl(361, 1, 1)'), false);
      assert.equal(v.isHSL('hsl(40, 2, 1)'), false);
      assert.equal(v.isHSL('hsl(null)'), false);
      assert.equal(v.isHSL('hsl(false)'), false);
      assert.equal(v.isHSL('hsl([false])'), false);
    });
  });

  describe('isColor( input )', () => {
    it('should throw an exception when the provided input is not a String', () => {
      assert.throws(
        () => {
          v.isColor(new Date());
          v.isColor(null);
          v.isColor(undefined);
          v.isColor([]);
        },
        /Error: expected STRING/
        );
    });
    it('should pass when the input parameter is a hex, RGB, or HSL color type', () => {
      assert.equal(v.isColor('#ccccff'), true);
      assert.equal(v.isColor('rgb(255,255,200)'), true);
      assert.equal(v.isColor('#363'), true);
      assert.equal(v.isColor('hsl(90, 0.55, 0.44)'), true);
    });
    it('should return false when the input parameter is not a hex, RGB, or HSL color type', () => {
      assert.equal(v.isColor('rgb(0, 0, 0, 0)'), false);
      assert.equal(v.isColor('hla(255,255,255)'), false);
      assert.equal(v.isColor('abc345'), false);
      assert.equal(v.isColor('hsl(false)'), false);
      assert.equal(v.isColor('hsl([false])'), false);
    });
  });

  describe('isTrimmed( input )', () => {
    it('should throw an exception when the provided input is not a String', () => {
      assert.throws(
        () => {
          v.isTrimmed(new Date());
          v.isTrimmed(null);
          v.isTrimmed(undefined);
          v.isTrimmed([]);
        },
        /Error: expected STRING/
        );
    });
    it('should pass when the input parameter has not leading or trailing whitespaces or too many spaces between words', () => {
      assert.equal(v.isTrimmed('harmony and irony'), true);
      assert.equal(v.isTrimmed('today is a beautiful day'), true);
      assert.equal(v.isTrimmed('Enjoy your life'), true);
    });
    it('should return false when the input parameter contains leading or trailing whitespaces or too many spaces between words', () => {
      assert.equal(v.isTrimmed('   harmony and irony'), false);
      assert.equal(v.isTrimmed('harmony and irony      '), false);
      assert.equal(v.isTrimmed('harmony  and  irony'), false);
    });
  });

});
