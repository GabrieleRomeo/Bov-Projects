'use strict';

document.addEventListener('DOMContentLoaded', function () {

    var valid  = validator,
        $      = valid.$;

    var loginForm   = $('#loginForm');

    var inputs = {
        username:  valid.getNode($('#username')),
        password:  valid.getNode($('#password'))
    };

      /*
       * For each input, defines a particular Validator function that must
       * be satisfied to proceed further.
       */

    inputs.username.setConstraint(
        'Please, provide a valid username \n' +
        'The username must be a nonempty string and should be at least 3 ' +
        'characters in length.');

    inputs.username.setValidator(function(elem) {

        var value  = elem.node.value;

        if (valid.isLength(value, 2)) {
            elem.node.setCustomValidity(elem.constr.value);
        } else {
            elem.resetCustomValidity();
        }
    });

    inputs.password.setValidator(function(elem) {

        var value  = elem.node.value;

        if (valid.isLength(value, 5)) {
            elem.node.setCustomValidity(elem.constr.value);
        } else {
            elem.resetCustomValidity();
        }

    });

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
                input.node.addEventListener('change', function () {

                    var constr  = input.constr;
                    input.setInvalidClass();
                    constr.check();
                });
            })(inputs[input]);
        }
    }

    loginForm.addEventListener('submit', function (event) {
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