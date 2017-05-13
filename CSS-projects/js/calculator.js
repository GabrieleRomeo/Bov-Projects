'use strict';

document.addEventListener('DOMContentLoaded', function () {

    var calculator = (function() {

        var $ = validator.$;

        var HTMLResult,
            operation,
            numbersLayer,
            controlsLayer,
            numberButtons,
            controlButtons;

        var del,
            clr,
            eql,
            per;

        var result = '';

        function bind(HTMLelement) {

            HTMLResult     = $(HTMLelement + ' .result'),
            operation      = $(HTMLelement + ' .operation'),
            numbersLayer   = $(HTMLelement + ' .control__list--numbers'),
            controlsLayer  = $(HTMLelement + ' .control__list--operations'),
            numberButtons  = numbersLayer.childNodes,
            controlButtons = controlsLayer.childNodes;

            del = $(HTMLelement + ' .button--del'),
            clr = $(HTMLelement + ' .button--clear'),
            eql = $(HTMLelement + ' .button--equal'),
            per = $(HTMLelement + ' .button--period');

            // Event Listeners DEL, CLEAR, EQUAL, COMMA
            del.addEventListener('click', function() {
                updateResult(result.substr(0, result.length - 1), 'delete');
            });

            clr.addEventListener('click', function() {
                HTMLResult.innerHTML = '';
                updateResult('');
            });

            eql.addEventListener('click', function() {

                var partial;

                if (isLastCharNum()) {
                    partial = (function() { return eval(result).toString() ; })();
                    HTMLResult.innerHTML = parseFloat(partial).toFixed(1);
                    result = '(' + result.toString() +')';
                }
            });

            per.addEventListener('click', function() {

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
                operation.innerHTML = result;

            });

            // Event Listeners Numbers 0 - 9
            Object.keys(numberButtons).map(function(item) {
                numberButtons[item].addEventListener('click', function () {
                    if (this.firstElementChild.value === '.' ||
                        (this.firstElementChild.value === '0' && result === '')) {
                        return;
                    }
                    updateResult(this.firstElementChild.value);
                });
            });

            // Event Listeners Operations [+ - / *]
            Object.keys(controlButtons).map(function(item) {
                controlButtons[item].addEventListener('click', function () {
                  /*
                   * When last char is not a number or is the equal sign, skip
                   */
                    if ((!isLastCharNum() && !isLastBracket())  || this.firstElementChild.value === '=') {
                        return;
                    }

                    updateResult(this.firstElementChild.value.replace('÷','/'));
                });
            });
        }

        function isDecimal(value) {

            if (!value) return true;

            var len = (value.length - 1) || 0;
            var partial = '';

            while (len > 0 &&
                  !(isNaN(value.charAt(len)) && value.charAt(len) !== '.')) {

                partial = partial + value.charAt(len);
                len--;
            }

            return (partial.indexOf('.') > -1);
        }

        function isLastCharNum() {
            return result.length > 0 ?
                   !isNaN(result.charAt(result.length - 1)) :
                   false;
        }

        function isLastBracket() {
            return result.length > 0 ?
                   result.charAt(result.length - 1) === ')' :
                   false;
        }

        function updateResult(value, opt) {

            if (!value) {
                result = '';
            }

            switch(opt) {
            case 'delete':
                result = (value === 'Infinity') ? 'Division by 0' : value;
                break;

            default:
                result += value;
            }

            operation.innerHTML = result;

            if (result === 'Division by 0') result = '';
        }

        return { bind: bind };
    });

    var calculator1 = calculator().bind('#calculator'),
        calculator2 = calculator().bind('#calculator-2'),
        calculator3 = calculator().bind('#calculator-3');
});