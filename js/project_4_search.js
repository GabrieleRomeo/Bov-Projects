'use strict';

document.addEventListener('DOMContentLoaded', function () {

    var valid  = validator,
        $      = valid.$;

    var searchForm  = $('#search');

    var inputs = {
        searchTxt:  valid.getNode($('#searchTxt')),
        category:   valid.getNode($('#category'))
    }

      /*
       * For each input, defines a particular Validator function that must
       * be satisfied to proceed further.
       */
        inputs.searchTxt.setValidator(function(elem) {

            var constr = elem.constr;
            var value  = elem.node.value;

            if (valid.isEmpty(value)) {
                elem.node.setCustomValidity(constr.value);
            } else {
                elem.resetCustomValidity();
            }
        })

        inputs.category.setConstraint('Please, select at least one Category');
        inputs.category.setValidator(function(elem) {

            var node = elem.node;

            if (valid.isEmpty(node.options[node.selectedIndex].value)) {
                node.setCustomValidity(this.constrValue);
            } else {
                elem.resetCustomValidity();
            }
        })

      /* Sets an initial custom validity for every input
       * All the indicated inputs are not valid by default
       */

        for (var input in inputs) {
            if (inputs.hasOwnProperty(input)) {
                if (inputs[input].constr.isRequired) {
                    inputs[input].node.setCustomValidity(
                                              inputs[input].constr.constrValue);
                }
          // Using a closure, it defines a custom event listener for every
          // single inputs object
            (function(input) {
                input.node.addEventListener('change', function (event) {
                    input.setInvalidClass();
                    input.constr.check();
                })
            })(inputs[input]);
            }
        }

        searchForm.addEventListener('submit', function (event) {
        // Check the inputs validity. If at least one input is invalid, stop
        // the form
            for (var input in inputs) {
                if (inputs.hasOwnProperty(input)) {
                    if (!inputs[input].node.validity.valid) {
                        event.preventDefault();
                    }
                }
            }
        }, false);
});