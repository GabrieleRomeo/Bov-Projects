'use strict';

document.addEventListener('DOMContentLoaded', function () {

(function() {
    var resultInput     = document.getElementById('result');
    var numbersLayer    = document.getElementById('numbers');
    var controlsLayer   = document.getElementById('controls');
    var numberButtons   = numbersLayer.childNodes;
    var controlButtons  = controlsLayer.childNodes;

    var del = document.getElementById('del'),
        clr = document.getElementById('clear'),
        eql = document.getElementById('equal'),
        com = document.getElementById('comma');

    var result = '';

    // Event Listeners DEL, CLEAR, EQUAL, COMMA
    del.addEventListener('click', function(event) {
        updateResult('');
    })

    clr.addEventListener('click', function(event) {
        updateResult(result.substr(0, result.length - 1), "clear");
    })

    eql.addEventListener('click', function(event) {

        var partial;

        if (isLastCharNum()) {
            partial = (function() { return eval(result).toString() ; })();
            updateResult(partial, "=");
        }

    })

    com.addEventListener('click', function(event) {

        /* 
         * Skip if:
         * - The last char is not a number 
         * - The current result is already a decimal number
         * - The current result contains only 0
         */
        if (!isLastCharNum()   || 
             isDecimal(result) || result.split(0).join(' ').trim() === '') {
          return;
        } 

        result += '.';
        resultInput.value = result;

    })

    // Event Listeners Numbers 0 - 9
    Object.keys(numberButtons).map(function(item) {

        if (!isNaN(numberButtons[item].id)) {
          numberButtons[item].addEventListener('click', function (event) {
              updateResult(this.value);
          })
        }
    })

    // Event Listeners Operations [+ - / *]
    Object.keys(controlButtons).map(function(item) {    
        controlButtons[item].addEventListener('click', function (event) {

          /*
           * When last char is not a number, skip
           */
          if (!isLastCharNum()) {
              return;
          }

          updateResult(this.value.replace('÷','/'));
        })
    })

    function isDecimal(value) {

        if (!value) return true;

        var len = (value.length - 1) || 0;
        var partial = '';

        while (len > 0 && 
              !(isNaN(value.charAt(len)) && value.charAt(len) !== '.')) {
            
            partial = partial + value.charAt(len);
            len--;
        };

       return (partial.indexOf('.') > -1);
    }

    function isLastCharNum() {
      return result.length > 0 ? !isNaN(result.charAt(result.length - 1)) : false;
    } 

    function getLastChar() {
      return result.charAt(result.length - 1);
    }

    function updateResult(value, opt) {

        if (!value) {
            result = '';
        }

        switch(opt) {
          case '=':
          case 'clear':
            result = (value === "Infinity") ? 'Division by 0' : value;
          break;

          default:
            result += value;
        }

        resultInput.value = result;

        if (result === 'Division by 0') result = '';
    }
})();

});