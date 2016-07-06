

var Utilities = (function(window){

    var u = {};

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

    u.isFunc = function(fn) {

        return (typeof fn === "function");
    };    

    /**
     * Checks if the provided parameter is a String
     *
     * @param {str} str A String
     * 
     * @returns {Boolean} True | False
     *                  
     */ 

    u.isString = function(str) {

        return (typeof str === "string");
    };

    /**
     * Checks if the provided parameter is a Number
     *
     * @param {Number} num A Number
     * 
     * @returns {Boolean} True | False
     *                  
     */ 

    u.isNumber = function(num) {

        return !isNaN(parseFloat(num)) && isFinite(num);
    };

    /**
     * Checks if the provided parameter is an Integer
     *
     * @param {Number} num A Number
     * 
     * @returns {Boolean} True | False
     *                  
     */ 

    u.isInt = function(num) {

        return parseFloat(num) === parseInt(num, 10);
    };

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

    u.by = function(list, n, callback) {

        if (!u.isArray(list)) return;

        if (!n) n = 1;

        var len = list.length;
        var i;

        for (i = 0; i < len; i++) {
            if (n <= len && u.isFunc(callback) && ((i + 1) % n === 0)) {
                callback(list[i], i, list);
            }
        }
    }

    /**
     * Creates an array of all the keys of an object
     * 
     * @param {Object} object The object used as a template
     * 
     * @returns {Array} An Array containing all the keys of the provided object
     */ 

    u.keys = perhaps(function(object) {

        var result = [];

        if ("hasOwnProperty" in object) {
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    result.push(prop);
                }
            }
        }

        return result;
    });

    /**
     * Creates an array of all the value of an object
     * 
     * @param {Object} object The object used as a template
     * 
     * @returns {Array} An Array containing all the values of the provided 
     *                  object
     */ 

    u.values = perhaps(function(object) {

        var result = [];

        if ("hasOwnProperty" in object) {
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    result.push(object[prop]);
                }
            }
        }

        return result;
    });

    /**
     * Creates an array of all keys and values of an object in the order of
     * [key, value, key, value] for as many key/value pairs as exist in the 
     * object.
     *
     * @param {Object} object The object used as a template
     * 
     * @returns {Array} An Array containing all all keys and values pairs of 
     *                  the provided object
     */ 

    u.pairs = perhaps(function(object) {

        var result = [];

        if ("hasOwnProperty" in object) {
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    result.push(prop);
                    result.push(object[prop]);
                }
            }
        }

        return result;
    });

    /**
     * Returns a randomly re-arranged copy of the elements in its parameter 
     * array.
     *
     * @param {Array} object The Array used as a template
     * 
     * @returns {Array} A randomly re-arranged copy of the original Array
     *                  
     */ 

    u.shuffle = perhaps(function(array) {

        if (!u.isArray(array)) return; 

        var result  = [];
        var len     = array.length;
        var rnd;

        while (len) {
            rnd = getRandom(array.length);
            if (rnd in array) {
                result.push(array[rnd]);
                delete array[rnd];
                len--;
            }
        }

        return result;
    });

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
     */ 

    u.pluralize = perhaps(function(n, word, pluralWord) {

        if (pluralWord) return pluralWord;

        if (n === 1) return word;

        return word + 's';
    });


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
     */ 

    u.toDash = perhaps(function(str) {

        if (!u.isString(str)) return; 

        var chars = str.split('');

        return chars.map(function(item) {

                    if (item === item.toUpperCase()) {
                        return '-' + item.toLowerCase();
                    }

                    return item; 
                }).join('');
    });

    /**
     * Converts a dashed string to a camel case string.  
     *
     * @param {string} str A dashed string 
     * 
     * @returns {String} A camelCase string
     *                  
     */ 

    u.toCamel = perhaps(function(str) {

        if (!u.isString(str)) return; 

        var chars = str.split('-');

        return chars.map(function(item) {
                    return item.charAt(0).toUpperCase() + item.substr(1);
                }).join('');
    });

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

    u.has = perhaps(function(obj, search) {

        if ("hasOwnProperty" in obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (obj[prop] === search) return true;
                }
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
     */ 

    u.pick = perhaps(function(obj, keys) {

        if (!u.isArray(keys)) return; 

        var result = {};

        if ("hasOwnProperty" in obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (keys.indexOf(prop) !== -1) {
                        result[prop] = obj[prop];
                    }
                }
            }
        }

        return result;
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

    u.replaceAll = function(text, search, replace) {
        return text.split(search).join(replace);
    };

    // ****** PRIVATE UTILITY FUNCTIONS ***********

    /**
     * It calls the fn function if and only if the provided parameters 
     * are neither null nor undefined
     * 
     * @param {Object} fn The function that could be applied
     * 
     * @returns {value | void} The evalutation of fn or nothing
     */ 

    function perhaps(fn) {
        return function() {

            var i;
            var len = arguments.length;

            if (arguments.length === 0) {
                return;
            } else {

                for (i = 0; i < len; i++) {
                    if (!arguments[i]) return;
                }

                return fn.apply(this, arguments);
            }
        }
    }

    /**
     * Returns a random integer under an upper limit
     * 
     * @param {int} max The upper limit
     * 
     * @returns {int} A random integer
     */ 

    function getRandom(max) {
        return parseInt(Math.random() * max, 10);
    }


    return u;

})(window);